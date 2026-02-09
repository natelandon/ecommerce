/**
 * ProductGrid Component
 * Extracted from App.tsx for better SRP and reusability
 * Handles product display and cart interactions
 */

import React from 'react';
import ProductCard from './ProductCard';
import { LoadingSpinner } from './ui/loading-spinner';
import { FormError } from './ui/form-error';
import type { Product } from '../models/Product';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

export function ProductGrid({
  products,
  isLoading,
  error,
  onAddToCart,
  onProductClick,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <FormError message={error} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No products found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          {...product}
          isLCP={index === 0}
          onAddToCart={() => onAddToCart(product)}
          onClick={() => onProductClick(String(product.id))}
        />
      ))}
    </div>
  );
}
