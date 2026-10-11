/**
 * Dados mockados do cardápio.
 * Em produção, estes dados virão da API (.NET) — veja MenuService.
 */
import { Category, ChoiceOption, CustomizationType, DrinkCategory, Extra, Ingredient, Product } from '../models/menu.model';

const img = (file: string) => `img/produtos/${file}.svg`;

/** Monta a lista de ingredientes. Prefixo "*" = ingrediente fixo (não removível). */
const ing = (items: string[]): Ingredient[] =>
  items.map((s, i) => ({ id: `i${i}`, label: s.replace('*', ''), fixed: s.startsWith('*') }));

export const CATEGORIES: Category[] = [
  { id: 'burgers', label: 'Hambúrgueres', image: img('b_xbacon') },
  { id: 'combos', label: 'Combos', image: img('combo_semana') },
  { id: 'dogs', label: 'Hot Dogs', image: img('dog_classico') },
  { id: 'porcoes', label: 'Porções', image: img('fritas') },
  { id: 'sobremesas', label: 'Sobremesas', image: img('sundae') },
];

export const DRINK_CATEGORIES: DrinkCategory[] = [
  { id: 'all', label: 'Todas' },
  { id: 'refri', label: 'Refrigerantes' },
  { id: 'suco', label: 'Sucos' },
  { id: 'agua', label: 'Água' },
  { id: 'shake', label: 'Milk-shakes' },
  { id: 'outras', label: 'Outras' },
];

