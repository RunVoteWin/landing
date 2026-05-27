import crypto from 'node:crypto';

const SHEET_ID = process.env.LEADS_SHEET_ID;
const SHEET_NAME = process.env.LEADS_SHEET_NAME || 'Leads';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const MAX_FIELD_LENGTH = 500;

const PRICE_BY_CAMPAIGN_SIZE: Record<string, { label: string; price: number }> = {
  local: { label: 'Local / county', price: 249 },
  legislative: { label: 'State legislative', price: 599 },
  congressional: { label: 'Congressional', price: 1250 },
  coordinated: { label: 'Coordinated or IE', price: 2500 },
};

type Lead = {
  receivedAt: string;
  submittedAt: string;
  formType: 'updates' | 'pricing';
  name: string;
  email: string;
  role: string;
  campaignSize: string;
  campaignSizeLabel: string;
  estimateMonthly: number;
  estimateFormatted: string;
  source: string;
  page: string;
};

export default async function handler(request: any, response: any) {
  if (request.method === 'GET') {
    return response.status(200).json({ ok: true, service: 'RunVoteWin landing lead capture' });
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const payload = parseBody(request.body);

    if (isSpam(payload)) {
      return response.status(200).json({ ok: true, skipped: true });
    }

    const lead = normalizeLead(payload);
    validateLead(lead);

    await appendLead(lead);
    await notifySlack(lead);

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('[leads] capture failed', error);
    return response.status(500).json({ ok: false, error: 'Lead capture failed' });
  }
}

function parseBody(body: unknown): Record<string, unknown> {
  if (!body) return {};
  if (typeof body === 'object') return body as Record<string, unknown>;
  if (typeof body === 'string') return JSON.parse(body);
  return {};
}

function isSpam(payload: Record<string, unknown>) {
  return Boolean(clean(payload.website).trim() || clean(payload.companyWebsite).trim());
}

function normalizeLead(payload: Record<string, unknown>): Lead {
  const campaignSize = clean(payload.campaignSize);
  const campaign = PRICE_BY_CAMPAIGN_SIZE[campaignSize] || null;
  const estimateMonthly = campaign ? campaign.price : Number(payload.estimateMonthly || 0);
  const campaignSizeLabel = campaign ? campaign.label : clean(payload.campaignSizeLabel);

  return {
    receivedAt: new Date().toISOString(),
    submittedAt: clean(payload.submittedAt) || new Date().toISOString(),
    formType: clean(payload.formType) === 'pricing' ? 'pricing' : 'updates',
    name: clean(payload.name),
    email: clean(payload.email).toLowerCase(),
    role: clean(payload.role),
    campaignSize,
    campaignSizeLabel,
    estimateMonthly,
    estimateFormatted: estimateMonthly ? `${formatUsd(estimateMonthly)}/mo` : '',
    source: clean(payload.source),
    page: clean(payload.page),
  };
}

function validateLead(lead: Lead) {
  if (!lead.name) throw new Error('Name is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    throw new Error('Valid email is required');
  }
}

function clean(value: unknown) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

async function appendLead(lead: Lead) {
  const accessToken = await getGoogleAccessToken();
  await ensureHeaderRow(accessToken);

  const values = [[
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
  ]];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!result.ok) {
    throw new Error(`Sheets append failed: ${result.status} ${await result.text()}`);
  }
}

async function ensureHeaderRow(accessToken: string) {
  const range = `${SHEET_NAME}!A1:L1`;
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`;
  const getResult = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!getResult.ok) return;

  const current = await getResult.json();
  if (current.values?.[0]?.length) return;

  const headers = [[
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
  ]];

  await fetch(`${getUrl}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: headers }),
  });
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!SHEET_ID || !clientEmail || !privateKey) {
    throw new Error('Missing Google Sheets lead capture env vars');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey);
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const result = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!result.ok) {
    throw new Error(`Google token failed: ${result.status} ${await result.text()}`);
  }

  const data = await result.json();
  return data.access_token as string;
}

async function notifySlack(lead: Lead) {
  const webhookUrl = process.env.SLACK_SIGNUP_WEBHOOK_URL;
  if (!webhookUrl) return;

  const details = lead.formType === 'pricing'
    ? `${lead.campaignSizeLabel || 'Unknown campaign size'} · ${lead.estimateFormatted || 'No estimate'}`
    : 'Demo / updates CTA';

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New RunVoteWin landing lead: ${lead.name} <${lead.email}>`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New RunVoteWin landing lead*\n*Name:* ${slackEscape(lead.name)}\n*Email:* ${slackEscape(lead.email)}\n*Form:* ${slackEscape(lead.formType)}\n*Details:* ${slackEscape(details)}`,
            },
          },
          {
            type: 'context',
            elements: [{ type: 'mrkdwn', text: `Source: ${slackEscape(lead.source || 'landing page')} · <${lead.page || 'https://runvotewin.com'}|Page>` }],
          },
        ],
      }),
    });
  } catch (error) {
    console.error('[leads] Slack notification failed', error);
  }
}

function formatUsd(value: number) {
  return '$' + Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function slackEscape(value: string) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}
