import type { StateConfig } from '../types.ts';

export const va: StateConfig = {
  code: 'va',
  label: 'Virginia',
  voterBuckets: [
    { label: '75K',  max:    75_000 },
    { label: '100K', max:   100_000 },
    { label: '200K', max:   200_000 },
    { label: '500K', max:   500_000 },
    { label: '750K', max:   750_000 },
    { label: '1M',   max: 1_000_000 },
    { label: '6.5M', max: 6_500_000 },
  ],
  tierPricing: {
    Basic:   [ 29,  49,  99, 129, 199,  499,  999 ],
    Pro:     [ 89, 129, 299, 389, 599, 1499, 2999 ],
    Premium: [149, 249, 499, 649, 999, 2499, 4999 ],
  },
  competitorAnchors: {
    ngpVanMonthly: [55, 55, 367, 625, 750, 1083, 2292],
  },
  racePopulations: {
    'city-council':        50_000,
    'school-board':        50_000,
    'mayor':               50_000,
    'county':             100_000,
    'city-council-large': 100_000,
    'school-board-large': 100_000,
    'mayor-large':        500_000,
    'county-large':     1_000_000,
    'state-house':        200_000,
    'state-senate':       500_000,
    'judicial':           'largest',
    'statewide-non-exec': 6_500_000,
    'governor':           6_500_000,
    'us-house':             750_000,
    'us-senate':          6_500_000,
  },
};
