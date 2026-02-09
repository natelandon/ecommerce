import React, { Suspense, lazy } from 'react';
import {
  GrowthBook,
  GrowthBookProvider,
} from '@growthbook/growthbook-react';
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Link,
  Navigate,
} from 'react-router-dom';
import { ShoppingCart, User, LogIn } from './lib/icons';

import { ThemeProvider } from './components/ui/theme-provider';
import { ModeToggle } from './components/ui/mode-toggle';
import { Button } from './components/ui/button';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load pages (reduces initial bundle)
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));

import { ServiceContainerProvider } from './services/ServiceContainer';
import { useCartStore } from './store/useCartStore';
import { useAuthStore } from './store/useAuthStore';
import { ROUTES } from './constants/routes';

// Loading component for lazy routes
function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const growthbook = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: 'sdk-SEzvG9BTJc8FBm',
  enableDevMode: true,
});

/**
 * ProtectedRoute Component
 * Ensures only authenticated users can access certain routes
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
}

/**
 * AppHeader Component
 * Navigation header with cart, user profile, and theme toggle
 */
function AppHeader() {
  const navigate = useNavigate();
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-md">
          <h1 className="text-2xl font-semibold">Ecommerce</h1>
        </Link>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.CART)}
            className="relative rounded-lg p-2 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Shopping cart with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-live="polite">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.PROFILE)}
              className="gap-2"
              aria-label={`User profile for ${user?.name || 'Profile'}`}
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
              <span className="inline sm:hidden">Profile</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="gap-2"
              aria-label="Log in to your account"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Login</span>
              <span className="inline sm:hidden">Log in</span>
            </Button>
          )}

          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

/**
 * Main App Component
 * Handles routing and layout structure
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <GrowthBookProvider growthbook={growthbook}>
          <ServiceContainerProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground">
                {/* Skip to main content link for accessibility */}
                <a 
                  href="#main-content" 
                  className="absolute top-0 left-0 z-50 -translate-y-12 rounded bg-primary text-primary-foreground px-4 py-2 focus:translate-y-0"
                >
                  Skip to main content
                </a>
                
                <AppHeader />

                <main id="main-content" className="focus:outline-none" tabIndex={-1}>
                  <Suspense fallback={<RouteLoader />}>
                    <Routes>
                      <Route path={ROUTES.HOME} element={<HomePage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path={ROUTES.CART} element={<CartPage />} />
                      <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
                      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                      <Route
                        path={ROUTES.PROFILE}
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path={ROUTES.ORDER_SUCCESS} element={<OrderSuccessPage />} />
                      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </BrowserRouter>
          </ServiceContainerProvider>
        </GrowthBookProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
