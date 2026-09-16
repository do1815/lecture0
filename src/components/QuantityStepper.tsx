import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max, step = 1 }: Props) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(max ? Math.min(max, value + step) : value + step);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={decrease}
        disabled={value <= min}
      >
        <Text style={[styles.buttonText, value <= min && styles.disabled]}>−</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={increase}
        disabled={max !== undefined && value >= max}
      >
        <Text
          style={[
            styles.buttonText,
            max !== undefined && value >= max && styles.disabled,
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  disabled: {
    opacity: 0.3,
  },
  value: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.xs,
  },
});
