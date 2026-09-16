import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';
import { UserRole } from '../types';

interface Props {
  onSelect: (role: UserRole) => void;
}

export function RoleSelectScreen({ onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('role.title')}</Text>
        <Text style={styles.subtitle}>{t('role.subtitle')}</Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => onSelect('farmer')}
        >
          <Text style={styles.cardEmoji}>👨‍🌾</Text>
          <Text style={styles.cardTitle}>{t('role.farmer')}</Text>
          <Text style={styles.cardDesc}>{t('role.farmerDesc')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => onSelect('buyer')}
        >
          <Text style={styles.cardEmoji}>🛒</Text>
          <Text style={styles.cardTitle}>{t('role.buyer')}</Text>
          <Text style={styles.cardDesc}>{t('role.buyerDesc')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
