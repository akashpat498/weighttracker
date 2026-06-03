import 'react-native-get-random-values'; // Must be first: polyfill for uuid
import '../global.css';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { Colors } from '@/constants/theme';
import { analyticsService } from '@/services/analytics';

SplashScreen.preventAutoHideAsync();

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

const AppTheme = {
  ...DarkTheme,
  dark: false,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.tint,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.tint,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

/** Bridges the PostHog instance from the provider into our analytics singleton. */
function PostHogBridge() {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      analyticsService.setPostHogInstance(posthog);
    }
  }, [posthog]);

  return null;
}

/**
 * Renders the navigation stack and enforces the auth gate: signed-out users are
 * redirected to /login; signing in (or out) moves them to/from the tabs.
 */
function RootNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const onLogin = segments[0] === 'login';
    if (!session && !onLogin) {
      router.replace('/login');
    } else if (session && onLogin) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
  });

  // Splash is hidden by RootNavigator once the auth session is resolved.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const appContent = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <AuthProvider>
            <ThemeProvider value={AppTheme}>
              <RootNavigator />
              <StatusBar style="dark" />
            </ThemeProvider>
          </AuthProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  if (!POSTHOG_API_KEY) {
    return appContent;
  }

  return (
    <PostHogProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: POSTHOG_HOST,
      }}
      autocapture={{
        captureScreens: true,
      }}>
      <PostHogBridge />
      {appContent}
    </PostHogProvider>
  );
}
