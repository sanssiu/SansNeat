export interface FoodItem {
  id: string;
  name: string;
  category: 'Pizza' | 'Burger' | 'Sandwich' | string;
  price: string;
  numericPrice: number;
  image: string;
  description?: string;
  rating?: number;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'In Transit' | 'Delivered' | 'Preparing';
  total: string;
  items: string;
  image: string;
}

export type TabType = 'home' | 'orders' | 'cart' | 'profile' | 'wishlist';
