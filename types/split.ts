/**
 * A reusable workout split template (e.g. "Push", "Pull", "Legs").
 * `exerciseNames` pre-fills the Log screen when a split is selected.
 */
export interface Split {
  id: string;
  name: string;
  exerciseNames: string[];
  createdAt: string;
}
