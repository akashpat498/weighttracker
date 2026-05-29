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
}