/** Cor de fundo do "palco" da foto, por categoria/subcategoria. */
export const IMAGE_TINTS: Record<string, string> = {
  burgers: '#FBE3D0', combos: '#FCE9C7', dogs: '#F9E6CC', porcoes: '#FFF0C4', sobremesas: '#F7E0E4',
  refri: '#FBE0DA', suco: '#FFEBC9', agua: '#DDEEF6', shake: '#F3E1D8', outras: '#E5F0D8',
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

/** Opções de bebida inclusas nos combos. */
export const COMBO_DRINKS: ChoiceOption[] = [
  { id: 'coca', label: 'Coca-Cola 350ml', price: 0 },
  { id: 'guarana', label: 'Guaraná 350ml', price: 0 },
  { id: 'laranja', label: 'Suco de laranja 500ml', price: 3.9 },
];

export const PRODUCTS: Product[] = [
  // Hambúrgueres
  { id: 'b1', category: 'burgers', name: 'X-Bacon', price: 24.9, image: img('b_xbacon'), popular: true, customization: 'burger',
    description: 'Pão brioche, hambúrguer artesanal 150g, queijo prato, bacon crocante, alface e tomate.',
    ingredients: ing(['*Pão brioche', '*Hambúrguer artesanal 150g', 'Queijo prato', 'Bacon', 'Alface', 'Tomate', 'Cebola roxa', 'Maionese da casa']) },
  { id: 'b2', category: 'burgers', name: 'Clássico da Brasa', price: 22.9, image: img('b_classico'), customization: 'burger',
    description: 'Blend 150g na brasa, cheddar, picles, cebola roxa, alface e molho da casa.',
    ingredients: ing(['*Pão com gergelim', '*Blend 150g', 'Cheddar', 'Picles', 'Cebola roxa', 'Alface', 'Molho da casa']) },
  { id: 'b3', category: 'burgers', name: 'Duplo Smash', price: 29.9, image: img('b_smash'), popular: true, customization: 'burger',
    description: 'Dois smash de 90g com crosta, cheddar em dobro e cebola na chapa.',
    ingredients: ing(['*Pão com gergelim', '*2 smash 90g', 'Cheddar duplo', 'Cebola na chapa', 'Molho especial']) },
  { id: 'b4', category: 'burgers', name: 'Brasa BBQ', price: 31.9, image: img('b_bbq'), customization: 'burger',
    description: 'Blend 180g, provolone, onion rings crocantes e barbecue defumado.',
    ingredients: ing(['*Pão brioche', '*Blend 180g', 'Provolone', 'Onion rings', 'Barbecue defumado']) },
  { id: 'b5', category: 'burgers', name: 'Chicken Crispy', price: 26.9, image: img('b_chicken'), customization: 'burger',
    description: 'Sobrecoxa empanada e crocante, coleslaw, alface e maionese de alho.',
    ingredients: ing(['*Pão com gergelim', '*Frango empanado', 'Coleslaw', 'Alface', 'Maionese de alho']) },
  { id: 'b6', category: 'burgers', name: 'Veggie da Horta', price: 25.9, image: img('b_veggie'), customization: 'burger',
    description: 'Hambúrguer de grão-de-bico e beterraba, queijo coalho, tomate e rúcula.',
    ingredients: ing(['*Pão com gergelim', '*Burger de grão-de-bico', 'Queijo coalho', 'Tomate', 'Rúcula']) },
  { id: 'b7', category: 'burgers', name: 'Cheddar Melt', price: 27.9, image: img('b_melt'), customization: 'burger',
    description: 'Blend 150g, cheddar cremoso em dobro e bacon, no pão brioche.',
    ingredients: ing(['*Pão brioche', '*Blend 150g', 'Cheddar cremoso', 'Bacon']) },
  { id: 'b8', category: 'burgers', name: 'Brasa Monstro', price: 39.9, image: img('b_monstro'), customization: 'burger', unavailable: true,
    description: 'Três blends de 150g, três queijos, bacon e alface. Para os fortes.',
    ingredients: ing(['*Pão com gergelim', '*3 blends 150g', 'Queijos', 'Bacon', 'Alface']) },

  // Combos
  { id: 'c1', category: 'combos', name: 'Combo da Semana', price: 32.9, oldPrice: 39.9, image: img('combo_semana'), popular: true, customization: 'combo',
    description: 'X-Bacon + batata frita média + bebida 350ml.' },
  { id: 'c2', category: 'combos', name: 'Combo Smash', price: 42.9, image: img('combo_smash'), customization: 'combo',
    description: 'Duplo Smash + batata frita média + bebida 350ml.' },
  { id: 'c3', category: 'combos', name: 'Combo Chicken', price: 38.9, image: img('combo_chicken'), customization: 'combo',
    description: 'Chicken Crispy + batata frita média + bebida 350ml.' },
  { id: 'c4', category: 'combos', name: 'Combo Casal', price: 74.9, image: img('combo_casal'), customization: 'combo',
    description: 'X-Bacon + Clássico da Brasa + batata grande + 2 bebidas 350ml.' },

  // Hot dogs
  { id: 'h1', category: 'dogs', name: 'Dog da Brasa', price: 18.9, image: img('dog_classico'), customization: 'dog',
    description: 'Salsicha defumada na brasa, mostarda, ketchup e batata palha.',
    ingredients: ing(['*Pão de hot dog', '*Salsicha defumada', 'Mostarda', 'Ketchup', 'Batata palha']) },
  { id: 'h2', category: 'dogs', name: 'Dog Cheddar Bacon', price: 21.9, image: img('dog_cheddar'), customization: 'dog',
    description: 'Salsicha defumada, cheddar cremoso e bacon crocante.',
    ingredients: ing(['*Pão de hot dog', '*Salsicha defumada', 'Cheddar cremoso', 'Bacon']) },

  // Porções
  { id: 'p1', category: 'porcoes', name: 'Batata Frita Grande', price: 19.9, image: img('fritas'), popular: true,
    description: 'Batatas crocantes com sal e páprica. Serve 2 pessoas.' },
  { id: 'p2', category: 'porcoes', name: 'Batata Cheddar & Bacon', price: 27.9, image: img('fritas_cheddar'),
    description: 'Batata frita coberta com cheddar cremoso, bacon e cebolinha.' },
  { id: 'p3', category: 'porcoes', name: 'Onion Rings', price: 22.9, image: img('onion_rings'),
    description: 'Anéis de cebola empanados, com molho barbecue.' },
  { id: 'p4', category: 'porcoes', name: 'Frango Crocante', price: 29.9, image: img('frango'),
    description: 'Tiras de frango empanadas com molho de mostarda e mel.' },

  // Sobremesas
  { id: 's1', category: 'sobremesas', name: 'Brownie com Sorvete', price: 16.9, image: img('brownie'), popular: true,
    description: 'Brownie quente de chocolate, sorvete de creme e calda.' },
  { id: 's2', category: 'sobremesas', name: 'Churros com Doce de Leite', price: 12.9, image: img('churros'),
    description: 'Três churros com açúcar e canela e doce de leite para mergulhar.' },
  { id: 's3', category: 'sobremesas', name: 'Sundae de Caramelo', price: 13.9, image: img('sundae'),
    description: 'Sorvete de creme, calda de caramelo e confeitos.' },

  // Bebidas
  { id: 'd1', category: 'drink', drinkCategory: 'refri', name: 'Coca-Cola', size: '350ml', price: 6, image: img('coca'), popular: true, description: 'Lata gelada.' },
  { id: 'd2', category: 'drink', drinkCategory: 'refri', name: 'Guaraná', size: '350ml', price: 6, image: img('guarana'), description: 'Lata gelada.' },
  { id: 'd3', category: 'drink', drinkCategory: 'suco', name: 'Suco de laranja', size: '500ml', price: 9.9, image: img('suco_laranja'), description: 'Natural, espremido na hora.' },
  { id: 'd4', category: 'drink', drinkCategory: 'suco', name: 'Suco de maracujá', size: '500ml', price: 9.9, image: img('suco_maracuja'), description: 'Natural, feito com a fruta.' },
  { id: 'd5', category: 'drink', drinkCategory: 'agua', name: 'Água mineral', size: '500ml', price: 4, image: img('agua'), description: 'Sem gás.' },
  { id: 'd6', category: 'drink', drinkCategory: 'agua', name: 'Água com gás', size: '500ml', price: 4.5, image: img('agua_gas'), unavailable: true, description: 'Com gás.' },
  { id: 'd7', category: 'drink', drinkCategory: 'shake', name: 'Milk-shake de chocolate', size: '500ml', price: 14.9, image: img('shake_choc'), popular: true, description: 'Sorvete de chocolate batido, chantilly e calda.' },
  { id: 'd8', category: 'drink', drinkCategory: 'shake', name: 'Milk-shake de morango', size: '500ml', price: 14.9, image: img('shake_morango'), description: 'Sorvete de morango batido, chantilly e calda.' },
  { id: 'd9', category: 'drink', drinkCategory: 'outras', name: 'Chá gelado de limão', size: '400ml', price: 7.9, image: img('cha'), description: 'Chá preto gelado com limão.' },
  { id: 'd10', category: 'drink', drinkCategory: 'outras', name: 'Limonada suíça', size: '500ml', price: 10.9, image: img('limonada'), description: 'Limão batido com leite condensado e gelo.' },
];

/** Produtos exibidos em "Mais pedidos" na Home. */
export const BEST_SELLER_IDS = ['b1', 'b3', 'c1', 'p1', 'p2', 'd7', 's1', 'h2'];

/** Sugestões de acompanhamento no carrinho. */
export const UPSELL_IDS = ['d1', 'd2', 'd3', 'd7', 'p1'];

/** Dados institucionais do restaurante (fictícios). */
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
