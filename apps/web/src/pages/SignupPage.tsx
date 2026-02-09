import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormError } from '../components/ui/form-error';
import { useRedirect } from '../hooks/useRedirect';
import { ROUTES } from '../constants/routes';
import { validatePassword, validatePasswordMatch, validateEmail, validateRequired } from '../lib/validation';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const { redirect, getRedirectUrl } = useRedirect(ROUTES.PROFILE);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const nameValidation = validateRequired(formData.name, 'Name');
    if (!nameValidation.isValid) {
      setError(nameValidation.error!);
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      return;
    }

    const passwordMatchValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (!passwordMatchValidation.isValid) {
      setError(passwordMatchValidation.error!);
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(
        formData.email,
        formData.password,
        formData.name
      );

      if (success) {
        redirect();
      } else {
        setError('Email already exists');
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
          <h1 id="signup-heading" className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="signup-heading" noValidate>
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              autoComplete="name"
            />

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
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {error && <FormError message={error} />}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to={getRedirectUrl(ROUTES.LOGIN)}
                className="text-blue-500 hover:underline font-semibold"
              >
                Log In
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
              <strong>Demo Note:</strong> This is a mock signup. Data is stored locally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
