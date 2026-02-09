import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Edit } from '../lib/icons';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { formatCurrency, formatDate } from '../lib/utils';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const { getOrdersByUserId } = useOrderStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address.street || '',
    city: user?.address.city || '',
    state: user?.address.state || '',
    zipCode: user?.address.zipCode || '',
    country: user?.address.country || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const orders = getOrdersByUserId(user.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={user.email}
                    disabled
                    autoComplete="email"
                  />
                  <p className="text-xs text-gray-500 -mt-2">
                    Email cannot be changed
                  </p>
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />

                  <h3 className="font-semibold mt-6 mb-2">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Street"
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        autoComplete="street-address"
                      />
                    </div>
                    <div>
                      <Input
                        label="City"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <Input
                        label="State"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        autoComplete="address-level1"
                      />
                    </div>
                    <div>
                      <Input
                        label="Zip Code"
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        autoComplete="postal-code"
                      />
                    </div>
                    <div>
                      <Input
                        label="Country"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        autoComplete="country-name"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shipping Address
                    </p>
                    <p className="font-medium">
                      {user.address.street || 'Not provided'}
                      {user.address.city && (
                        <>
                          <br />
                          {user.address.city}, {user.address.state}{' '}
                          {user.address.zipCode}
                          <br />
                          {user.address.country}
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()} at{' '}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm font-semibold mb-1">
                          Items ({order.items.length})
                        </p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.title.substring(0, 40)}... x {item.quantity}
                              </span>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm">
                          <span className="font-semibold">Shipped to:</span>{' '}
                          {order.shippingAddress.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.street},{' '}
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Account Stats</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold">
                    $
                    {orders
                      .reduce((sum, order) => sum + order.total, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
