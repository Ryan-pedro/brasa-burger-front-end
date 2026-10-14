export type CategoryId = string;

export type CustomizationType = 'burger' | 'dog' | 'combo';

export interface Ingredient {
  id: string;
  label: string;
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
  category: CategoryId;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
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
