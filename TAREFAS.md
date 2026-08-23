# Lista de tarefas — Eixo de Marca

Arquivo versionado no repositório para que a lista fique igual em qualquer
máquina. Ao trocar de computador: `git pull` antes de começar, `git push`
depois de marcar o que foi feito.

Legenda: `[x]` concluído · `[ ]` pendente · `[~]` em andamento

Última atualização: 2026-08-23 (reconstruída a partir do histórico de commits)

---

## Concluído

### Estrutura e páginas
- [x] Site institucional em Next.js com rota principal imersiva
- [x] Portfólio dividido em páginas dedicadas (`/portfolio/artes`, `/portfolio/video`) — `4f61195`
- [x] Página de identidade visual com carrossel e rotas por projeto (`/identidade-visual/[slug]`) — `c96f2f1`
- [x] Header, footer, barra de progresso de scroll e componentes de reveal
- [x] `robots.ts` e `sitemap.ts`

### Hero
- [x] Hero interativo com mockup de celular e cenas de serviço — `ef28de9`, `c96f2f1`
- [x] Texto à esquerda, mascote ao lado e selo menos genérico — `9c132c4`
- [x] Esfera de trabalhos girando atrás do texto (seção 01) — `aaed342`
- [x] Órbita de serviços com mãos + celular substituindo a seção scroll-driven — `1faf013`
- [x] Layout em leque com transição de ícone voando — `6af1c71`
- [x] Ajustes de título, CTA, caption e ancoragem do device — `7b58340`, `0c3a78e`, `98f3d59`
- [x] Mockup do hero com recorte de chroma adequado e maior — `56051dc`
- [x] Marquee do hero com contagem de prioridade fixa — `e3e5a7b`
- [x] Cards flutuantes de clientes no hero (feito e depois revertido) — `5696f28`, `bb1f1be`

### Seção de serviços
- [x] Serviços legíveis: lista, cards sincronizados e descrição (seção 02) — `37f4b50`
- [x] Vitrine circular auto-cíclica no lugar da lista scroll-driven — `410fdcf`
- [x] Celular fixo (sticky) enquanto a lista rola — `d8cdd88`
- [x] Intervalo de troca dos celulares encurtado — `8df7663`

### Portfólio e conteúdo
- [x] Vídeos do portfólio em grade 3x2 no lugar do trilho de scroll — `e0d3131`
- [x] Grade de 5 projetos fechada (sem 3ª coluna irregular) — `401ac86`
- [x] Grade de 5 colunas no desktop para "Marcas e histórias" — `10946b4`
- [x] Mosaico de vídeos — `c96f2f1`
- [x] Animação 3D de tilt-and-rise ligada ao scroll na grade — `f7952fb`
- [x] Assets reais de cliente no showcase, grade, marcas e hero — `ed524b8`, `e66a762`
- [x] Copy do hero e das seções ajustada, rótulos de UI menos "nota de dev" — `64ff7fd`

### CTA Ponto Cego
- [x] CTA de lead magnet no hero e no footer — `b9073c1`
- [x] Ponto Cego promovido a CTA primário do header — `4f61195`
- [x] Assinatura do footer alinhada com a nova copy do hero — `43d9299`

### Performance
- [x] Correção dos 138MB de vídeo por sessão — `81760b8`
- [x] Vídeos re-encodados em resolução maior, caption acima do celular — `ae56c47`
- [x] Vídeos comprimidos e grade em click-to-play — `06d1332`, `ec5b8e9`
- [x] LCP: imagens do marquee sem lazy-load, posters redimensionados — `15b473b`, `870524f`
- [x] Reveals de scroll consolidados em um observer por grade — `6b0dbf1`
- [x] Remoção da arquitetura morta de GSAP/Three.js — `40cf1a5`

### Acessibilidade e ajuste fino
- [x] Contraste WCAG AA (texto azul em fundo claro, 2.83:1) — `6f878b3`, `a187e3b`
- [x] Auditoria visual / layout / a11y — `81760b8`
- [x] Escala tipográfica menor (2 passadas) — `2704bf9`, `2b6c8ab`
- [x] Títulos das etapas do método alinhados na grade de 4 colunas — `be4e301`
- [x] Linhas viúvas nos títulos de seção corrigidas — `da8906b`
- [x] Logo real no lugar dos glifos X/× — `facb444`
- [x] Gap vazio em viewports mobile altas eliminado — `741a304`

### Build e deploy
- [x] Webpack forçado no build da Vercel — `c14fae8`
- [x] `pnpm lint` e `pnpm build` como validação padrão

---

## Pendente

_Nada registrado ainda. Adicione aqui o que ficou em aberto no outro PC —
uma linha por tarefa — e faça commit para sincronizar as duas máquinas._

- [ ] 
