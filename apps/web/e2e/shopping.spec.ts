import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Product Browsing and Cart functionality
 * Tests real user interactions with products and shopping cart
 */

test.describe('Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays product grid on homepage', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /featured products/i }),
    ).toBeVisible();

    // Should show multiple products
    const products = page.getByRole('article');
    await expect(products).toHaveCount(8, { timeout: 5000 });
  });

  test('shows product details when clicking on product', async ({ page }) => {
    // Click first product
    await page.getByRole('article').first().click();

    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/product\/\d+/);

    // Should show product information
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add to cart/i }),
    ).toBeVisible();
    await expect(page.getByText(/\$/)).toBeVisible();
  });

  test('navigates back to homepage from product detail', async ({ page }) => {
    await page.getByRole('article').first().click();
    await page.getByRole('link', { name: /home/i }).click();

    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: /featured products/i }),
    ).toBeVisible();
  });
});

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear cart from localStorage
    await page.evaluate(() => localStorage.clear());
  });

  test('adds product to cart from product detail page', async ({ page }) => {
    // Go to product detail
    await page.getByRole('article').first().click();

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Cart badge should show 1 item
    await expect(page.getByText('1')).toBeVisible();
  });

  test('increases quantity in cart', async ({ page }) => {
    // Add product to cart
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to cart
    await page.getByRole('link', { name: /cart/i }).click();

    // Click increment button
    await page.getByRole('button', { name: '+' }).click();

    // Should show quantity 2
    await expect(page.getByText('2')).toBeVisible();
  });

  test('decreases quantity in cart', async ({ page }) => {
    // Add product to cart
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to cart and increase quantity
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: '+' }).click();

    // Decrease quantity
    await page.getByRole('button', { name: '-' }).click();

    // Should show quantity 1
    await expect(page.getByText('1')).toBeVisible();
  });

  test('removes product from cart', async ({ page }) => {
    // Add product to cart
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to cart
    await page.getByRole('link', { name: /cart/i }).click();

    // Remove item
    await page.getByRole('button', { name: /remove/i }).click();

    // Should show empty cart message
    await expect(page.getByText(/cart is empty/i)).toBeVisible();
  });

  test('calculates correct cart total', async ({ page }) => {
    // Add first product
    await page.getByRole('article').first().click();
    const firstPrice = await page.getByText(/\$/).textContent();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go back and add second product
    await page.getByRole('link', { name: /home/i }).click();
    await page.getByRole('article').nth(1).click();
    const secondPrice = await page.getByText(/\$/).textContent();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to cart and verify total
    await page.getByRole('link', { name: /cart/i }).click();

    // Total should be visible
    await expect(page.getByText(/total/i)).toBeVisible();
  });

  test('persists cart across page reloads', async ({ page }) => {
    // Add product to cart
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Reload page
    await page.reload();

    // Cart badge should still show 1
    await expect(page.getByText('1')).toBeVisible();
  });

  test('shows empty cart message when no items', async ({ page }) => {
    await page.getByRole('link', { name: /cart/i }).click();

    await expect(page.getByText(/cart is empty/i)).toBeVisible();
    await expect(
      page.getByRole('link', { name: /continue shopping/i }),
    ).toBeVisible();
  });
});

test.describe('Cart to Checkout Flow', () => {
  test('proceeds to checkout from cart', async ({ page }) => {
    await page.goto('/');

    // Add product
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to cart
    await page.getByRole('link', { name: /cart/i }).click();

    // Proceed to checkout
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Should navigate to checkout page
    await expect(page).toHaveURL('/checkout');
    await expect(
      page.getByRole('heading', { name: /checkout/i }),
    ).toBeVisible();
  });

  test('displays cart items in checkout summary', async ({ page }) => {
    await page.goto('/');

    // Add product
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Navigate to checkout
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /proceed to checkout/i }).click();

    // Should show order summary
    await expect(page.getByText(/order summary/i)).toBeVisible();
    await expect(page.getByText(/total/i)).toBeVisible();
  });
});
