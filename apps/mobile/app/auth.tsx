import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/lib/api';
import { useSession } from '@/store/session';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const save = useSession((state) => state.save);

  async function submit() {
    try {
      setBusy(true);
      const tokens = mode === 'login'
        ? await api.login(email, password)
        : await api.register(name, email, password);
      await save(tokens.accessToken, tokens.refreshToken);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Could not sign in', error instanceof Error ? error.message : 'Try again');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}>
      <View>
        <Text style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>
        <Text style={styles.sub}>Your camera becomes a shopping shortcut.</Text>
      </View>
      <View style={styles.form}>
        {mode === 'register' && <TextInput accessibilityLabel="Name" autoComplete="name" placeholder="Name" value={name} onChangeText={setName} style={styles.input} />}
        <TextInput accessibilityLabel="Email" autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput accessibilityLabel="Password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
        <PrimaryButton disabled={busy} title={busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'} onPress={submit} />
        <Pressable accessibilityRole="button" onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={styles.switchButton}>
          <Text style={styles.switchText}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream, padding: 28, paddingTop: 110 },
  title: { fontSize: 36, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 17, color: colors.muted, marginTop: 10 },
  form: { gap: 14, marginTop: 46 },
  input: { height: 56, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: colors.line, paddingHorizontal: 17, fontSize: 16, color: colors.ink },
  switchButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  switchText: { textAlign: 'center', color: colors.green, fontWeight: '700' },
});
