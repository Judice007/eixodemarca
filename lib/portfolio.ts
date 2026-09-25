// Dados do portfólio, separados de lib/data.ts porque são usados pela home
// (seção "Marcas e histórias") E pelas páginas dedicadas /portfolio/artes e
// /portfolio/video — mantê-los aqui evita duplicar os arrays em cada lugar.

// Tipado à mão de propósito: inferido de `as const`, o campo `fit` só aceitava
// os valores que existiam nas entradas. Quando a única peça com 'contain'
// (Vista Bajeko) saiu, `fit === 'contain'` nos componentes passou a ser erro
// de compilação — e voltaria a ser sempre que a lista mudasse.
type ProjectItem = {
  type: 'image'
  src: string
  alt: string
  client: string
  tags: string
  fit: 'cover' | 'contain'
  position: string
}

export const projects: ProjectItem[] = [
  {
    type: 'image' as const,
    src: '/portfolio-media/design-ukimports.webp',
    alt: 'Campanha de smartphones para UK Imports',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center 45%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-acai.webp',
    alt: 'Conteúdo para Di Casa Açaí',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center 42%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-reset.webp',
    alt: 'Campanha sustentável para Reset Madeira Ecológica',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center 50%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/landing-pousada.webp',
    alt: 'Landing page da Pousada da Praia',
    client: 'Pousada da Praia',
    tags: 'Web · Landing page',
    fit: 'cover' as const,
    position: 'center 46%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/trafego-itamang.webp',
    alt: 'Campanha de tráfego para Itamang',
    client: 'Itamang',
    tags: 'Tráfego pago',
    fit: 'cover' as const,
    position: 'center',
  },
  // Setembro/2026: carrosséis e estáticos da própria Eixo (pilar "direção
  // estratégica"). Curadoria de ~20 peças disponíveis — 6 escolhidas por
  // ângulo distinto, evitando repetir o mesmo argumento duas vezes.
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/eixo-de-marca-03.webp',
    alt: 'Carrossel da Eixo de Marca: "Você não tem problema de marketing. Tem problema de direção."',
    client: 'Eixo de Marca',
    tags: 'Carrossel · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/eixo-de-marca-04.webp',
    alt: 'Carrossel da Eixo de Marca: "Marketing para clínica não é só antes e depois."',
    client: 'Eixo de Marca',
    tags: 'Carrossel · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/eixo-de-marca-05.webp',
    alt: 'Post da Eixo de Marca: "Trocaram sua logo pela do concorrente e ninguém notou."',
    client: 'Eixo de Marca',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/eixo-de-marca-06.webp',
    alt: 'Post da Eixo de Marca: "Quando o cliente só olha o preço, a culpa não é dele."',
    client: 'Eixo de Marca',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/eixo-de-marca-07.webp',
    alt: 'Post da Eixo de Marca: "Anúncio não conserta negócio ruim."',
    client: 'Eixo de Marca',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/eixo-de-marca-08.webp',
    alt: 'Post da Eixo de Marca: "Boca a boca é ótimo. Mas você não controla a torneira."',
    client: 'Eixo de Marca',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-laura-dispositivo.webp',
    alt: 'Post sobre dispositivo de estética para Laura Anjos',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center 30%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-laura-pele-desidratada.webp',
    alt: 'Post sobre sinais de pele desidratada para Laura Anjos',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center 55%',
  },
  // Setembro/2026, pasta de entrega do cliente. Um arquivo ("5 sinais de
  // pele desidratada") era duplicata exata do post acima — pulado.
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/laura-anjos-03.webp',
    alt: 'Post da Laura Anjos perguntando "o que você fez por você até agora esse ano?"',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/laura-anjos-04.webp',
    alt: 'Post da Laura Anjos sobre peeling, com foto de antes e depois',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/laura-anjos-05.webp',
    alt: 'Post ilustrado da Laura Anjos sobre a diferença entre quem cuida da pele e quem não cuida',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center',
  },
  // ── Artes entregues pelo cliente (pasta _PARA O SITE) ─────────────────────
  // Todas 1080x1350 (4:5 de feed), então `cover` + `center` não corta nada: o
  // card da home e a grade da página do cliente usam a mesma proporção.
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-01.webp',
    alt: 'Post da UK Imports com iPhone laranja e a frase "Nada menos que o melhor"',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-02.webp',
    alt: 'Post da UK Imports com iPhone laranja e a pergunta "Orange is the new black?"',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-03.webp',
    alt: 'Carrossel da UK Imports sobre por que usuários de iPhone não devem usar o Chrome',
    client: 'UK Imports',
    tags: 'Carrossel · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-04.webp',
    alt: 'Carrossel da UK Imports sobre os sete novos produtos lançados pela Apple',
    client: 'UK Imports',
    tags: 'Carrossel · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-05.webp',
    alt: 'Post da UK Imports com dois iPhones lado a lado e a frase "Quem tem, não volta atrás"',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/di-casa-acai-01.webp',
    alt: 'Post da Di Casa Açaí com copo de açaí, morango e banana sobre fundo roxo',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/di-casa-acai-02.webp',
    alt: 'Meme da Di Casa Açaí sobre a reação de quem escuta o convite para pedir açaí',
    client: 'Di Casa Açaí',
    tags: 'Social media · Humor',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/di-casa-acai-03.webp',
    alt: 'Post da Di Casa Açaí com copo de açaí e frutas e a pergunta "Já tomou seu açaí hoje?"',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-01.webp',
    alt: 'Post da Reset com área gourmet em deck de madeira e a frase "O barato sai caro. Invista certo!"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-02.webp',
    alt: 'Post da Reset com pergolado de madeira no jardim e a chamada "25 anos de garantia"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-03.webp',
    alt: 'Post da Reset com passarela de madeira entre árvores e a frase "Construção e preservação"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-04.webp',
    alt: 'Post da Reset com fachada revestida em madeira e a frase "Mais do que madeira: confiança e legado"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-04.webp',
    alt: 'Post da EcoUtil com deck de madeira à beira-mar e as palavras durabilidade, elegância e sustentabilidade',
    client: 'EcoUtil',
    tags: 'Social media · Sustentabilidade',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-01.webp',
    alt: 'Post da EcoUtil com piscina cercada por deck de madeira ecológica',
    client: 'EcoUtil',
    tags: 'Social media · Sustentabilidade',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-02.webp',
    alt: 'Post "Você sabia?" da EcoUtil: uma árvore salva a cada 600 kg de madeira ecológica',
    client: 'EcoUtil',
    tags: 'Social media · Educativo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-03.webp',
    alt: 'Post da EcoUtil com amostras de madeira ecológica empilhadas diante do mar',
    client: 'EcoUtil',
    tags: 'Social media · Produto',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/itamang-01.webp',
    alt: 'Post da Itamang com mangueira de jardim enrolada sobre a grama',
    client: 'Itamang',
    tags: 'Tráfego pago',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/itamang-02.webp',
    alt: 'Post da Itamang com a van da empresa e a chamada "Agilidade na entrega"',
    client: 'Itamang',
    tags: 'Social media · Serviço',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/itamang-03.webp',
    alt: 'Post da Itamang com rolos de mangueira em paletes no estoque',
    client: 'Itamang',
    tags: 'Social media · Produto',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/pousada-da-praia-01.webp',
    alt: 'Post da Pousada da Praia com drink e guarda-sol na areia e a frase "Natureza, conforto e pé na areia"',
    client: 'Pousada da Praia',
    tags: 'Social media · Turismo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/pousada-da-praia-02.webp',
    alt: 'Post da Pousada da Praia com a tabela de pacotes de Carnaval',
    client: 'Pousada da Praia',
    tags: 'Campanha · Sazonal',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/pousada-da-praia-03.webp',
    alt: 'Post da Pousada da Praia com a tabela de pacotes de Natal sobre fundo vermelho',
    client: 'Pousada da Praia',
    tags: 'Campanha · Sazonal',
    fit: 'cover' as const,
    position: 'center',
  },
  // ── Well Calçados (setembro/2026) — primeira entrada no portfólio de
  // artes; até aqui a marca só tinha a identidade visual.
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/well-calcados-01.webp',
    alt: 'Post da Well Calçados "Encontre o seu par", com grade de tênis casuais e esportivos',
    client: 'Well Calçados',
    tags: 'Social media · Produto',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/well-calcados-02.webp',
    alt: 'Post da Well Calçados "Tênis bom não devia ser raro", com grade de tênis sobre fundo roxo',
    client: 'Well Calçados',
    tags: 'Social media · Produto',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/well-calcados-03.webp',
    alt: 'Post criativo da Well Calçados com um tênis em formato de nuvem no céu',
    client: 'Well Calçados',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/well-calcados-04.webp',
    alt: 'Post criativo da Well Calçados com silhueta de cabeça pensando em tênis',
    client: 'Well Calçados',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  // ── Espaço dos Anjos (setembro/2026) — primeira entrada no portfólio de
  // artes; até aqui a marca só tinha a identidade visual.
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/espaco-dos-anjos-01.webp',
    alt: 'Post do Espaço dos Anjos perguntando "Quando foi a última vez que você cuidou de si mesma?"',
    client: 'Espaço dos Anjos',
    tags: 'Social media · Bem-estar',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/espaco-dos-anjos-02.webp',
    alt: 'Post do Espaço dos Anjos sobre praticidade no cuidado com a pele, com foto de procedimento facial',
    client: 'Espaço dos Anjos',
    tags: 'Social media · Bem-estar',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/espaco-dos-anjos-03.webp',
    alt: 'Post do Espaço dos Anjos "Seu olhar é a sua assinatura", com foto de atendimento de massagem',
    client: 'Espaço dos Anjos',
    tags: 'Social media · Bem-estar',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/espaco-dos-anjos-04.webp',
    alt: 'Post do Espaço dos Anjos "Seu momento começa aqui", com foto da sala de atendimento',
    client: 'Espaço dos Anjos',
    tags: 'Social media · Bem-estar',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/espaco-dos-anjos-05.webp',
    alt: 'Post do Espaço dos Anjos sobre reflexologia podal, "relaxamento da cabeça aos pés"',
    client: 'Espaço dos Anjos',
    tags: 'Social media · Bem-estar',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/espaco-dos-anjos-06.webp',
    alt: 'Post do Espaço dos Anjos no Dia do Nutricionista, com foto da nutricionista da equipe',
    client: 'Espaço dos Anjos',
    tags: 'Social media · Bem-estar',
    fit: 'cover' as const,
    position: 'center',
  },
]

