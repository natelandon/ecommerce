import '@testing-library/jest-dom';

// Mock fetch for tests
global.fetch = jest.fn((url: string) => {
  // Return mock product data for API calls
  if (url.includes('/products')) {
    // Return product list for /products endpoint
    if (!url.includes('/products/')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              title: 'Product 1',
              price: 99.99,
              image: 'https://via.placeholder.com/300',
              category: 'electronics',
              description: 'Test product 1',
            },
            {
              id: 2,
              title: 'Product 2',
              price: 199.99,
              image: 'https://via.placeholder.com/300',
              category: 'electronics',
              description: 'Test product 2',
            },
          ]),
      });
    } else {
      // Return single product for /products/:id endpoint
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            title: 'Product 1',
            price: 99.99,
            image: 'https://via.placeholder.com/300',
            category: 'electronics',
            description: 'Test product 1',
          }),
      });
    }
  }

  // Default mock response
  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({}),
  });
}) as jest.Mock;
