import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAuthStore } from '../store/useAuthStore';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginPage', () => {
  beforeAll(async () => {
    // Create test user for login tests
    const { signup } = useAuthStore.getState();
    await signup('user1@example.com', 'password123', 'Test User');
  });

  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    logout();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders login form', () => {
      renderWithRouter(<LoginPage />);

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders link to signup page', () => {
      renderWithRouter(<LoginPage />);

      const signupLink = screen.getByRole('link', { name: /sign up/i });
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it('shows error for empty password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });
  });

  describe('Login Flow', () => {
    it('successfully logs in with valid credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(emailInput, 'user1@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      });
    });

    it('shows error for invalid credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('shows loading state during login', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(emailInput, 'user1@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Check for loading indicator
      expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('marks required fields', () => {
      renderWithRouter(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });
});