export const portfolioVideos = [
  // Os dois primeiros vêm de render em 1440x2560 e saíram em 1080x1920 — o
  // resto do acervo está em 406x720, que é a origem da pixelação na tela do
  // celular. Ficam na frente por serem os de melhor qualidade.
  {
    src: '/portfolio-media/videos/video-well-calcados.mp4',
    poster: '/portfolio-media/videos/poster-well-calcados.webp',
    title: 'Well Calçados',
    tag: 'Unboxing · Reels',
  },
  {
    src: '/portfolio-media/videos/video-tudo-acaba-em-pizza.mp4',
    poster: '/portfolio-media/videos/poster-tudo-acaba-em-pizza.webp',
    title: 'Tudo acaba em pizza',
    tag: 'Bastidores · Captação',
  },
  {
    src: '/portfolio-media/videos/video-pousada-01.mp4',
    poster: '/portfolio-media/videos/poster-pousada-01.webp',
    title: 'Pousada da Praia',
    tag: 'Turismo · Apresentação',
  },
  {
    src: '/portfolio-media/videos/video-trafego-pago.mp4',
    poster: '/portfolio-media/videos/poster-trafego-pago.webp',
    title: 'Beleza ou estratégia',
    tag: 'Gancho · Tráfego pago',
  },
  {
    src: '/portfolio-media/videos/video-massagem.mp4',
    poster: '/portfolio-media/videos/poster-massagem.webp',
    title: 'Bem-estar & spa',
    tag: 'Gancho · Reels',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-01.mp4',
    poster: '/portfolio-media/videos/poster-procedimento-estetico.webp',
    title: 'Procedimento estético',
    tag: 'Captação · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-02.mp4',
    poster: '/portfolio-media/videos/poster-conteudo-fitness.webp',
    title: 'Conteúdo fitness',
    tag: 'Ritmo · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-03.mp4',
    poster: '/portfolio-media/videos/poster-movimenta-angra.webp',
    title: 'Movimenta Angra',
    tag: 'Apresentação · Cobertura',
  },
  // Setembro/2026: vídeos já postados da Eixo e da Well Calçados. Reencodados
  // em 720x1280 (os tiles do mosaico têm ~200px; 1080p seria peso à toa) —
  // 0,9 a 3,9 MB cada. Ficaram de fora as versões longas (52-57 s) e as
  // variações da mesma mensagem (três cortes de Landing Page, dois de
  // "antes e depois").
  {
    src: '/portfolio-media/videos/video-eixo-concorrente.mp4',
    poster: '/portfolio-media/videos/poster-eixo-concorrente.webp',
    title: 'Concorrente vende mais',
    tag: 'Explicativo · Eixo',
  },
  {
    src: '/portfolio-media/videos/video-well-cliente-esperta.mp4',
    poster: '/portfolio-media/videos/poster-well-cliente-esperta.webp',
    title: 'Quando a cliente é esperta',
    tag: 'Produto · Well Calçados',
  },
  {
    src: '/portfolio-media/videos/video-eixo-feed-bonito.mp4',
    poster: '/portfolio-media/videos/poster-eixo-feed-bonito.webp',
    title: 'Feed bonito',
    tag: 'Explicativo · Eixo',
  },
  {
    src: '/portfolio-media/videos/video-well-transicao.mp4',
    poster: '/portfolio-media/videos/poster-well-transicao.webp',
    title: 'Transição de tênis',
    tag: 'Edição · Well Calçados',
  },
  {
    src: '/portfolio-media/videos/video-eixo-landing-page.mp4',
    poster: '/portfolio-media/videos/poster-eixo-landing-page.webp',
    title: 'Landing page',
    tag: 'Explicativo · Eixo',
  },
  {
    src: '/portfolio-media/videos/video-well-dias-da-semana.mp4',
    poster: '/portfolio-media/videos/poster-well-dias-da-semana.webp',
    title: 'Dias da semana',
    tag: 'Produto · Well Calçados',
  },
  {
    src: '/portfolio-media/videos/video-eixo-antes-depois.mp4',
    poster: '/portfolio-media/videos/poster-eixo-antes-depois.webp',
    title: 'Antes e depois de edição',
    tag: 'Edição · Eixo',
  },
] as const

