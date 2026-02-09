import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormError } from '../components/ui/form-error';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { formatCurrency } from '../lib/utils';
import { logger } from '../lib/logger';
import { ERROR_MESSAGES, CHECKOUT_PROCESSING_DELAY_MS } from '../lib/constants';
import { ROUTES, getOrderSuccessRoute } from '../constants/routes';
import { CreditCard, Lock } from '../lib/icons';

// Lazy load Stripe only when checkout page is accessed (saves 229 KB on initial load)
const stripePromise = loadStripe('pk_test_51Demo123456789');

function CheckoutPageContent() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { items, getTotalPrice, clear } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addOrder } = useOrderStore();

  const [checkoutAs, setCheckoutAs] = useState<'guest' | 'account'>(
    isAuthenticated ? 'account' : 'guest'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: user?.address.street || '',
    city: user?.address.city || '',
    state: user?.address.state || '',
    zipCode: user?.address.zipCode || '',
    country: user?.address.country || 'USA',
  });

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    navigate(ROUTES.CART);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      logger.error('Stripe not initialized');
      setError('Payment system is not available. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate Stripe payment processing (in real app, this would call your backend)
      await new Promise((resolve) =>
        setTimeout(resolve, CHECKOUT_PROCESSING_DELAY_MS)
      );

      // Mock payment success
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        logger.error('Card element not found in checkout form');
        throw new Error(ERROR_MESSAGES.CARD_ELEMENT_NOT_FOUND);
      }

      // Create order
      const orderId = addOrder({
        userId: checkoutAs === 'account' && user ? user.id : null,
        items: items.map((item) => ({ ...item })),
        total: totalPrice,
        shippingAddress: shippingInfo,
        paymentMethod: 'card',
      });

      logger.info('Order created successfully', { orderId, total: totalPrice });

      // Clear cart
      clear();

      // Redirect to success page
      navigate(getOrderSuccessRoute(orderId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      logger.error('Checkout error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account or Guest */}
            {!isAuthenticated && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Checkout As</h2>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutAs('guest')}
                    className={`flex-1 p-4 border-2 rounded-lg ${
                      checkoutAs === 'guest'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold mb-1">Guest</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quick checkout without account
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/signup?redirect=/checkout')}
                    className="flex-1 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500"
                  >
                    <h3 className="font-semibold mb-1">Create Account</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Save info & track orders
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    type="text"
                    name="street"
                    value={shippingInfo.street}
                    onChange={handleInputChange}
                    required
                    autoComplete="street-address"
                  />
                </div>
                <div>
                  <Input
                    label="City"
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-level2"
                  />
                </div>
                <div>
                  <Input
                    label="State"
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-level1"
                  />
                </div>
                <div>
                  <Input
                    label="Zip Code"
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                    autoComplete="postal-code"
                  />
                </div>
                <div>
                  <Input
                    label="Country"
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                    autoComplete="country-name"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Card Details *
                </label>
                <div className="p-3 border rounded-lg bg-white dark:bg-gray-700">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Note: This is a demo. No real payment will be processed.
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.title.substring(0, 30)}... x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageContent />
    </Elements>
  );
}
