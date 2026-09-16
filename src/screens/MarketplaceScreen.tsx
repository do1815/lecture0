import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { ProduceCategory } from '../types';
import { MarketStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MarketStackParamList, 'MarketList'>;

const CATEGORIES: { key: 'all' | ProduceCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'common.all' },
  { key: 'fruit', labelKey: 'common.fruit' },
  { key: 'vegetable', labelKey: 'common.vegetable' },
];

export function MarketplaceScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { listings } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ProduceCategory>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesCategory = category === 'all' || l.category === category;
      const matchesQuery =
        !q ||
        l.nameEn.toLowerCase().includes(q) ||
        l.nameAr.includes(q) ||
        l.farmerName.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [listings, query, category]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('market.title')}</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder={t('common.search') ?? ''}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.chips}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.chip, category === c.key && styles.chipActive]}
            onPress={() => setCategory(c.key)}
          >
            <Text style={[styles.chipText, category === c.key && styles.chipTextActive]}>
              {t(c.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            listing={item}
            onPress={() => navigation.navigate('ProductDetail', { listingId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState emoji="🔍" title={t('market.noResults')} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
});