// Uma marca por item hoje (a maioria só tem a logo no projeto ainda — só a
// Vista Bajeko tem uma segunda peça, o mockup de camiseta, usado aqui em vez
// da logo plana por mostrar a marca aplicada). `accent` é só a cor de fundo
// do card na página /identidade-visual/[slug] — não é conteúdo, é estilo.
// Ordem calculada, não cronológica: alterna card claro/escuro pra não
// empilhar tons parecidos em sequência (aconteceu com Espaço dos Anjos,
// Laura Anjos e Viva Angra — três fundos brancos seguidos na grade de
// 5 colunas). Checkerboard D-L-D-L-D / L-D-L-D-L nas duas linhas.
//
// Os nomes de arquivo com hash (.xxxxxxxx.webp) são propositais: os headers
// em next.config.ts cacheiam /portfolio-media/ por 1 ano como `immutable`.
// Sobrescrever o mesmo nome não invalida o cache do navegador nem da CDN —
// o arquivo muda no servidor, mas quem já visitou continua vendo o antigo.
// Trocar o nome força uma URL nova, sem cache pra brigar. Sempre que um
// destes arquivos for re-editado, gerar um hash novo (sha1 dos primeiros
// bytes, 8 caracteres) em vez de sobrescrever o mesmo arquivo.
// Ordem calculada, não cronológica — ver comentário completo acima do
// array original no histórico do git. Resumo: 6 marcas de fundo escuro
// (eixo, vista-bajeko, bm, jo-salao, luciane-judice, itamang) contra só 4
// claras (espaço-dos-anjos, laura-anjos, viva-angra, well-calcados).
//
// Numa grade de 5 colunas × 2 linhas, o máximo de células que dá pra
// preencher sem NENHUMA vizinha do mesmo grupo (nem na horizontal, nem na
// vertical entre as duas linhas) é 5 — é o tamanho do maior conjunto
// independente desse grid. Com 6 escuros é matematicamente impossível
// zerar todo contato entre eles; a única escolha real é ONDE sobra esse
// contato. Aqui sobra no Itamang (preto/branco), que toca só Luciane
// (coral) e JO (terracota) — cores bem diferentes da dele, então lê como
// "card colorido do lado do card P&B", não como "dois cards pretos
// repetidos". O que não pode de jeito nenhum é Itamang encostar no BM
// (também preto) — aí sim pareceriam a mesma marca duplicada.
//
// Os nomes de arquivo com hash (.xxxxxxxx.webp) são propositais: os headers
// em next.config.ts cacheiam /portfolio-media/ por 1 ano como `immutable`.
// Sobrescrever o mesmo nome não invalida o cache do navegador nem da CDN —
// o arquivo muda no servidor, mas quem já visitou continua vendo o antigo.
// Trocar o nome força uma URL nova, sem cache pra brigar. Sempre que um
// destes arquivos for re-editado, gerar um hash novo (sha1 dos primeiros
// bytes, 8 caracteres) em vez de sobrescrever o mesmo arquivo.
export const identities = [
  // fundo escuro (roxo norte, a própria cor da marca) — wordmark claro
  {
    slug: 'eixo-de-marca',
    name: 'Eixo de Marca',
    src: '/portfolio-media/marca-eixo.ab7dfce5.webp',
    alt: 'Eixo de Marca',
    accent: '#28112e',
  },
  { slug: 'espaco-dos-anjos', name: 'Espaço dos Anjos', src: '/portfolio-media/marca-espaco-dos-anjos.webp', alt: 'Espaço dos Anjos', accent: '#b8879a' },
  { slug: 'vista-bajeko', name: 'Vista Bajeko', src: '/portfolio-media/marca-vista-bajeko.webp', alt: 'Vista Bajeko', accent: '#0b4a5c' },
  { slug: 'laura-anjos', name: 'Laura Anjos', src: '/portfolio-media/marca-laura-anjos.webp', alt: 'Laura Anjos', accent: '#caa153' },
  // Manual fechado em 29/08/2026. Card montado em 1080x1440 — o 3:4 exato do
  // carrossel — com a logo aparada até o lettering: o PNG de origem tinha
  // margem demais e a marca saía boiando no cartão.
  {
    slug: 'jo-salao-de-beleza',
    name: 'JO Salão de Beleza',
    src: '/portfolio-media/marca-jo-salao-de-beleza.webp',
    alt: 'JO Salão de Beleza',
    accent: '#922b1a',
  },
  { slug: 'viva-angra', name: 'Viva Angra', src: '/portfolio-media/marca-viva-angra.webp', alt: 'Viva Angra', accent: '#2f7d6b' },
  { slug: 'bm', name: 'BIG', src: '/portfolio-media/marca-bm.webp', alt: 'BIG', accent: '#da2d3a' },
  // Kit fechado em set/2026: wordmark + símbolo (o W dentro do tênis) +
  // mascote 3D, em navy (#000e29) e roxo (#682898). Card usa a versão
  // COLORIDA oficial (não a branca-em-negativo que estava antes) — o desenho
  // do tênis depende do fundo claro pra funcionar, então foi pro papel.
  {
    slug: 'well-calcados',
    name: 'Well Calçados',
    src: '/portfolio-media/marca-well-calcados.8561f7cc.webp',
    alt: 'Well Calçados',
    accent: '#682898',
  },
  { slug: 'luciane-judice', name: 'Luciane Júdice', src: '/portfolio-media/marca-luciane-judice.webp', alt: 'Luciane Júdice', accent: '#8b4bc8' },
  // Arquivo ORIGINAL do card (preto com contorno branco), restaurado do git
  // (commit efa362cf) a pedido do usuário. Duas tentativas minhas de
  // "melhorar" — positivo sobre papel e branco sólido sobre preto — eram
  // desenhos diferentes do que ele queria; o pedido era o de antes, byte
  // a byte. Nome com hash pra furar o cache immutable de /portfolio-media/.
  {
    slug: 'itamang',
    name: 'Itamang',
    src: '/portfolio-media/marca-itamang.f47834c8.webp',
    alt: 'Itamang',
    accent: '#3a5a8c',
  },
] as const

