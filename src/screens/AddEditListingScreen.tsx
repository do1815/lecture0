import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
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
import { useFocusEffect } from '@react-navigation/native';

import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { ProduceCategory, Unit } from '../types';

interface Props {
  listingId?: string;
  onDone: () => void;
}

const CATEGORIES: ProduceCategory[] = ['fruit', 'vegetable'];
const UNITS: Unit[] = ['kg', 'box', 'piece'];
const DEFAULT_EMOJI: Record<ProduceCategory, string> = {
  fruit: '🍎',
  vegetable: '🥕',
};

interface FormState {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: ProduceCategory;
  unit: Unit;
  price: string;
  quantity: string;
  emoji: string;
}

const BLANK_FORM: FormState = {
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  category: 'vegetable',
  unit: 'kg',
  price: '',
  quantity: '',
  emoji: DEFAULT_EMOJI.vegetable,
};

export function AddEditListingScreen({ listingId, onDone }: Props) {
  const { t } = useTranslation();
  const { user, listings, addListing, updateListing, deleteListing } = useApp();
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [touched, setTouched] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (listingId) {
        const existing = listings.find((l) => l.id === listingId);
        if (existing) {
          setForm({
            nameEn: existing.nameEn,
            nameAr: existing.nameAr,
            descriptionEn: existing.descriptionEn,
            descriptionAr: existing.descriptionAr,
            category: existing.category,
            unit: existing.unit,
            price: String(existing.pricePerUnit),
            quantity: String(existing.quantityAvailable),
            emoji: existing.emoji,
          });
        }
      } else {
        setForm(BLANK_FORM);
      }
      setTouched(false);
    }, [listingId, listings]),
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const priceNumber = parseFloat(form.price);
  const quantityNumber = parseInt(form.quantity, 10);

  const isValid =
    form.nameEn.trim().length > 0 &&
    form.nameAr.trim().length > 0 &&
    !Number.isNaN(priceNumber) &&
    priceNumber > 0 &&
    !Number.isNaN(quantityNumber) &&
    quantityNumber >= 0;

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValid || !user) return;

    const payload = {
      farmerId: user.id,
      farmerName: user.name,
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      descriptionAr: form.descriptionAr.trim(),
      category: form.category,
      pricePerUnit: priceNumber,
      unit: form.unit,
      quantityAvailable: quantityNumber,
      cityEn: user.city,
      cityAr: user.city,
      emoji: form.emoji.trim() || DEFAULT_EMOJI[form.category],
    };

    if (listingId) {
      await updateListing(listingId, payload);
    } else {
      await addListing(payload);
      setForm(BLANK_FORM);
      setTouched(false);
      Alert.alert(t('addListing.success'));
    }
    onDone();
  };

  const handleDelete = () => {
    if (!listingId) return;
    Alert.alert(t('addListing.deleteConfirmTitle'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteListing(listingId);
          onDone();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>
            {listingId ? t('addListing.editTitle') : t('addListing.title')}
          </Text>

          <Field label={t('addListing.nameEn')} required touched={touched} value={form.nameEn}>
            <TextInput
              style={styles.input}
              value={form.nameEn}
              onChangeText={(v) => setField('nameEn', v)}
            />
          </Field>

          <Field label={t('addListing.nameAr')} required touched={touched} value={form.nameAr}>
            <TextInput
              style={styles.input}
              value={form.nameAr}
              onChangeText={(v) => setField('nameAr', v)}
            />
          </Field>

          <Field label={t('addListing.descriptionEn')} touched={touched} value="ok">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.descriptionEn}
              onChangeText={(v) => setField('descriptionEn', v)}
              multiline
            />
          </Field>

          <Field label={t('addListing.descriptionAr')} touched={touched} value="ok">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.descriptionAr}
              onChangeText={(v) => setField('descriptionAr', v)}
              multiline
            />
          </Field>

          <Text style={styles.label}>{t('addListing.category')}</Text>
          <View style={styles.optionsRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.optionChip, form.category === c && styles.optionChipActive]}
                onPress={() =>
                  setForm((f) => ({
                    ...f,
                    category: c,
                    emoji: f.emoji === DEFAULT_EMOJI[f.category] ? DEFAULT_EMOJI[c] : f.emoji,
                  }))
                }
              >
                <Text
                  style={[
                    styles.optionChipText,
                    form.category === c && styles.optionChipTextActive,
                  ]}
                >
                  {t(`common.${c}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('addListing.unit')}</Text>
          <View style={styles.optionsRow}>
            {UNITS.map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.optionChip, form.unit === u && styles.optionChipActive]}
                onPress={() => setField('unit', u)}
              >
                <Text
                  style={[styles.optionChipText, form.unit === u && styles.optionChipTextActive]}
                >
                  {t(`common.${u}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Field label={t('addListing.price')} required touched={touched} value={form.price}>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(v) => setField('price', v)}
              keyboardType="decimal-pad"
            />
          </Field>

          <Field
            label={t('addListing.quantity')}
            required
            touched={touched}
            value={form.quantity}
          >
            <TextInput
              style={styles.input}
              value={form.quantity}
              onChangeText={(v) => setField('quantity', v)}
              keyboardType="number-pad"
            />
          </Field>

          <Field label={t('addListing.emoji')} touched={touched} value="ok">
            <TextInput
              style={styles.input}
              value={form.emoji}
              onChangeText={(v) => setField('emoji', v)}
              maxLength={4}
            />
          </Field>

          <PrimaryButton
            title={listingId ? t('addListing.update') : t('addListing.submit')}
            onPress={handleSubmit}
            style={styles.submit}
          />

          {listingId && (
            <PrimaryButton
              title={t('common.delete')}
              onPress={handleDelete}
              variant="outline"
              style={styles.deleteButton}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required,
  touched,
  value,
  children,
}: {
  label: string;
  required?: boolean;
  touched: boolean;
  value: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const showError = required && touched && !value.trim();
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {showError && <Text style={styles.error}>{t('common.requiredField')}</Text>}
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
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
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
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  optionChipTextActive: {
    color: colors.white,
  },
  submit: {
    marginTop: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.sm,
  },
});
