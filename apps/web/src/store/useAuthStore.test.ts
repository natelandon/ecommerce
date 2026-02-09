import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './useAuthStore';

describe('useAuthStore', () => {
  // Set up mock users for testing
  beforeAll(async () => {
    // Create test users by signing up
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.signup(
        'user1@example.com',
        'password123',
        'Test User 1',
      );
      result.current.logout();
    });
  });

  beforeEach(() => {
    localStorage.clear();
    // Reset Zustand store state to initial
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      error: null,
    });
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  describe('Login', () => {
    it('logs in with valid credentials', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.login(
          'user1@example.com',
          'password123',
        );
      });

      expect(success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe('user1@example.com');
    });

    it('fails login with invalid credentials', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.login('wrong@example.com', 'wrongpass');
      });

      expect(success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('fails login with incorrect password', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.login('user1@example.com', 'wrongpass');
      });

      expect(success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Signup', () => {
    it('creates new account with unique email', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.signup(
          'newuser@example.com',
          'password123',
          'New User',
        );
      });

      expect(success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('newuser@example.com');
      expect(result.current.user?.name).toBe('New User');
    });

    it('fails signup with existing email', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.signup(
          'user1@example.com',
          'password123',
          'Test User',
        );
      });

      expect(success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('creates user with default address', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signup(
          'addressuser@example.com',
          'password123',
          'Address User',
        );
      });

      expect(result.current.user?.address).toEqual({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      });
    });
  });

  describe('Logout', () => {
    it('logs out authenticated user', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('user1@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('handles logout when not logged in', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Update Profile', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.login('user1@example.com', 'password123');
      });
    });

    it('updates user name', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateProfile({ name: 'Updated Name' });
      });

      expect(result.current.user?.name).toBe('Updated Name');
    });

    it('updates user phone', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateProfile({ phone: '555-1234' });
      });

      expect(result.current.user?.phone).toBe('555-1234');
    });

    it('updates user address', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateProfile({
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
          },
        });
      });

      expect(result.current.user?.address.street).toBe('123 Main St');
      expect(result.current.user?.address.city).toBe('Springfield');
    });

    it('partially updates address', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateProfile({
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
          },
        });
      });

      expect(result.current.user?.address.street).toBe('123 Main St');
      // Other fields should remain unchanged
      expect(result.current.user?.address.country).toBe('USA');
    });

    it('does nothing when not authenticated', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.logout();
        result.current.updateProfile({ name: 'New Name' });
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('Persistence', () => {
    it('maintains authentication state', async () => {
      const { result: result1 } = renderHook(() => useAuthStore());

      await act(async () => {
        await result1.current.login('user1@example.com', 'password123');
      });

      // Simulate new instance (like page refresh)
      const { result: result2 } = renderHook(() => useAuthStore());

      expect(result2.current.isAuthenticated).toBe(true);
      expect(result2.current.user?.email).toBe('user1@example.com');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty email', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.login('', 'password');
      });

      expect(success).toBe(false);
    });

    it('handles empty password', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.login('user1@example.com', '');
      });

      expect(success).toBe(false);
    });

    it('handles empty name in signup', async () => {
      const { result } = renderHook(() => useAuthStore());

      let success;
      await act(async () => {
        success = await result.current.signup('new@example.com', 'pass', '');
      });

      expect(success).toBe(true);
      expect(result.current.user?.name).toBe('');
    });
  });
});
