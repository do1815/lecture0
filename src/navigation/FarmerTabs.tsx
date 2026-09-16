import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { AddEditListingScreen } from '../screens/AddEditListingScreen';
import { FarmerDashboardScreen } from '../screens/FarmerDashboardScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { DashboardStackParamList, FarmerTabParamList } from './types';

const Tab = createBottomTabNavigator<FarmerTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();

function AddEditListingRoute({
  route,
  navigation,
}: NativeStackScreenProps<DashboardStackParamList, 'AddEditListing'>) {
  return (
    <AddEditListingScreen
      listingId={route.params?.listingId}
      onDone={() => navigation.navigate('MyListings')}
    />
  );
}

function DashboardStackNavigator() {
  const { t } = useTranslation();
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen
        name="MyListings"
        component={FarmerDashboardScreen}
        options={{ headerShown: false }}
      />
      <DashboardStack.Screen
        name="AddEditListing"
        component={AddEditListingRoute}
        options={{ title: t('addListing.editTitle') }}
      />
    </DashboardStack.Navigator>
  );
}

function AddListingTabScreen() {
  return <AddEditListingScreen onDone={() => {}} />;
}

const ICONS: Record<keyof FarmerTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'leaf-outline',
  AddListing: 'add-circle-outline',
  Orders: 'receipt-outline',
  Profile: 'person-outline',
};

export function FarmerTabs() {
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
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{ title: t('tabs.dashboard') }}
      />
      <Tab.Screen
        name="AddListing"
        component={AddListingTabScreen}
        options={{ title: t('tabs.addListing') }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: t('tabs.orders') }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}
