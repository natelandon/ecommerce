import cors from 'cors';
import express from 'express';
import { getProductById, getProducts } from './services/akeStore';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/products', async (_req, res) => {
    const products = await getProducts();
    // Cache products for 5 minutes on client, 1 hour on CDN
    res.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
    res.json(products);
  });

  app.get('/products/:id', async (req, res) => {
    const product = await getProductById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Cache individual products for 24 hours (they rarely change)
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.json(product);
  });

  return app;
}
