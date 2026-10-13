export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CategoryInput {
  name: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceInCents: number;
  size: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export interface ProductInput {
  categoryId: string;
  name: string;
  description: string;
  priceInCents: number;
  size: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}
