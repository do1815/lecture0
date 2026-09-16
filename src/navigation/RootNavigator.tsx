import React, { useState } from 'react';
import { ActivityIndicator, I18nManager, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { useApp } from '../context/AppContext';
import { AuthScreen } from '../screens/AuthScreen';
import { LanguageSelectScreen } from '../screens/LanguageSelectScreen';
import { RoleSelectScreen } from '../screens/RoleSelectScreen';
import { colors } from '../theme/colors';
import { UserRole } from '../types';
import { BuyerTabs } from './BuyerTabs';
import { FarmerTabs } from './FarmerTabs';

function genUserId() {
  return `user_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
}

export function RootNavigator() {
  const { isReady, languageSelected, user, login } = useApp();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!languageSelected) {
    return <LanguageSelectScreen />;
  }

  if (!user) {
    if (!pendingRole) {
      return <RoleSelectScreen onSelect={setPendingRole} />;
    }
    return (
      <AuthScreen
        role={pendingRole}
        onBack={() => setPendingRole(null)}
        onSubmit={(fields) =>
          login({
            id: genUserId(),
            role: pendingRole,
            ...fields,
          })
        }
      />
    );
  }

  return (
    <NavigationContainer key={I18nManager.isRTL ? 'rtl' : 'ltr'}>
      {user.role === 'farmer' ? <FarmerTabs /> : <BuyerTabs />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
