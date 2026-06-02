import type { PricingInput, PricingResult, RaceConfig, StateConfig, TermConfig } from './types.ts';
import {
  canvasserCostModel,
  defaultDiscount,
  discountLadder,
  races,
  relationalOrganizingMonthlyByTier,
  terms,
} from './shared.ts';
import { getState } from './states/index.ts';

const round2 = (n: number) => Math.round(n * 100) / 100;

function resolveVoters(state: StateConfig, race: RaceConfig['id']): number {
  const raw = state.racePopulations[race];
  if (raw === 'largest') {
    return state.voterBuckets[state.voterBuckets.length - 1]!.max;
  }
  return raw;
}

function snapToBucketIndex(state: StateConfig, voters: number): number {
  for (let i = 0; i < state.voterBuckets.length; i++) {
    if (voters <= state.voterBuckets[i]!.max) return i;
  }
  return state.voterBuckets.length - 1;
}

function lookupDiscount(cycleMonths: number): number {
  for (const [months, pct] of discountLadder) {
    if (cycleMonths === months) return pct;
  }
  return defaultDiscount;
}

export class PricingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function calculatePricing(input: PricingInput): PricingResult {
  const state = getState(input.state);
  if (!state) throw new PricingError(`Unknown state: ${input.state}`);

  const race = races.find((r) => r.id === input.race);
  if (!race) throw new PricingError(`Unknown race: ${input.race}`);

  const term: TermConfig | undefined = terms.find((t) => t.id === input.term);
  if (!term) throw new PricingError(`Unknown term: ${input.term}`);

  if (!['Basic', 'Pro', 'Premium'].includes(input.tier)) {
    throw new PricingError(`Unknown tier: ${input.tier}`);
  }

  const voters = resolveVoters(state, race.id);
  const bucketIndex = snapToBucketIndex(state, voters);
  const bucket = state.voterBuckets[bucketIndex]!;

  const monthly = state.tierPricing[input.tier][bucketIndex]!;
  const cycleMonths = race.months[term.id];
  const discountPct = lookupDiscount(cycleMonths);
  const discountAmount = round2(monthly * discountPct);
  const monthlyTotal = round2(monthly - discountAmount);
  const orderTotal = round2(monthlyTotal * cycleMonths);

  const voterFileMonthly = state.competitorAnchors.ngpVanMonthly[bucketIndex]!;
  const relationalMonthly = relationalOrganizingMonthlyByTier[input.tier];
  const canvasserMonthly = round2(
    (voters * canvasserCostModel.knocksPerVoter * canvasserCostModel.cyclesPerTerm * canvasserCostModel.ratePerKnock) /
      12,
  );

  const voterFileCycle = round2(voterFileMonthly * cycleMonths);
  const relationalCycle = round2(relationalMonthly * cycleMonths);
  const canvasserCycle = round2(canvasserMonthly * cycleMonths * canvasserCostModel.activeCycleFraction);

  const totalMonthly = round2(voterFileMonthly + relationalMonthly + canvasserMonthly - monthlyTotal);
  const totalCycle = round2(voterFileCycle + relationalCycle + canvasserCycle - orderTotal);

  return {
    state: state.code,
    stateLabel: state.label,
    race: race.id,
    raceLabel: race.label,
    term: term.id,
    termLabel: term.label,
    tier: input.tier,
    voters,
    voterBucket: bucket.label,
    cycleMonths,
    monthly,
    discountPct,
    discountAmount,
    monthlyTotal,
    orderTotal,
    savings: {
      voterFile: { monthly: voterFileMonthly, cycle: voterFileCycle },
      relationalOrganizing: { monthly: relationalMonthly, cycle: relationalCycle },
      canvasserSuit: { monthly: canvasserMonthly, cycle: canvasserCycle },
      totalMonthly,
      totalCycle,
    },
  };
}
