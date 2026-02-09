import { test, expect } from '@playwright/test';

/**
 * E2E Tests for User Authentication
 * Tests signup, login, logout, and profile management flows
 */

test.describe('User Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('successfully creates new account', async ({ page }) => {
    // Navigate to signup
    await page.getByRole('link', { name: /sign up/i }).click();

    // Fill signup form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill(`testuser${Date.now()}@example.com`);
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');

    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should redirect to homepage and show logout button
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();

    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');

    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('shows error for weak password', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();

    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('weak');
    await page.getByLabel(/confirm password/i).fill('weak');

    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
  });

  test('shows error for password mismatch', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();

    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different123');

    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('shows error for existing email', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();

    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('user1@example.com'); // Existing user
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');

    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText(/email already exists/i)).toBeVisible();
  });
});

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('successfully logs in with valid credentials', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();

    await page.getByLabel(/email/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');

    await page.getByRole('button', { name: /log in/i }).click();

    // Should redirect to homepage and show logout
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();

    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('shows error for empty fields', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();

    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('redirects to login when accessing protected route', async ({
    page,
  }) => {
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('redirects to original destination after login', async ({ page }) => {
    // Try to access profile (protected route)
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Login
    await page.getByLabel(/email/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();

    // Should redirect to profile
    await expect(page).toHaveURL('/profile');
  });
});

test.describe('User Logout', () => {
  test('successfully logs out user', async ({ page }) => {
    await page.goto('/');

    // Login first
    await page.getByRole('link', { name: /log in/i }).click();
    await page.getByLabel(/email/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();

    // Verify logged in
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Should show login link again
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
  });

  test('redirects to homepage after logout', async ({ page }) => {
    await page.goto('/');

    // Login and navigate to profile
    await page.getByRole('link', { name: /log in/i }).click();
    await page.getByLabel(/email/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.getByRole('link', { name: /profile/i }).click();

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Should redirect to homepage
    await expect(page).toHaveURL('/');
  });
});

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Login before each test
    await page.getByRole('link', { name: /log in/i }).click();
    await page.getByLabel(/email/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();
  });

  test('displays user profile information', async ({ page }) => {
    await page.getByRole('link', { name: /profile/i }).click();

    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('updates user profile', async ({ page }) => {
    await page.getByRole('link', { name: /profile/i }).click();

    // Update name
    await page.getByLabel(/name/i).clear();
    await page.getByLabel(/name/i).fill('Updated Name');

    // Update address
    await page.getByLabel(/street/i).fill('123 New Street');
    await page.getByLabel(/city/i).fill('New City');
    await page.getByLabel(/state/i).fill('NC');
    await page.getByLabel(/zip code/i).fill('12345');

    // Save
    await page.getByRole('button', { name: /save/i }).click();

    // Verify saved
    await expect(page.getByText(/profile updated/i)).toBeVisible();
  });

  test('persists profile changes', async ({ page }) => {
    await page.getByRole('link', { name: /profile/i }).click();

    // Update name
    await page.getByLabel(/name/i).clear();
    await page.getByLabel(/name/i).fill('Persistent Name');
    await page.getByRole('button', { name: /save/i }).click();

    // Reload page
    await page.reload();

    // Verify name persisted
    await expect(page.getByLabel(/name/i)).toHaveValue('Persistent Name');
  });
});
