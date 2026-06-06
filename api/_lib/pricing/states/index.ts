import type { StateConfig } from '../types.ts';
import { tx } from './tx.ts';
import { va } from './va.ts';

export const states: Record<string, StateConfig> = {
  tx,
  va,
};

export function getState(code: string): StateConfig | null {
  return states[code.toLowerCase()] ?? null;
}

export function listStates(): Array<{ code: string; label: string }> {
  return Object.values(states).map(({ code, label }) => ({ code, label }));
}
