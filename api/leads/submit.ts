type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
  setHeader: (name: string, value: string) => void;
};

async function readJsonBody(req: Req): Promise<Record<string, unknown>> {
  if (!req.body || req.body === '') {
    return {};
  }
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
    } catch {
      throw new Error('Invalid JSON body.');
    }
  }
  return typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
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
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...body,
        submittedAt: new Date().toISOString(),
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
    res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
}
