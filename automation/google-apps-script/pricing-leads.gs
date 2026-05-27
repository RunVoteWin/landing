const SPREADSHEET_ID = '1bp_UeAov4yln670kaII9_jV1JJw53wqKZlIAfa2rx08';
const SHEET_NAME = 'Leads';
const MAX_FIELD_LENGTH = 500;
const DUPLICATE_WINDOW_SECONDS = 60 * 5;

// Optional script properties:
// - SLACK_SIGNUP_WEBHOOK_URL: Slack incoming webhook URL for lead pings.
// - TEAM_NOTIFY_EMAIL: Internal notification email fallback.
// - SEND_LEAD_EMAILS: Set to "true" to send requester confirmation/estimate emails.
const PRICE_BY_CAMPAIGN_SIZE = {
  local: { label: 'Local / county', price: 249 },
  legislative: { label: 'State legislative', price: 599 },
  congressional: { label: 'Congressional', price: 1250 },
  coordinated: { label: 'Coordinated or IE', price: 2500 },
};

function doPost(event) {
  try {
    const payload = parsePayload_(event);

    if (isSpam_(payload)) {
      return json_({ ok: true, skipped: true });
    }

    const normalized = normalizeLead_(payload);
    validateLead_(normalized);

    if (isDuplicate_(normalized)) {
      return json_({ ok: true, duplicate: true });
    }

    appendLead_(normalized);
    notifySlack_(normalized);
    notifyTeamEmail_(normalized);

    if (shouldSendLeadEmails_()) {
      sendLeadEmail_(normalized);
    }

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'RunVoteWin lead automation' });
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    return {};
  }

  return JSON.parse(event.postData.contents);
}

function isSpam_(payload) {
  // Honeypot field. Real users never see/fill this input.
  return Boolean(String(payload.website || payload.companyWebsite || '').trim());
}

function normalizeLead_(payload) {
  const campaign = PRICE_BY_CAMPAIGN_SIZE[payload.campaignSize] || null;
  const estimateMonthly = campaign ? campaign.price : Number(payload.estimateMonthly || 0);
  const campaignSizeLabel = campaign ? campaign.label : clean_(payload.campaignSizeLabel || '');

  return {
    receivedAt: new Date(),
    submittedAt: clean_(payload.submittedAt || new Date().toISOString()),
    formType: normalizeFormType_(payload.formType),
    name: clean_(payload.name || ''),
    email: clean_(payload.email || '').toLowerCase(),
    role: clean_(payload.role || ''),
    campaignSize: clean_(payload.campaignSize || ''),
    campaignSizeLabel,
    estimateMonthly,
    estimateFormatted: estimateMonthly ? formatUsd_(estimateMonthly) + '/mo' : '',
    source: clean_(payload.source || ''),
    page: clean_(payload.page || ''),
  };
}

function normalizeFormType_(value) {
  const formType = clean_(value || 'updates');
  return ['updates', 'pricing'].includes(formType) ? formType : 'updates';
}

function clean_(value) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

function validateLead_(lead) {
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    throw new Error('Valid email is required');
  }

  if (!lead.name) {
    throw new Error('Name is required');
  }
}

function isDuplicate_(lead) {
  const cache = CacheService.getScriptCache();
  const key = 'lead:' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      [lead.formType, lead.email, lead.campaignSize, lead.role].join('|'),
    ),
  ).slice(0, 64);

  if (cache.get(key)) {
    return true;
  }

  cache.put(key, '1', DUPLICATE_WINDOW_SECONDS);
  return false;
}

function appendLead_(lead) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getLeadSheet_();
    sheet.appendRow([
      lead.receivedAt,
      lead.submittedAt,
      lead.formType,
      lead.name,
      lead.email,
      lead.role,
      lead.campaignSize,
      lead.campaignSizeLabel,
      lead.estimateMonthly,
      lead.estimateFormatted,
      lead.source,
      lead.page,
    ]);
  } finally {
    lock.releaseLock();
  }
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Received At',
      'Submitted At',
      'Form Type',
      'Name',
      'Email',
      'Role',
      'Campaign Size',
      'Campaign Size Label',
      'Estimate Monthly',
      'Estimate Formatted',
      'Source',
      'Page',
    ]);
  }

  return sheet;
}

