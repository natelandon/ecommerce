import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SignupPage } from './SignupPage';
import { useAuthStore } from '../store/useAuthStore';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SignupPage', () => {
  beforeAll(async () => {
    // Create test user for existing email test
    const { signup } = useAuthStore.getState();
    await signup('existing@example.com', 'Password123!', 'Existing User');
  });

  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    logout();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders signup form', () => {
      renderWithRouter(<SignupPage />);

      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('renders link to login page', () => {
      renderWithRouter(<SignupPage />);

      const loginLink = screen.getByRole('link', { name: /log in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    });

    it('shows error for empty email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it('shows error for weak password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'weak');

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
    });

    it('shows error for mismatched passwords', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  describe('Signup Flow', () => {
    it('successfully creates account with valid data', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      });
    });

    it('shows error for existing email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'user1@example.com'); // Existing email
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
    });

    it('disables submit button during signup', async () => {
      const user = userEvent.setup();
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(nameInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('marks required fields', () => {
      renderWithRouter(<SignupPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
      expect(confirmPasswordInput).toBeRequired();
    });
  });
});
