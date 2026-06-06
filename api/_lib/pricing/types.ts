export type Tier = 'Basic' | 'Pro' | 'Premium';

export type TermId = 'primary' | 'runoff' | 'general' | 'fullTerm';

export type RaceId =
  | 'city-council'
  | 'school-board'
  | 'mayor'
  | 'county'
  | 'city-council-large'
  | 'school-board-large'
  | 'mayor-large'
  | 'county-large'
  | 'state-house'
  | 'state-senate'
  | 'judicial'
  | 'statewide-non-exec'
  | 'governor'
  | 'us-house'
  | 'us-senate';

export type VoterBucket = {
  label: string;
  max: number;
};

export type RaceConfig = {
  id: RaceId;
  label: string;
  months: Record<TermId, number>;
};

export type TermConfig = {
  id: TermId;
  label: string;
};

export type StateConfig = {
  code: string;
  label: string;
  voterBuckets: VoterBucket[];
  tierPricing: Record<Tier, number[]>;
  competitorAnchors: {
    ngpVanMonthly: number[];
  };
  racePopulations: Record<RaceId, number | 'largest'>;
};

export type PricingInput = {
  state: string;
  race: RaceId;
  term: TermId;
  tier: Tier;
};

export type PricingResult = {
  state: string;
  stateLabel: string;
  race: RaceId;
  raceLabel: string;
  term: TermId;
  termLabel: string;
  tier: Tier;
  voters: number;
  voterBucket: string;
  cycleMonths: number;
  monthly: number;
  discountPct: number;
  discountAmount: number;
  monthlyTotal: number;
  orderTotal: number;
  savings: {
    voterFile: { monthly: number; cycle: number };
    relationalOrganizing: { monthly: number; cycle: number };
    canvasserSuit: { monthly: number; cycle: number };
    totalMonthly: number;
    totalCycle: number;
  };
};

export type PricingConfigResponse = {
  states: Array<{ code: string; label: string }>;
  races: Array<{ id: RaceId; label: string }>;
  terms: Array<{ id: TermId; label: string }>;
  tiers: Tier[];
};
