import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/colors';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
  onBack: () => void;
  onSubmit: (fields: { name: string; phone: string; city: string }) => void;
}

export function AuthScreen({ role, onBack, onSubmit }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = name.trim().length > 0 && phone.trim().length > 0 && city.trim().length > 0;

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) return;
    onSubmit({ name: name.trim(), phone: phone.trim(), city: city.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.roleEmoji}>{role === 'farmer' ? '👨‍🌾' : '🛒'}</Text>
          <Text style={styles.title}>{t('auth.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>{t('auth.name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('auth.namePlaceholder') ?? ''}
              placeholderTextColor={colors.textMuted}
            />
            {touched && !name.trim() && (
              <Text style={styles.error}>{t('common.requiredField')}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('auth.phone')}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder={t('auth.phonePlaceholder') ?? ''}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
            {touched && !phone.trim() && (
              <Text style={styles.error}>{t('common.requiredField')}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('auth.city')}</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder={t('auth.cityPlaceholder') ?? ''}
              placeholderTextColor={colors.textMuted}
            />
            {touched && !city.trim() && (
              <Text style={styles.error}>{t('common.requiredField')}</Text>
            )}
          </View>

          <PrimaryButton
            title={t('auth.getStarted')}
            onPress={handleSubmit}
            style={styles.submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backText: {
    color: colors.primary,
    fontWeight: '600',
  },
  roleEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  submit: {
    marginTop: spacing.md,
  },
});
