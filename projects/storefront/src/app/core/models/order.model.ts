/** Uma linha do carrinho: um produto com as escolhas do cliente. */
export interface CartLine {
  /** Chave única derivada do produto + personalização (itens iguais se somam). */
  key: string;
  productId: string;
  qty: number;
  /** IDs dos adicionais marcados. */
  extras: string[];
  /** IDs dos ingredientes removidos. */
  removed: string[];
  /** ID da opção escolhida (ex.: bebida do combo). */
  choice: string | null;
  note: string;
}

/** Dados de uma linha antes de entrar no carrinho (sem a chave). */
export type CartLineInput = Omit<CartLine, 'key'>;

export interface CartTotals {
  count: number;
  subtotal: number;
  discount: number;
  discountLabel: string;
  fee: number;
  total: number;
}

export type OrderType = 'local' | 'balcao' | 'delivery';
export type PaymentMethod = 'card' | 'pix' | 'cash';

export interface CustomerForm {
  mesa: string;
  nome: string;
  deliveryNome: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
}

/** Status do pedido na ordem em que acontecem. */
export const ORDER_STATUSES = [
  { label: 'Pedido recebido', hint: 'Recebemos seu pedido' },
  { label: 'Pedido confirmado', hint: 'A cozinha aceitou o pedido' },
  { label: 'Em preparação', hint: 'Seu lanche está na chapa' },
  { label: 'Pronto', hint: 'Pode vir buscar!' },
  { label: 'Finalizado', hint: 'Bom apetite!' },
] as const;

export interface Order {
  number: number;
  createdAt: Date;
  lines: CartLine[];
  type: OrderType;
  customer: CustomerForm;
  totals: CartTotals;
  payment: PaymentMethod;
  /** Índice em ORDER_STATUSES. */
  status: number;
}
