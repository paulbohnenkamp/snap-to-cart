import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '@/lib/api';
import { useSession } from '@/store/session';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';

export default function Settings() {
  const logout = useSession((state) => state.logout);
  async function connect() {
    try {
      const { url } = await api.krogerConnectUrl();
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Connection unavailable', error instanceof Error ? error.message : 'Try again');
    }
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kroger connection</Text>
        <Text style={styles.copy}>Production OAuth and cart integration are not part of the local demo yet.</Text>
        <PrimaryButton title="Open Kroger authorization" onPress={connect} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy</Text>
        <Text style={styles.copy}>Package images are processed for recognition and are not retained by default.</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream, padding: 24, paddingTop: 70 },
  title: { fontSize: 34, fontWeight: '800', color: colors.ink, marginBottom: 24 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, gap: 14, marginBottom: 14 },
  cardTitle: { fontSize: 19, fontWeight: '800', color: colors.ink },
  copy: { fontSize: 15, lineHeight: 22, color: colors.muted },
  logoutButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  logoutText: { color: colors.danger, fontWeight: '700' },
});
