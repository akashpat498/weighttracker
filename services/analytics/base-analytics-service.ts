import type { AnalyticsService } from './analytics-service';

/**
 * Base analytics service. Add typed, domain-specific event helpers here
 * (e.g. workoutLogged, prAchieved) once the MVP feature set is defined,
 * so screens call `analyticsService.workoutLogged(...)` rather than raw
 * `track('workout_logged', ...)` strings.
 */
export abstract class BaseAnalyticsService implements AnalyticsService {
  abstract track(event: string, properties?: Record<string, unknown>): void;

  appOpened(): void {
    this.track('app_opened');
  }

  sessionLogged(props: {
    exercise_count: number;
    set_count: number;
    from_split: boolean;
  }): void {
    this.track('session_logged', props);
  }

  sessionDeleted(): void {
    this.track('session_deleted');
  }

  exerciseProgressViewed(props: { data_points: number }): void {
    this.track('exercise_progress_viewed', props);
  }
}
