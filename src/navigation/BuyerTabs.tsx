import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CartScreen } from '../screens/CartScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { BuyerTabParamList, MarketStackParamList } from './types';

const Tab = createBottomTabNavigator<BuyerTabParamList>();
const MarketStack = createNativeStackNavigator<MarketStackParamList>();

function MarketStackNavigator() {
  const { t } = useTranslation();
  return (
    <MarketStack.Navigator>
      <MarketStack.Screen
        name="MarketList"
        component={MarketplaceScreen}
        options={{ headerShown: false }}
      />
      <MarketStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: t('product.title') }}
      />
    </MarketStack.Navigator>
  );
}

const ICONS: Record<keyof BuyerTabParamList, keyof typeof Ionicons.glyphMap> = {
  Market: 'storefront-outline',
  Cart: 'cart-outline',
  Orders: 'receipt-outline',
  Profile: 'person-outline',
};

export function BuyerTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="Market"
        component={MarketStackNavigator}
        options={{ title: t('tabs.market') }}
      />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: t('tabs.cart') }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: t('tabs.orders') }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}
