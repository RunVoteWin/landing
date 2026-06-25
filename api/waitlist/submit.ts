type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
  setHeader: (name: string, value: string) => void;
};

type WaitlistInput = {
  name: string;
  email: string;
  website?: string;
  page?: string;
};

function coerceInput(body: unknown): WaitlistInput {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const { name, email, website, page } = body as Record<string, unknown>;
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('name is required.');
  }
  if (typeof email !== 'string' || !email.trim()) {
    throw new Error('email is required.');
  }

  return {
    name: name.trim(),
    email: email.trim(),
    website: typeof website === 'string' ? website : '',
    page: typeof page === 'string' ? page : '',
  };
}

async function readJsonBody(req: Req): Promise<unknown> {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { throw new Error('Invalid JSON body.'); }
    }
    return req.body;
  }
  return null;
}

async function readSignupResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export default async function handler(req: Req, res: Res) {
  if (req.method && req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  const endpoint = process.env.SIGNUP_ENDPOINT ?? process.env.VITE_SIGNUP_ENDPOINT;
  if (!endpoint) {
    res.status(503).json({ error: 'SIGNUP_ENDPOINT or VITE_SIGNUP_ENDPOINT is not configured.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const input = coerceInput(body);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        formType: 'launch-waitlist',
        name: input.name,
        email: input.email,
        website: input.website,
        source: 'RunVoteWin launch waitlist',
        submittedAt: new Date().toISOString(),
        page: input.page,
      }),
    });

    if (!response.ok) {
      res.status(502).json({ error: `Signup endpoint failed: ${response.status}` });
      return;
    }

    const payload = await readSignupResponse(response);
    if (payload.ok === false) {
      res.status(502).json({ error: typeof payload.error === 'string' ? payload.error : 'Signup endpoint failed.' });
      return;
    }

    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).json({ ok: true, waitlistPosition: payload.waitlistPosition ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
}
