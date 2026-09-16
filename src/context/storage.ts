import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'harvest-market:';

export const StorageKeys = {
  language: `${PREFIX}language`,
  user: `${PREFIX}user`,
  listings: `${PREFIX}listings`,
  cart: `${PREFIX}cart`,
  orders: `${PREFIX}orders`,
};

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore persistence failures, app remains usable in-memory
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
