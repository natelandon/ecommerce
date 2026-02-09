import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from '../lib/icons';
import { useOrderStore } from '../store/useOrderStore';
import { Button } from '../components/ui/button';

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrderStore();

  const order = orderId ? getOrderById(orderId) : null;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Order Date:
                </span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Items:
                </span>
                <span className="font-medium">{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Amount:
                </span>
                <span className="font-bold text-lg">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 text-left">
              <p className="text-sm font-semibold mb-1">Shipping Address:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="border-t mt-4 pt-4 text-left">
              <p className="text-sm font-semibold mb-2">Order Items:</p>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.title.substring(0, 40)}... x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {order.userId && (
              <Button
                className="w-full"
                onClick={() => navigate('/profile')}
              >
                View Order History
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
            A confirmation email has been sent to {order.shippingAddress.email}
            <br />
            <span className="text-xs">(Demo only - no email actually sent)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
