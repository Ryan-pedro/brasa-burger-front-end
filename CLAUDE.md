CLAUDE.md — Brasa Burger · Front-end
Instruções permanentes para trabalhar neste repositório. Valem para toda tarefa, salvo pedido explícito em contrário.
O sistema
- Sistema de pedidos de uma única hamburgueria (ADR-0016). Não existe multi-loja, TenantId nem seletor de loja.
- Dois repositórios (ADR-0017):
  - brasa-burger-front-end (este): workspace Angular.
  - brasa-burger-API: API .NET 10, PostgreSQL, documentação de arquitetura (docs/architecture) e ADRs (docs/adr).
- A API é a fonte da verdade para preço, permissão e regra de negócio. O front exibe e coleta; não decide.
- Em desenvolvimento, o front chama /api/... e o proxy.conf.json encaminha para http://localhost:5143. Nunca use URL absoluta da API no código nem habilite CORS.
Stack (o que existe, não acrescente outra)
- Angular 21: componentes standalone, signals, change detection zoneless, controle de fluxo @if/@for/@switch, rotas com loadComponent.
- Formulários reativos tipados (NonNullableFormBuilder).
- HttpClient com withFetch() e interceptors funcionais.
- Testes: Vitest via ng test (builder @angular/build:unit-test) com jsdom.
- SCSS com tokens em variáveis CSS. Sem biblioteca de UI e sem biblioteca de estado global: componentes próprios e estado com signals (ADR-0015).
- npm (com legacy-peer-deps), Prettier (printWidth 100, aspas simples), .editorconfig com 2 espaços.
- Não adicione dependências sem pedido explícito.
Organização
projects/
├─ storefront/   # loja do cliente (prefixo app-)
│  └─ src/app/{core,shared,pages}
└─ admin/        # painel da loja (prefixo adm-)
   └─ src/app/
      ├─ core/       # api (erros, CSRF), session (sessão, guards, permissões), store (perfil, título)
      ├─ layout/     # shell, navegação, admin-modules.ts
      ├─ shared/     # *admCan, sheet, dinheiro, mensagens de campo, pipes
      └─ features/   # uma pasta por módulo: auth, home, catalog, no-access...
