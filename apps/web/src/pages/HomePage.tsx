/**
 * HomePage Component
 * Extracted from App.tsx to reduce component size and improve SRP
 * Handles product listing with filtering
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../services/ServiceContainer';
import { useCartStore } from '../store/useCartStore';
import { logger } from '../lib/logger';
import { PRODUCT_FILTER_DEFAULTS } from '../lib/constants';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import type { Product } from '../models/Product';

const RATING_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: '4', label: '4★ & up' },
  { value: '3', label: '3★ & up' },
  { value: '2', label: '2★ & up' },
  { value: '1', label: '1★ & up' },
] as const;

export function HomePage() {
  const { addItem } = useCartStore();
  const { productService, productFilterService } = useServices();
  const navigate = useNavigate();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState(
    PRODUCT_FILTER_DEFAULTS.CATEGORY
  );
  const [genderFilter, setGenderFilter] = React.useState(
    PRODUCT_FILTER_DEFAULTS.GENDER
  );
  const [sizeFilter, setSizeFilter] = React.useState(
    PRODUCT_FILTER_DEFAULTS.SIZE
  );
  const [ratingFilter, setRatingFilter] = React.useState(
    PRODUCT_FILTER_DEFAULTS.RATING
  );

  const categories = React.useMemo(
    () => productFilterService.getCategories(products),
    [productFilterService, products]
  );

  const genders = React.useMemo(() => ['all', 'men', 'women', 'unisex'], []);

  const sizeOptions = React.useMemo(
    () => productFilterService.getAvailableSizes(products),
    [productFilterService, products]
  );

  const filteredProducts = React.useMemo(
    () =>
      productFilterService.filter(products, {
        category: categoryFilter,
        gender: genderFilter,
        size: sizeFilter,
        rating: ratingFilter,
      }),
    [
      categoryFilter,
      genderFilter,
      productFilterService,
      products,
      ratingFilter,
      sizeFilter,
    ]
  );

  const ratingOptions = React.useMemo(
    () => [
      { value: 'all', label: 'All' },
      { value: '4', label: '4★ & up' },
      { value: '3', label: '3★ & up' },
      { value: '2', label: '2★ & up' },
      { value: '1', label: '1★ & up' },
    ],
    []
  );

  React.useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const data = await productService.getProducts();

        if (isMounted) {
          setProducts(data);
          logger.info('Products loaded successfully', { count: data.length });
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown error loading products';
          setError(errorMessage);
          logger.error('Failed to load products', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [productService]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    logger.debug('Item added to cart', { productId: product.id });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-6 pb-12">
      <section className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Filters</h2>
            <p className="text-xs text-muted-foreground">
              Refine by product type, gender, and size.
            </p>
          </div>

          <ProductFilters
            categoryFilter={categoryFilter}
            setCategoryFilter={(value) => setCategoryFilter(value as typeof categoryFilter)}
            genderFilter={genderFilter}
            setGenderFilter={(value) => setGenderFilter(value as typeof genderFilter)}
            sizeFilter={sizeFilter}
            setSizeFilter={(value) => setSizeFilter(value as typeof sizeFilter)}
            ratingFilter={ratingFilter}
            setRatingFilter={(value) => setRatingFilter(value as typeof ratingFilter)}
            categories={categories}
            genders={genders}
            sizeOptions={sizeOptions}
            ratingOptions={Array.from(ratingOptions)}
          />
        </aside>

        <article>
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </article>
      </section>
    </main>
  );
}
