import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nManager } from 'react-native';

import i18n, { RTL_LANGUAGES } from '../i18n';
import { mockListings } from '../data/mockListings';
import { loadJSON, removeKey, saveJSON, StorageKeys } from './storage';
import {
  CartItem,
  Language,
  Listing,
  Order,
  OrderStatus,
  User,
} from '../types';

interface AppContextValue {
  isReady: boolean;

  language: Language;
  languageSelected: boolean;
  setLanguage: (lang: Language) => Promise<void>;

  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;

  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<void>;
  updateListing: (id: string, patch: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;

  cart: CartItem[];
  addToCart: (listingId: string, quantity: number) => Promise<void>;
  updateCartQuantity: (listingId: string, quantity: number) => Promise<void>;
  removeFromCart: (listingId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  orders: Order[];
  placeOrder: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function genId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [languageSelected, setLanguageSelected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const [storedLang, storedUser, storedListings, storedCart, storedOrders] =
        await Promise.all([
          loadJSON<Language>(StorageKeys.language),
          loadJSON<User>(StorageKeys.user),
          loadJSON<Listing[]>(StorageKeys.listings),
          loadJSON<CartItem[]>(StorageKeys.cart),
          loadJSON<Order[]>(StorageKeys.orders),
        ]);

      if (storedLang) {
        i18n.changeLanguage(storedLang);
        const shouldBeRTL = RTL_LANGUAGES.includes(storedLang);
        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);
        }
        setLanguageState(storedLang);
        setLanguageSelected(true);
      }
      if (storedUser) setUser(storedUser);
      if (storedListings && storedListings.length > 0) setListings(storedListings);
      if (storedCart) setCart(storedCart);
      if (storedOrders) setOrders(storedOrders);

      setIsReady(true);
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    await i18n.changeLanguage(lang);
    setLanguageState(lang);
    setLanguageSelected(true);
    await saveJSON(StorageKeys.language, lang);

    const shouldBeRTL = RTL_LANGUAGES.includes(lang);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
    }
  }, []);

  const login = useCallback(async (newUser: User) => {
    setUser(newUser);
    await saveJSON(StorageKeys.user, newUser);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await removeKey(StorageKeys.user);
  }, []);

  const persistListings = useCallback(async (next: Listing[]) => {
    setListings(next);
    await saveJSON(StorageKeys.listings, next);
  }, []);

  const addListing = useCallback(
    async (listing: Omit<Listing, 'id' | 'createdAt'>) => {
      const newListing: Listing = {
        ...listing,
        id: genId('listing'),
        createdAt: Date.now(),
      };
      await persistListings([newListing, ...listings]);
    },
    [listings, persistListings],
  );

  const updateListing = useCallback(
    async (id: string, patch: Partial<Listing>) => {
      const next = listings.map((l) => (l.id === id ? { ...l, ...patch } : l));
      await persistListings(next);
    },
    [listings, persistListings],
  );

  const deleteListing = useCallback(
    async (id: string) => {
      await persistListings(listings.filter((l) => l.id !== id));
    },
    [listings, persistListings],
  );

  const persistCart = useCallback(async (next: CartItem[]) => {
    setCart(next);
    await saveJSON(StorageKeys.cart, next);
  }, []);

  const addToCart = useCallback(
    async (listingId: string, quantity: number) => {
      const existing = cart.find((c) => c.listingId === listingId);
      let next: CartItem[];
      if (existing) {
        next = cart.map((c) =>
          c.listingId === listingId
            ? { ...c, quantity: c.quantity + quantity }
            : c,
        );
      } else {
        next = [...cart, { listingId, quantity }];
      }
      await persistCart(next);
    },
    [cart, persistCart],
  );

  const updateCartQuantity = useCallback(
    async (listingId: string, quantity: number) => {
      if (quantity <= 0) {
        await persistCart(cart.filter((c) => c.listingId !== listingId));
        return;
      }
      await persistCart(
        cart.map((c) => (c.listingId === listingId ? { ...c, quantity } : c)),
      );
    },
    [cart, persistCart],
  );

  const removeFromCart = useCallback(
    async (listingId: string) => {
      await persistCart(cart.filter((c) => c.listingId !== listingId));
    },
    [cart, persistCart],
  );

  const clearCart = useCallback(async () => {
    await persistCart([]);
  }, [persistCart]);

  const persistOrders = useCallback(async (next: Order[]) => {
    setOrders(next);
    await saveJSON(StorageKeys.orders, next);
  }, []);

  const placeOrder = useCallback(async () => {
    if (!user || cart.length === 0) return;

    const byFarmer = new Map<string, CartItem[]>();
    for (const item of cart) {
      const listing = listings.find((l) => l.id === item.listingId);
      if (!listing) continue;
      const group = byFarmer.get(listing.farmerId) ?? [];
      group.push(item);
      byFarmer.set(listing.farmerId, group);
    }

    const newOrders: Order[] = [];
    for (const [farmerId, items] of byFarmer.entries()) {
      const orderItems = items
        .map((item) => {
          const listing = listings.find((l) => l.id === item.listingId);
          if (!listing) return null;
          return {
            listingId: listing.id,
            nameEn: listing.nameEn,
            nameAr: listing.nameAr,
            quantity: item.quantity,
            unit: listing.unit,
            priceAtOrder: listing.pricePerUnit,
          };
        })
        .filter((i): i is NonNullable<typeof i> => i !== null);

      const farmerName = listings.find((l) => l.farmerId === farmerId)?.farmerName ?? '';
      const total = orderItems.reduce(
        (sum, i) => sum + i.priceAtOrder * i.quantity,
        0,
      );

      newOrders.push({
        id: genId('order'),
        buyerId: user.id,
        buyerName: user.name,
        farmerId,
        farmerName,
        items: orderItems,
        total,
        status: 'pending',
        createdAt: Date.now(),
      });
    }

    await persistOrders([...newOrders, ...orders]);
    await persistCart([]);
  }, [cart, listings, orders, persistCart, persistOrders, user]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
      await persistOrders(next);
    },
    [orders, persistOrders],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      isReady,
      language,
      languageSelected,
      setLanguage,
      user,
      login,
      logout,
      listings,
      addListing,
      updateListing,
      deleteListing,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      orders,
      placeOrder,
      updateOrderStatus,
    }),
    [
      isReady,
      language,
      languageSelected,
      setLanguage,
      user,
      login,
      logout,
      listings,
      addListing,
      updateListing,
      deleteListing,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      orders,
      placeOrder,
      updateOrderStatus,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
