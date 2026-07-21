import type { GuidesModule } from "./types";

const PUBLISHED = "2026-01-15";
const MODIFIED = "2026-07-21";

export const guidesPtBr: GuidesModule = {
  ui: {
    eyebrow: "Guias",
    hubTitle: "Como parar de apostar — guias práticos",
    hubDescription:
      "Guias diretos e sem julgamento sobre como parar de apostar, bloquear sites de apostas no iPhone e recuperar seu tempo e seu dinheiro.",
    breadcrumbHome: "Início",
    breadcrumbGuides: "Guias",
    tldrHeading: "Resposta rápida",
    faqHeading: "Perguntas frequentes",
    relatedHeading: "Continue lendo",
    backToGuides: "Todos os guias",
    updatedLabel: "Atualizado",
    minRead: "min de leitura",
    disclaimer:
      "O BetClear é um bloqueador de sites de apostas, não um serviço médico. Se você precisar de apoio clínico ou de crise, procure um profissional qualificado ou uma linha de apoio ao jogador.",
    readMore: "Ler guia",
  },
  guides: {
    "stop-gambling": {
      slug: "como-parar-de-apostar",
      cardTitle: "Como parar de apostar",
      title: "Como parar de apostar? Um guia prático passo a passo",
      description:
        "Um guia prático para parar de apostar online: tire o acesso fácil, bloqueie sites de apostas, controle a vontade e busque apoio que realmente ajuda.",
      keywords: [
        "como parar de apostar",
        "como parar de apostar na bet",
        "como parar de apostar online",
        "como sair do vício em apostas",
        "parar de apostar de vez",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Você não precisa só de força de vontade. Você precisa de menos chances de fazer a próxima aposta.",
      tldr: [
        "Tire o acesso fácil primeiro: bloqueie sites de apostas em todos os dispositivos para que a próxima aposta fique mais difícil de alcançar.",
        "Corte o caminho do dinheiro: desative depósitos no cartão, peça o bloqueio de apostas no banco e remova os cartões salvos.",
        "Tenha um plano para a vontade: o impulso sobe e passa, geralmente em 15 a 30 minutos. Adie e se distraia.",
        "Busque apoio: conte para alguém de confiança e use uma linha de apoio ou a autoexclusão.",
      ],
      sections: [
        {
          heading: "1. Deixe as apostas mais difíceis de alcançar",
          body: [
            "O passo mais eficaz é criar atrito entre a vontade e a aposta. Quando o site de apostas abre em um toque, a decisão acontece em segundos. Quando ele simplesmente não carrega, você ganha tempo para pensar.",
            "Bloqueie os sites de apostas no nível do DNS, para que o bloqueio valha no Safari e em outros apps, não só em um navegador. No iPhone, uma ferramenta como o BetClear instala um perfil de configuração que bloqueia domínios de apostas conhecidos em todo o aparelho e se atualiza sozinho.",
          ],
        },
        {
          heading: "2. Feche os caminhos do dinheiro",
          body: [
            "O acesso é só metade do problema — o dinheiro é a outra metade. Remover os caminhos rápidos de depósito cria a mesma pausa que bloquear os sites.",
          ],
          bullets: [
            "Peça ao seu banco para ativar o bloqueio de transações de apostas (muitos bancos oferecem isso gratuitamente).",
            "Apague os cartões salvos das contas de apostas e dos navegadores.",
            "Defina um limite de gastos ou mova o dinheiro para uma conta que você não acessa na hora.",
          ],
        },
        {
          heading: "3. Atravesse a vontade",
          body: [
            "A fissura parece permanente, mas não é. A maioria dos impulsos sobe, chega ao pico e passa em 15 a 30 minutos. Seu objetivo não é vencer uma briga — é durar mais que ela.",
            "Tenha duas ou três ações prontas: saia do ambiente, ligue para um amigo, caminhe ou abra algo que você já escolheu como distração. A ideia é se manter ocupado enquanto o impulso passa.",
          ],
        },
        {
          heading: "4. Conte para alguém e busque apoio",
          body: [
            "O segredo mantém a aposta viva. Contar para uma pessoa de confiança transforma uma batalha privada em algo compartilhado e torna a recaída mais difícil de esconder.",
            "Existe apoio gratuito e sigiloso no Brasil e em vários países. Linhas de ajuda, grupos como os Jogadores Anônimos e a autoexclusão são eficazes e gratuitos.",
          ],
        },
      ],
      faq: [
        {
          question: "Dá para parar de apostar sozinho?",
          answer:
            "Muitas pessoas reduzem ou param de apostar com passos de autoajuda, como bloquear sites, pedir bloqueio no banco e criar novas rotinas. Se as apostas estão afetando suas finanças, relações ou saúde mental, procure uma linha de apoio ou um profissional — o apoio aumenta muito as chances de sucesso.",
        },
        {
          question: "Qual é a forma mais rápida de parar de apostar online?",
          answer:
            "Tire o acesso na hora. Bloqueie os sites de apostas no celular e no computador, peça o bloqueio de apostas no banco e apague os cartões salvos. Isso cria um intervalo entre a vontade e a aposta enquanto você constrói um apoio de longo prazo.",
        },
        {
          question: "Quanto tempo dura a vontade de apostar?",
          answer:
            "A maioria dos impulsos chega ao pico e passa em 15 a 30 minutos. Adiar a decisão e se distrair costuma ser suficiente para atravessar uma fissura sem agir sobre ela.",
        },
      ],
      cta: {
        title: "Bloqueie a próxima aposta antes que ela comece",
        body: "O BetClear bloqueia mais de 348.000 sites de apostas no seu iPhone, para que a vontade não tenha para onde ir. Instale uma vez e fique protegido automaticamente.",
        button: "Ativar proteção grátis",
      },
      related: ["block-iphone", "betting-games", "get-help"],
    },
    "block-iphone": {
      slug: "como-bloquear-sites-de-apostas-no-iphone",
      cardTitle: "Bloquear apostas no iPhone",
      title: "Como bloquear sites de apostas no iPhone (Safari e apps)",
      description:
        "Passo a passo para bloquear sites de apostas e bets no iPhone, no Safari e nos apps — com o Tempo de Uso e um bloqueador de DNS que cobre todo o aparelho e se atualiza sozinho.",
      keywords: [
        "como bloquear sites de apostas no iphone",
        "bloquear sites de apostas iphone",
        "bloquear apps de apostas",
        "bloquear bet365 iphone",
        "como bloquear bets no iphone",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Bloqueie as bets em todo o iPhone — não só em um navegador.",
      tldr: [
        "Mais rápido e completo: instale um bloqueador de DNS para todo o aparelho, como o BetClear, que bloqueia domínios de apostas conhecidos no Safari e nos apps e se atualiza sozinho.",
        "Opção nativa: em Tempo de Uso > Restrições de Conteúdo e Privacidade você pode limitar sites adultos e adicionar bets específicas, mas precisa listar cada site manualmente.",
        "Bloqueadores só de navegador não pegam os apps e são fáceis de burlar — prefira o bloqueio por DNS em todo o aparelho.",
      ],
      sections: [
        {
          heading: "Opção 1: um bloqueador para todo o aparelho (recomendado)",
          body: [
            "A forma mais confiável de bloquear apostas no iPhone é no nível do DNS, que vale no Safari e em qualquer app que use o DNS do sistema. Você não precisa manter uma lista nem iniciar uma sessão a cada vez.",
            "O BetClear instala um perfil de configuração da Apple que aponta o iPhone para um DNS criptografado e bloqueia mais de 348.000 domínios de apostas conhecidos. A lista é atualizada de forma central, então novas bets são cobertas sem reinstalar.",
          ],
          bullets: [
            "Funciona no Safari e em apps compatíveis, não em um só navegador.",
            "Sempre ativo — sem sessão para iniciar.",
            "A lista se atualiza sozinha conforme surgem novos domínios de apostas.",
          ],
        },
        {
          heading: "Opção 2: Tempo de Uso (nativo do iOS)",
          body: [
            "O iOS tem uma restrição gratuita que você pode usar para bloquear sites adultos e sites específicos.",
          ],
          bullets: [
            "Abra Ajustes > Tempo de Uso > Restrições de Conteúdo e Privacidade.",
            "Ative as Restrições, toque em Restrições de Conteúdo > Conteúdo da Web.",
            "Escolha 'Limitar Sites Adultos' e adicione as bets em 'Nunca Permitir'.",
            "Defina um código do Tempo de Uso que outra pessoa guarde, para você não desfazer na hora.",
          ],
        },
        {
          heading: "Por que extensões de navegador não bastam",
          body: [
            "Bloqueadores que só funcionam em um navegador deixam os apps de apostas e outros navegadores totalmente abertos, e costumam estar a poucos toques de serem desligados. Para apostas, o bloqueio por DNS em todo o aparelho é muito mais difícil de burlar num momento de tentação.",
          ],
        },
      ],
      faq: [
        {
          question: "O BetClear também bloqueia apps de apostas?",
          answer:
            "O BetClear bloqueia por domínio, então apps que carregam conteúdo por domínios de apostas bloqueados costumam parar de funcionar. Os apps da App Store não são removidos do aparelho, mas as conexões de apostas deles podem ser bloqueadas.",
        },
        {
          question: "Bloquear as bets deixa o iPhone mais lento?",
          answer:
            "Não. O bloqueio por DNS apenas se recusa a resolver os domínios de apostas. Sites e apps do dia a dia continuam funcionando normalmente.",
        },
        {
          question: "Dá para bloquear bets de graça no iPhone?",
          answer:
            "Sim, o Tempo de Uso é gratuito, mas exige adicionar cada site manualmente e é mais fácil de burlar. Um bloqueador dedicado como o BetClear cobre centenas de milhares de domínios automaticamente e se atualiza com o tempo.",
        },
      ],
      cta: {
        title: "Bloqueie as bets em todo o seu iPhone",
        body: "O BetClear bloqueia mais de 348.000 sites de apostas no Safari e nos apps usando DNS criptografado. A instalação guiada leva poucos minutos.",
        button: "Ativar proteção grátis",
      },
      related: ["stop-gambling", "betting-games", "self-exclusion"],
    },
    "betting-games": {
      slug: "como-parar-de-jogar-tigrinho-aviator",
      cardTitle: "Parar com Tigrinho e Aviator",
      title: "Como parar de jogar no Tigrinho, Aviator e outras bets",
      description:
        "Como parar de jogar no Jogo do Tigrinho, Aviator e apps de apostas: bloqueie os sites, corte as notificações, tire o dinheiro e mude a rotina que puxa para a aposta.",
      keywords: [
        "como parar de jogar no tigrinho",
        "como parar de jogar aviator",
        "parar de jogar no tigrinho",
        "vício em jogo do tigrinho",
        "como parar de jogar nas bets",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "O Tigrinho e o Aviator são feitos para prender. Quebrar o ciclo começa tirando o caminho de um toque até a aposta.",
      tldr: [
        "Bloqueie os sites e apps das bets no celular para que o Tigrinho e o Aviator não carreguem.",
        "Desative todas as notificações de apostas e pare de seguir grupos e 'dicas' de bets.",
        "Corte o caminho do dinheiro: bloqueio de apostas no banco e cartões salvos apagados.",
        "Mude a rotina dos gatilhos — tédio, madrugada e grupos de WhatsApp são os mais comuns.",
      ],
      sections: [
        {
          heading: "Por que o Tigrinho e o Aviator viciam tanto",
          body: [
            "Jogos como o Fortune Tiger (o 'Jogo do Tigrinho') e o Aviator são desenhados para dar recompensas rápidas e imprevisíveis, com rodadas de poucos segundos e a sensação de que a próxima é a boa. As quase-vitórias e os bônus mantêm você jogando muito depois do que planejou.",
            "Como o ciclo é curtíssimo e o app está sempre no bolso, força de vontade sozinha raramente basta. O que funciona é tornar o jogo indisponível.",
          ],
        },
        {
          heading: "Corte o acesso rápido",
          bullets: [
            "Bloqueie os sites de apostas em todo o aparelho para que o Tigrinho e o Aviator não abram.",
            "Apague os apps de bets e desligue completamente as notificações.",
            "Saia de grupos de 'sinais', 'dicas' e telegram de apostas.",
          ],
        },
        {
          heading: "Cuide dos gatilhos",
          body: [
            "Repare quando a vontade aparece — normalmente na madrugada, no tédio ou depois de ver alguém ganhando. Tenha uma resposta pronta para esses momentos: dormir, sair do quarto, chamar alguém. Trocar a rotina que puxa para a aposta é tão importante quanto bloquear o jogo.",
          ],
        },
      ],
      faq: [
        {
          question: "Como parar de jogar no Jogo do Tigrinho?",
          answer:
            "Bloqueie os sites e apps de apostas no celular para o jogo não abrir, desligue as notificações, peça o bloqueio de apostas no banco e saia dos grupos de 'sinais'. Se sentir que perdeu o controle, procure uma linha de apoio ao jogador.",
        },
        {
          question: "O Aviator e o Tigrinho são feitos para viciar?",
          answer:
            "Esses jogos usam rodadas rápidas, recompensas imprevisíveis, quase-vitórias e bônus para maximizar o tempo de jogo. Por isso, remover o app e bloquear os sites funciona melhor do que depender do autocontrole na hora.",
        },
      ],
      cta: {
        title: "Deixe o Tigrinho e o Aviator impossíveis de abrir",
        body: "O BetClear bloqueia os sites de apostas no seu iPhone, então esses jogos simplesmente não carregam. Instale uma vez e fique protegido.",
        button: "Ativar proteção grátis",
      },
      related: ["block-iphone", "stop-gambling", "addiction-signs"],
    },
    "addiction-signs": {
      slug: "sinais-de-vicio-em-apostas",
      cardTitle: "Sinais de vício em apostas",
      title: "Sinais de vício em apostas: como saber a hora de parar",
      description:
        "Os sinais comuns de vício em apostas — correr atrás do prejuízo, esconder apostas, pegar dinheiro emprestado — e o que fazer se você reconhecer isso em você ou em alguém.",
      keywords: [
        "sinais de vício em apostas",
        "sintomas de vício em apostas",
        "sou viciado em apostas",
        "vício em apostas sinais",
        "como saber se tenho vício em apostas",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Um problema com apostas não é sobre quanto você aposta — é sobre o controle que você perdeu.",
      tldr: [
        "Sinais de alerta incluem correr atrás do prejuízo, apostar mais para sentir a mesma emoção e não conseguir parar.",
        "Esconder as apostas, mentir sobre elas ou pegar dinheiro emprestado para apostar são sinais fortes.",
        "Se as apostas estão prejudicando seu dinheiro, suas relações, seu trabalho ou seu humor, é hora de agir — não importa o valor.",
      ],
      sections: [
        {
          heading: "Sinais comuns de um problema com apostas",
          bullets: [
            "Correr atrás do prejuízo — apostar mais para recuperar o que perdeu.",
            "Precisar apostar valores maiores para sentir a mesma emoção.",
            "Tentar diminuir ou parar e não conseguir.",
            "Ficar inquieto ou irritado quando não pode apostar.",
            "Apostar para fugir do estresse, do tédio ou da tristeza.",
            "Mentir para a família ou os amigos sobre o quanto aposta.",
            "Pegar dinheiro emprestado, vender coisas ou atrasar contas para apostar.",
            "Apostar por mais tempo ou gastar mais do que pretendia.",
          ],
        },
        {
          heading: "Não é sobre o valor",
          body: [
            "As pessoas costumam dizer que não têm problema porque não apostam 'tanto assim'. Mas o vício em apostas se define pela perda de controle e pelo prejuízo, não por um valor específico. Se está custando seu sono, dinheiro que falta ou a confiança de quem você ama, o valor é o de menos.",
          ],
        },
        {
          heading: "O que fazer se você reconhece os sinais",
          body: [
            "Reconhecer o padrão é a parte difícil — e você já fez isso. Os próximos passos são práticos: tire o acesso, tire o caminho do dinheiro e conte para alguém.",
          ],
          bullets: [
            "Bloqueie os sites de apostas no celular para quebrar o hábito automático.",
            "Peça ao banco o bloqueio de transações de apostas.",
            "Fale com uma linha de apoio ou com alguém de confiança — você não precisa chegar ao fundo do poço primeiro.",
          ],
        },
      ],
      faq: [
        {
          question: "Sou viciado em apostas?",
          answer:
            "Se você já tentou parar e não conseguiu, corre atrás do prejuízo, esconde suas apostas ou elas estão prejudicando suas finanças ou relações, esses são sinais reconhecidos de vício em apostas. Uma linha de apoio ou uma autoavaliação curta podem ajudar a entender sua situação.",
        },
        {
          question: "Dá para ter vício em apostas sem apostar valores altos?",
          answer:
            "Sim. O vício em apostas é sobre a perda de controle e o prejuízo que causa, não sobre o tamanho das apostas. Apostas pequenas e frequentes também podem prejudicar suas finanças, seu humor e suas relações.",
        },
      ],
      cta: {
        title: "Crie uma barreira entre você e a próxima aposta",
        body: "Se você vê os sinais, deixe as apostas mais difíceis de alcançar hoje. O BetClear bloqueia mais de 348.000 sites de apostas no seu iPhone.",
        button: "Ativar proteção grátis",
      },
      related: ["stop-gambling", "get-help", "self-exclusion"],
    },
    "self-exclusion": {
      slug: "autoexclusao-apostas",
      cardTitle: "Autoexclusão de apostas",
      title: "Autoexclusão de apostas: como funciona e como fazer",
      description:
        "O que é a autoexclusão de apostas, como pedir o bloqueio da sua conta nas bets e como combinar a autoexclusão com o bloqueio no aparelho para uma proteção mais forte.",
      keywords: [
        "autoexclusão apostas",
        "como me autoexcluir das bets",
        "autoexclusão bets",
        "bloquear minha conta de apostas",
        "autoexclusão jogos de azar",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "A autoexclusão pede que as bets fechem sua conta. O bloqueio no aparelho garante que elas não te alcancem.",
      tldr: [
        "A autoexclusão é um pedido às casas de apostas para bloquear sua conta e parar de te enviar propaganda por um período.",
        "No Brasil, as bets regulamentadas devem oferecer autoexclusão pelo próprio site ou app.",
        "A autoexclusão não cobre sites irregulares nem o seu navegar — combine-a com um bloqueador no aparelho para cobertura total.",
      ],
      sections: [
        {
          heading: "O que é autoexclusão?",
          body: [
            "A autoexclusão é um pedido formal para que as empresas de apostas fechem ou congelem sua conta e parem de te enviar promoções por um período escolhido. Durante esse tempo, as casas regulamentadas devem recusar suas apostas.",
          ],
        },
        {
          heading: "Como se autoexcluir",
          bullets: [
            "Use a opção de autoexclusão dentro das configurações de jogo responsável de cada bet que você usa.",
            "Peça o período mais longo disponível — quanto maior, melhor a proteção.",
            "Verifique se a casa é regulamentada; sites irregulares podem não respeitar o pedido.",
          ],
        },
        {
          heading: "A brecha que a autoexclusão deixa — e como fechá-la",
          body: [
            "A autoexclusão é poderosa, mas não é completa. Ela depende de a casa respeitar o pedido, não cobre sites irregulares ou estrangeiros e não impede você de navegar até novos. Por isso o bloqueio no aparelho importa: ele impede o site de carregar já de início.",
            "Combinar a autoexclusão com um bloqueador como o BetClear significa que a conta está fechada e o site nem abre — proteção em duas frentes.",
          ],
        },
      ],
      faq: [
        {
          question: "A autoexclusão bloqueia todas as bets?",
          answer:
            "Não. A autoexclusão cobre as casas ou o esquema em que você se cadastrou, geralmente sites regulamentados. Sites irregulares ou estrangeiros podem não estar incluídos, por isso combinar com um bloqueador no aparelho é recomendado.",
        },
        {
          question: "Dá para desfazer a autoexclusão?",
          answer:
            "A maioria dos esquemas define um período mínimo que não pode ser cancelado antes, seguido de uma etapa de espera antes de você poder apostar de novo. Esse atrito proposital faz parte do que torna a autoexclusão eficaz.",
        },
      ],
      cta: {
        title: "Reforce a autoexclusão com um bloqueio de verdade",
        body: "O BetClear impede que os sites de apostas carreguem no seu iPhone, até os que a autoexclusão não alcança.",
        button: "Ativar proteção grátis",
      },
      related: ["block-iphone", "stop-gambling", "get-help"],
    },
    "get-help": {
      slug: "onde-buscar-ajuda-apostas",
      cardTitle: "Onde buscar ajuda",
      title: "Onde buscar ajuda para o vício em apostas: apoio gratuito",
      description:
        "Apoio gratuito e sigiloso para o vício em apostas: linhas de ajuda, grupos como os Jogadores Anônimos e passos práticos que você pode dar hoje para reduzir o dano.",
      keywords: [
        "ajuda para vício em apostas",
        "onde buscar ajuda apostas",
        "linha de apoio ao jogador",
        "ajuda para parar de apostar",
        "jogadores anônimos",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Você não precisa resolver isso sozinho, e pedir ajuda não é o último recurso.",
      tldr: [
        "Linhas de apoio e grupos gratuitos e sigilosos existem no Brasil e em vários países — você pode procurar de forma anônima.",
        "Os Jogadores Anônimos e grupos parecidos oferecem apoio com pessoas que entendem o que você vive.",
        "A redução de danos prática — bloquear sites, bloqueio no banco, autoexclusão — funciona melhor junto com o apoio.",
      ],
      sections: [
        {
          heading: "Apoio gratuito que você pode usar hoje",
          bullets: [
            "Jogadores Anônimos (jogadoresanonimos.com.br) — grupos de apoio no Brasil.",
            "CVV — 188 — apoio emocional gratuito e sigiloso, 24 horas.",
            "BeGambleAware (begambleaware.org) — orientação e linha de apoio gratuita.",
            "Seu médico ou um psicólogo — o apoio ao jogo é parte reconhecida do cuidado com a saúde mental.",
          ],
        },
        {
          heading: "Para amigos e familiares",
          body: [
            "Se você está preocupado com outra pessoa, também pode buscar apoio. Fale sem julgar, foque no comportamento e no impacto em vez da culpa, e incentive a busca por ajuda em vez de tentar controlar o dinheiro dela para sempre.",
          ],
        },
        {
          heading: "Combine apoio com bloqueios práticos",
          body: [
            "O apoio ajuda você a entender e mudar o comportamento; as ferramentas de bloqueio tiram a oportunidade enquanto isso acontece. Usar os dois juntos é muito mais eficaz do que qualquer um sozinho.",
          ],
        },
      ],
      faq: [
        {
          question: "O apoio para apostas é mesmo gratuito e sigiloso?",
          answer:
            "Sim. Linhas de apoio, o CVV (188) e grupos como os Jogadores Anônimos são gratuitos e sigilosos. Você pode procurar muitos deles de forma anônima, sem informar seus dados.",
        },
        {
          question: "E se eu ainda não estiver pronto para falar com alguém?",
          answer:
            "Você ainda pode agir hoje. Bloquear os sites de apostas no celular, pedir o bloqueio no banco e se autoexcluir reduzem o dano na hora e podem ser um primeiro passo antes de buscar apoio.",
        },
      ],
      cta: {
        title: "Dê um passo prático agora",
        body: "Enquanto decide sobre o apoio, tire o acesso fácil. O BetClear bloqueia mais de 348.000 sites de apostas no seu iPhone.",
        button: "Ativar proteção grátis",
      },
      related: ["stop-gambling", "addiction-signs", "self-exclusion"],
    },
  },
};
