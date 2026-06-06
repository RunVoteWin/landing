import type { RaceConfig, TermConfig, Tier } from './types.ts';

export const tiers: readonly Tier[] = ['Basic', 'Pro', 'Premium'] as const;

export const terms: readonly TermConfig[] = [
  { id: 'primary', label: 'Primary' },
  { id: 'runoff', label: 'Runoff' },
  { id: 'general', label: 'General' },
  { id: 'fullTerm', label: 'Full Term' },
] as const;

export const races: readonly RaceConfig[] = [
  { id: 'city-council',        label: 'City Council',           months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'school-board',        label: 'School Board',           months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'mayor',               label: 'Mayor',                  months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'county',              label: 'County',                 months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'city-council-large',  label: 'City Council (Large)',   months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'school-board-large',  label: 'School Board (Large)',   months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'mayor-large',         label: 'Mayor (Large)',          months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'county-large',        label: 'County (Large)',         months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'state-house',         label: 'State House',            months: { primary: 3, runoff: 6, general: 12, fullTerm: 24 } },
  { id: 'state-senate',        label: 'State Senate',           months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'judicial',            label: 'Judicial',               months: { primary: 3, runoff: 6, general: 12, fullTerm: 72 } },
  { id: 'statewide-non-exec',  label: 'Statewide (Non-Exec)',   months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'governor',            label: 'Governor',               months: { primary: 3, runoff: 6, general: 12, fullTerm: 48 } },
  { id: 'us-house',            label: 'U.S. House',             months: { primary: 3, runoff: 6, general: 12, fullTerm: 24 } },
  { id: 'us-senate',           label: 'U.S. Senate',            months: { primary: 3, runoff: 6, general: 12, fullTerm: 72 } },
] as const;

export const discountLadder: ReadonlyArray<readonly [number, number]> = [
  [3, 0.00],
  [6, 0.03],
  [12, 0.05],
];
export const defaultDiscount = 0.10;

export const relationalOrganizingMonthlyByTier: Record<Tier, number> = {
  Basic: 115,
  Pro: 230,
  Premium: 345,
};

export const canvasserCostModel = {
  knocksPerVoter: 0.1,
  cyclesPerTerm: 3,
  ratePerKnock: 0.07,
  activeCycleFraction: 0.5,
} as const;
