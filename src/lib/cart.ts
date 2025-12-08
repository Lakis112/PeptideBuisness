'use client';

import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        total: get().total + product.price
      });
    } else {
      // Add new item
      set({
        items: [...items, { ...product, quantity: 1 }],
        total: get().total + product.price
      });
    }
  },
  
  removeItem: (id) => {
    const items = get().items;
    const itemToRemove = items.find(item => item.id === id);
    
    if (itemToRemove) {
      set({
        items: items.filter(item => item.id !== id),
        total: get().total - (itemToRemove.price * itemToRemove.quantity)
      });
    }
  },
  
  clearCart: () => {
    set({ items: [], total: 0 });
  }
}));