export const marks = identities.map(({ src, alt }) => ({ src, alt }))

// ─────────────────────────────────────────────────────────────────────────────
// Artes agrupadas por cliente.
//
// A home mostra um card por CLIENTE (não por peça) e o clique leva a
// /portfolio/artes/[slug], que reúne tudo o que fizemos pra aquela marca.
// Agrupar aqui é o que funde as duplicatas: "Eixo de Marca" e "Laura Anjos"
// aparecem duas vezes em `projects` e viravam dois cards iguais na home.
//
// Pra adicionar arte nova: basta acrescentar em `projects` com o mesmo
// `client` — ela entra na página daquele cliente sozinha, sem mexer aqui.

export type Project = (typeof projects)[number]

export type ArtClient = {
  slug: string
  name: string
  /** tags da primeira peça, usada como categoria do card */
  tags: string
  cover: string
  coverAlt: string
  items: Project[]
}

/** "Di Casa Açaí" -> "di-casa-acai" */
export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const artClients: ArtClient[] = (() => {
  const porSlug = new Map<string, ArtClient>()

  for (const project of projects) {
    const slug = slugify(project.client)
    const existente = porSlug.get(slug)
    if (existente) {
      existente.items.push(project)
      continue
    }
    porSlug.set(slug, {
      slug,
      name: project.client,
      tags: project.tags,
      cover: project.src,
      coverAlt: project.alt,
      items: [project],
    })
  }

  return [...porSlug.values()]
})()

export function artClientBySlug(slug: string) {
  return artClients.find((client) => client.slug === slug)
}
