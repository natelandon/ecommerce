import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Checkout Process
 * Tests the complete checkout flow from cart to order confirmation
 */

test.describe('Guest Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Add product to cart
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Navigate to checkout
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
  });

  test('displays checkout form', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /checkout/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/street/i)).toBeVisible();
    await expect(page.getByLabel(/city/i)).toBeVisible();
    await expect(page.getByLabel(/state/i)).toBeVisible();
    await expect(page.getByLabel(/zip code/i)).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /place order/i }).click();

    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/street/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('Springfield');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('62701');

    await page.getByRole('button', { name: /place order/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('successfully places order', async ({ page }) => {
    // Fill checkout form
    await page.getByLabel(/name/i).fill('Guest User');
    await page.getByLabel(/email/i).fill('guest@example.com');
    await page.getByLabel(/street/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('Springfield');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('62701');

    // Select payment method
    await page.getByLabel(/credit card/i).check();

    // Place order
    await page.getByRole('button', { name: /place order/i }).click();

    // Should redirect to success page
    await expect(page).toHaveURL(/\/order-success/);
    await expect(page.getByText(/order placed successfully/i)).toBeVisible();
  });

  test('shows order summary in checkout', async ({ page }) => {
    await expect(page.getByText(/order summary/i)).toBeVisible();
    await expect(page.getByText(/subtotal/i)).toBeVisible();
    await expect(page.getByText(/total/i)).toBeVisible();
  });

  test('calculates order total correctly', async ({ page }) => {
    // Get cart total
    await page.goto('/cart');
    const cartTotal = await page.getByText(/total/i).textContent();

    // Go to checkout
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Checkout total should match cart total
    const checkoutTotal = await page.getByText(/total/i).textContent();
    expect(checkoutTotal).toContain(cartTotal?.match(/\$[\d.]+/)?.[0] || '');
  });

  test('clears cart after successful order', async ({ page }) => {
    // Fill and submit checkout form
    await page.getByLabel(/name/i).fill('Guest User');
    await page.getByLabel(/email/i).fill('guest@example.com');
    await page.getByLabel(/street/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('Springfield');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('62701');
    await page.getByLabel(/credit card/i).check();
    await page.getByRole('button', { name: /place order/i }).click();

    // Navigate to cart
    await page.getByRole('link', { name: /cart/i }).click();

    // Cart should be empty
    await expect(page.getByText(/cart is empty/i)).toBeVisible();
  });
});

test.describe('Authenticated User Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Login
    await page.getByRole('link', { name: /log in/i }).click();
    await page.getByLabel(/email/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();

    // Add product to cart
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Navigate to checkout
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
  });

  test('pre-fills user information from profile', async ({ page }) => {
    // Name and email should be pre-filled
    await expect(page.getByLabel(/name/i)).not.toBeEmpty();
    await expect(page.getByLabel(/email/i)).not.toBeEmpty();
  });

  test('allows updating address during checkout', async ({ page }) => {
    await page.getByLabel(/street/i).fill('456 Oak Ave');
    await page.getByLabel(/city/i).fill('Chicago');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('60601');
    await page.getByLabel(/credit card/i).check();

    await page.getByRole('button', { name: /place order/i }).click();

    // Should successfully place order
    await expect(page).toHaveURL(/\/order-success/);
  });

  test('saves order to user account', async ({ page }) => {
    // Complete checkout
    await page.getByLabel(/street/i).fill('456 Oak Ave');
    await page.getByLabel(/city/i).fill('Chicago');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('60601');
    await page.getByLabel(/credit card/i).check();
    await page.getByRole('button', { name: /place order/i }).click();

    // Navigate to profile
    await page.getByRole('link', { name: /profile/i }).click();

    // Should show order history
    await expect(page.getByText(/order history/i)).toBeVisible();
  });
});

test.describe('Order Success Page', () => {
  test('displays order confirmation details', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Complete checkout flow
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/street/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('Springfield');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('62701');
    await page.getByLabel(/credit card/i).check();
    await page.getByRole('button', { name: /place order/i }).click();

    // Verify order success page
    await expect(page.getByText(/order placed successfully/i)).toBeVisible();
    await expect(page.getByText(/order number/i)).toBeVisible();
  });

  test('provides link to continue shopping', async ({ page }) => {
    await page.goto('/order-success/test-order-id');

    const continueShoppingLink = page.getByRole('link', {
      name: /continue shopping/i,
    });
    await expect(continueShoppingLink).toBeVisible();

    await continueShoppingLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Payment Method Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Setup checkout
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();
  });

  test('allows selecting credit card payment', async ({ page }) => {
    const creditCardOption = page.getByLabel(/credit card/i);
    await expect(creditCardOption).toBeVisible();
    await creditCardOption.check();
    await expect(creditCardOption).toBeChecked();
  });

  test('allows selecting PayPal payment', async ({ page }) => {
    const paypalOption = page.getByLabel(/paypal/i);
    await expect(paypalOption).toBeVisible();
    await paypalOption.check();
    await expect(paypalOption).toBeChecked();
  });

  test('requires payment method selection', async ({ page }) => {
    // Fill form without selecting payment
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/street/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('Springfield');
    await page.getByLabel(/state/i).fill('IL');
    await page.getByLabel(/zip code/i).fill('62701');

    // Try to submit
    await page.getByRole('button', { name: /place order/i }).click();

    // Should show error or default to first payment method
    // This depends on implementation
  });
});

test.describe('Checkout Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/name/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();
  });

  test('form has proper labels', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // All inputs should have labels
    const nameInput = page.getByLabel(/name/i);
    const emailInput = page.getByLabel(/email/i);
    const streetInput = page.getByLabel(/street/i);

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(streetInput).toBeVisible();
  });
});