- Cada aplicação importa só o próprio código. Algo vira compartilhado entre aplicações apenas quando for usado por duas delas e estiver estável.
- Uma feature contém: *.api.ts (HTTP), *.models.ts (tipos do contrato), *.store.ts (estado com signals, providers da página), página e componentes de formulário.
- Componentes de tela não chamam HttpClient diretamente: passam pelo *.api.ts ou pelo store.
Regras do painel (admin)
- Permissão, nunca papel. O front nunca compara Owner/Manager/Kitchen; pergunta session.can('catalog.write').
- layout/admin-modules.ts é a lista única de módulos: dela saem rotas (permissionGuard), menu e tela inicial. Módulo novo = um item com loadComponent.
- Ações condicionais na tela usam *admCan="'permissao'; else alternativa".
- A sessão é cookie HttpOnly. Não leia nem guarde token em localStorage/sessionStorage.
- Toda requisição que altera estado passa pelo csrfInterceptor (cabeçalho X-Brasa-Csrf). Não contorne.
- Erros da API são Problem Details com code estável e, em validação, errors por campo. Decida sempre pelo code, nunca pelo texto. Use toResult, problemCode e problemFields de core/api/api-problem.ts.
- Dinheiro trafega em centavos inteiros (priceInCents, ADR-0012). Converta só na borda: shared/money.ts e o pipe brl.
- Atualização otimista (ex.: disponibilidade) sempre com reversão e aviso se a API recusar.
Regras da loja (storefront)
- O nome da loja vem de GET /api/v1/store/profile (StoreContext). Nunca escreva "Brasa Burger" fixo em tela.
- O cardápio e o pedido ainda são mockados (core/data/menu.data.ts). Ao integrar com a API, mantenha a interface dos services e troque só a implementação.
- core/utils/pricing.ts é regra pura e testada; altere junto com os testes.
Código
- Nomes de código em inglês; textos de interface, mensagens e descrições de teste em português do Brasil.
- Sem comentários no código. Nomes claros substituem explicações. Exceção só se o usuário pedir.
- Sem código morto, sem duplicação, sem abstração "para o futuro". Extraia para shared/ quando a segunda ocorrência aparecer.
- ChangeDetectionStrategy.OnPush em todo componente. inject() em vez de construtor. input(), output(), viewChild() com signals.
- Estado: signal privado + computed/asReadonly() públicos. Sem subscribe manual quando firstValueFrom resolve.
- Strict TypeScript e strictTemplates estão ligados: não use any, $any nem ! para silenciar o compilador.
- Arquivos: nome.page.ts, nome.component.ts, nome.store.ts, nome.api.ts, nome.models.ts, nome.spec.ts.
Preservar o que existe
- Não altere comportamento fora do escopo da tarefa. Refatoração ampla só com pedido explícito.
- Não renomeie rotas, seletores, tokens CSS ou contratos da API sem pedido explícito.
- Mudança que depende de contrato novo da API: a API muda primeiro, em PR próprio no outro repositório.
- Trabalho sempre em branch (feat/..., fix/..., chore/..., docs/...) a partir da main. Nunca grave alterações com a main ativa: confirme a branch antes de editar.
- Commits em Conventional Commits com escopo: feat(admin): ..., fix(storefront): ....
Testes, build e validação
Antes de dar uma tarefa como pronta:
npm test
npm run build
- Todo store, guard, interceptor, diretiva e função pura nova ganha *.spec.ts. Use provideHttpClientTesting e HttpTestingController para HTTP.
- Descreva o comportamento, não a implementação: it('desfaz a troca e avisa quando a API recusa').
- Teste os estados de erro e de permissão, não só o caminho feliz.
- Os budgets do angular.json não podem ser estourados.
- A CI (.github/workflows/ci.yml) roda npm ci, npm test e npm run build; ela precisa passar.
UI/UX: excelência visual obrigatória
Esta seção é uma regra permanente para qualquer alteração no frontend, incluindo páginas, componentes, formulários, dashboards, navegação, animações, responsividade e estados de interação.
Princípio fundamental: não entregue interfaces que apenas funcionam. Entregue interfaces com identidade visual, qualidade de produto profissional e acabamento consistente. Uma interface não está pronta apenas porque compila, passa nos testes ou funciona em uma resolução.
1. Processo obrigatório antes de desenvolver
Antes de escrever ou modificar código de interface:
1. Analise a tela existente, o fluxo do usuário, os componentes reutilizáveis, os tokens CSS e a arquitetura da aplicação.
2. Identifique o objetivo da tela, o público-alvo, a ação principal e as informações que precisam de maior destaque.
3. Consulte referências visuais relevantes para o domínio do produto. Não copie templates completos nem escolha referências apenas porque são populares.
4. Verifique as skills, os plugins, os servidores MCP, as ferramentas de design e os recursos de browser disponíveis no ambiente.
5. Defina uma direção visual específica para a tela, coerente com a identidade do Brasa Burger.
6. Para telas novas ou reformulações visuais significativas, apresente uma proposta curta antes de implementar e aguarde aprovação quando solicitado ou quando a tarefa exigir aprovação explícita.
Não comece a implementação escolhendo componentes aleatórios e tentando construir uma identidade visual depois.
2. Uso de ferramentas especializadas
Antes de qualquer trabalho visual, investigue quais ferramentas de design e frontend estão efetivamente disponíveis.
- Utilize a skill frontend-design caso esteja instalada e disponível no ambiente.
- Utilize ferramentas de referência e descoberta de componentes, como MCPs de design, quando estiverem disponíveis e forem adequadas à tarefa.
- Utilize ferramentas especializadas em animação quando o projeto realmente precisar de movimento complexo.
- Utilize browser automation, como Playwright, quando disponível, para inspecionar a interface renderizada e validar interações.
- Utilize ferramentas de geração ou edição de imagens quando imagens personalizadas forem necessárias para a experiência visual.
- Consulte a documentação oficial das tecnologias e bibliotecas antes de utilizar APIs desconhecidas.
- Prefira componentes existentes, ferramentas já instaladas e recursos nativos do Angular quando atenderem aos requisitos.
Não presuma que uma ferramenta está instalada. Descubra seus recursos antes de utilizá-la.
Se uma ferramenta especializada importante não estiver disponível, identifique a limitação e proponha uma alternativa adequada. Solicite autorização explícita antes de instalar plugins, adicionar pacotes npm ou alterar dependências. Não instale ferramentas apenas para cumprir uma formalidade; cada ferramenta deve contribuir concretamente para qualidade, produtividade ou validação.
3. Direção visual e identidade do produto
Toda tela deve ter intenção visual clara e composição adequada à sua função. Antes de implementar, defina:
- Hierarquia visual e ordem de leitura.
- Composição, alinhamento, espaçamento e densidade de informação.
- Tipografia e níveis de contraste.
- Uso intencional das cores da marca.
- Tratamento de superfícies, divisórias, bordas e elevação.
- Estados interativos e feedback visual.
- Comportamento em dispositivos móveis e desktops.
Não use a mesma composição em todas as telas. A identidade deve ser consistente, mas cada página precisa de um layout adequado ao conteúdo e ao objetivo.
Identidade do Brasa Burger
Storefront
- Linguagem visual de hamburgueria, apetitosa, expressiva e acolhedora.
- Lilita One para display e Nunito para textos.
- Vermelho #C8102E, amarelo #FFB320, tinta #2A1712 e fundo creme #FFF6E8.
- Experiência mobile-first, navegação intuitiva e destaque para os produtos.
- Imagens de alimentos com qualidade visual, aparência realista e consistência com os produtos apresentados.
Admin
- Aparência de ferramenta profissional de operação, objetiva e sóbria.
- Lilita One apenas no nome da loja.
- Cor --ember (#7A0A1C) concentrada nas ações primárias e nos pontos de destaque necessários.
- Superfícies claras, listas, tabelas e divisórias como elementos estruturais.
- Densidade informacional adequada ao trabalho operacional, sem espaço desperdiçado.
- Experiência desktop-first, mantendo usabilidade em dispositivos móveis.
Utilize os tokens existentes nos respectivos arquivos styles.scss. Não introduza uma identidade paralela nem modifique tokens globais sem necessidade justificada.
4. Proibição de estética genérica de IA
Evite rigorosamente:
- Dashboards SaaS genéricos, layouts clonados de templates e páginas com aparência de boilerplate.
- Grades de cards idênticos quando listas, tabelas, seções ou layouts assimétricos forem mais apropriados.
- Gradientes decorativos, glassmorphism, brilhos, efeitos neon e sombras excessivas sem justificativa de design.
- Bordas exageradamente arredondadas e o uso do mesmo raio em todos os elementos.
- Ícones, badges, pills, indicadores e elementos decorativos sem função.
- Emojis utilizados como ícones de interface.
- Títulos gigantes, rótulos em caixa alta com espaçamento artificial e números decorativos sem significado.
- Destaques arbitrários em palavras, cores ou itálicos apenas para criar aparência de landing page.
- Animações de entrada em todas as seções, efeitos de hover indiscriminados e transições que não melhoram a experiência.
- Botões com setas decorativas, textos de marketing vazios e conteúdo fictício usado apenas para preencher espaço.
- A mesma linguagem visual aplicada indiscriminadamente a todas as páginas.
- Componentes com aparência de biblioteca padrão sem adaptação à identidade do produto.
Essas restrições não proíbem cards, gradientes, sombras, animações ou componentes de biblioteca quando houver uma razão funcional e visual concreta.
A regra não é eliminar personalidade. É eliminar decisões visuais automáticas, repetitivas e sem propósito.
5. Componentes e consistência visual
- Construa componentes reutilizáveis quando houver um padrão real de repetição.
- Preserve os componentes e tokens existentes antes de criar alternativas.
- Defina variantes e estados visuais consistentes para botões, campos, menus, tabelas, diálogos e notificações.
- Evite duplicação de CSS e estilos conflitantes entre aplicações.
- Não crie um componente genérico excessivamente configurável para resolver apenas uma tela.
- Não introduza uma biblioteca de UI sem autorização explícita.
- Não substitua a arquitetura standalone, signals ou os padrões Angular estabelecidos neste repositório.
A reutilização deve preservar consistência sem transformar a interface em um conjunto de blocos visualmente indistinguíveis.
6. Animações e microinterações
Animações devem melhorar a percepção de resposta, continuidade, orientação e feedback.
- Priorize microinterações funcionais: feedback de clique, abertura de menus, diálogos, expansão de conteúdo, confirmação de ações e transições de estado.
- Utilize duração, easing e deslocamento discretos, coerentes com a identidade do produto.
- Evite animações longas, movimentos constantes, paralaxe desnecessária e animações aplicadas indiscriminadamente.
- Não anime elementos apenas para fazer a tela parecer moderna.
- Prefira CSS e recursos nativos quando forem suficientes.
- Adote bibliotecas especializadas apenas quando houver benefício concreto e após autorização para adicionar dependências.
- Respeite prefers-reduced-motion.
- Garanta que animações não prejudiquem acessibilidade, desempenho, leitura ou operação em dispositivos modestos.
Toda animação deve ter um propósito identificável. Na dúvida, prefira uma interação simples, rápida e bem executada.
7. Responsividade real
Responsividade não significa apenas reduzir o tamanho dos elementos. Teste a adaptação dos layouts, a hierarquia, a navegação, os formulários e as interações em diferentes larguras.
- Storefront: prioridade para dispositivos móveis.
- Admin: prioridade para desktop, sem comprometer o uso em telas pequenas.
- Validar pelo menos 390 px e 1280 px de largura, além de larguras intermediárias quando relevantes.
- Não permitir rolagem horizontal acidental.
- Adaptar tabelas, menus, filtros, formulários, diálogos, imagens e áreas de ação de acordo com o contexto.
- Garantir alvos de toque adequados, campos legíveis e ações importantes acessíveis.
- Não esconder funcionalidades importantes simplesmente porque a tela ficou estreita.
- Evitar breakpoints arbitrários sem considerar o comportamento real do conteúdo.
Utilize CSS Grid, Flexbox, unidades fluidas e media queries de maneira intencional. Não construa layouts exclusivamente com larguras fixas ou posicionamento absoluto.
8. Imagens e conteúdo visual
- Priorize imagens relevantes e de alta qualidade, adequadas ao produto e à identidade da marca.
- Para o cardápio, utilize imagens realistas e coerentes com os alimentos efetivamente oferecidos.
- Não utilize imagens genéricas quando elas enfraquecerem a identidade do produto.
- Não invente produtos, preços, avaliações, depoimentos ou indicadores para tornar uma tela visualmente mais interessante.
- Preserve proporções, qualidade e comportamento responsivo das imagens.
- Utilize placeholders apenas em estados de carregamento ou quando forem realmente necessários.
- Forneça alternativas textuais adequadas para imagens relevantes e mantenha o carregamento eficiente.
9. Acessibilidade e estados de interface
Toda tela deve considerar os estados relevantes do fluxo:
- Carregamento.
- Conteúdo disponível.
- Lista vazia.
- Erro de carregamento ou operação.
- Falta de permissão.
- Validação de formulário.
- Sucesso da operação.
- Indisponibilidade temporária, quando aplicável.
Não crie estados fictícios incompatíveis com o contrato da API.
Mantenha contraste WCAG AA, foco visível, navegação por teclado, associação correta entre labels e campos e mensagens de erro compreensíveis.
Utilize textos em português do Brasil, voz ativa e frases naturais. Os botões devem descrever a ação: "Salvar produto", "Adicionar ao pedido" ou "Cancelar pedido".
10. Inspeção visual obrigatória
Quando ferramentas de execução e inspeção visual estiverem disponíveis, não finalize uma alteração de UI sem verificar o resultado renderizado.
1. Execute a aplicação usando o procedimento documentado no projeto.
2. Acesse a tela alterada no navegador.
3. Inspecione a interface em desktop e celular.
4. Verifique alinhamento, espaçamento, tipografia, contraste, imagens, overflow e consistência visual.
5. Teste as interações principais, a navegação por teclado e os estados relevantes.
6. Compare o resultado com a direção visual definida.
7. Corrija os problemas identificados e repita a inspeção.
8. Execute testes, build e demais validações pertinentes.
Se a inspeção visual não puder ser realizada, informe explicitamente essa limitação. Não afirme que uma tela foi visualmente validada sem tê-la inspecionado.
11. Critérios de conclusão
Uma implementação visual só pode ser considerada pronta quando:
- A identidade do Brasa Burger foi preservada.
- A interface tem composição intencional, hierarquia clara e acabamento consistente.
- Não existem padrões genéricos introduzidos apenas por conveniência.
- Os componentes respeitam a arquitetura e os padrões do projeto.
- A responsividade foi validada nos tamanhos relevantes.
- Animações e interações têm propósito e respeitam acessibilidade.
- Os estados relevantes estão implementados.
- Não existem regressões funcionais conhecidas.
- Testes e build passaram, ou eventuais impedimentos foram relatados.
- A revisão visual foi realizada quando tecnicamente possível.
Regra final: nunca entregue a primeira versão visual apenas porque ela parece aceitável no código. Avalie o resultado como um designer de produto exigente e como um engenheiro frontend responsável pela qualidade de produção. Identifique o que parece genérico, desnecessário, inconsistente ou mal acabado e corrija antes de concluir.
Texto da interface
- Português do Brasil, frase normal (não Title Case), voz ativa.
- Botão diz o que acontece: "Salvar produto", "Novo produto", não "Enviar" ou "OK".
- Erro explica o que houve e como resolver, sem pedir desculpas. Estado vazio convida à ação.
- O mesmo nome para a mesma ação em toda a jornada.
Critérios de qualidade
- Contraste AA em texto e em indicador de foco; foco visível em todo elemento interativo.
- Alvos de toque com no mínimo 40 px; label ligado a todo campo; aria-invalid e mensagem no campo com erro.
- prefers-reduced-motion respeitado; movimento só como resposta a uma ação.
- Sem rolagem horizontal em 390 px.
- Números monetários com font-variant-numeric: tabular-nums quando alinhados em lista.
Revisão visual após implementar
1. Rode a tela de verdade (com a API, ou com dados simulados quando a API não tiver a rota).
2. Capture e revise desktop (1280 px) e celular (390 px), em todos os estados listados na direção.
3. Navegue só com teclado e confira a ordem e o foco.
4. Compare com a direção aprovada e com a lista de proibições; corrija antes de entregar.
5. Ao entregar, mostre as capturas e diga o que mudou em relação à direção, se algo mudou.