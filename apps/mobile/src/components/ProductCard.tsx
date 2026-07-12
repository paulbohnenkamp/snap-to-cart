import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductCandidate } from '@/types';
import { colors } from '@/theme';

export function ProductCard({ product, onToggle }: { product: ProductCandidate; onToggle: () => void }) {
  const details = [product.variant, product.size].filter(Boolean).join(' · ');
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: product.selected }}
      accessibilityLabel={`${product.brand} ${product.name}${details ? `, ${details}` : ''}`}
      onPress={onToggle}
      style={[styles.card, product.selected && styles.selected]}
    >
      <View style={styles.icon}><Ionicons name="cube-outline" size={25} color={colors.green} /></View>
      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{details ? `${details} · ` : ''}{Math.round(product.confidence * 100)}% match</Text>
        <Text style={styles.selection}>{product.selected ? 'Selected' : 'Not selected'}</Text>
      </View>
      <Ionicons name={product.selected ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={product.selected ? colors.green : colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 88, backgroundColor: colors.card, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.line },
  selected: { borderColor: colors.green, borderWidth: 2 },
  icon: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  brand: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, color: colors.green },
  name: { fontSize: 17, fontWeight: '700', color: colors.ink, marginTop: 3 },
  meta: { fontSize: 13, color: colors.muted, marginTop: 5 },
  selection: { fontSize: 12, color: colors.ink, fontWeight: '700', marginTop: 4 },
});
