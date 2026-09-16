import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { DashboardStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'MyListings'>;

export function FarmerDashboardScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const { listings, user } = useApp();
  const isAr = i18n.language === 'ar';

  const myListings = listings
    .filter((l) => l.farmerId === user?.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.title')}</Text>
      </View>

      <FlatList
        data={myListings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            emoji="🌱"
            title={t('dashboard.emptyTitle')}
            subtitle={t('dashboard.emptySubtitle')}
          />
        }
        renderItem={({ item }) => {
          const name = isAr ? item.nameAr : item.nameEn;
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AddEditListing', { listingId: item.id })}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.price}>
                  ${item.pricePerUnit.toFixed(2)} / {t(`common.${item.unit}`)}
                </Text>
                <Text style={styles.quantity}>
                  {t('dashboard.quantityLeft', {
                    count: item.quantityAvailable,
                    unit: t(`common.${item.unit}`),
                  })}
                </Text>
              </View>
              <Text style={styles.chevron}>{t('common.edit')}</Text>
            </TouchableOpacity>
          );
        }}
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
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 32,
    marginEnd: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginVertical: 2,
  },
  quantity: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
