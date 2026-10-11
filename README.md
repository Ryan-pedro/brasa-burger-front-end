# Brasa Burger — Front-end (workspace Angular)

Workspace Angular do projeto. Hoje contém uma aplicação, o **Storefront** (`projects/storefront`), convertida a partir do protótipo.
As demais aplicações (admin, kitchen, platform) e as bibliotecas compartilhadas entram em `projects/`, conforme [a arquitetura do frontend](../docs/architecture/frontend-architecture.md).
Cobre o fluxo completo do cliente:

**Home → Cardápio → Produto/Personalização → Bebidas → Carrinho → Tipo de pedido → Revisão → Confirmação → Acompanhamento → Comanda da cozinha**

> O **nome da loja** já vem da API (`GET /api/v1/store/profile`); o cardápio e os pedidos ainda são **mockados** — veja [Integração com a API](#integração-com-a-api).

## Lojas por endereço

A loja é definida pelo endereço acessado. Com a API rodando (veja `back-end/README.md`):

- http://brasa.localhost:4200 abre a Brasa Burger
- http://smash-house.localhost:4200 abre a Smash House
- http://localhost:4200 mostra "Loja não encontrada", porque esse endereço não pertence a nenhuma loja

O servidor de desenvolvimento encaminha `/api` para `http://localhost:5143` (`proxy.conf.json`), preservando o endereço original.

## Requisitos

- Node.js **22.22+** (ou 24.15+)
- npm 10+

## Como rodar

```bash
npm install          # o .npmrc já usa legacy-peer-deps
npm start            # http://brasa.localhost:4200 (a API precisa estar rodando)
npm run build        # build de produção em dist/storefront/browser
npm test             # testes (Vitest)
```

## Stack

- Angular 21, componentes standalone, **signals** e change detection zoneless
- Novo controle de fluxo (`@if`, `@for`, `@switch`) e rotas com lazy loading
- SCSS com tokens de design em variáveis CSS (`projects/storefront/src/styles.scss`)
- Sem bibliotecas de UI: todos os componentes são próprios

## Estrutura

```
projects/storefront/src/
├─ styles.scss                     # tokens (cores, fontes, raios), botões, chips, campos, animações
├─ index.html                      # fontes Google (Lilita One, Nunito, JetBrains Mono)
└─ app/
   ├─ app.ts                       # shell: header, router-outlet, barra do carrinho, nav inferior, toast, modal
   ├─ app.routes.ts                # rotas (lazy) + guards
   ├─ core/
   │  ├─ models/                   # menu.model.ts, order.model.ts
   │  ├─ data/menu.data.ts         # cardápio mockado, adicionais, bebidas do combo, dados do restaurante
   │  ├─ utils/pricing.ts          # regras de preço puras (+ pricing.spec.ts)
   │  ├─ guards.ts                 # checkout só com itens; confirmação só com pedido
   │  └─ services/
   │     ├─ menu.service.ts        # leitura do cardápio (trocar por HttpClient)
   │     ├─ cart.service.ts        # carrinho com signals + localStorage
   │     ├─ checkout.service.ts    # tipo de pedido, dados do cliente, pagamento, totais
   │     ├─ order.service.ts       # confirmação e status do pedido
   │     ├─ product-sheet.service.ts # abre o modal de produto / adição rápida
   │     └─ toast.service.ts       # feedback "Produto adicionado ao pedido"
   ├─ shared/
   │  ├─ layout/                   # site-header, bottom-nav, cart-bar, toast, flow-header
   │  ├─ product-card/             # card de produto (variantes grid e row)
   │  ├─ product-sheet/            # modal de detalhes + personalização
   │  ├─ kitchen-ticket/           # comanda térmica (com CSS de impressão 80 mm)
   │  ├─ cart-line.component.ts    # item do carrinho (editável ou só leitura)
   │  ├─ order-summary.component.ts
   │  ├─ qty-stepper.component.ts
   │  ├─ icon.component.ts         # ícones SVG inline
   │  ├─ logo.component.ts
   │  └─ brl.pipe.ts               # 24.9 → "R$ 24,90"
   └─ pages/
      ├─ home/                     # hero, diferenciais, categorias, combo da semana, mais pedidos, ofertas, rodapé
      ├─ menu/                     # cardápio por categoria + busca (?categoria=burgers)
      ├─ drinks/                   # bebidas por subcategoria
      ├─ promos/
      ├─ cart/                     # itens, sugestões, resumo, estado vazio
      ├─ checkout-type/            # local (mesa) / balcão (nome) / delivery (endereço)
      ├─ checkout-review/          # confira seu pedido + forma de pagamento
      ├─ order-confirmed/
      ├─ order-tracking/           # status em 5 etapas (simulado)
      └─ kitchen/                  # comanda saindo da impressora + window.print()
```

`projects/storefront/public/img/produtos/` guarda as ilustrações SVG dos produtos.

## Rotas

| Rota | Tela |
|---|---|
| `/` | Home |
| `/cardapio?categoria=burgers` | Cardápio (burgers, combos, dogs, porcoes, sobremesas) |
| `/bebidas` | Bebidas |
| `/promocoes` | Promoções |
| `/carrinho` | Carrinho |
| `/pedido/tipo` | Tipo de pedido |
| `/pedido/revisao` | Revisão |
| `/pedido/confirmado` | Pedido confirmado |
| `/pedido/acompanhar` | Acompanhamento |
| `/cozinha/comanda` | Comanda da cozinha (mostra um pedido de exemplo se não houver pedido) |

## Regras de negócio implementadas (`core/utils/pricing.ts`)

- Preço unitário = preço base + adicionais + diferença da bebida do combo.
- Itens com a mesma personalização (adicionais, remoções, bebida e observação) são somados numa linha só.
- **R$ 5 OFF** em pedidos a partir de R$ 30.
- **Terça do Hambúrguer**: às terças, 50% no hambúrguer de menor valor ao levar 2 ou mais. Vale o maior desconto.
- Taxa de entrega de R$ 6,90 só no delivery.
- Produto com `unavailable: true` aparece com o aviso "Indisponível no momento" e o botão desabilitado.

## Integração com a API

Pontos já preparados para trocar o mock por chamadas HTTP (`provideHttpClient()` no `app.config.ts`):

| Onde | Hoje | Com backend (.NET) |
|---|---|---|
| `MenuService` | lê `menu.data.ts` | `GET /api/produtos`, `GET /api/categorias` |
| `OrderService.confirm()` | gera o número localmente | `POST /api/pedidos` → retorna número e status |
| `OrderService.advanceStatus()` | botão de simulação | status em tempo real (ex.: SignalR) |
| Comanda da cozinha | `window.print()` no navegador | backend envia para a impressora térmica (ESC/POS) ao criar o pedido |
| `computeTotals()` | calculado no front | recalcular no backend (fonte da verdade) e exibir o retorno |

Os modelos em `core/models` podem servir de base para os DTOs.

## Personalização visual

Cores, fontes e raios estão em `:root` no `projects/storefront/src/styles.scss`. Para trocar as ilustrações por fotos,
substitua os arquivos em `projects/storefront/public/img/produtos/` (ou altere o campo `image` em `menu.data.ts`);
fotos com fundo transparente (PNG/WebP) ficam melhores sobre os fundos coloridos dos cards.
