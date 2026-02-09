import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart } from "../lib/icons";

import { Button } from "../components/ui/button";
import type { Product } from "../models/Product";
import { useServices } from "../services/ServiceContainer";
import { useCartStore } from "../store/useCartStore";
import { useEffect } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { productService } = useServices();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadProduct(productId: string) {
      try {
        const data = await productService.getProductById(productId);

        if (isMounted) {
          setProduct(data);
          if (!data) {
            setError("Product not found");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      loadProduct(id);
    } else {
      setIsLoading(false);
      setError("Missing product id");
    }

    return () => {
      isMounted = false;
    };
  }, [id, productService]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to products
        </Link>
        {product && (
          <Button
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          Loading product...
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          {error}
        </div>
      )}

      {product && (
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="flex items-center justify-center rounded-xl border border-border bg-muted/60 p-6">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[360px] w-auto object-contain"
            />
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <Button onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
