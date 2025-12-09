'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          const newItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({
            items: newItems,
            total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
          });
        } else {
          const newItems = [...items, { ...product, quantity: 1 }];
          set({
            items: newItems,
            total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
          });
        }
      },
      
      removeItem: (id) => {
        const newItems = get().items.filter(item => item.id !== id);
        set({
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        });
      },
      
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        
        const newItems = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        set({
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        });
      },
      
      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);