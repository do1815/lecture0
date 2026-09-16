import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { Language } from '../types';

const OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇴🇲' },
];

export function LanguageSelectScreen() {
  const { t } = useTranslation();
  const { setLanguage } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌴</Text>
        </View>

        <View style={styles.wordmarkRow}>
          <Text style={styles.wordmarkEn}>Bustan</Text>
          <View style={styles.wordmarkDot} />
          <Text style={styles.wordmarkAr}>بستان</Text>
        </View>

        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>{t('language.subtitle')}</Text>

        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.code}
              style={styles.option}
              activeOpacity={0.8}
              onPress={() => setLanguage(opt.code)}
            >
              <Text style={styles.flag}>{opt.flag}</Text>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoBadge: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: {
    fontSize: 52,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  wordmarkEn: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  wordmarkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginHorizontal: spacing.sm,
  },
  wordmarkAr: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.accent,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  options: {
    width: '100%',
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flag: {
    fontSize: 28,
    marginEnd: spacing.md,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
