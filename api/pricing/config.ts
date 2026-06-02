import type { PricingConfigResponse } from '../_lib/pricing/types.ts';
import { races, terms, tiers } from '../_lib/pricing/shared.ts';
import { listStates } from '../_lib/pricing/states/index.ts';

export default function handler(req: { method?: string }, res: {
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
  setHeader: (name: string, value: string) => void;
}) {
  if (req.method && !['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).end();
    return;
  }

  const body: PricingConfigResponse = {
    states: listStates(),
    races: races.map(({ id, label }) => ({ id, label })),
    terms: terms.map(({ id, label }) => ({ id, label })),
    tiers: [...tiers],
  };

  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  if (req.method === 'HEAD') {
    res.status(200).end();
    return;
  }

  res.status(200).json(body);
}
