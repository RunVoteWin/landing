const SPREADSHEET_ID = '1Ia8ppbMMQIlAv6Ep3Z8DbwHBHpmCNyzOZ7d8BYv_laQ';
const SHEET_NAME = 'Leads';
const TEAM_NOTIFY_EMAIL = '';

const PRICE_BY_CAMPAIGN_SIZE = {
  local: { label: 'Local / county', price: 249 },
  legislative: { label: 'State legislative', price: 599 },
  congressional: { label: 'Congressional', price: 1250 },
  coordinated: { label: 'Coordinated or IE', price: 2500 },
};

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    const normalized = normalizeLead_(payload);

    appendLead_(normalized);

    if (normalized.email) {
      sendLeadEmail_(normalized);
    }

    if (TEAM_NOTIFY_EMAIL) {
      sendTeamNotification_(normalized);
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

function normalizeLead_(payload) {
  const campaign = PRICE_BY_CAMPAIGN_SIZE[payload.campaignSize] || null;
  const estimateMonthly = campaign ? campaign.price : Number(payload.estimateMonthly || 0);
  const campaignSizeLabel = campaign ? campaign.label : String(payload.campaignSizeLabel || '');

  return {
    submittedAt: payload.submittedAt || new Date().toISOString(),
    formType: String(payload.formType || 'updates'),
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    role: String(payload.role || '').trim(),
    campaignSize: String(payload.campaignSize || '').trim(),
    campaignSizeLabel,
    estimateMonthly,
    estimateFormatted: estimateMonthly ? formatUsd_(estimateMonthly) + '/mo' : '',
    source: String(payload.source || '').trim(),
    page: String(payload.page || '').trim(),
  };
}

function appendLead_(lead) {
  const sheet = getLeadSheet_();

  sheet.appendRow([
    new Date(),
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

function sendTeamNotification_(lead) {
  MailApp.sendEmail({
    to: TEAM_NOTIFY_EMAIL,
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
    ].join('\n'),
    htmlBody: [
      '<p><strong>Form:</strong> ',
      escapeHtml_(lead.formType),
      '</p><p><strong>Name:</strong> ',
      escapeHtml_(lead.name),
      '</p><p><strong>Email:</strong> ',
      escapeHtml_(lead.email),
      '</p><p><strong>Role:</strong> ',
      escapeHtml_(lead.role),
      '</p><p><strong>Campaign size:</strong> ',
      escapeHtml_(lead.campaignSizeLabel),
      '</p><p><strong>Estimate:</strong> ',
      escapeHtml_(lead.estimateFormatted),
      '</p><p><strong>Source:</strong> ',
      escapeHtml_(lead.source),
      '</p>',
    ].join(''),
  });
}

function formatUsd_(value) {
  return '$' + Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
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
