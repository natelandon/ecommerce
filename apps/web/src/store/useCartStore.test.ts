import { renderHook, act } from '@testing-library/react';
import { useCartStore } from './useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset Zustand store state
    useCartStore.setState({ items: [] });
    // Also call the store's clear method
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clear();
    });
  });

  describe('Adding Items', () => {
    it('adds item to cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Test Product',
          price: 99.99,
          image: 'test.jpg',
          category: 'test',
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject({
        id: 1,
        title: 'Test Product',
        quantity: 1,
      });
    });

    it('increments quantity when adding existing item', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        image: 'test.jpg',
        category: 'test',
      };

      act(() => {
        result.current.addItem(item);
        result.current.addItem(item);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });
  });

  describe('Removing Items', () => {
    it('removes item from cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Test Product',
          price: 99.99,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.removeItem(1);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('does nothing when removing non-existent item', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Test Product',
          price: 99.99,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.removeItem(999);
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('Quantity Management', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useCartStore());
      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Test Product',
          price: 99.99,
          image: 'test.jpg',
          category: 'test',
        });
      });
    });

    it('increments item quantity', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.incrementQuantity(1);
      });

      expect(result.current.items[0].quantity).toBe(2);
    });

    it('decrements item quantity', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.incrementQuantity(1);
        result.current.decrementQuantity(1);
      });

      expect(result.current.items[0].quantity).toBe(1);
    });

    it('removes item when quantity reaches 0', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.decrementQuantity(1);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('updates quantity directly', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.updateQuantity(1, 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it('removes item when quantity set to 0', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('Cart Calculations', () => {
    it('calculates total items count', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Product 1',
          price: 10,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.addItem({
          id: 2,
          title: 'Product 2',
          price: 20,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.updateQuantity(1, 3);
      });

      expect(result.current.getTotalItems()).toBe(4); // 3 + 1
    });

    it('calculates total price', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Product 1',
          price: 10.5,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.addItem({
          id: 2,
          title: 'Product 2',
          price: 20.25,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.updateQuantity(1, 2);
      });

      expect(result.current.getTotalPrice()).toBe(41.25); // (10.5 * 2) + 20.25
    });

    it('returns 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.getTotalItems()).toBe(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });
  });

  describe('Cart Operations', () => {
    it('clears entire cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Product 1',
          price: 10,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.addItem({
          id: 2,
          title: 'Product 2',
          price: 20,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.clear();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles negative quantity attempts gracefully', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Test Product',
          price: 99.99,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.updateQuantity(1, -5);
      });

      // Should remove item instead of having negative quantity
      expect(result.current.items).toHaveLength(0);
    });

    it('handles very large quantities', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Test Product',
          price: 1,
          image: 'test.jpg',
          category: 'test',
        });
        result.current.updateQuantity(1, 1000000);
      });

      expect(result.current.items[0].quantity).toBe(1000000);
      expect(result.current.getTotalPrice()).toBe(1000000);
    });
  });
});
