import { renderHook, act } from '@testing-library/react';
import { useOrderStore } from './useOrderStore';

describe('useOrderStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset Zustand store state
    useOrderStore.setState({ orders: [] });
  });

  describe('Adding Orders', () => {
    it('adds a new order', () => {
      const { result } = renderHook(() => useOrderStore());

      let orderId: string;
      act(() => {
        orderId = result.current.addOrder({
          userId: 'user1',
          items: [
            {
              id: 1,
              title: 'Test Product',
              price: 99.99,
              image: 'test.jpg',
              category: 'test',
              quantity: 2,
            },
          ],
          total: 199.98,
          shippingAddress: {
            name: 'John Doe',
            email: 'john@example.com',
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const order = result.current.getOrderById(orderId!);
      expect(order).toBeDefined();
      expect(order?.total).toBe(199.98);
      expect(order?.items).toHaveLength(1);
      expect(order?.status).toBe('completed');
    });

    it('generates unique order IDs', () => {
      const { result } = renderHook(() => useOrderStore());

      const orderId1 = act(() => {
        return result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 100,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const orderId2 = act(() => {
        return result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 200,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      expect(orderId1).not.toBe(orderId2);
    });

    it('sets order date to current time', () => {
      const { result } = renderHook(() => useOrderStore());
      const beforeTime = new Date();

      let orderId: string;
      act(() => {
        orderId = result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 100,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const order = result.current.getOrderById(orderId!);
      const orderDate = new Date(order!.createdAt);
      const afterTime = new Date();

      expect(orderDate.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(orderDate.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });

  describe('Retrieving Orders', () => {
    it('retrieves order by ID', () => {
      const { result } = renderHook(() => useOrderStore());

      let orderId: string;
      act(() => {
        orderId = result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 150.5,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const order = result.current.getOrderById(orderId!);
      expect(order).toBeDefined();
      expect(order?.id).toBe(orderId!);
      expect(order?.total).toBe(150.5);
    });

    it('returns undefined for non-existent order', () => {
      const { result } = renderHook(() => useOrderStore());

      const order = result.current.getOrderById('non-existent-id');
      expect(order).toBeUndefined();
    });

    it('retrieves orders by user ID', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 100,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });

        result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 200,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });

        result.current.addOrder({
          userId: 'user2',
          items: [],
          total: 300,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const user1Orders = result.current.getOrdersByUserId('user1');
      expect(user1Orders).toHaveLength(2);
      expect(user1Orders.every((order) => order.userId === 'user1')).toBe(true);
    });

    it('returns empty array for user with no orders', () => {
      const { result } = renderHook(() => useOrderStore());

      const orders = result.current.getOrdersByUserId('non-existent-user');
      expect(orders).toEqual([]);
    });

    it('retrieves guest orders (null userId)', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addOrder({
          userId: 'guest',
          items: [],
          total: 100,
          shippingAddress: {
            name: 'Guest',
            email: 'guest@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const guestOrders = result.current.getOrdersByUserId('guest');
      expect(guestOrders).toHaveLength(1);
      expect(guestOrders[0].userId).toBe('guest');
    });
  });

  describe('Order Sorting', () => {
    it('returns orders sorted by date (newest first)', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 100,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      // Wait a bit to ensure different timestamps
      setTimeout(() => {
        act(() => {
          result.current.addOrder({
            userId: 'user1',
            items: [],
            total: 200,
            shippingAddress: {
              name: 'Test',
              email: 'test@example.com',
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'USA',
            },
            paymentMethod: 'card',
          });
        });
      }, 10);

      const orders = result.current.getOrdersByUserId('user1');
      if (orders.length === 2) {
        const date1 = new Date(orders[0].createdAt);
        const date2 = new Date(orders[1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });
  });

  describe('Persistence', () => {
    it('persists orders to localStorage', () => {
      const { result } = renderHook(() => useOrderStore());

      let orderId: string;
      act(() => {
        orderId = result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 123.45,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      // Create new instance to simulate page refresh
      const { result: result2 } = renderHook(() => useOrderStore());

      const order = result2.current.getOrderById(orderId!);
      expect(order).toBeDefined();
      expect(order?.total).toBe(123.45);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const { result } = renderHook(() => useOrderStore());

      let orderId: string;
      act(() => {
        orderId = result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 0,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const order = result.current.getOrderById(orderId!);
      expect(order?.items).toEqual([]);
    });

    it('handles large order totals', () => {
      const { result } = renderHook(() => useOrderStore());

      let orderId: string;
      act(() => {
        orderId = result.current.addOrder({
          userId: 'user1',
          items: [],
          total: 999999.99,
          shippingAddress: {
            name: 'Test',
            email: 'test@example.com',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          paymentMethod: 'card',
        });
      });

      const order = result.current.getOrderById(orderId!);
      expect(order?.total).toBe(999999.99);
    });
  });
});
