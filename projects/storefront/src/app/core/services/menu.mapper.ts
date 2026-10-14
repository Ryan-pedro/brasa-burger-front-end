import { CUSTOMIZATION_BY_CATEGORY, INGREDIENTS_BY_PRODUCT } from '../data/menu.data';
import { Category, Product } from '../models/menu.model';

export interface MenuResponse {
  categories: MenuCategoryResponse[];
}

interface MenuCategoryResponse {
  id: string;
  name: string;
  slug: string;
  products: MenuProductResponse[];
}

interface MenuProductResponse {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  size: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}

export interface Menu {
  categories: Category[];
  products: Product[];
}

export function toMenu(response: MenuResponse): Menu {
  return {
    categories: response.categories.map((category) => ({
      id: category.slug,
      label: category.name,
      image: category.products.find((p) => p.imageUrl)?.imageUrl ?? '',
    })),
    products: response.categories.flatMap((category) => category.products.map((product) => toProduct(category.slug, product))),
  };
}

function toProduct(categoryId: string, product: MenuProductResponse): Product {
  return {
    id: product.id,
    category: categoryId,
    name: product.name,
    description: product.description,
    price: product.priceInCents / 100,
    size: product.size ?? undefined,
    image: product.imageUrl ?? '',
    popular: product.isFeatured,
    unavailable: !product.isAvailable,
    customization: CUSTOMIZATION_BY_CATEGORY[categoryId],
    ingredients: INGREDIENTS_BY_PRODUCT[product.name],
  };
}
