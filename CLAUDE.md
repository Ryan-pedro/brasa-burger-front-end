# CLAUDE.md — Brasa Burger · Front-end

Instruções permanentes para trabalhar neste repositório. Valem para toda tarefa, salvo pedido explícito em contrário.

## O sistema

- Sistema de pedidos de **uma única hamburgueria** (ADR-0016). Não existe multi-loja, `TenantId` nem seletor de loja.
- Dois repositórios (ADR-0017):
  - `brasa-burger-front-end` (este): workspace Angular.
  - `brasa-burger-API`: API .NET 10, PostgreSQL, documentação de arquitetura (`docs/architecture`) e ADRs (`docs/adr`).
- A API é a fonte da verdade para preço, permissão e regra de negócio. O front exibe e coleta; não decide.
- Em desenvolvimento, o front chama `/api/...` e o `proxy.conf.json` encaminha para `http://localhost:5143`. Nunca use URL absoluta da API no código nem habilite CORS.

## Stack (o que existe, não acrescente outra)

- Angular 21: componentes standalone, signals, change detection zoneless, controle de fluxo `@if/@for/@switch`, rotas com `loadComponent`.
- Formulários reativos tipados (`NonNullableFormBuilder`).
- `HttpClient` com `withFetch()` e interceptors funcionais.
- Testes: Vitest via `ng test` (builder `@angular/build:unit-test`) com jsdom.
- SCSS com tokens em variáveis CSS. **Sem biblioteca de UI e sem biblioteca de estado global**: componentes próprios e estado com signals (ADR-0015).
- npm (com `legacy-peer-deps`), Prettier (`printWidth` 100, aspas simples), `.editorconfig` com 2 espaços.
- Não adicione dependências sem pedido explícito.

## Organização

```
projects/
├─ storefront/   # loja do cliente (prefixo app-)
│  └─ src/app/{core,shared,pages}
└─ admin/        # painel da loja (prefixo adm-)
   └─ src/app/
      ├─ core/       # api (erros, CSRF), session (sessão, guards, permissões), store (perfil, título)
      ├─ layout/     # shell, navegação, admin-modules.ts
      ├─ shared/     # *admCan, sheet, dinheiro, mensagens de campo, pipes
      └─ features/   # uma pasta por módulo: auth, home, catalog, no-access...
```

- Cada aplicação importa só o próprio código. Algo vira compartilhado entre aplicações apenas quando for usado por duas delas e estiver estável.
- Uma feature contém: `*.api.ts` (HTTP), `*.models.ts` (tipos do contrato), `*.store.ts` (estado com signals, `providers` da página), página e componentes de formulário.
- Componentes de tela não chamam `HttpClient` diretamente: passam pelo `*.api.ts` ou pelo store.

## Regras do painel (admin)

- **Permissão, nunca papel.** O front nunca compara `Owner`/`Manager`/`Kitchen`; pergunta `session.can('catalog.write')`.
- `layout/admin-modules.ts` é a lista única de módulos: dela saem rotas (`permissionGuard`), menu e tela inicial. Módulo novo = um item com `loadComponent`.
- Ações condicionais na tela usam `*admCan="'permissao'; else alternativa"`.
- A sessão é cookie HttpOnly. Não leia nem guarde token em `localStorage`/`sessionStorage`.
- Toda requisição que altera estado passa pelo `csrfInterceptor` (cabeçalho `X-Brasa-Csrf`). Não contorne.
- Erros da API são Problem Details com `code` estável e, em validação, `errors` por campo. Decida sempre pelo `code`, nunca pelo texto. Use `toResult`, `problemCode` e `problemFields` de `core/api/api-problem.ts`.
- Dinheiro trafega em **centavos inteiros** (`priceInCents`, ADR-0012). Converta só na borda: `shared/money.ts` e o pipe `brl`.
- Atualização otimista (ex.: disponibilidade) sempre com reversão e aviso se a API recusar.

## Regras da loja (storefront)

- O nome da loja vem de `GET /api/v1/store/profile` (`StoreContext`). Nunca escreva "Brasa Burger" fixo em tela.
- O cardápio e o pedido ainda são mockados (`core/data/menu.data.ts`). Ao integrar com a API, mantenha a interface dos services e troque só a implementação.
- `core/utils/pricing.ts` é regra pura e testada; altere junto com os testes.

## Código

- Nomes de código em inglês; textos de interface, mensagens e descrições de teste em português do Brasil.
- **Sem comentários no código.** Nomes claros substituem explicações. Exceção só se o usuário pedir.
- Sem código morto, sem duplicação, sem abstração "para o futuro". Extraia para `shared/` quando a segunda ocorrência aparecer.
- `ChangeDetectionStrategy.OnPush` em todo componente. `inject()` em vez de construtor. `input()`, `output()`, `viewChild()` com signals.
- Estado: `signal` privado + `computed`/`asReadonly()` públicos. Sem `subscribe` manual quando `firstValueFrom` resolve.
- Strict TypeScript e `strictTemplates` estão ligados: não use `any`, `$any` nem `!` para silenciar o compilador.
- Arquivos: `nome.page.ts`, `nome.component.ts`, `nome.store.ts`, `nome.api.ts`, `nome.models.ts`, `nome.spec.ts`.

