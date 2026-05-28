import type { PricingConfigResponse } from '../_lib/pricing/types.ts';
import { races, terms, tiers } from '../_lib/pricing/shared.ts';
import { listStates } from '../_lib/pricing/states/index.ts';

export default function handler(req: { method?: string }, res: {
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
  setHeader: (name: string, value: string) => void;
}) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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
  res.status(200).json(body);
}
