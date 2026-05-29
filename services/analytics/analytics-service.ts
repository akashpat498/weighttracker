export interface AnalyticsService {
  track(event: string, properties?: Record<string, unknown>): void;
}
