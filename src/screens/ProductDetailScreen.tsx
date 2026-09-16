import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PrimaryButton } from '../components/PrimaryButton';
import { QuantityStepper } from '../components/QuantityStepper';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { MarketStackParamList } from '../navigation/types';
import { formatPrice } from '../utils/currency';

type Props = NativeStackScreenProps<MarketStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { t, i18n } = useTranslation();
  const { listings, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const listing = listings.find((l) => l.id === route.params.listingId);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>{t('common.empty')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAr = i18n.language === 'ar';
  const lang = isAr ? 'ar' : 'en';
  const name = isAr ? listing.nameAr : listing.nameEn;
  const description = isAr ? listing.descriptionAr : listing.descriptionEn;
  const city = isAr ? listing.cityAr : listing.cityEn;
  const unitLabel = t(`common.${listing.unit}`);
  const total = listing.pricePerUnit * quantity;

  const handleAddToCart = async () => {
    await addToCart(listing.id, quantity);
    Alert.alert(t('product.addedToCart'));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>{listing.emoji}</Text>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>
          {formatPrice(listing.pricePerUnit, lang)} {t('product.pricePerUnit', { unit: unitLabel })}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('product.farmer')}</Text>
          <Text style={styles.infoValue}>{listing.farmerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('product.location')}</Text>
          <Text style={styles.infoValue}>{city}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('market.available')}</Text>
          <Text style={styles.infoValue}>
            {listing.quantityAvailable} {unitLabel}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t('product.description')}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>{t('product.quantity')}</Text>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={listing.quantityAvailable}
          />
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('product.totalPrice')}</Text>
          <Text style={styles.totalValue}>{formatPrice(total, lang)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title={t('product.addToCart')} onPress={handleAddToCart} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hero: {
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 80,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  quantitySection: {
    marginTop: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
