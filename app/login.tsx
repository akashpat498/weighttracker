import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

const inputStyle = {
  backgroundColor: Colors.surface,
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: Colors.text,
  fontFamily: 'IBMPlexMono_500Medium',
  fontSize: 18,
} as const;

type Mode = 'signin' | 'signup';

export default function LoginScreen() {
  const { configured, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = mode === 'signin'
      ? await signIn(trimmed, password)
      : await signUp(trimmed, password);
    setBusy(false);
    if (err) setError(err);
    // On success the auth listener updates the session and the gate navigates away.
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1 justify-center px-6"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ThemedText type="title">WeightTracker</ThemedText>
          <ThemedText className="mb-8 mt-2" style={{ color: Colors.muted }}>
            {mode === 'signin'
              ? 'Sign in to sync your workouts across devices.'
              : 'Create an account to sync your workouts across devices.'}
          </ThemedText>

          {!configured && (
            <View className="mb-6 rounded-xl p-4" style={{ backgroundColor: Colors.chip }}>
              <ThemedText style={{ color: Colors.text, fontSize: 13 }}>
                Supabase isn’t configured yet. Add EXPO_PUBLIC_SUPABASE_URL and
                EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env and restart.
              </ThemedText>
            </View>
          )}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={Colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            style={inputStyle}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={Colors.muted}
            secureTextEntry
            autoCapitalize="none"
            style={[inputStyle, { marginTop: 12 }]}
          />

          {error ? (
            <ThemedText className="mt-3" style={{ color: '#DC2626', fontSize: 13 }}>
              {error}
            </ThemedText>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={busy || !configured}
            className="mt-6 items-center rounded-xl py-4"
            style={{ backgroundColor: Colors.tint, opacity: busy || !configured ? 0.5 : 1 }}>
            {busy ? (
              <ActivityIndicator color={Colors.tintContrast} />
            ) : (
              <ThemedText type="onTint">
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </ThemedText>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
            }}
            className="mt-4 items-center">
            <ThemedText type="link">
              {mode === 'signin'
                ? 'New here? Create an account'
                : 'Have an account? Sign in'}
            </ThemedText>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
