/**
 * ProductFilters Component
 * Extracted from App.tsx for better SRP and reusability
 * Handles all product filtering UI and state
 */

import React from 'react';

interface FilterProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  sizeFilter: string;
  setSizeFilter: (value: string) => void;
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
  categories: string[];
  genders: string[];
  sizeOptions: string[];
  ratingOptions: Array<{ value: string; label: string }>;
}

export function ProductFilters({
  categoryFilter,
  setCategoryFilter,
  genderFilter,
  setGenderFilter,
  sizeFilter,
  setSizeFilter,
  ratingFilter,
  setRatingFilter,
  categories,
  genders,
  sizeOptions,
  ratingOptions,
}: FilterProps) {
  return (
    <div className="mb-8 space-y-6 bg-card p-6 rounded-lg border" role="region" aria-label="Product filters">
      <h2 className="text-xl font-semibold">Filters</h2>

      <div className="space-y-3">
        <label htmlFor="category-filter" className="block text-sm font-medium">Category</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter by product category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label htmlFor="gender-filter" className="block text-sm font-medium">Gender</label>
        <select
          id="gender-filter"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter by gender"
        >
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label htmlFor="size-filter" className="block text-sm font-medium">Size</label>
        <select
          id="size-filter"
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter by size"
        >
          <option value="all">All Sizes</option>
          {sizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label htmlFor="rating-filter" className="block text-sm font-medium">Rating</label>
        <select
          id="rating-filter"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter by minimum rating"
        >
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
