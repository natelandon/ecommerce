import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';

/**
 * Integration tests for complete user journeys through the e-commerce application
 * Tests realistic user workflows from browsing to checkout
 */

const renderApp = () => {
  return render(<App />);
};

describe('User Journey Integration Tests', () => {
  beforeEach(() => {
    // Clear all stores before each test
    useCartStore.getState().clear();
    useAuthStore.getState().logout();
    localStorage.clear();
  });

  describe('Guest User - Browse to Checkout', () => {
    it('allows guest to browse products, add to cart, and checkout', async () => {
      const user = userEvent.setup();
      renderApp();

      // Step 1: Browse products on home page
      await waitFor(() => {
        expect(screen.getByText(/featured products/i)).toBeInTheDocument();
      });

      // Step 2: Click on a product
      const productCards = screen.getAllByRole('article');
      await user.click(productCards[0]);

      // Step 3: Add product to cart from product detail page
      const addToCartButton = await screen.findByRole('button', { name: /add to cart/i });
      await user.click(addToCartButton);

      // Step 4: Navigate to cart
      const cartLink = screen.getByRole('link', { name: /cart/i });
      await user.click(cartLink);

      // Step 5: Verify product is in cart
      await waitFor(() => {
        expect(useCartStore.getState().items).toHaveLength(1);
      });

      // Step 6: Proceed to checkout
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Step 7: Fill checkout form
      await user.type(screen.getByLabelText(/name/i), 'Guest User');
      await user.type(screen.getByLabelText(/email/i), 'guest@example.com');
      await user.type(screen.getByLabelText(/street/i), '123 Main St');
      await user.type(screen.getByLabelText(/city/i), 'Springfield');
      await user.type(screen.getByLabelText(/state/i), 'IL');
      await user.type(screen.getByLabelText(/zip code/i), '62701');

      // Step 8: Place order
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      await user.click(placeOrderButton);

      // Step 9: Verify order success
      await waitFor(() => {
        expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument();
      });

      // Step 10: Verify cart is cleared
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('Authenticated User - Full Flow', () => {
    it('allows user to signup, browse, add to cart, and checkout', async () => {
      const user = userEvent.setup();
      renderApp();

      // Step 1: Navigate to signup
      const signupLink = screen.getByRole('link', { name: /sign up/i });
      await user.click(signupLink);

      // Step 2: Create account
      await user.type(screen.getByLabelText(/name/i), 'New User');
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      // Step 3: Verify authenticated
      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      });

      // Step 4: Browse and add product to cart
      const productCards = await screen.findAllByRole('article');
      await user.click(productCards[0]);

      const addToCartButton = await screen.findByRole('button', { name: /add to cart/i });
      await user.click(addToCartButton);

      // Step 5: Add another product
      await user.click(screen.getByRole('link', { name: /home/i }));
      const moreProducts = await screen.findAllByRole('article');
      await user.click(moreProducts[1]);
      await user.click(await screen.findByRole('button', { name: /add to cart/i }));

      // Step 6: Go to cart and adjust quantities
      await user.click(screen.getByRole('link', { name: /cart/i }));

      const incrementButtons = screen.getAllByRole('button', { name: /\+/i });
      await user.click(incrementButtons[0]);

      // Step 7: Proceed to checkout
      await user.click(screen.getByRole('button', { name: /proceed to checkout/i }));

      // Step 8: Fill remaining checkout details
      await user.type(screen.getByLabelText(/street/i), '456 Oak Ave');
      await user.type(screen.getByLabelText(/city/i), 'Chicago');
      await user.type(screen.getByLabelText(/state/i), 'IL');
      await user.type(screen.getByLabelText(/zip code/i), '60601');

      // Step 9: Place order
      await user.click(screen.getByRole('button', { name: /place order/i }));

      // Step 10: Verify success and order recorded
      await waitFor(() => {
        const orders = useOrderStore.getState().getOrdersByUserId(
          useAuthStore.getState().user?.id || ''
        );
        expect(orders.length).toBeGreaterThan(0);
      });
    });

    it('allows user to update profile and use saved address', async () => {
      const user = userEvent.setup();
      renderApp();

      // Step 1: Login
      await user.click(screen.getByRole('link', { name: /log in/i }));
      await user.type(screen.getByLabelText(/email/i), 'user1@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      // Step 2: Go to profile
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('link', { name: /profile/i }));

      // Step 3: Update profile address
      await user.clear(screen.getByLabelText(/street/i));
      await user.type(screen.getByLabelText(/street/i), '789 Pine St');
      await user.clear(screen.getByLabelText(/city/i));
      await user.type(screen.getByLabelText(/city/i), 'Boston');
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Step 4: Add product to cart
      await user.click(screen.getByRole('link', { name: /home/i }));
      const productCards = await screen.findAllByRole('article');
      await user.click(productCards[0]);
      await user.click(await screen.findByRole('button', { name: /add to cart/i }));

      // Step 5: Go to checkout
      await user.click(screen.getByRole('link', { name: /cart/i }));
      await user.click(screen.getByRole('button', { name: /proceed to checkout/i }));

      // Step 6: Verify saved address is pre-filled
      expect(screen.getByDisplayValue('789 Pine St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Boston')).toBeInTheDocument();
    });
  });

  describe('Cart Management Flow', () => {
    it('allows adding, updating, and removing items from cart', async () => {
      const user = userEvent.setup();
      renderApp();

      // Add first product
      const productCards = await screen.findAllByRole('article');
      await user.click(productCards[0]);
      await user.click(await screen.findByRole('button', { name: /add to cart/i }));

      // Add second product
      await user.click(screen.getByRole('link', { name: /home/i }));
      const moreProducts = await screen.findAllByRole('article');
      await user.click(moreProducts[1]);
      await user.click(await screen.findByRole('button', { name: /add to cart/i }));

      // Go to cart
      await user.click(screen.getByRole('link', { name: /cart/i }));

      // Verify 2 items
      expect(useCartStore.getState().items).toHaveLength(2);

      // Increase quantity
      const incrementButtons = screen.getAllByRole('button', { name: /\+/i });
      await user.click(incrementButtons[0]);
      expect(useCartStore.getState().getTotalItems()).toBeGreaterThan(2);

      // Decrease quantity
      const decrementButtons = screen.getAllByRole('button', { name: /-/i });
      await user.click(decrementButtons[0]);

      // Remove item
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);
      expect(useCartStore.getState().items).toHaveLength(1);
    });

    it('persists cart across page navigation', async () => {
      const user = userEvent.setup();
      renderApp();

      // Add product
      const productCards = await screen.findAllByRole('article');
      await user.click(productCards[0]);
      await user.click(await screen.findByRole('button', { name: /add to cart/i }));

      const cartCountBefore = useCartStore.getState().getTotalItems();

      // Navigate away and back
      await user.click(screen.getByRole('link', { name: /home/i }));
      await user.click(screen.getByRole('link', { name: /cart/i }));

      // Verify cart persisted
      expect(useCartStore.getState().getTotalItems()).toBe(cartCountBefore);
    });
  });

  describe('Authentication Flow', () => {
    it('redirects to login when accessing protected routes', async () => {
      const user = userEvent.setup();
      renderApp();

      // Try to access profile without login
      await user.click(screen.getByRole('link', { name: /profile/i }));

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      });
    });

    it('allows logout and clears auth state', async () => {
      const user = userEvent.setup();
      renderApp();

      // Login
      await user.click(screen.getByRole('link', { name: /log in/i }));
      await user.type(screen.getByLabelText(/email/i), 'user1@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      });

      // Logout
      await user.click(screen.getByRole('button', { name: /logout/i }));

      // Verify logged out
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
