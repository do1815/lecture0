export type Language = 'en' | 'ar';

export type UserRole = 'farmer' | 'buyer';

export type ProduceCategory = 'fruit' | 'vegetable';

export type Unit = 'kg' | 'box' | 'piece';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  city: string;
}

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: ProduceCategory;
  pricePerUnit: number;
  unit: Unit;
  quantityAvailable: number;
  cityEn: string;
  cityAr: string;
  emoji: string;
  createdAt: number;
}

export interface CartItem {
  listingId: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export interface OrderItem {
  listingId: string;
  nameEn: string;
  nameAr: string;
  quantity: number;
  unit: Unit;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}
