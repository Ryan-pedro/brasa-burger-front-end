import { ChoiceOption, CustomizationType, Extra, Ingredient } from '../models/menu.model';

const ing = (items: string[]): Ingredient[] =>
  items.map((s, i) => ({ id: `i${i}`, label: s.replace('*', ''), fixed: s.startsWith('*') }));

export const MENU_SLUGS = {
  burgers: 'hamburgueres',
  combos: 'combos',
  sides: 'porcoes',
  drinks: 'bebidas',
} as const;

export const CUSTOMIZATION_BY_CATEGORY: Readonly<Record<string, CustomizationType>> = {
  hamburgueres: 'burger',
  'hot-dogs': 'dog',
  combos: 'combo',
};

export const CATEGORY_TINTS: Readonly<Record<string, string>> = {
  hamburgueres: '#FBE3D0',
  combos: '#FCE9C7',
  'hot-dogs': '#F9E6CC',
  porcoes: '#FFF0C4',
  sobremesas: '#F7E0E4',
  bebidas: '#FBE0DA',
};

export const DEFAULT_TINT = '#FCEBD6';

export const INGREDIENTS_BY_PRODUCT: Readonly<Record<string, Ingredient[]>> = {
  'X-Bacon': ing(['*Pão brioche', '*Hambúrguer artesanal 150g', 'Queijo prato', 'Bacon', 'Alface', 'Tomate', 'Cebola roxa', 'Maionese da casa']),
  'Clássico da Brasa': ing(['*Pão com gergelim', '*Blend 150g', 'Cheddar', 'Picles', 'Cebola roxa', 'Alface', 'Molho da casa']),
  'Duplo Smash': ing(['*Pão com gergelim', '*2 smash 90g', 'Cheddar duplo', 'Cebola na chapa', 'Molho especial']),
  'Brasa BBQ': ing(['*Pão brioche', '*Blend 180g', 'Provolone', 'Onion rings', 'Barbecue defumado']),
  'Chicken Crispy': ing(['*Pão com gergelim', '*Frango empanado', 'Coleslaw', 'Alface', 'Maionese de alho']),
  'Veggie da Horta': ing(['*Pão com gergelim', '*Burger de grão-de-bico', 'Queijo coalho', 'Tomate', 'Rúcula']),
  'Cheddar Melt': ing(['*Pão brioche', '*Blend 150g', 'Cheddar cremoso', 'Bacon']),
  'Brasa Monstro': ing(['*Pão com gergelim', '*3 blends 150g', 'Queijos', 'Bacon', 'Alface']),
  'Dog da Brasa': ing(['*Pão de hot dog', '*Salsicha defumada', 'Mostarda', 'Ketchup', 'Batata palha']),
  'Dog Cheddar Bacon': ing(['*Pão de hot dog', '*Salsicha defumada', 'Cheddar cremoso', 'Bacon']),
};

export const EXTRAS: Record<Exclude<CustomizationType, 'combo'>, Extra[]> = {
  burger: [
    { id: 'bacon', label: 'Bacon', price: 5 },
    { id: 'queijo', label: 'Queijo', price: 3 },
    { id: 'ovo', label: 'Ovo', price: 2.5 },
    { id: 'carne', label: 'Hambúrguer extra', price: 8 },
    { id: 'cebcar', label: 'Cebola caramelizada', price: 3 },
  ],
  dog: [
    { id: 'bacon', label: 'Bacon', price: 5 },
    { id: 'queijo', label: 'Cheddar extra', price: 3 },
    { id: 'palha', label: 'Batata palha extra', price: 2 },
  ],
};

export const COMBO_DRINKS: ChoiceOption[] = [
  { id: 'coca', label: 'Coca-Cola 350ml', price: 0 },
  { id: 'guarana', label: 'Guaraná 350ml', price: 0 },
  { id: 'laranja', label: 'Suco de laranja 500ml', price: 3.9 },
];

export const RESTAURANT = {
  name: 'Brasa Burger',
  fullName: 'Brasa Burger & Co.',
  slogan: 'Seu lanche favorito, do seu jeito.',
  address: 'Av. das Brasas, 480 — Centro',
  city: 'Belo Horizonte · MG',
  phone: '(31) 3000-0480',
  instagram: '@brasaburger',
  hours: [
    { days: 'Seg a Qui', time: '11h – 23h' },
    { days: 'Sex e Sáb', time: '11h – 00h' },
    { days: 'Domingo', time: '17h – 23h' },
  ],
  deliveryFee: 6.9,
};
