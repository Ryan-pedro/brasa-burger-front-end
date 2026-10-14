# Brasa Burger — Front-end (workspace Angular)

> Este repositório tem só o front-end. A API (.NET), o banco local, a infraestrutura e a documentação de arquitetura ficam no repositório [Ryan-pedro/brasa-burger-API](https://github.com/Ryan-pedro/brasa-burger-API) ([ADR-0017](https://github.com/Ryan-pedro/brasa-burger-API/blob/main/docs/adr/0017-front-end-em-repositorio-proprio.md)).

Workspace Angular do projeto, com duas aplicações:

| Aplicação | Pasta | Endereço em desenvolvimento |
|---|---|---|
| **Storefront**: loja do consumidor | `projects/storefront` | http://localhost:4200 |
| **Admin**: painel da loja | `projects/admin` | http://localhost:4201 |

O painel da cozinha e as bibliotecas compartilhadas entram em `projects/` depois, conforme [a arquitetura do frontend](https://github.com/Ryan-pedro/brasa-burger-API/blob/main/docs/architecture/frontend-architecture.md).

O Storefront foi convertido a partir do protótipo e cobre o fluxo completo do cliente:

**Home → Cardápio → Produto/Personalização → Bebidas → Carrinho → Tipo de pedido → Revisão → Confirmação → Acompanhamento → Comanda da cozinha**

> O **nome da loja** e o **cardápio** vêm da API (`GET /api/v1/store/profile` e `GET /api/v1/store/menu`). Adicionais, ingredientes removíveis, bebida do combo e o pedido ainda são **locais** — veja [Integração com a API](#integração-com-a-api).

Os dois servidores de desenvolvimento encaminham `/api` para a API em `http://localhost:5143` (`proxy.conf.json`). Suba a API antes (veja o [README da API](https://github.com/Ryan-pedro/brasa-burger-API/blob/main/README.md)); sem ela, as duas aplicações mostram uma tela de erro com o botão "Tentar de novo".

## Requisitos

- Node.js **22.22+** (ou 24.15+)
- npm 10+

## Como rodar

```bash
npm install          # o .npmrc já usa legacy-peer-deps
npm start            # Storefront em http://localhost:4200 (a API precisa estar rodando)
npm run start:admin  # Admin em http://localhost:4201
npm test             # testes das duas aplicações (Vitest), uma vez
npm run test:admin   # testes de uma aplicação, em modo observação
npm run build        # build de produção em dist/storefront e dist/admin
```

Para desenvolver com a API, deixe os dois repositórios lado a lado:

```
Documents/
├─ brasa-burger-API/        # API, banco (Docker Compose) e documentação
└─ brasa-burger-front-end/  # este repositório
```

Suba o banco e a API pelo `brasa-burger-API` e o front por aqui. Mudanças que alteram o contrato da API viram dois pull requests, um em cada repositório: faça o merge da API primeiro.

A integração contínua (`.github/workflows/ci.yml`) roda os testes e o build das duas aplicações em todo push e pull request.

## Admin (painel da loja)

Login, sessão, saída, a tela inicial e o módulo **Cardápio** (categorias, produtos, preço e disponibilidade). Os outros módulos aparecem como "em breve" até terem tela.

Usuários de demonstração (criados pela API em Development), todos com a senha `brasa-dev-1234`:

| E-mail | Papel | O que vê |
|---|---|---|
| `dono@brasa.dev` | Dono | Todos os módulos, inclusive Equipe |
| `gerente@brasa.dev` | Gerente | Todos, menos Equipe |
| `cozinha@brasa.dev` | Cozinha | Aviso de que a conta é da cozinha |

Como a sessão funciona no navegador:

- A sessão fica num cookie **HttpOnly** criado pela API. O JavaScript nunca lê o token; o painel só pergunta à API quem está conectado (`GET /api/v1/admin/session`).
- Toda chamada que altera estado leva o cabeçalho `X-Brasa-Csrf` (`core/api/csrf.interceptor.ts`). Sem ele, a API recusa com `csrf_validation_failed`.
- Um 401 no meio do uso (usuário desativado, cookie vencido) leva ao login com o aviso "Sua sessão terminou" e guarda a página em que o usuário estava (`?voltar=`). Só caminhos internos são aceitos em `voltar`.
- As permissões só montam a tela (guards e navegação). Quem decide de verdade é a API.
- As mensagens de erro vêm do campo `code` da resposta (`invalid_credentials`, `account_locked`, `account_disabled`), nunca do texto.

```
projects/admin/src/app/
├─ core/
│  ├─ api/          # código de erro da API, cabeçalho anti-CSRF
│  ├─ session/      # AdminSession, guards, permissões, sessão expirada, retorno seguro
│  └─ store/        # nome da loja, título da aba
├─ layout/          # barra superior, navegação lateral, lista de módulos
├─ shared/          # *admCan, painel lateral (sheet), dinheiro em centavos, mensagens de campo
└─ features/
   ├─ auth/         # login
   ├─ home/         # início
   ├─ catalog/      # cardápio: API, store com signals, página e formulários
   └─ no-access/    # conta sem acesso ao painel (cozinha)
```

Permissões, nunca papéis: o painel só pergunta "tem a permissão X?".

- `layout/admin-modules.ts` é a lista única de módulos. Dela saem as rotas (cada uma com `permissionGuard`), o menu lateral e a tela inicial. Para criar um módulo, acrescente um item com `loadComponent`.
- Dentro das telas, `*admCan="'catalog.write'; else somenteLeitura"` mostra ou esconde ações conforme a permissão.
- A API continua sendo quem decide: as permissões só montam a tela.

## Stack

- Angular 21, componentes standalone, **signals** e change detection zoneless
- Novo controle de fluxo (`@if`, `@for`, `@switch`) e rotas com lazy loading
- SCSS com tokens de design em variáveis CSS (`src/styles.scss` de cada aplicação)
- Sem bibliotecas de UI: todos os componentes são próprios

## Estrutura do Storefront

```
projects/storefront/src/
├─ styles.scss                     # tokens (cores, fontes, raios), botões, chips, campos, animações
├─ index.html                      # fontes Google (Lilita One, Nunito, JetBrains Mono)
└─ app/
   ├─ app.ts                       # shell: header, router-outlet, barra do carrinho, nav inferior, toast, modal
   ├─ app.routes.ts                # rotas (lazy) + guards
   ├─ core/
   │  ├─ models/                   # menu.model.ts, order.model.ts
   │  ├─ data/menu.data.ts         # dados ainda locais: adicionais, ingredientes, bebidas do combo, cores por categoria, dados do restaurante
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

## Rotas do Storefront

| Rota | Tela |
|---|---|
| `/` | Home |
| `/cardapio?categoria=hamburgueres` | Cardápio (o valor de `categoria` é o slug da categoria na API) |
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
| `MenuService` | **integrado**: `GET /api/v1/store/menu`, convertido por `menu.mapper.ts` (centavos → reais, categoria pelo `slug`) | — |
| Adicionais, ingredientes, bebida do combo | `menu.data.ts` (ingredientes casados pelo nome do produto) | grupos de opções na API |
| `OrderService.confirm()` | gera o número localmente | `POST /api/pedidos` → retorna número e status |
| `OrderService.advanceStatus()` | botão de simulação | status em tempo real (ex.: SignalR) |
| Comanda da cozinha | `window.print()` no navegador | backend envia para a impressora térmica (ESC/POS) ao criar o pedido |
| `computeTotals()` | calculado no front | recalcular no backend (fonte da verdade) e exibir o retorno |

Os modelos em `core/models` podem servir de base para os DTOs.

## Personalização visual

Cores, fontes e raios estão em `:root` no `projects/storefront/src/styles.scss`. Para trocar as ilustrações por fotos,
substitua os arquivos em `projects/storefront/public/img/produtos/` (ou altere a imagem do produto no cadastro);
fotos com fundo transparente (PNG/WebP) ficam melhores sobre os fundos coloridos dos cards.
