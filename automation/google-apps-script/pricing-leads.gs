const SPREADSHEET_ID = '1Ia8ppbMMQIlAv6Ep3Z8DbwHBHpmCNyzOZ7d8BYv_laQ';
const SHEET_NAME = 'Leads';
const TEAM_NOTIFY_EMAIL = '';

const PRICE_BY_CAMPAIGN_SIZE = {
  local: { label: 'Local / county', price: 249 },
  legislative: { label: 'State legislative', price: 599 },
  congressional: { label: 'Congressional', price: 1250 },
  coordinated: { label: 'Coordinated or IE', price: 2500 },
};

const LEAD_HEADERS = [
  'Received At',
  'Submitted At',
  'Form Type',
  'Name',
  'Email',
  'Role',
  'Campaign',
  'State',
  'State Label',
  'Requested State',
  'Race',
  'Race Label',
  'Term',
  'Term Label',
  'Tier',
  'Voters',
  'Voter Bucket',
  'Cycle Months',
  'Estimate Monthly',
  'Order Total',
  'Estimate Formatted',
  'Source',
  'Page',
  'Waitlist Position',
];

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    const normalized = normalizeLead_(payload);

    if (normalized.formType === 'launch-waitlist') {
      normalized.waitlistPosition = nextWaitlistPosition_();
    }

    appendLead_(normalized);

    if (normalized.email) {
      sendLeadEmail_(normalized);
    }

    if (TEAM_NOTIFY_EMAIL) {
      sendTeamNotification_(normalized);
    }

    return json_({ ok: true, waitlistPosition: normalized.waitlistPosition || null });
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
  const estimateMonthly = Number(payload.estimateMonthly || 0) || (campaign ? campaign.price : 0);
  const campaignSizeLabel = campaign ? campaign.label : String(payload.campaignSizeLabel || '');

  return {
    submittedAt: payload.submittedAt || new Date().toISOString(),
    formType: String(payload.formType || 'updates'),
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    role: String(payload.role || '').trim(),
    campaign: String(payload.campaign || '').trim(),
    state: String(payload.state || '').trim(),
    stateLabel: String(payload.stateLabel || '').trim(),
    requestedState: String(payload.requestedState || '').trim(),
    race: String(payload.race || '').trim(),
    raceLabel: String(payload.raceLabel || '').trim(),
    term: String(payload.term || '').trim(),
    termLabel: String(payload.termLabel || '').trim(),
    tier: String(payload.tier || '').trim(),
    voters: Number(payload.voters || 0),
    voterBucket: String(payload.voterBucket || '').trim(),
    cycleMonths: Number(payload.cycleMonths || 0),
    campaignSize: String(payload.campaignSize || '').trim(),
    campaignSizeLabel,
    estimateMonthly,
    orderTotal: Number(payload.orderTotal || 0),
    estimateFormatted: String(payload.estimateFormatted || '').trim() || (estimateMonthly ? formatUsd_(estimateMonthly) + '/mo' : ''),
    waitlistPosition: Number(payload.waitlistPosition || 0),
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
    lead.campaign,
    lead.state,
    lead.stateLabel,
    lead.requestedState,
    lead.race,
    lead.raceLabel,
    lead.term,
    lead.termLabel,
    lead.tier,
    lead.voters,
    lead.voterBucket,
    lead.cycleMonths,
    lead.estimateMonthly,
    lead.orderTotal,
    lead.estimateFormatted,
    lead.source,
    lead.page,
    lead.waitlistPosition || '',
  ]);
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_HEADERS);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const needsHeaderUpdate = LEAD_HEADERS.some(function (header, index) {
      return currentHeaders[index] !== header;
    });

    if (needsHeaderUpdate) {
      sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setValues([LEAD_HEADERS]);
    }
  }

  return sheet;
}

function nextWaitlistPosition_() {
  const sheet = getLeadSheet_();
  const lastRow = sheet.getLastRow();
  const basePosition = 101;

  if (lastRow <= 1) {
    return basePosition;
  }

  const formTypes = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  const existingWaitlistCount = formTypes.filter(function (row) {
    return row[0] === 'launch-waitlist';
  }).length;

  return basePosition + existingWaitlistCount;
}

