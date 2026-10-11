/** Categorias do cardápio (exceto bebidas, que têm subcategorias próprias). */
export type CategoryId = 'burgers' | 'combos' | 'dogs' | 'porcoes' | 'sobremesas';

/** Subcategorias da aba de bebidas. */
export type DrinkCategoryId = 'refri' | 'suco' | 'agua' | 'shake' | 'outras';

/** Define qual tela de personalização o produto usa. */
export type CustomizationType = 'burger' | 'dog' | 'combo';

export interface Ingredient {
  id: string;
  label: string;
  /** Ingredientes fixos (pão, carne) não podem ser removidos. */
  fixed?: boolean;
}

export interface Extra {
  id: string;
  label: string;
  price: number;
}

export interface ChoiceOption {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  category: CategoryId | 'drink';
  drinkCategory?: DrinkCategoryId;
  name: string;
  description: string;
  price: number;
  /** Preço "de" exibido riscado em promoções. */
  oldPrice?: number;
  /** Tamanho exibido em bebidas (ex.: 350ml). */
  size?: string;
  image: string;
  popular?: boolean;
  unavailable?: boolean;
  customization?: CustomizationType;
  ingredients?: Ingredient[];
}

export interface Category {
  id: CategoryId;
  label: string;
  image: string;
}

export interface DrinkCategory {
  id: DrinkCategoryId | 'all';
  label: string;
}
