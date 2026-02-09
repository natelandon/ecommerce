# Ecommerce Application - Cart & Checkout System

## Overview

This ecommerce application now features a complete shopping cart and checkout system with user authentication, order history, and Stripe-integrated payment flow (mock implementation).

## Features

### 🛒 Shopping Cart
- **Dedicated cart page** at `/cart`
- Real-time cart badge showing total items in header
- Quantity management (increase/decrease)
- Remove items
- Persistent storage (localStorage)
- Automatic price calculations
- Empty cart state with call-to-action

### 💳 Checkout System
- **Mock Stripe integration** with realistic UI
- Stripe Elements for card input (demo mode)
- Guest checkout option
- Account checkout with saved information
- Shipping address form with validation
- Order summary sidebar
- Mock payment processing with 2-second delay
- Redirect to order success page

### 👤 User Authentication
- **Sign up** page with validation
- **Login** page with persistent sessions
- Mock authentication (no real backend)
- Password confirmation validation
- Protected routes for authenticated users
- Automatic redirect after login
- Logout functionality

### 📦 Order Management
- **Order history** on profile page
- Order details including:
  - Order ID and timestamp
  - Items purchased with quantities
  - Total amount
  - Shipping address
  - Order status
- **Order success page** with confirmation
- Persistent order storage (localStorage)
- Support for both guest and authenticated orders

### 👥 User Profiles
- **Profile page** for authenticated users
- Editable user information:
  - Name
  - Phone number
  - Shipping address (street, city, state, zip, country)
- Order history timeline
- Account statistics (total orders, total spent)
- Member since date

## Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Home page with product listing | No |
| `/products/:id` | Product detail page | No |
| `/cart` | Shopping cart | No |
| `/checkout` | Checkout with Stripe Elements | No |
| `/login` | User login | No |
| `/signup` | User registration | No |
| `/profile` | User profile and order history | Yes |
| `/order-success/:orderId` | Order confirmation | No |

## Tech Stack Additions

### New Dependencies
- `@stripe/stripe-js` - Stripe JavaScript SDK
- `@stripe/react-stripe-js` - Stripe React components
- `zustand` (existing) with `persist` middleware

### State Management
- **useCartStore** - Cart items with quantity management
- **useAuthStore** - User authentication state
- **useOrderStore** - Order history storage

All stores use Zustand with localStorage persistence.

## Usage

### Adding Items to Cart

```typescript
import { useCartStore } from './store/useCartStore';

const { addItem } = useCartStore();

addItem({
  id: 1,
  title: 'Product Name',
  price: 29.99,
  image: '/image.jpg',
  category: 'Category'
});
```

### User Authentication

```typescript
import { useAuthStore } from './store/useAuthStore';

const { login, signup, logout, isAuthenticated, user } = useAuthStore();

// Sign up
await signup('email@example.com', 'password', 'John Doe');

// Login
await login('email@example.com', 'password');

// Logout
logout();
```

### Creating Orders

```typescript
import { useOrderStore } from './store/useOrderStore';

const { addOrder } = useOrderStore();

const orderId = addOrder({
  userId: user?.id || null,
  items: cartItems,
  total: 99.99,
  shippingAddress: {
    name: 'John Doe',
    email: 'john@example.com',
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA'
  },
  paymentMethod: 'card'
});
```

## Demo Behavior

### Mock Authentication
- Any email/password combination can create an account
- Accounts are stored in memory (lost on page refresh without localStorage)
- Password is not validated beyond minimum length

### Mock Stripe Payment
- Uses a fake Stripe publishable key: `pk_test_51Demo123456789`
- Card details are collected but not processed
- Payment always "succeeds" after 2-second delay
- No real charges are made

### Data Persistence
All data is stored in **localStorage**:
- `cart-storage` - Shopping cart items
- `auth-storage` - User authentication state
- `order-storage` - Order history

## Components

### New Pages
- `CartPage` - Full cart management interface
- `CheckoutPage` - Stripe checkout with guest/account options
- `LoginPage` - User login form
- `SignupPage` - User registration form
- `ProfilePage` - User profile with editable information and order history
- `OrderSuccessPage` - Order confirmation and details

### Updated Components
- `App.tsx` - New routes, header with cart badge and user menu
- `ProductDetailPage` - Updated cart integration
- `ProductCard` - Updated cart integration

## Header Navigation

The application header includes:
- **Logo** - Click to return home
- **Cart Icon** - Badge showing item count, click to view cart
- **User Menu** - Login button or profile button (when authenticated)
- **Theme Toggle** - Dark/light mode switcher

## Checkout Flow

1. **Browse Products** → Add items to cart
2. **View Cart** → Adjust quantities, remove items
3. **Proceed to Checkout** → Choose guest or create account
4. **Enter Shipping Info** → Fill out delivery address
5. **Enter Payment** → Mock Stripe card form
6. **Submit Order** → Mock payment processing
7. **Order Confirmation** → View order details, continue shopping

## Guest vs Account Checkout

### Guest Checkout
- No registration required
- Enter shipping information manually
- Order is saved but not linked to user
- No order history access

### Account Checkout
- Must be logged in
- Shipping information pre-filled from profile
- Order linked to user account
- Accessible in profile order history
- Can update profile information

## Protected Routes

The `/profile` route is protected - unauthenticated users are redirected to `/login` with a return URL to redirect back after successful login.

## Future Enhancements

Potential improvements for a production application:

- Real backend API integration
- Actual Stripe payment processing
- Email confirmations
- Order tracking
- Product reviews and ratings
- Wishlist functionality
- Password reset/recovery
- Email verification
- Admin panel for order management
- Inventory management
- Search functionality
- Product categories navigation
- Related products
- Promotions and discount codes

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Notes

- This is a **demo application** - no real payments are processed
- All data is stored locally and will be lost if localStorage is cleared
- The Stripe integration is UI-only and does not connect to real Stripe servers
- User passwords are stored in memory unencrypted (for demo purposes only)
