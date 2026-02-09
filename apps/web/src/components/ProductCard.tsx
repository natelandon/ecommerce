import * as React from "react";
import { ShoppingCart } from "../lib/icons";

import { Button } from "./ui/button";

export type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  onAddToCart?: (id: number) => void;
  onClick?: (id: number) => void;
  isLCP?: boolean; // Mark if this is the Largest Contentful Paint image
};

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
  description,
  onAddToCart,
  onClick,
  isLCP
}: ProductCardProps) {
  return (
    <article
      className="flex h-full cursor-pointer flex-col gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
      onClick={() => onClick?.(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(id);
        }
      }}
      aria-label={`${title} - $${price.toFixed(2)}`}
    >
      <div className="flex h-40 items-center justify-center rounded-lg bg-muted/60">
        <img
          src={image}
          alt={title}
          className="h-full w-auto max-w-full object-contain"
          loading={isLCP ? "eager" : "lazy"}
          fetchPriority={isLCP ? "high" : "auto"}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {category}
          </p>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
        </div>
        {description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-lg font-semibold">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <Button
            size="sm"
            className="ml-auto"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.(id);
            }}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="inline sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
