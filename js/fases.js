/* ========================================================================
   FASES — Conteúdo de todas as fases do jogo da Antonella
   --------------------------------------------------------------------------
   Cada fase tem: id, titulo, icone (emoji do card de seleção) e cenas[].
   As cenas reutilizam os tipos de mecânica do motor (Fase1):

     tipo "fonico"    -> achar o card que começa com a letra/sílaba
     tipo "arrasta"   -> completar a palavra arrastando a sílaba certa
     tipo "microfone" -> falar o nome do que aparece na tela
     tipo "contar"    -> escolher quantas sílabas tem a palavra
     tipo "parear"    -> achar a mesma palavra em MAIÚSCULA/minúscula
     tipo "sinonimo"  -> achar a palavra que quer dizer o mesmo
     tipo "tamanho"   -> achar a palavra escrita grande ou pequena
     tipo "separar"   -> achar onde fica o espaço entre palavras grudadas

   ORDEM DAS FASES = progressão de dificuldade (do mais concreto ao mais
   abstrato). O número no card de seleção vem da POSIÇÃO no array (a 1ª é a
   estrela ★). Para mudar a ordem, basta reordenar os blocos abaixo.

     NÍVEL 1 — Sons e letras iniciais (muito apoio visual)
       1. O Jardim da Antonella
       2. Gato, Rato e Pato
       3. Maluquinhos por Bicho
       4. Como Ele Se Sente? (emoções)
       5. Que Som É Esse? (onomatopeias)
       6. Sons da Fazenda
       7. Caça às Letras
     NÍVEL 2 — Sílabas: contar e montar
       8. Sílabas Sonoras
       9. Quantas Sílabas?
       10. Brincando com Sílabas
       11. Montar a Palavra
       12. O Título e Meu Nome
     NÍVEL 3 — Percepção do texto (tipo, tamanho, espaço)
       13. Tipos de Letras
       14. Grande ou Pequeno?
       15. Cadê o Espaço?
     NÍVEL 4 — Revisão e vocabulário (mais abstrato)
       16. O Ratinho Esperto (revisão: usa várias mecânicas)
       17. Palavras Amigas (sinônimos)

   Toda a narração e o design são herdados do motor, sem mudanças.
   Para trocar pelo conteúdo real do livro, edite apenas este arquivo.
   ======================================================================== */

