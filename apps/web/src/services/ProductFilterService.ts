import type { Product } from '../models/Product';

export type ProductFilter = {
  category: string;
  gender: string;
  size: string;
  rating: string;
};

export interface ProductFilterService {
  filter(products: Product[], filter: ProductFilter): Product[];
  getGender(category: string): string;
  getAvailableSizes(products: Product[]): string[];
  getCategories(products: Product[]): string[];
}

export class DefaultProductFilterService implements ProductFilterService {
  filter(products: Product[], filter: ProductFilter): Product[] {
    return products.filter((product) => {
      if (filter.category !== 'all' && product.category !== filter.category) {
        return false;
      }

      if (
        filter.gender !== 'all' &&
        this.getGender(product.category) !== filter.gender
      ) {
        return false;
      }

      if (filter.size !== 'all') {
        const productSizes = (product as { sizes?: string[] }).sizes ?? [];
        if (!productSizes.includes(filter.size)) {
          return false;
        }
      }

      if (filter.rating !== 'all') {
        const minRating = Number(filter.rating);
        const ratingValue = product.rating?.rate ?? 0;
        if (ratingValue < minRating) {
          return false;
        }
      }

      return true;
    });
  }

  getGender(category: string) {
    const normalized = category.toLowerCase();

    if (normalized.includes('men')) {
      return 'men';
    }

    if (normalized.includes('women')) {
      return 'women';
    }

    return 'unisex';
  }

  getAvailableSizes(products: Product[]): string[] {
    const sizes = new Set<string>();

    for (const product of products) {
      const productSizes = (product as { sizes?: string[] }).sizes;

      if (Array.isArray(productSizes)) {
        productSizes.forEach((size) => sizes.add(size));
      }
    }

    return ['all', ...Array.from(sizes).sort()];
  }

  getCategories(products: Product[]): string[] {
    const unique = new Set(products.map((product) => product.category));
    return ['all', ...Array.from(unique).sort()];
  }
}
