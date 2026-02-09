import { getCached, setCache } from './redis';
import { logger } from '../lib/logger';

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const FAKE_STORE_API = 'https://fakestoreapi.com';
const CACHE_KEY_PRODUCTS = 'fakestore:products';
const CACHE_KEY_PRODUCT_PREFIX = 'fakestore:product:';

export async function getProducts(): Promise<FakeStoreProduct[]> {
  // Try to get from cache first
  const cached = await getCached<FakeStoreProduct[]>(CACHE_KEY_PRODUCTS);
  if (cached) {
    logger.debug('Cache hit: products');
    return cached;
  }

  logger.debug('Cache miss: products - fetching from API');
  const response = await fetch(`${FAKE_STORE_API}/products`);

  if (!response.ok) {
    logger.warn('Failed to fetch products from FakeStore API', {
      status: response.status,
    });
    return [];
  }

  const products = (await response.json()) as FakeStoreProduct[];

  // Cache the result
  await setCache(CACHE_KEY_PRODUCTS, products);

  return products;
}

export async function getProductById(
  id: string,
): Promise<FakeStoreProduct | null> {
  const cacheKey = `${CACHE_KEY_PRODUCT_PREFIX}${id}`;

  // Try to get from cache first
  const cached = await getCached<FakeStoreProduct>(cacheKey);
  if (cached) {
    logger.debug(`Cache hit: product ${id}`);
    return cached;
  }

  logger.debug(`Cache miss: product ${id} - fetching from API`);
  const response = await fetch(`${FAKE_STORE_API}/products/${id}`);

  if (!response.ok) {
    logger.warn(`Product not found in FakeStore API: ${id}`, {
      status: response.status,
    });
    return null;
  }

  const product = (await response.json()) as FakeStoreProduct;

  // Cache the result
  await setCache(cacheKey, product);

  return product;
}
