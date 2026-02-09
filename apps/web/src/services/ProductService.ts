import { API_BASE_URL } from '../lib/config';
import { logger } from '../lib/logger';
import { ERROR_MESSAGES } from '../lib/constants';
import type { Product } from '../models/Product';

export interface ProductService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}

export class HttpProductService implements ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);

      if (!response.ok) {
        logger.error('Failed to fetch products', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(ERROR_MESSAGES.PRODUCT_LOAD_FAILED);
      }

      return (await response.json()) as Product[];
    } catch (error) {
      // Log error but don't throw - return empty array for graceful degradation
      logger.error('Product fetch error - API may be unavailable', error);
      // In production, this would return cached data or show appropriate UI
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          logger.warn(`Product not found: ${id}`);
          return null;
        }
        logger.error('Failed to fetch product', {
          productId: id,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(ERROR_MESSAGES.PRODUCT_LOAD_FAILED);
      }

      return (await response.json()) as Product;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ERROR_MESSAGES.PRODUCT_LOAD_FAILED
      ) {
        throw error;
      }
      logger.error(`Product fetch error for ID: ${id}`, error);
      throw new Error(ERROR_MESSAGES.PRODUCT_LOAD_FAILED);
    }
  }
}
