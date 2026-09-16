import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { Language } from '../types';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

export function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, language, setLanguage } = useApp();

  const handleSwitchRole = () => {
    Alert.alert(t('profile.switchRoleConfirm'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.continue'), onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>{user?.role === 'farmer' ? '👨‍🌾' : '🛒'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>

        <View style={styles.card}>
          <InfoRow label={t('profile.role')} value={user?.role === 'farmer' ? t('role.farmer') : t('role.buyer')} />
          <InfoRow label={t('profile.phone')} value={user?.phone ?? ''} />
          <InfoRow label={t('profile.city')} value={user?.city ?? ''} last />
        </View>

        <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langChip, language === l.code && styles.langChipActive]}
              onPress={() => setLanguage(l.code)}
            >
              <Text
                style={[styles.langChipText, language === l.code && styles.langChipTextActive]}
              >
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title={t('profile.switchRole')}
          onPress={handleSwitchRole}
          variant="outline"
          style={styles.actionButton}
        />
        <PrimaryButton
          title={t('auth.logout')}
          onPress={() => logout()}
          variant="danger"
          style={styles.actionButton}
        />

        <Text style={styles.about}>{t('profile.about')}</Text>
        <Text style={styles.version}>{t('profile.version')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  langChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  langChipTextActive: {
    color: colors.white,
  },
  actionButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  about: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  version: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