const FASES = [
  // ====================================================================
  // NÍVEL 1 · FASE 1 — O JARDIM DA ANTONELLA (abertura)
  // Introdução suave: som inicial, um montar e um falar.
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
  // NÍVEL 1 · FASE 2 — GATO, RATO E PATO
  // Som INICIAL diferente em palavras que rimam (G, R, P). Fecha falando.
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
  // NÍVEL 1 · FASE 3 — MALUQUINHOS POR BICHO
  // Baseada na história em quadrinhos do livro: um GATO mantém os ratos
  // longe de casa. Os personagens são dois gatos, RAMIRO e GATURRO. A fase
  // trabalha som/letra inicial e montar os nomes, no tema gato x rato.
  // ====================================================================
  {
    id: "maluquinhos-por-bicho",
    titulo: "MALUQUINHOS POR BICHO",
    icone: "😺",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Na historinha, quem espanta os ratos de casa é o GATO! Vamos achar o GATO, que faz miau.",
        pista: "G",
        enunciado: "com a letra G",
        cards: [
          { nome: "GATO", figura: "🐱" },
          { nome: "RATO", figura: "🐭" },
          { nome: "OSSO", figura: "🦴" },
        ],
        correta: "GATO",
      },
      {
        tipo: "fonico",
        historia:
          "Um dos gatos da história se chama RAMIRO. Qual é a primeira letra do nome RAMIRO?",
        pista: "R",
        enunciado: "o nome RAMIRO",
        personagem: true,
        cards: [
          { nome: "R", figura: "🇷" },
          { nome: "M", figura: "Ⓜ️" },
          { nome: "G", figura: "🇬" },
        ],
        correta: "R",
      },
      {
        tipo: "arrasta",
        historia:
          "O outro gato se chama GATURRO. Vamos montar o nome dele arrastando a sílaba certa!",
        figura: "😼",
        palavra: "GATURRO",
        inicio: "",
        lacuna: "GA",
        fim: "TURRO",
        opcoes: ["GA", "RA", "BO"],
      },
      {
        tipo: "fonico",
        historia:
          "Os gatos são famosos por perseguir um bichinho! Qual animal o gato adora correr atrás?",
        enunciadoLivre: "QUAL ANIMAL O GATO PERSEGUE?",
        narracaoDesafio:
          "Qual animal o gato adora perseguir, Antonella? Toque no bichinho certo.",
        cards: [
          { nome: "RATO", figura: "🐭" },
          { nome: "ABELHA", figura: "🐝" },
          { nome: "PASSARINHO", figura: "🐦" },
        ],
        correta: "RATO",
      },
      {
        tipo: "microfone",
        historia:
          "Os dois gatos, Ramiro e Gaturro, adoram fazer barulho! Fale bem alto o nome do bichinho que espanta o rato.",
        figura: "🐱",
        resposta: "GATO",
        sinonimos: ["gatinho", "gata"],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 1 · FASE 4 — COMO ELE SE SENTE?
  // Inspirada nos exercícios de EXPRESSÃO da HQ (o rato apavorado, o gato
  // surpreso...). Reconhecer emoções em rostinhos — habilidade socioemocional
  // valiosa na educação inclusiva. Usa o tipo fonico com enunciado livre:
  // mostra rostos (emojis) e a criança acha o sentimento pedido.
  // ====================================================================
  {
    id: "como-se-sente",
    titulo: "COMO ELE SE SENTE?",
    icone: "😊",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Os rostinhos mostram como a gente se sente! Ache o rostinho que está FELIZ, bem contente.",
        enunciadoLivre: "ACHE QUEM ESTÁ FELIZ",
        narracaoDesafio: "Ache o rostinho feliz, Antonella. Bem contente!",
        cards: [
          { nome: "FELIZ", figura: "😄" },
          { nome: "TRISTE", figura: "😢" },
          { nome: "BRAVO", figura: "😠" },
        ],
        correta: "FELIZ",
      },
      {
        tipo: "fonico",
        historia:
          "Na história, o rato ficou apavorado quando viu o gato! Ache o rostinho que está COM MEDO.",
        enunciadoLivre: "ACHE QUEM ESTÁ COM MEDO",
        narracaoDesafio: "Ache o rostinho com medo, Antonella. Bem assustado!",
        cards: [
          { nome: "COM MEDO", figura: "😱" },
          { nome: "FELIZ", figura: "😄" },
          { nome: "SURPRESO", figura: "😮" },
        ],
        correta: "COM MEDO",
      },
      {
        tipo: "fonico",
        historia:
          "Quando a gente fica chateado, o rostinho muda. Ache o rostinho que está TRISTE.",
        enunciadoLivre: "ACHE QUEM ESTÁ TRISTE",
        narracaoDesafio: "Ache o rostinho triste, Antonella.",
        cards: [
          { nome: "TRISTE", figura: "😢" },
          { nome: "FELIZ", figura: "😄" },
          { nome: "COM MEDO", figura: "😱" },
        ],
        correta: "TRISTE",
      },
      {
        tipo: "fonico",
        historia:
          "E quando ficamos com raiva? Ache o rostinho que está BRAVO, com raivinha.",
        enunciadoLivre: "ACHE QUEM ESTÁ BRAVO",
        narracaoDesafio: "Ache o rostinho bravo, Antonella. Com raivinha!",
        cards: [
          { nome: "BRAVO", figura: "😠" },
          { nome: "TRISTE", figura: "😢" },
          { nome: "FELIZ", figura: "😄" },
        ],
        correta: "BRAVO",
      },
    ],
  },

  // ====================================================================
  // NÍVEL 1 · FASE 5 — QUE SOM É ESSE?
  // Baseada nos exercícios de ONOMATOPEIA (ligar o som ao animal). A criança
  // ouve/lê o som e acha o animal que o faz. Conecta direto com o método
  // fônico (som -> figura). Usa o tipo fonico com enunciado livre.
  // ====================================================================
  {
    id: "que-som-e-esse",
    titulo: "QUE SOM É ESSE?",
    icone: "🔊",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Cada bichinho faz um som diferente! Quem faz MIAU? Ache o bichinho certo!",
        enunciadoLivre: "QUEM FAZ MIAU?",
        narracaoDesafio: "Quem faz miau, Antonella? Ache o bichinho!",
        cards: [
          { nome: "GATO", figura: "🐱" },
          { nome: "PATO", figura: "🦆" },
          { nome: "LOBO", figura: "🐺" },
        ],
        correta: "GATO",
      },
      {
        tipo: "fonico",
        historia:
          "Agora, quem faz QUÁ-QUÁ na beira da lagoa? Ache o bichinho!",
        enunciadoLivre: "QUEM FAZ QUÁ-QUÁ?",
        narracaoDesafio: "Quem faz quá quá, Antonella? Ache o bichinho!",
        cards: [
          { nome: "PATO", figura: "🦆" },
          { nome: "GATO", figura: "🐱" },
          { nome: "PORCO", figura: "🐷" },
        ],
        correta: "PATO",
      },
      {
        tipo: "fonico",
        historia:
          "Quem faz AUUU para a lua lá na floresta? Ache o bichinho!",
        enunciadoLivre: "QUEM FAZ AUUU?",
        narracaoDesafio: "Quem faz auuu, Antonella? Ache o bichinho!",
        cards: [
          { nome: "LOBO", figura: "🐺" },
          { nome: "GATO", figura: "🐱" },
          { nome: "PATO", figura: "🦆" },
        ],
        correta: "LOBO",
      },
      {
        tipo: "fonico",
        historia:
          "E quem faz OINC-OINC lá na lama da fazenda? Ache o bichinho!",
        enunciadoLivre: "QUEM FAZ OINC-OINC?",
        narracaoDesafio: "Quem faz oinc oinc, Antonella? Ache o bichinho!",
        cards: [
          { nome: "PORCO", figura: "🐷" },
          { nome: "LOBO", figura: "🐺" },
          { nome: "PATO", figura: "🦆" },
        ],
        correta: "PORCO",
      },
    ],
  },

  // ====================================================================
  // NÍVEL 1 · FASE 6 — SONS DA FAZENDA
  // Associar a SÍLABA INICIAL ao animal (VA, GA, PO, CA).
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
  // NÍVEL 1 · FASE 7 — CAÇA ÀS LETRAS
  // Encontrar a PRIMEIRA LETRA do nome do personagem (letras como cards).
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
  // NÍVEL 2 · FASE 8 — SÍLABAS SONORAS
  // Consciência silábica: CONTAR quantas sílabas (tipo "contar") + montar.
  // ====================================================================
  {
    id: "silabas-sonoras",
    titulo: "SÍLABAS SONORAS",
    icone: "👏",
    cenas: [
      {
        tipo: "contar",
        historia:
          "Cada palavra é feita de pedacinhos de som chamados SÍLABAS. Vamos bater palma para cada sílaba! Comece com o QUEIJO.",
        figura: "🧀",
        palavra: "QUEIJO",
        silabas: ["QUEI", "JO"],
        numeros: [1, 2, 3],
      },
      {
        tipo: "contar",
        historia:
          "Agora um docinho gostoso: a ROSCA. Vamos contar as sílabas dela batendo palma!",
        figura: "🍩",
        palavra: "ROSCA",
        silabas: ["ROS", "CA"],
        numeros: [1, 2, 3],
      },
      {
        tipo: "contar",
        historia:
          "Um legume redondo que faz a gente chorar: a CEBOLA. Quantas sílabas será que ela tem?",
        figura: "🧅",
        palavra: "CEBOLA",
        silabas: ["CE", "BO", "LA"],
        numeros: [2, 3, 4],
      },
      {
        tipo: "contar",
        historia:
          "Agora uma fruta grande e docinha: o ABACAXI! Essa tem bastante sílaba. Vamos contar!",
        figura: "🍍",
        palavra: "ABACAXI",
        silabas: ["A", "BA", "CA", "XI"],
        numeros: [3, 4, 5],
      },
      {
        tipo: "arrasta",
        historia:
          "Muito bem! Agora vamos MONTAR uma palavra da página. Complete a palavra MILHO arrastando a sílaba certa!",
        figura: "🌽",
        palavra: "MILHO",
        inicio: "",
        lacuna: "MI",
        fim: "LHO",
        opcoes: ["MI", "LA", "BO"],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 2 · FASE 9 — QUANTAS SÍLABAS?
  // DISCRIMINAR o alimento com o número de sílabas pedido. Fecha contando.
  // ====================================================================
  {
    id: "quantas-silabas",
    titulo: "QUANTAS SÍLABAS?",
    icone: "🍎",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Vamos brincar com comidinhas e suas sílabas! Ache o alimento que tem só UMA sílaba: PÃO.",
        enunciadoLivre: "ACHE O QUE TEM 1 SÍLABA",
        narracaoDesafio:
          "Ache o alimento que tem uma sílaba só, Antonella. Uma palma!",
        cards: [
          { nome: "PÃO", figura: "🍞" },
          { nome: "BOLO", figura: "🍰" },
          { nome: "PEIXE", figura: "🐟" },
        ],
        correta: "PÃO",
      },
      {
        tipo: "fonico",
        historia:
          "Agora ache o alimento que tem DUAS sílabas: a MAÇÃ. Ma-çã, duas palmas!",
        enunciadoLivre: "ACHE O QUE TEM 2 SÍLABAS",
        narracaoDesafio:
          "Ache o alimento com duas sílabas, Antonella. Duas palmas!",
        cards: [
          { nome: "MAÇÃ", figura: "🍎" },
          { nome: "BANANA", figura: "🍌" },
          { nome: "LARANJA", figura: "🍊" },
        ],
        correta: "MAÇÃ",
      },
      {
        tipo: "fonico",
        historia:
          "Muito bem! Agora o alimento com TRÊS sílabas: o TOMATE. To-ma-te, três palmas!",
        enunciadoLivre: "ACHE O QUE TEM 3 SÍLABAS",
        narracaoDesafio:
          "Ache o alimento com três sílabas, Antonella. Três palmas!",
        cards: [
          { nome: "TOMATE", figura: "🍅" },
          { nome: "MELANCIA", figura: "🍉" },
          { nome: "BERINJELA", figura: "🍆" },
        ],
        correta: "TOMATE",
      },
      {
        tipo: "contar",
        historia:
          "Para terminar, vamos contar juntas as sílabas de uma palavra bem grande: a BERINJELA!",
        figura: "🍆",
        palavra: "BERINJELA",
        silabas: ["BE", "RIN", "JE", "LA"],
        numeros: [3, 4, 5],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 2 · FASE 10 — BRINCANDO COM SÍLABAS
  // Sílaba INICIAL (RA) + MONTAR palavras (tênis, blusa, coroa).
  // ====================================================================
  {
    id: "brincando-silabas",
    titulo: "BRINCANDO COM SÍLABAS",
    icone: "🧩",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "O ratinho voltou! O nome dele começa com a sílaba RA: RA-TO. Ache o que começa com o som RA!",
        pista: "RA",
        enunciado: "com o som RA",
        cards: [
          { nome: "RATO", figura: "🐭" },
          { nome: "SOL", figura: "☀️" },
          { nome: "BOLA", figura: "⚽" },
        ],
        correta: "RATO",
      },
      {
        tipo: "arrasta",
        historia:
          "Vamos montar o nome de um calçado de brincar. Complete a palavra TÊNIS arrastando a sílaba certa!",
        figura: "👟",
        palavra: "TÊNIS",
        inicio: "",
        lacuna: "TÊ",
        fim: "NIS",
        opcoes: ["TÊ", "BO", "RA"],
      },
      {
        tipo: "arrasta",
        historia:
          "Agora uma roupa que a gente veste no frio. Monte a palavra BLUSA!",
        figura: "🧥",
        palavra: "BLUSA",
        inicio: "",
        lacuna: "BLU",
        fim: "SA",
        opcoes: ["BLU", "PA", "TO"],
      },
      {
        tipo: "arrasta",
        historia:
          "Para terminar, o que o rei usa na cabeça! Monte a palavra COROA!",
        figura: "👑",
        palavra: "COROA",
        inicio: "",
        lacuna: "CO",
        fim: "ROA",
        opcoes: ["CO", "RA", "BO"],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 2 · FASE 11 — MONTAR A PALAVRA
  // Montar palavras maiores por sílabas (banana, laranja, bola, uva).
  // ====================================================================
  {
    id: "montar",
    titulo: "MONTAR A PALAVRA",
    icone: "🍌",
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
  // NÍVEL 2 · FASE 12 — O TÍTULO E MEU NOME
  // Sinal de pergunta (?) + montar o próprio nome ANTONELLA por sílabas.
  // (Palavra mais longa = passo mais difícil dentro do nível das sílabas.)
  // ====================================================================
  {
    id: "meu-nome",
    titulo: "O TÍTULO E MEU NOME",
    icone: "🌟",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "O título da história é uma pergunta: RATOS GOSTAM DE QUEIJO? Toda pergunta termina com um sinalzinho especial. Vamos achar o SINAL DE PERGUNTA!",
        enunciadoLivre: "ACHE O SINAL DE PERGUNTA",
        narracaoDesafio:
          "Ache o sinal de pergunta, Antonella. É o que usamos quando perguntamos alguma coisa.",
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
        historia: "Muito bem! Agora a segunda parte do seu nome: TO.",
        figura: "🌟",
        palavra: "ANTONELLA",
        inicio: "AN",
        lacuna: "TO",
        fim: "NELA",
        opcoes: ["TO", "NE", "AN"],
      },
      {
        tipo: "arrasta",
        historia: "Está quase lá! A terceira parte é: NE.",
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

  // ====================================================================
  // NÍVEL 3 · FASE 13 — TIPOS DE LETRAS
  // Parear a mesma palavra em MAIÚSCULA e minúscula + achar letra + montar.
  // ====================================================================
  {
    id: "tipos-de-letras",
    titulo: "TIPOS DE LETRAS",
    icone: "🔠",
    cenas: [
      {
        tipo: "parear",
        historia:
          "A mesma palavra pode ser escrita de jeitos diferentes: com letra grande ou pequena. Ache a palavra SORVETE escrita com letra pequena!",
        figura: "🍦",
        alvo: "SORVETE",
        opcoes: ["sorvete", "cenoura", "abacate"],
      },
      {
        tipo: "parear",
        historia:
          "Muito bem! Agora ache a palavra CENOURA escrita com letra pequena.",
        figura: "🥕",
        alvo: "CENOURA",
        opcoes: ["cenoura", "sorvete", "pimenta"],
      },
      {
        tipo: "parear",
        historia: "Mais uma! Ache a palavra ABACATE escrita com letra pequena.",
        figura: "🥑",
        alvo: "ABACATE",
        opcoes: ["abacate", "banana", "cenoura"],
      },
      {
        tipo: "fonico",
        historia:
          "Agora um desafio de letra! Em qual cartão está escrita SÓ a letra R? Ache a letra R!",
        enunciadoLivre: "ACHE A LETRA R",
        narracaoDesafio: "Ache o cartão com a letra R, Antonella.",
        cards: [
          { nome: "R", figura: "🇷" },
          { nome: "P", figura: "🅿️" },
          { nome: "B", figura: "🅱️" },
        ],
        correta: "R",
      },
      {
        tipo: "arrasta",
        historia:
          "Para terminar, monte o nome deste bichinho arrastando a sílaba certa: RATO!",
        figura: "🐭",
        palavra: "RATO",
        inicio: "",
        lacuna: "RA",
        fim: "TO",
        opcoes: ["RA", "GA", "PA"],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 3 · FASE 14 — GRANDE OU PEQUENO?
  // Achar a mesma palavra escrita bem grande ou pequenininha.
  // ====================================================================
  {
    id: "grande-ou-pequeno",
    titulo: "GRANDE OU PEQUENO?",
    icone: "🔎",
    cenas: [
      {
        tipo: "tamanho",
        historia:
          "As palavras podem ser escritas bem grandes ou pequenininhas! Ache a palavra SOL escrita bem GRANDE.",
        emoji: "☀️",
        palavra: "SOL",
        alvo: "grande",
      },
      {
        tipo: "tamanho",
        historia: "Agora ao contrário! Ache a palavra GATO escrita PEQUENININHA.",
        emoji: "🐱",
        palavra: "GATO",
        alvo: "pequeno",
      },
      {
        tipo: "tamanho",
        historia: "Ache a palavra BOLA escrita bem GRANDE!",
        emoji: "⚽",
        palavra: "BOLA",
        alvo: "grande",
      },
      {
        tipo: "tamanho",
        historia: "Por último, ache a palavra FLOR escrita PEQUENININHA.",
        emoji: "🌸",
        palavra: "FLOR",
        alvo: "pequeno",
      },
    ],
  },

  // ====================================================================
  // NÍVEL 3 · FASE 15 — CADÊ O ESPAÇO?
  // Achar onde fica o espaço entre duas palavrinhas grudadas.
  // ====================================================================
  {
    id: "cade-o-espaco",
    titulo: "CADÊ O ESPAÇO?",
    icone: "✂️",
    cenas: [
      {
        tipo: "separar",
        historia:
          "Às vezes as palavras ficam grudadas e a gente precisa achar o espaço! Onde separamos OGATO para virar duas palavras?",
        emoji: "🐱",
        grudada: "OGATO",
        opcoes: [
          { texto: "O GATO", certa: true },
          { texto: "OG ATO", certa: false },
          { texto: "OGA TO", certa: false },
        ],
      },
      {
        tipo: "separar",
        historia: "Muito bem! Agora ache o espaço certo em OSOL.",
        emoji: "☀️",
        grudada: "OSOL",
        opcoes: [
          { texto: "O SOL", certa: true },
          { texto: "OS OL", certa: false },
          { texto: "OSO L", certa: false },
        ],
      },
      {
        tipo: "separar",
        historia: "Onde fica o espaço em ABOLA? Ache o jeito certo de separar!",
        emoji: "⚽",
        grudada: "ABOLA",
        opcoes: [
          { texto: "A BOLA", certa: true },
          { texto: "AB OLA", certa: false },
          { texto: "ABO LA", certa: false },
        ],
      },
      {
        tipo: "separar",
        historia: "Última! Ache o espaço para separar OPATO em duas palavras.",
        emoji: "🦆",
        grudada: "OPATO",
        opcoes: [
          { texto: "O PATO", certa: true },
          { texto: "OP ATO", certa: false },
          { texto: "OPA TO", certa: false },
        ],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 4 · FASE 16 — O RATINHO ESPERTO (revisão)
  // Reúne 5 mecânicas num só bichinho: achar, contar, parear, falar, montar.
  // ====================================================================
  {
    id: "ratinho-esperto",
    titulo: "O RATINHO ESPERTO",
    icone: "🐭",
    cenas: [
      {
        tipo: "fonico",
        historia:
          "Era uma vez um ratinho muito esperto e cheirador! O nome dele começa com a letra R. Vamos achar o RATO!",
        pista: "R",
        enunciado: "com a letra R",
        cards: [
          { nome: "RATO", figura: "🐭" },
          { nome: "GATO", figura: "🐱" },
          { nome: "PATO", figura: "🦆" },
        ],
        correta: "RATO",
      },
      {
        tipo: "contar",
        historia:
          "O nome do nosso amigo é RATO. Vamos bater palma para contar as sílabas dele!",
        figura: "🐭",
        palavra: "RATO",
        silabas: ["RA", "TO"],
        numeros: [1, 2, 3],
      },
      {
        tipo: "parear",
        historia:
          "O nome do ratinho pode ser escrito com letra grande ou pequena. Ache RATO escrito com letra pequena!",
        figura: "🐭",
        alvo: "RATO",
        opcoes: ["rato", "gato", "pato"],
      },
      {
        tipo: "microfone",
        historia:
          "O ratinho esperto quer ouvir a sua voz! Fale o nome dele bem alto.",
        figura: "🐭",
        resposta: "RATO",
        sinonimos: ["ratinho", "rato esperto"],
      },
      {
        tipo: "arrasta",
        historia:
          "Sabe o que o ratinho mais adora comer? QUEIJO! Vamos montar essa palavra arrastando a sílaba certa!",
        figura: "🧀",
        palavra: "QUEIJO",
        inicio: "",
        lacuna: "QUEI",
        fim: "JO",
        opcoes: ["QUEI", "MI", "BO"],
      },
    ],
  },

  // ====================================================================
  // NÍVEL 4 · FASE 17 — PALAVRAS AMIGAS (sinônimos)
  // O mais abstrato: achar a palavra que quer dizer o mesmo (vocabulário).
  // ====================================================================
  {
    id: "palavras-amigas",
    titulo: "PALAVRAS AMIGAS",
    icone: "💬",
    cenas: [
      {
        tipo: "sinonimo",
        historia:
          "Algumas palavras são amigas porque querem dizer a mesma coisa! Ache a palavra amiga de BONITO.",
        emoji: "🌸",
        palavra: "BONITO",
        opcoes: [
          { texto: "LINDO", certa: true },
          { texto: "FEIO", certa: false },
          { texto: "GRANDE", certa: false },
        ],
      },
      {
        tipo: "sinonimo",
        historia:
          "Muito bem! Agora ache a palavra amiga de FELIZ, que quer dizer a mesma coisa.",
        emoji: "😄",
        palavra: "FELIZ",
        opcoes: [
          { texto: "ALEGRE", certa: true },
          { texto: "TRISTE", certa: false },
          { texto: "CANSADO", certa: false },
        ],
      },
      {
        tipo: "sinonimo",
        historia:
          "Ache a palavra amiga de GRANDE. Qual quer dizer a mesma coisa?",
        emoji: "🐘",
        palavra: "GRANDE",
        opcoes: [
          { texto: "ENORME", certa: true },
          { texto: "PEQUENO", certa: false },
          { texto: "RÁPIDO", certa: false },
        ],
      },
      {
        tipo: "sinonimo",
        historia:
          "Última palavra amiga! Ache a que quer dizer o mesmo que RÁPIDO.",
        emoji: "🐆",
        palavra: "RÁPIDO",
        opcoes: [
          { texto: "LIGEIRO", certa: true },
          { texto: "DEVAGAR", certa: false },
          { texto: "BONITO", certa: false },
        ],
      },
    ],
  },
];
