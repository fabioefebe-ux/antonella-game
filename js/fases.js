/* ========================================================================
   FASES — Conteúdo de todas as fases do jogo da Antonella
   --------------------------------------------------------------------------
   Cada fase tem: id, titulo, icone (emoji do card de seleção) e cenas[].
   As cenas reutilizam os três tipos de mecânica do motor (Fase1):

     tipo "fonico"    -> achar o card que começa com a letra/sílaba
     tipo "arrasta"   -> completar a palavra arrastando a sílaba certa
     tipo "microfone" -> falar o nome do que aparece na tela

   Toda a narração e o design são herdados do motor, sem mudanças.
   Para trocar pelo conteúdo real do livro, edite apenas este arquivo.
   ======================================================================== */

const FASES = [
  // ====================================================================
  // FASE DE ABERTURA — O Jardim (mantida do jogo original)
  // ====================================================================
  {
    id: "jardim",
    titulo: "O JARDIM DA ANTONELLA",
    icone: "🌷",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Era uma manhã de sol no jardim. A Antonella viu uma linda BORBOLETA voando entre as flores coloridas.",
        pista: "B",
        enunciado: "com a letra B",
        cards: [
          { nome: "BORBOLETA", figura: "🦋" },
          { nome: "FLOR", figura: "🌸" },
          { nome: "SOL", figura: "☀️" },
        ],
        correta: "BORBOLETA",
      },
      {
        tipo: "arrasta",
        historia:
          "Perto da lagoa apareceu um bichinho fofo. Vamos completar o nome dele arrastando a sílaba certa!",
        figura: "🐱",
        palavra: "GATO",
        inicio: "",
        lacuna: "GA",
        fim: "TO",
        opcoes: ["GA", "BO", "PA"],
      },
      {
        tipo: "microfone",
        historia:
          "Olha só quem chegou nadando na lagoa! Um bichinho amarelo que faz quá-quá.",
        figura: "🦆",
        resposta: "PATO",
        sinonimos: ["patinho"],
      },
    ],
  },

  // ====================================================================
  // FASE 1 — SONS DA FAZENDA
  // Mecânica: associar a SÍLABA INICIAL ao animal da história.
  // Usamos o tipo "fonico", mas a pista é a sílaba inicial (VA, CA, PA...).
  // ====================================================================
  {
    id: "fazenda",
    titulo: "SONS DA FAZENDA",
    icone: "🐄",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Na fazenda, a Antonella ouviu um MUU bem alto. Era a VACA no curral tomando sol.",
        pista: "VA",
        enunciado: "com o som VA",
        cards: [
          { nome: "VACA", figura: "🐄" },
          { nome: "PORCO", figura: "🐷" },
          { nome: "GALO", figura: "🐓" },
        ],
        correta: "VACA",
      },
      {
        tipo: "fonico",
        historia:
          "De manhã cedinho, um barulho acordou todo mundo: có-có-ri-có! Era o GALO cantando.",
        pista: "GA",
        enunciado: "com o som GA",
        cards: [
          { nome: "GALO", figura: "🐓" },
          { nome: "CAVALO", figura: "🐴" },
          { nome: "OVELHA", figura: "🐑" },
        ],
        correta: "GALO",
      },
      {
        tipo: "fonico",
        historia:
          "Perto do lago, um animalzinho rosa fazia oinc-oinc na lama. Que bichinho engraçado!",
        pista: "PO",
        enunciado: "com o som PO",
        cards: [
          { nome: "PORCO", figura: "🐷" },
          { nome: "PATO", figura: "🦆" },
          { nome: "VACA", figura: "🐄" },
        ],
        correta: "PORCO",
      },
      {
        tipo: "fonico",
        historia:
          "No campo verde, um animal grande e forte corria feliz. Ele faz relincho e adora galopar.",
        pista: "CA",
        enunciado: "com o som CA",
        cards: [
          { nome: "CAVALO", figura: "🐴" },
          { nome: "GALO", figura: "🐓" },
          { nome: "OVELHA", figura: "🐑" },
        ],
        correta: "CAVALO",
      },
    ],
  },

  // ====================================================================
  // FASE 2 — CAÇA ÀS LETRAS
  // Mecânica: encontrar a PRIMEIRA LETRA do nome do personagem.
  // Usamos "fonico": os cards são LETRAS grandes e a resposta é a inicial.
  // ====================================================================
  {
    id: "letras",
    titulo: "CAÇA ÀS LETRAS",
    icone: "🔤",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Nesta história, a estrelinha principal é a ANTONELLA! Vamos achar a primeira letra do nome dela.",
        pista: "A",
        enunciado: "o nome ANTONELLA",
        personagem: true,
        cards: [
          { nome: "A", figura: "🅰️" },
          { nome: "O", figura: "⭕" },
          { nome: "E", figura: "📧" },
        ],
        correta: "A",
      },
      {
        tipo: "fonico",
        historia:
          "O amiguinho dela é o BERNARDO. Qual é a primeira letra do nome BERNARDO?",
        pista: "B",
        enunciado: "o nome BERNARDO",
        personagem: true,
        cards: [
          { nome: "B", figura: "🅱️" },
          { nome: "D", figura: "🇩" },
          { nome: "P", figura: "🅿️" },
        ],
        correta: "B",
      },
      {
        tipo: "fonico",
        historia:
          "A gatinha de estimação se chama MIA. Vamos caçar a primeira letra do nome MIA!",
        pista: "M",
        enunciado: "o nome MIA",
        personagem: true,
        cards: [
          { nome: "M", figura: "Ⓜ️" },
          { nome: "N", figura: "🇳" },
          { nome: "I", figura: "ℹ️" },
        ],
        correta: "M",
      },
      {
        tipo: "fonico",
        historia:
          "E o vovô querido se chama LUCAS. Qual letra começa o nome LUCAS?",
        pista: "L",
        enunciado: "o nome LUCAS",
        personagem: true,
        cards: [
          { nome: "L", figura: "🇱" },
          { nome: "U", figura: "⛎" },
          { nome: "C", figura: "🇨" },
        ],
        correta: "L",
      },
    ],
  },

  // ====================================================================
  // FASE 3 — MONTAR A PALAVRA
  // Mecânica: juntar 2 SÍLABAS GRANDES para formar o nome de fruta/objeto.
  // Usamos "arrasta": a parte fixa é a 2ª sílaba e a lacuna é a 1ª sílaba.
  // ====================================================================
  {
    id: "montar",
    titulo: "MONTAR A PALAVRA",
    icone: "🧩",
    cenas: [
      {
        tipo: "arrasta",
        historia:
          "Na fruteira tinha uma fruta amarela e comprida. Arraste a sílaba para formar a palavra BANANA!",
        figura: "🍌",
        palavra: "BANANA",
        inicio: "",
        lacuna: "BA",
        fim: "NANA",
        opcoes: ["BA", "CA", "MA"],
      },
      {
        tipo: "arrasta",
        historia:
          "Uma fruta bem redonda e laranja rolou da cesta. Vamos montar a palavra LARANJA!",
        figura: "🍊",
        palavra: "LARANJA",
        inicio: "",
        lacuna: "LA",
        fim: "RANJA",
        opcoes: ["LA", "RA", "SA"],
      },
      {
        tipo: "arrasta",
        historia:
          "Do lado da fruteira tinha um brinquedo redondo de pular. Monte a palavra BOLA!",
        figura: "⚽",
        palavra: "BOLA",
        inicio: "",
        lacuna: "BO",
        fim: "LA",
        opcoes: ["BO", "LO", "PO"],
      },
      {
        tipo: "arrasta",
        historia:
          "Por último, uma frutinha vermelha e docinha. Vamos formar a palavra UVA!",
        figura: "🍇",
        palavra: "UVA",
        inicio: "",
        lacuna: "U",
        fim: "VA",
        opcoes: ["U", "O", "A"],
      },
    ],
  },

  // ====================================================================
  // FASE 4 — GATO, RATO E PATO
  // Baseada na atividade do livro. As três palavras RIMAM (terminam em
  // "-ATO"), então a criança treina justamente o SOM INICIAL diferente:
  // G de GATO, R de RATO, P de PATO. Fecha falando o nome de um deles.
  // ====================================================================
  {
    id: "gato-rato-pato",
    titulo: "GATO, RATO E PATO",
    icone: "🐱",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "A história tem três amigos que rimam: o GATO, o RATO e o PATO! Primeiro, vamos achar o GATO, que faz miau.",
        pista: "G",
        enunciado: "com a letra G",
        cards: [
          { nome: "GATO", figura: "🐱" },
          { nome: "RATO", figura: "🐭" },
          { nome: "PATO", figura: "🦆" },
        ],
        correta: "GATO",
      },
      {
        tipo: "fonico",
        historia:
          "O GATO saiu correndo atrás de um bichinho pequeno e cinza que adora queijo. Ache o RATO!",
        pista: "R",
        enunciado: "com a letra R",
        cards: [
          { nome: "RATO", figura: "🐭" },
          { nome: "PATO", figura: "🦆" },
          { nome: "GATO", figura: "🐱" },
        ],
        correta: "RATO",
      },
      {
        tipo: "arrasta",
        historia:
          "Chegou nadando na lagoa o amigo amarelo que faz quá-quá. Vamos montar o nome dele: PATO!",
        figura: "🦆",
        palavra: "PATO",
        inicio: "",
        lacuna: "PA",
        fim: "TO",
        opcoes: ["PA", "GA", "RA"],
      },
      {
        tipo: "microfone",
        historia:
          "Os três amigos ficaram juntos: gato, rato e pato! Agora fale o nome do bichinho que faz miau.",
        figura: "🐱",
        resposta: "GATO",
        sinonimos: ["gatinho", "gata"],
      },
    ],
  },

  // ====================================================================
  // FASE 5 — O TÍTULO E MEU NOME
  // Baseada na página do livro: primeiro reconhecer o SINAL DE PERGUNTA (?)
  // do título "RATOS GOSTAM DE QUEIJO?", depois montar o próprio nome
  // ANTONELLA sílaba por sílaba (AN-TO-NE-LA). Montar o próprio nome é um
  // reforço afetivo forte para a criança.
  //
  // Observação sobre o "arrasta": o motor tem UMA lacuna por cena. Então
  // montamos o nome em ETAPAS — cada cena preenche uma sílaba e mostra as
  // anteriores já no lugar (campo "inicio") para o nome ir aparecendo.
  // ====================================================================
  {
    id: "meu-nome",
    titulo: "O TÍTULO E MEU NOME",
    icone: "🔤",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "O título da história é uma pergunta: RATOS GOSTAM DE QUEIJO? Toda pergunta termina com um sinalzinho especial. Vamos achar o SINAL DE PERGUNTA!",
        // Enunciado e narração livres: a frase padrão "ache o que começa"
        // não serve para pontuação.
        enunciadoLivre: "ACHE O SINAL DE PERGUNTA",
        narracaoDesafio:
          "Ache o sinal de pergunta, " + "Antonella" + ". É o que usamos quando perguntamos alguma coisa.",
        cards: [
          { nome: "?", figura: "❓" },
          { nome: "!", figura: "❗" },
          { nome: ".", figura: "🔵" },
        ],
        correta: "?",
      },
      {
        tipo: "arrasta",
        historia:
          "Agora vamos escrever o seu nome, sílaba por sílaba! Comece montando a primeira parte: AN.",
        figura: "🌟",
        palavra: "ANTONELLA",
        inicio: "",
        lacuna: "AN",
        fim: "TONELA",
        opcoes: ["AN", "TO", "LA"],
      },
      {
        tipo: "arrasta",
        historia:
          "Muito bem! Agora a segunda parte do seu nome: TO.",
        figura: "🌟",
        palavra: "ANTONELLA",
        inicio: "AN",
        lacuna: "TO",
        fim: "NELA",
        opcoes: ["TO", "NE", "AN"],
      },
      {
        tipo: "arrasta",
        historia:
          "Está quase lá! A terceira parte é: NE.",
        figura: "🌟",
        palavra: "ANTONELLA",
        inicio: "ANTO",
        lacuna: "NE",
        fim: "LLA",
        opcoes: ["NE", "LLA", "TO"],
      },
      {
        tipo: "arrasta",
        historia:
          "A última parte para completar o seu nome: LLA. Você vai escrever ANTONELLA inteiro!",
        figura: "🌟",
        palavra: "ANTONELLA",
        inicio: "ANTONE",
        lacuna: "LLA",
        fim: "",
        opcoes: ["LLA", "NE", "AN"],
      },
    ],
  },
];
