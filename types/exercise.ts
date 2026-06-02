/**
 * A user-defined exercise in the catalog. Exercises are created on the fly while
 * logging (free-typed names) and reused across sessions so progress can be tracked
 * per exercise. Matching is case-insensitive on `name`.
 */
export interface Exercise {
  id: string;
  name: string;
  createdAt: string;
}
