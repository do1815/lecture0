import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuantityStepper } from '../components/QuantityStepper';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { BuyerTabParamList } from '../navigation/types';
import { formatPrice } from '../utils/currency';

type Props = BottomTabScreenProps<BuyerTabParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const { cart, listings, updateCartQuantity, removeFromCart, placeOrder } = useApp();
  const isAr = i18n.language === 'ar';
  const lang = isAr ? 'ar' : 'en';

  const items = cart
    .map((item) => {
      const listing = listings.find((l) => l.id === item.listingId);
      return listing ? { ...item, listing } : null;
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  const subtotal = items.reduce(
    (sum, i) => sum + i.listing.pricePerUnit * i.quantity,
    0,
  );

  const handleCheckout = async () => {
    await placeOrder();
    Alert.alert(t('cart.orderPlaced'), t('cart.orderPlacedSubtitle') ?? '');
    navigation.navigate('Orders');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState emoji="🛒" title={t('cart.emptyTitle')} subtitle={t('cart.emptySubtitle')}>
          <PrimaryButton
            title={t('cart.browseMarket')}
            onPress={() => navigation.navigate('Market', { screen: 'MarketList' })}
          />
        </EmptyState>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('cart.title')}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.listingId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const name = isAr ? item.listing.nameAr : item.listing.nameEn;
          return (
            <View style={styles.card}>
              <Text style={styles.emoji}>{item.listing.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.price}>
                  {formatPrice(item.listing.pricePerUnit, lang)} /{' '}
                  {t(`common.${item.listing.unit}`)}
                </Text>
                <TouchableOpacity onPress={() => removeFromCart(item.listingId)}>
                  <Text style={styles.remove}>{t('cart.remove')}</Text>
                </TouchableOpacity>
              </View>
              <QuantityStepper
                value={item.quantity}
                onChange={(q) => updateCartQuantity(item.listingId, q)}
                min={1}
                max={item.listing.quantityAvailable}
              />
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>{t('cart.subtotal')}</Text>
          <Text style={styles.subtotalValue}>{formatPrice(subtotal, lang)}</Text>
        </View>
        <PrimaryButton title={t('cart.checkout')} onPress={handleCheckout} />
      </View>
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
    color: colors.textMuted,
    marginVertical: 2,
  },
  remove: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  subtotalLabel: {
    fontSize: 15,
    color: colors.textMuted,
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
});
