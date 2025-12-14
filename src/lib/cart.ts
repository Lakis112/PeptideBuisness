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
  addItem: (product: { id: string; name: string; price: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  total: number;
  itemCount: number;
}

// Helper function to check authentication
const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/me');
    const data = await response.json();
    return !!data.user;
  } catch {
    return false;
  }
};

// Helper function to ensure price is a number
const ensureNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
};

// Helper function to ensure cart items have proper types
const normalizeCartItems = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) return [];
  
  return items.map(item => ({
    id: String(item.id || ''),
    name: String(item.name || ''),
    price: ensureNumber(item.price),
    quantity: Number(item.quantity) || 1
  }));
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      
      syncCart: async () => {
        try {
          const auth = await isAuthenticated();
          
          if (auth) {
            const response = await fetch('/api/cart');
            if (response.ok) {
              const data = await response.json();
              const normalizedItems = normalizeCartItems(data.items || []);
              const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
              
              set({ 
                items: normalizedItems,
                total,
                itemCount
              });
              return;
            }
          }
          
          // For guests, just load from local storage (automatically done by persist)
          const items = get().items;
          const normalizedItems = normalizeCartItems(items);
          const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
          
          set({
            items: normalizedItems,
            total,
            itemCount
          });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },
      
      syncWithServer: async () => {
        const auth = await isAuthenticated();
        if (!auth) return;
        
        try {
          const localItems = get().items;
          if (localItems.length === 0) return;
          
          // Merge local cart with server cart
          const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: localItems })
          });
          
          if (response.ok) {
            const data = await response.json();
            const normalizedItems = normalizeCartItems(data.items || []);
            const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ 
              items: normalizedItems,
              total,
              itemCount
            });
          }
        } catch (error) {
          console.error('Failed to sync with server:', error);
        }
      },
      
      addItem: async (product) => {
        const auth = await isAuthenticated();
        const price = ensureNumber(product.price);
        
        if (auth) {
          // Use database API for logged users
          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                ...product, 
                price: price,
                quantity: 1 
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              const normalizedItems = normalizeCartItems(data.items || []);
              const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
              
              set({ 
                items: normalizedItems,
                total,
                itemCount
              });
              return;
            }
          } catch (error) {
            console.error('Failed to add to server cart:', error);
          }
        }
        
        // Fallback to local storage for guests
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          const newItems = items.map(item =>
            item.id === product.id
              ? { 
                  ...item, 
                  quantity: item.quantity + 1,
                  price: ensureNumber(item.price)
                }
              : item
          );
          const normalizedItems = normalizeCartItems(newItems);
          const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
          
          set({
            items: normalizedItems,
            total,
            itemCount
          });
        } else {
          const newItems = [...items, { 
            ...product, 
            price: price,
            quantity: 1 
          }];
          const normalizedItems = normalizeCartItems(newItems);
          const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
          
          set({
            items: normalizedItems,
            total,
            itemCount
          });
        }
      },
      
      removeItem: async (id: string) => {
        const auth = await isAuthenticated();
        
        if (auth) {
          try {
            const response = await fetch(`/api/cart?productId=${id}`, {
              method: 'DELETE'
            });
            
            if (response.ok) {
              const items = get().items.filter(item => item.id !== id);
              const normalizedItems = normalizeCartItems(items);
              const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
              
              set({
                items: normalizedItems,
                total,
                itemCount
              });
              return;
            }
          } catch (error) {
            console.error('Failed to remove item from server:', error);
          }
        }
        
        // Fallback to local storage for guests
        const newItems = get().items.filter(item => item.id !== id);
        const normalizedItems = normalizeCartItems(newItems);
        const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({
          items: normalizedItems,
          total,
          itemCount
        });
      },
      
      updateQuantity: async (id: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        
        const auth = await isAuthenticated();
        
        if (auth) {
          try {
            const item = get().items.find(item => item.id === id);
            if (!item) return;
            
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                id, 
                name: item.name, 
                price: ensureNumber(item.price), 
                quantity: quantity - item.quantity 
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              const normalizedItems = normalizeCartItems(data.items || []);
              const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
              
              set({ 
                items: normalizedItems,
                total,
                itemCount
              });
              return;
            }
          } catch (error) {
            console.error('Failed to update quantity on server:', error);
          }
        }
        
        // Fallback to local storage for guests
        const newItems = get().items.map(item =>
          item.id === id ? { 
            ...item, 
            quantity,
            price: ensureNumber(item.price)
          } : item
        );
        const normalizedItems = normalizeCartItems(newItems);
        const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({
          items: normalizedItems,
          total,
          itemCount
        });
      },
      
      clearCart: async () => {
        const auth = await isAuthenticated();
        
        if (auth) {
          try {
            const response = await fetch('/api/cart', {
              method: 'PATCH'
            });
            
            if (response.ok) {
              set({ items: [], total: 0, itemCount: 0 });
              return;
            }
          } catch (error) {
            console.error('Failed to clear server cart:', error);
          }
        }
        
        // Fallback to local storage for guests
        set({ items: [], total: 0, itemCount: 0 });
      }
    }),
    {
      name: 'cart-storage',
      // Add migration to fix existing data
      migrate: (persistedState: any) => {
        if (!persistedState) return { items: [], total: 0, itemCount: 0 };
        
        const items = normalizeCartItems(persistedState.items || []);
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items,
          total,
          itemCount
        };
      }
    }
  )
);