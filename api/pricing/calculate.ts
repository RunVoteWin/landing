import { calculatePricing, PricingError } from '../_lib/pricing/calculate.ts';
import type { PricingInput } from '../_lib/pricing/types.ts';

type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
  setHeader: (name: string, value: string) => void;
};

function coerceInput(body: unknown): PricingInput {
  if (!body || typeof body !== 'object') {
    throw new PricingError('Request body must be a JSON object.');
  }
  const { state, race, term, tier } = body as Record<string, unknown>;
  if (typeof state !== 'string' || typeof race !== 'string' || typeof term !== 'string' || typeof tier !== 'string') {
    throw new PricingError('state, race, term, and tier are required strings.');
  }
  return { state, race, term, tier } as PricingInput;
}

async function readJsonBody(req: Req): Promise<unknown> {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { throw new PricingError('Invalid JSON body.'); }
    }
    return req.body;
  }
  return null;
}

export default async function handler(req: Req, res: Res) {
  if (req.method && req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  try {
    const body = await readJsonBody(req);
    const input = coerceInput(body);
    const result = calculatePricing(input);
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof PricingError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
