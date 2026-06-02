import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { calculatePricing, PricingError } from './calculate.ts';

test('TX / County (Large) / Full Term / Pro matches xlsx worked example', () => {
  const result = calculatePricing({
    state: 'tx',
    race: 'county-large',
    term: 'fullTerm',
    tier: 'Pro',
  });

  assert.equal(result.voters, 2_500_000);
  assert.equal(result.voterBucket, '2.5M');
  assert.equal(result.cycleMonths, 48);
  assert.equal(result.monthly, 2099);
  assert.equal(result.discountPct, 0.10);
  assert.equal(result.discountAmount, 209.90);
  assert.equal(result.monthlyTotal, 1889.10);
  assert.equal(result.orderTotal, 90_676.80);

  assert.equal(result.savings.voterFile.monthly, 1400);
  assert.equal(result.savings.voterFile.cycle, 67_200);
  assert.equal(result.savings.relationalOrganizing.monthly, 230);
  assert.equal(result.savings.relationalOrganizing.cycle, 11_040);
  assert.equal(result.savings.canvasserSuit.monthly, 4375);
  assert.equal(result.savings.canvasserSuit.cycle, 105_000);
  assert.equal(result.savings.totalMonthly, 4115.90);
  assert.equal(result.savings.totalCycle, 92_563.20);
});

test('TX / State House / General / Basic — 12mo discount = 5%', () => {
  const result = calculatePricing({
    state: 'tx',
    race: 'state-house',
    term: 'general',
    tier: 'Basic',
  });

  assert.equal(result.voters, 250_000);
  assert.equal(result.voterBucket, '250K');
  assert.equal(result.cycleMonths, 12);
  assert.equal(result.monthly, 99);
  assert.equal(result.discountPct, 0.05);
  assert.equal(result.discountAmount, 4.95);
  assert.equal(result.monthlyTotal, 94.05);
  assert.equal(result.orderTotal, 1128.60);
});

test('TX / Judicial maps to largest bucket (18M) and gets 10% discount on 72mo Full Term', () => {
  const result = calculatePricing({
    state: 'tx',
    race: 'judicial',
    term: 'fullTerm',
    tier: 'Premium',
  });

  assert.equal(result.voters, 18_000_000);
  assert.equal(result.voterBucket, '18M');
  assert.equal(result.cycleMonths, 72);
  assert.equal(result.monthly, 4999);
  assert.equal(result.discountPct, 0.10);
});

test('VA / Governor / Full Term / Pro hits the 6.5M bucket (not TX 18M)', () => {
  const result = calculatePricing({
    state: 'va',
    race: 'governor',
    term: 'fullTerm',
    tier: 'Pro',
  });

  assert.equal(result.stateLabel, 'Virginia');
  assert.equal(result.voters, 6_500_000);
  assert.equal(result.voterBucket, '6.5M');
  assert.equal(result.cycleMonths, 48);
  assert.equal(result.monthly, 2999);
  assert.equal(result.discountPct, 0.10);
  assert.equal(result.discountAmount, 299.90);
});

test('TX / Mayor / Primary / Basic — 3mo gets 0% discount', () => {
  const result = calculatePricing({
    state: 'tx',
    race: 'mayor',
    term: 'primary',
    tier: 'Basic',
  });

  assert.equal(result.cycleMonths, 3);
  assert.equal(result.discountPct, 0);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.monthlyTotal, result.monthly);
});

test('TX / County (Large) / Runoff / Pro — 6mo gets 3% discount', () => {
  const result = calculatePricing({
    state: 'tx',
    race: 'county-large',
    term: 'runoff',
    tier: 'Pro',
  });

  assert.equal(result.cycleMonths, 6);
  assert.equal(result.discountPct, 0.03);
  assert.equal(result.monthly, 2099);
  assert.equal(result.discountAmount, 62.97);
  assert.equal(result.monthlyTotal, 2036.03);
});

test('unknown state throws PricingError', () => {
  assert.throws(
    () => calculatePricing({ state: 'ca', race: 'governor', term: 'fullTerm', tier: 'Pro' }),
    PricingError,
  );
});

test('unknown race throws PricingError', () => {
  assert.throws(
    // @ts-expect-error intentional bad input
    () => calculatePricing({ state: 'tx', race: 'president', term: 'fullTerm', tier: 'Pro' }),
    PricingError,
  );
});
