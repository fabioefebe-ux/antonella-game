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
];
