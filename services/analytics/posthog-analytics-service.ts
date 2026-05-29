import type { PostHog } from 'posthog-react-native';
import { BaseAnalyticsService } from './base-analytics-service';

export class PostHogAnalyticsService extends BaseAnalyticsService {
  private posthog: PostHog | null = null;

  setPostHogInstance(instance: PostHog): void {
    this.posthog = instance;
  }

  track(event: string, properties?: Record<string, unknown>): void {
    this.posthog?.capture(event, properties as Record<string, string | number | boolean | null>);
  }
}
