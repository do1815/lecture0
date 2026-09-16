import type { NavigatorScreenParams } from '@react-navigation/native';

export type MarketStackParamList = {
  MarketList: undefined;
  ProductDetail: { listingId: string };
};

export type DashboardStackParamList = {
  MyListings: undefined;
  AddEditListing: { listingId?: string } | undefined;
};

export type BuyerTabParamList = {
  Market: NavigatorScreenParams<MarketStackParamList>;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type FarmerTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  AddListing: undefined;
  Orders: undefined;
  Profile: undefined;
};
