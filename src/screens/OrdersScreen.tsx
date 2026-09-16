import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme/colors';
import { Order } from '../types';

export function OrdersScreen() {
  const { t, i18n } = useTranslation();
  const { orders, user, updateOrderStatus } = useApp();
  const isAr = i18n.language === 'ar';
  const isFarmer = user?.role === 'farmer';

  const myOrders = orders
    .filter((o) => (isFarmer ? o.farmerId === user?.id : o.buyerId === user?.id))
    .sort((a, b) => b.createdAt - a.createdAt);

  const renderActions = (order: Order) => {
    if (!isFarmer || order.status === 'delivered' || order.status === 'cancelled') return null;
    return (
      <View style={styles.actions}>
        {order.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => updateOrderStatus(order.id, 'confirmed')}
          >
            <Text style={styles.confirmText}>{t('orders.confirm')}</Text>
          </TouchableOpacity>
        )}
        {order.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => updateOrderStatus(order.id, 'delivered')}
          >
            <Text style={styles.confirmText}>{t('orders.markDelivered')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => updateOrderStatus(order.id, 'cancelled')}
        >
          <Text style={styles.cancelText}>{t('orders.cancel')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isFarmer ? t('orders.incomingTitle') : t('orders.title')}
        </Text>
      </View>

      <FlatList
        data={myOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            emoji="📦"
            title={t('orders.emptyTitle')}
            subtitle={
              isFarmer ? t('orders.emptySubtitleFarmer') : t('orders.emptySubtitleBuyer')
            }
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>
                {t('orders.order')} #{item.id.slice(-6)}
              </Text>
              <StatusBadge status={item.status} />
            </View>

            {isFarmer && (
              <Text style={styles.buyerLine}>
                {t('orders.buyer')}: {item.buyerName}
              </Text>
            )}
            {!isFarmer && <Text style={styles.buyerLine}>{item.farmerName}</Text>}

            {item.items.map((it) => (
              <View key={it.listingId} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {isAr ? it.nameAr : it.nameEn} × {it.quantity} {t(`common.${it.unit}`)}
                </Text>
                <Text style={styles.itemPrice}>
                  ${(it.priceAtOrder * it.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('orders.total')}</Text>
              <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
            </View>

            {renderActions(item)}
          </View>
        )}
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  buyerLine: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    color: colors.textMuted,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primaryLight,
  },
  confirmText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  cancelButton: {
    backgroundColor: '#F5E0DC',
  },
  cancelText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
});
