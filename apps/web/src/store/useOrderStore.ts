import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';

export type Order = {
  id: string;
  userId: string | null; // null for guest orders
  items: CartItem[];
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
};

type OrderState = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
  getOrdersByUserId: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const newOrder: Order = {
          ...order,
          id: orderId,
          status: 'completed',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
        }));

        return orderId;
      },

      getOrdersByUserId: (userId: string) => {
        const state = get();
        return state.orders
          .filter((order) => order.userId === userId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
      },

      getOrderById: (orderId: string) => {
        const state = get();
        return state.orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'order-storage',
    },
  ),
);
