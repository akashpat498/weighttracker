import type { Unit } from '@/types/units';

const LB_PER_KG = 2.2046226218;

/** Convert a value the user typed (in their current unit) to canonical kg. */
export function displayToKg(value: number, unit: Unit): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

/** Convert a stored kg value to the user's current unit, rounded for display. */
export function kgToDisplay(weightKg: number, unit: Unit): number {
  const value = unit === 'kg' ? weightKg : weightKg * LB_PER_KG;
  // One decimal place; drop a trailing .0 via Number().
  return Number(value.toFixed(1));
}

/** Short unit label. */
export function unitLabel(unit: Unit): string {
  return unit;
}

/**
 * Format a stored set weight for display, e.g. "135 lb", "60 kg", or "Body"
 * for a bodyweight (null) set.
 */
export function formatWeight(weightKg: number | null, unit: Unit): string {
  if (weightKg === null) return 'Body';
  return `${kgToDisplay(weightKg, unit)} ${unit}`;
}