function sendLeadEmail_(lead) {
  if (lead.formType === 'launch-waitlist') {
    MailApp.sendEmail({
      to: lead.email,
      subject: 'You are on the RunVoteWin waitlist',
      body: [
        'Thanks for joining the RunVoteWin waitlist.',
        '',
        lead.waitlistPosition ? 'Your place in line: #' + lead.waitlistPosition : 'You are on the list.',
        '',
        'We will notify you as soon as RunVoteWin is live. Waitlisted users will also get a subscription discount when RunVoteWin officially launches.',
        '',
        'Try the sandbox: https://app.runvotewin.com/sandbox',
        '',
        '- The RunVoteWin team',
      ].join('\n'),
      htmlBody: [
        '<p>Thanks for joining the RunVoteWin waitlist.</p>',
        lead.waitlistPosition ? '<p><strong>Your place in line: #' + escapeHtml_(lead.waitlistPosition) + '</strong></p>' : '<p>You are on the list.</p>',
        '<p>We will notify you as soon as RunVoteWin is live. Waitlisted users will also get a subscription discount when RunVoteWin officially launches.</p>',
        '<p>Try the sandbox: <a href="https://app.runvotewin.com/sandbox">https://app.runvotewin.com/sandbox</a></p>',
        '<p>- The RunVoteWin team</p>',
      ].join(''),
    });
    return;
  }

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
      'State: ' + (lead.stateLabel || lead.state),
      'Race: ' + lead.raceLabel,
      'Term: ' + lead.termLabel,
      'Tier: ' + lead.tier,
      '',
      'This estimate includes canvassing, intelligent turf cutting, voter-data workspace, imports and exports, reporting, and standard support.',
      'Final pricing can vary based on state availability, data needs, and compliance requirements.',
      '',
      'Try the sandbox: https://app.runvotewin.com/sandbox',
      '',
      '- The RunVoteWin team',
    ].join('\n'),
    htmlBody: [
      '<p>Thanks for taking a look at RunVoteWin.</p>',
      '<p>Based on what you selected, your estimated platform price is:</p>',
      '<p style="font-size:24px;font-weight:700;">',
      escapeHtml_(lead.estimateFormatted),
      '</p>',
      '<p><strong>State:</strong> ',
      escapeHtml_(lead.stateLabel || lead.state),
      '</p>',
      '<p><strong>Race:</strong> ',
      escapeHtml_(lead.raceLabel),
      '</p>',
      '<p><strong>Term:</strong> ',
      escapeHtml_(lead.termLabel),
      '</p>',
      '<p><strong>Tier:</strong> ',
      escapeHtml_(lead.tier),
      '</p>',
      '<p>This estimate includes canvassing, intelligent turf cutting, voter-data workspace, imports and exports, reporting, and standard support.</p>',
      '<p>Final pricing can vary based on state availability, data needs, and compliance requirements.</p>',
      '<p>You can try the sandbox here: <a href="https://app.runvotewin.com/sandbox">https://app.runvotewin.com/sandbox</a></p>',
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
      'Campaign: ' + lead.campaign,
      'State: ' + (lead.stateLabel || lead.state),
      'Requested state: ' + lead.requestedState,
      'Race: ' + lead.raceLabel,
      'Term: ' + lead.termLabel,
      'Tier: ' + lead.tier,
      'Voters: ' + lead.voters,
      'Estimate: ' + lead.estimateFormatted,
      'Waitlist position: ' + (lead.waitlistPosition || ''),
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
      '</p><p><strong>Campaign:</strong> ',
      escapeHtml_(lead.campaign),
      '</p><p><strong>State:</strong> ',
      escapeHtml_(lead.stateLabel || lead.state),
      '</p><p><strong>Requested state:</strong> ',
      escapeHtml_(lead.requestedState),
      '</p><p><strong>Race:</strong> ',
      escapeHtml_(lead.raceLabel),
      '</p><p><strong>Term:</strong> ',
      escapeHtml_(lead.termLabel),
      '</p><p><strong>Tier:</strong> ',
      escapeHtml_(lead.tier),
      '</p><p><strong>Voters:</strong> ',
      escapeHtml_(lead.voters),
      '</p><p><strong>Estimate:</strong> ',
      escapeHtml_(lead.estimateFormatted),
      '</p><p><strong>Waitlist position:</strong> ',
      escapeHtml_(lead.waitlistPosition || ''),
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
