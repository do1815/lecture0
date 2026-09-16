import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';
import { OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: colors.warning,
  confirmed: colors.primary,
  delivered: colors.primaryDark,
  cancelled: colors.danger,
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useTranslation();
  const color = STATUS_COLORS[status];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{t(`orders.status.${status}`)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
