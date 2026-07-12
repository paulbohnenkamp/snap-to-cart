import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { ProductCandidate } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';

export default function Scan() {
  const [uri, setUri] = useState<string>();
  const [products, setProducts] = useState<ProductCandidate[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [busy, setBusy] = useState(false);

  async function choose(camera: boolean) {
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', `Allow ${camera ? 'camera' : 'photo library'} access to choose a package photo.`);
      return;
    }

    const picked = camera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (picked.canceled) return;

    const imageUri = picked.assets[0].uri;
    setUri(imageUri);
    setProducts([]);
    setBusy(true);
    try {
      const result = await api.scan(imageUri);
      setDemoMode(result.demoMode);
      setProducts(result.products.map((product) => ({ ...product, selected: true, quantity: 1 })));
    } catch (error) {
      Alert.alert('Recognition failed', error instanceof Error ? error.message : 'Try again');
    } finally {
      setBusy(false);
    }
  }

  async function add() {
    const selected = products.filter((product) => product.selected);
    const actionable = selected.filter((product) => product.upc);
    if (!selected.length) {
      Alert.alert('Select an item', 'Choose at least one recognized product first.');
      return;
    }
    if (actionable.length !== selected.length) {
      Alert.alert('Product match unavailable', 'One or more selected products do not have a Kroger UPC yet. Nothing was added.');
      return;
    }

    try {
      await Promise.all(actionable.map((product) => api.addToCart(product.upc!, product.quantity ?? 1)));
      Alert.alert(
        demoMode ? 'Demo action complete' : 'Added to cart',
        demoMode
          ? 'The selected items were simulated successfully. No external Kroger cart was changed.'
          : 'Your selected items were sent to Kroger.',
      );
    } catch (error) {
      Alert.alert('Could not add items', error instanceof Error ? error.message : 'Try again');
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Scan packages</Text>
      <Text style={styles.sub}>One clear photo can contain one item or several.</Text>
      {demoMode && (
        <View style={styles.demo} accessibilityRole="text">
          <Ionicons name="flask-outline" size={20} color={colors.green} />
          <Text style={styles.demoText}>Demo mode recognizes a sample product and simulates cart actions.</Text>
        </View>
      )}
      {uri ? (
        <Image source={{ uri }} style={styles.preview} accessibilityLabel="Selected package photo" />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="scan-outline" size={46} color={colors.green} />
          <Text style={styles.emptyTitle}>Center labels in the frame</Text>
          <Text style={styles.emptyCopy}>Good light and a visible brand name improve matching.</Text>
        </View>
      )}
      <View style={styles.row}>
        <View style={styles.flex}><PrimaryButton title="Take photo" onPress={() => choose(true)} disabled={busy} /></View>
        <View style={styles.flex}><PrimaryButton title="Photo library" onPress={() => choose(false)} disabled={busy} /></View>
      </View>
      {busy && <Text style={styles.working} accessibilityLiveRegion="polite">Reading the package…</Text>}
      {products.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>We found {products.length} {products.length === 1 ? 'item' : 'items'}</Text>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggle={() => setProducts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, selected: !item.selected } : item))}
            />
          ))}
          <PrimaryButton title={demoMode ? 'Simulate adding selected items' : 'Add selected to Kroger'} onPress={add} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 24, paddingTop: 70, paddingBottom: 40 },
  title: { fontSize: 34, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 16, color: colors.muted, marginTop: 8, marginBottom: 22 },
  demo: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, marginBottom: 16, borderRadius: 14, backgroundColor: colors.greenSoft },
  demoText: { flex: 1, color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  empty: { height: 330, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B8C9BF', backgroundColor: '#EDF3EF', alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: colors.ink, marginTop: 18 },
  emptyCopy: { fontSize: 14, lineHeight: 21, textAlign: 'center', color: colors.muted, marginTop: 8 },
  preview: { height: 330, borderRadius: 16, resizeMode: 'cover' },
  row: { flexDirection: 'row', gap: 12, marginTop: 16 },
  flex: { flex: 1 },
  working: { textAlign: 'center', fontSize: 15, color: colors.green, fontWeight: '700', padding: 20 },
  results: { gap: 12, marginTop: 28 },
  resultsTitle: { fontSize: 21, fontWeight: '800', color: colors.ink, marginBottom: 4 },
});
