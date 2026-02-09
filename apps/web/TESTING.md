# E-Commerce Test Suite

Comprehensive testing strategy for the e-commerce application including unit tests, integration tests, and end-to-end tests.

## Test Structure

```
apps/web/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── input.test.tsx          # Input component tests
│   │   │   ├── button.test.tsx         # Button component tests
│   │   │   ├── form-error.test.tsx     # FormError component tests
│   │   │   └── loading-spinner.test.tsx # LoadingSpinner tests
│   │   └── ProductCard.test.tsx         # ProductCard component tests
│   ├── pages/
│   │   ├── LoginPage.test.tsx           # Login page tests
│   │   └── SignupPage.test.tsx          # Signup page tests
│   ├── store/
│   │   ├── useCartStore.test.ts         # Cart store tests
│   │   ├── useAuthStore.test.ts         # Auth store tests
│   │   └── useOrderStore.test.ts        # Order store tests
│   ├── integration/
│   │   └── user-journey.test.tsx        # Integration tests
│   ├── setupTests.ts                    # Test setup and mocks
│   └── App.test.tsx                     # App component tests
├── e2e/
│   ├── shopping.spec.ts                 # E2E shopping tests
│   ├── authentication.spec.ts           # E2E auth tests
│   └── checkout.spec.ts                 # E2E checkout tests
├── jest.config.js                       # Jest configuration
└── playwright.config.ts                 # Playwright configuration
```

## Running Tests

### Unit & Integration Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- input.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="User Interaction"
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test shopping.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test authentication.spec.ts --debug

# View test report
npx playwright show-report
```

## Test Coverage

### Unit Tests

#### Components
- **Input Component** (15+ tests)
  - Rendering with/without label
  - Error state display
  - Unique ID generation
  - Accessibility attributes
  - User interaction
  
- **Button Component** (12+ tests)
  - Variant rendering (default, outline, ghost)
  - Size variants (sm, default, lg)
  - Click handlers
  - Disabled state
  - Accessibility
  
- **FormError Component** (5 tests)
  - Error message display
  - Alert role
  - Icon rendering
  - Long message handling
  
- **LoadingSpinner Component** (7 tests)
  - Size variants
  - Accessibility
  - Custom className
  - Animation

- **ProductCard Component** (12+ tests)
  - Product information display
  - Click handlers
  - Add to cart functionality
  - Accessibility
  - Edge cases

#### Stores
- **useCartStore** (20+ tests)
  - Add/remove items
  - Quantity management
  - Total calculations
  - Cart operations
  - Edge cases (negative, zero, large numbers)
  
- **useAuthStore** (18+ tests)
  - Login/logout
  - Signup
  - Profile updates
  - Persistence
  - Edge cases
  
- **useOrderStore** (15+ tests)
  - Order creation
  - Order retrieval
  - User order filtering
  - Persistence
  - Edge cases

#### Pages
- **LoginPage** (10+ tests)
  - Form rendering
  - Validation
  - Login flow
  - Error handling
  - Accessibility
  
- **SignupPage** (12+ tests)
  - Form rendering
  - Validation
  - Signup flow
  - Password matching
  - Accessibility

### Integration Tests

- **Guest User Journey**
  - Browse products
  - Add to cart
  - Checkout
  - Order confirmation
  
- **Authenticated User Journey**
  - Signup
  - Browse products
  - Add multiple items to cart
  - Adjust quantities
  - Update profile
  - Checkout with saved info
  
- **Cart Management**
  - Add/remove items
  - Update quantities
  - Cart persistence
  
- **Authentication Flow**
  - Protected route access
  - Login redirect
  - Logout flow

### E2E Tests (Playwright)

#### Shopping Tests
- Product browsing
- Product details
- Add to cart
- Cart quantity management
- Remove from cart
- Cart total calculations
- Cart persistence
- Checkout flow

#### Authentication Tests
- User signup
- Form validation
- Login flow
- Logout
- Protected routes
- Profile management
- Profile persistence

#### Checkout Tests
- Guest checkout
- Form validation
- Order placement
- Order confirmation
- Authenticated checkout
- Pre-filled information
- Payment method selection
- Cart clearing
- Accessibility

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Writing Tests

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Test Example

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App';

test('complete checkout flow', async () => {
  const user = userEvent.setup();
  render(<BrowserRouter><App /></BrowserRouter>);
  
  // Add product to cart
  await user.click(screen.getAllByRole('article')[0]);
  await user.click(screen.getByRole('button', { name: /add to cart/i }));
  
  // Proceed to checkout
  await user.click(screen.getByRole('link', { name: /cart/i }));
  await user.click(screen.getByRole('button', { name: /checkout/i }));
  
  // Verify checkout page
  await waitFor(() => {
    expect(screen.getByText(/checkout/i)).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('user can add product to cart', async ({ page }) => {
  await page.goto('/');
  
  // Click first product
  await page.getByRole('article').first().click();
  
  // Add to cart
  await page.getByRole('button', { name: /add to cart/i }).click();
  
  // Verify cart badge shows 1 item
  await expect(page.getByText('1')).toBeVisible();
});
```

## Best Practices

### General
1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Test Behavior, Not Implementation**: Focus on what users see and do
3. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
4. **Keep Tests Independent**: Each test should work in isolation
5. **Mock External Dependencies**: API calls, timers, etc.

### Accessibility Testing
1. Test ARIA attributes
2. Test keyboard navigation
3. Test screen reader compatibility
4. Verify semantic HTML
5. Check color contrast (via visual tests)

### Performance
1. Use `userEvent` over `fireEvent` for realistic interactions
2. Avoid unnecessary `waitFor` calls
3. Batch parallel operations when possible
4. Clean up after tests (clear stores, localStorage)

### Coverage Goals
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Debugging Tests

### Jest
```bash
# Run tests in debug mode (Chrome DevTools)
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open chrome://inspect in Chrome
```

### Playwright
```bash
# Debug specific test
npx playwright test --debug shopping.spec.ts

# Debug with headed browser
npx playwright test --headed --debug

# Generate trace
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## Common Issues

### Jest
- **Module not found**: Check `moduleNameMapper` in jest.config.js
- **Timers not advancing**: Use `jest.useFakeTimers()` and `jest.advanceTimersByTime()`
- **Async updates**: Use `waitFor` from `@testing-library/react`

### Playwright
- **Element not visible**: Use `await expect(element).toBeVisible()` with timeout
- **Flaky tests**: Add proper waits, check for animations
- **Slow tests**: Run in parallel, use `test.describe.configure({ mode: 'parallel' })`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
