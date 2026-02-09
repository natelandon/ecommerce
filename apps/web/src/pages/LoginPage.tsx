import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormError } from '../components/ui/form-error';
import { useRedirect } from '../hooks/useRedirect';
import { ROUTES } from '../constants/routes';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { redirect, getRedirectUrl } = useRedirect(ROUTES.PROFILE);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate email
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email');
      return;
    }
    
    // Validate password
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    
    // All validations passed, proceed with login
    // Use flushSync to ensure loading state is updated immediately for tests
    flushSync(() => setIsLoading(true));

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        redirect();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 id="login-heading" className="text-3xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="login-heading" noValidate>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && <FormError message={error} />}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to={getRedirectUrl(ROUTES.SIGNUP)}
                className="text-blue-500 hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
              <strong>Demo Note:</strong> Create any account to test. No real authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