function notifySlack_(lead) {
  const webhookUrl = getScriptProperty_('SLACK_SIGNUP_WEBHOOK_URL');
  if (!webhookUrl) return;

  const summary = lead.formType === 'pricing'
    ? `${lead.campaignSizeLabel || 'Unknown campaign size'} · ${lead.estimateFormatted || 'No estimate'}`
    : 'Demo / updates CTA';

  const message = {
    text: `New RunVoteWin landing lead: ${lead.name} <${lead.email}>`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New RunVoteWin landing lead*\n*Name:* ${slackEscape_(lead.name)}\n*Email:* ${slackEscape_(lead.email)}\n*Form:* ${slackEscape_(lead.formType)}\n*Details:* ${slackEscape_(summary)}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Source: ${slackEscape_(lead.source || 'landing page')} · <${lead.page || 'https://runvotewin.com'}|Page>`,
          },
        ],
      },
    ],
  };

  try {
    UrlFetchApp.fetch(webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(message),
      muteHttpExceptions: true,
    });
  } catch (error) {
    // Slack should never block lead capture.
    console.error('Slack notification failed: ' + error);
  }
}

function notifyTeamEmail_(lead) {
  const teamNotifyEmail = getScriptProperty_('TEAM_NOTIFY_EMAIL');
  if (!teamNotifyEmail) return;

  MailApp.sendEmail({
    to: teamNotifyEmail,
    subject: 'New RunVoteWin lead: ' + (lead.name || lead.email || 'Unknown'),
    body: [
      'New RunVoteWin lead',
      '',
      'Form: ' + lead.formType,
      'Name: ' + lead.name,
      'Email: ' + lead.email,
      'Role: ' + lead.role,
      'Campaign size: ' + lead.campaignSizeLabel,
      'Estimate: ' + lead.estimateFormatted,
      'Source: ' + lead.source,
      'Page: ' + lead.page,
    ].join('\n'),
  });
}

function shouldSendLeadEmails_() {
  return getScriptProperty_('SEND_LEAD_EMAILS') === 'true';
}

function sendLeadEmail_(lead) {
  if (lead.formType !== 'pricing') {
    MailApp.sendEmail({
      to: lead.email,
      subject: 'Thanks for following RunVoteWin',
      body: [
        'Thanks for your interest in RunVoteWin.',
        '',
        'We will keep you posted as we expand access and add support for more campaigns.',
        '',
        '- The RunVoteWin team',
      ].join('\n'),
      htmlBody: [
        '<p>Thanks for your interest in RunVoteWin.</p>',
        '<p>We will keep you posted as we expand access and add support for more campaigns.</p>',
        '<p>- The RunVoteWin team</p>',
      ].join(''),
    });
    return;
  }

  MailApp.sendEmail({
    to: lead.email,
    subject: 'Your RunVoteWin pricing estimate',
    body: [
      'Thanks for taking a look at RunVoteWin.',
      '',
      'Estimated platform price: ' + lead.estimateFormatted,
      'Campaign size: ' + lead.campaignSizeLabel,
      '',
      'This estimate includes canvassing, intelligent turf cutting, voter-data workspace, imports and exports, reporting, and standard support.',
      'Final pricing can vary based on state availability, data needs, and compliance requirements.',
      '',
      'Access the app: https://app.runvotewin.com',
      '',
      '- The RunVoteWin team',
    ].join('\n'),
    htmlBody: [
      '<p>Thanks for taking a look at RunVoteWin.</p>',
      '<p>Based on what you selected, your estimated platform price is:</p>',
      '<p style="font-size:24px;font-weight:700;">',
      escapeHtml_(lead.estimateFormatted),
      '</p>',
      '<p><strong>Campaign size:</strong> ',
      escapeHtml_(lead.campaignSizeLabel),
      '</p>',
      '<p>This estimate includes canvassing, intelligent turf cutting, voter-data workspace, imports and exports, reporting, and standard support.</p>',
      '<p>Final pricing can vary based on state availability, data needs, and compliance requirements.</p>',
      '<p>You can access the app here: <a href="https://app.runvotewin.com">https://app.runvotewin.com</a></p>',
      '<p>- The RunVoteWin team</p>',
    ].join(''),
  });
}

function getScriptProperty_(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || '';
}

function formatUsd_(value) {
  return '$' + Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function slackEscape_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