## Preservar o que existe

- Não altere comportamento fora do escopo da tarefa. Refatoração ampla só com pedido explícito.
- Não renomeie rotas, seletores, tokens CSS ou contratos da API sem pedido explícito.
- Mudança que depende de contrato novo da API: a API muda primeiro, em PR próprio no outro repositório.
- Trabalho sempre em branch (`feat/...`, `fix/...`, `chore/...`, `docs/...`) a partir da `main`. **Nunca grave alterações com a `main` ativa**: confirme a branch antes de editar.
- Commits em Conventional Commits com escopo: `feat(admin): ...`, `fix(storefront): ...`.

## Testes, build e validação

Antes de dar uma tarefa como pronta:

```bash
npm test             # storefront e admin, sem modo observação
npm run build        # build de produção das duas aplicações
```

- Todo store, guard, interceptor, diretiva e função pura nova ganha `*.spec.ts`. Use `provideHttpClientTesting` e `HttpTestingController` para HTTP.
- Descreva o comportamento, não a implementação: `it('desfaz a troca e avisa quando a API recusa')`.
- Teste os estados de erro e de permissão, não só o caminho feliz.
- Os budgets do `angular.json` não podem ser estourados.
- A CI (`.github/workflows/ci.yml`) roda `npm ci`, `npm test` e `npm run build`; ela precisa passar.

## UI/UX: direção visual obrigatória

### Identidade que já existe

- **Storefront**: tom de lanchonete; Lilita One (display) + Nunito (texto); vermelho `#C8102E`, amarelo `#FFB320`, tinta `#2A1712`, fundo creme `#FFF6E8`; cards arredondados; pensado primeiro para celular.
- **Admin**: "fundo de loja", sóbrio; mesma marca (Lilita One só no nome da loja), cor forte concentrada na barra `--ember` `#7A0A1C` e nas ações primárias; superfícies claras (`--paper`, `--surface`), listas com divisórias em vez de cards; desktop primeiro e funcional no celular.
- Use os tokens de `src/styles.scss` de cada aplicação. Não invente cor, fonte, raio ou sombra fora deles sem registrar o motivo.

### Antes de implementar qualquer tela nova

Escreva e apresente, antes do código, uma direção visual curta:

1. Para quem é a tela e qual a ação principal.
2. Layout em esboço (ASCII), com hierarquia e alinhamento.
3. Quais tokens de cor e tipo serão usados e onde fica o único ponto de destaque.
4. Estados: carregando, vazio, erro, sem permissão, sucesso.
5. Comportamento em 390 px de largura.

Só depois implemente, seguindo a direção aprovada.

### Proibido (aparência genérica de IA)

- Grade de cards idênticos com a mesma sombra e o mesmo raio para todo conteúdo.
- Gradientes decorativos, glassmorphism, brilhos e ícones enfeitando títulos.
- Rótulo em CAIXA ALTA espaçada acima de cada título; números "01 / 02 / 03" quando o conteúdo não é sequência.
- Palavra solta destacada em cor ou itálico no meio do título.
- Animação de entrada em cada seção; hover animado em tudo.
- "→" no fim de botões e links; textos de marketing vazios ("Potencialize", "Descubra", "Tudo em um só lugar").
- Emojis como ícones; ícones de biblioteca sem pedido.
- Fundo creme com serifa e acento terracota no painel; tema escuro com um verde neon.

### Texto da interface

- Português do Brasil, frase normal (não Title Case), voz ativa.
- Botão diz o que acontece: "Salvar produto", "Novo produto", não "Enviar" ou "OK".
- Erro explica o que houve e como resolver, sem pedir desculpas. Estado vazio convida à ação.
- O mesmo nome para a mesma ação em toda a jornada.

### Critérios de qualidade

- Contraste AA em texto e em indicador de foco; foco visível em todo elemento interativo.
- Alvos de toque com no mínimo 40 px; `label` ligado a todo campo; `aria-invalid` e mensagem no campo com erro.
- `prefers-reduced-motion` respeitado; movimento só como resposta a uma ação.
- Sem rolagem horizontal em 390 px.
- Números monetários com `font-variant-numeric: tabular-nums` quando alinhados em lista.

### Revisão visual após implementar

1. Rode a tela de verdade (com a API, ou com dados simulados quando a API não tiver a rota).
2. Capture e revise desktop (1280 px) e celular (390 px), em todos os estados listados na direção.
3. Navegue só com teclado e confira a ordem e o foco.
4. Compare com a direção aprovada e com a lista de proibições; corrija antes de entregar.
5. Ao entregar, mostre as capturas e diga o que mudou em relação à direção, se algo mudou.
