import type { StateConfig } from '../types.ts';

export const tx: StateConfig = {
  code: 'tx',
  label: 'Texas',
  voterBuckets: [
    { label: '50K',  max:     50_000 },
    { label: '100K', max:    100_000 },
    { label: '250K', max:    250_000 },
    { label: '500K', max:    500_000 },
    { label: '750K', max:    750_000 },
    { label: '1M',   max:  1_000_000 },
    { label: '2.5M', max:  2_500_000 },
    { label: '18M',  max: 18_000_000 },
  ],
  tierPricing: {
    Basic:   [ 29,  49,  99, 129, 199,  499,  699,  999 ],
    Pro:     [ 89, 129, 299, 389, 599, 1499, 2099, 2999 ],
    Premium: [149, 249, 499, 649, 999, 2499, 3499, 4999 ],
  },
  competitorAnchors: {
    ngpVanMonthly: [55, 55, 367, 625, 750, 1083, 1400, 2292],
  },
  racePopulations: {
    'city-council':        50_000,
    'school-board':        50_000,
    'mayor':               50_000,
    'county':             100_000,
    'city-council-large': 100_000,
    'school-board-large': 100_000,
    'mayor-large':        750_000,
    'county-large':     2_500_000,
    'state-house':        250_000,
    'state-senate':     1_000_000,
    'judicial':           'largest',
    'statewide-non-exec': 18_000_000,
    'governor':           18_000_000,
    'us-house':              750_000,
    'us-senate':         18_000_000,
  },
};
