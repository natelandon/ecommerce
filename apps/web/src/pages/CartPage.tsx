import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from '../lib/icons';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { ROUTES } from '../constants/routes';

export function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button onClick={() => navigate(ROUTES.HOME)}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.category}
                </p>
                <p className="font-bold text-lg">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex flex-col items-end gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border rounded-lg" role="group" aria-label={`Adjust quantity for ${item.title}`}>
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={`Decrease quantity of ${item.title}`}
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="px-4 font-semibold" aria-live="polite" aria-atomic="true">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={`Increase quantity of ${item.title}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">Remove</span>
                </button>

                {/* Item Total */}
                <p className="font-bold text-lg">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Items ({totalItems})</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mb-3"
              onClick={() => navigate(ROUTES.CHECKOUT)}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(ROUTES.HOME)}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
