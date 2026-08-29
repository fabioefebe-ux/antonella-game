/* ========================================================================
   AVENTURAS DA ANTONELLA — CONTEÚDO DAS FASES (Caçada dos Sons)
   ========================================================================
   ESTE É O ÚNICO ARQUIVO QUE PRECISA SER EDITADO PARA CRIAR UMA FASE NOVA.
   A mecânica (narração, fônico, TEACCH, ABA, PECS, drag-and-drop, voz e
   minijogo) já está pronta em cacada.js e lê o conteúdo daqui.

   --------------------------------------------------------------------------
   COMO CADA FASE (TEMA) É ESTRUTURADA
   --------------------------------------------------------------------------
   Um tema = uma "aventura", com uma sequência de palavras que a Antonella
   monta uma a uma. Depois de todas, entra o minijogo de recompensa (15 s).

   tema = {
     nome:     "TÍTULO DA FASE",  // falado e mostrado (CAIXA ALTA)
     icone:    "🦕",              // emoji do card de seleção
     historia: "Texto da abertura...", // (OPCIONAL) narrado antes da 1ª palavra
     palavras: [ ...objetos de palavra... ],
     minijogo: { titulo, alvo, comida },
   }

   Cada PALAVRA:
   {
     figura:       "🦖",          // emoji grande do alvo desta palavra
     palavra:      "LOBO",        // palavra em CAIXA ALTA, SEM acento
                                  //   (o casamento é letra a letra)
     exibir:       "LEÃO",        // (opcional) versão com acento só para
                                  //   MOSTRAR na tela. Use quando a palavra
                                  //   tiver acento/til.
     artigo:       "o",           // "o" / "a" (para "Você encontrou O lobo")
     figurasCena:  ["🦖","🌋","🌴"], // 3 figuras no passo "Procurar"
                                  //   (a 1ª deve ser igual a "figura")
     lacunas:      [0],           // ÍNDICES das letras que ela vai montar:
                                  //   [0]    -> só a consoante inicial (fácil)
                                  //   [0,1]  -> a sílaba inicial (médio)
     letrasMoveis: ["L","B","V"], // blocos oferecidos: PRECISA conter todas
                                  //   as letras das lacunas + distratores.
                                  //   Evite repetir a mesma letra na lista.
   }

   MINIJOGO (recompensa de 15 s):
   { titulo: "ALIMENTAR O DINO", alvo: "🦖", comida: "🍖" }
     - titulo: falado/escrito no topo do minijogo
     - alvo:   personagem que recebe a comida
     - comida: item que a criança toca para pontuar

   --------------------------------------------------------------------------
   DICAS PEDAGÓGICAS AO MONTAR UMA FASE A PARTIR DA PÁGINA DO LIVRO
   --------------------------------------------------------------------------
   • Escolha palavras curtas e concretas que apareçam na história/figura.
   • Ordene por complexidade: 1ª mais fácil (1 letra), depois sílaba, depois
     palavra maior.
   • A letra da lacuna deve estar entre as "letrasMoveis" (senão não monta).
   • Prefira palavras sem acento na grafia interna; use "exibir" só para a
     versão visual acentuada.

   >>> Para uma NOVA FASE, copie o MOLDE lá embaixo, preencha e adicione
       ao objeto TEMAS com uma chave nova.
   ======================================================================== */

const TEMAS = {
  // ==================================================================
  // FASE: DINOSSAUROS
  // ==================================================================
  dinos: {
    nome: "DINOSSAUROS",
    icone: "🦕",
    palavras: [
      {
        figura: "🌋",
        palavra: "LAMA",
        artigo: "a",
        figurasCena: ["🌋", "🦖", "🌴"],
        lacunas: [0],
        letrasMoveis: ["L", "B", "V"],
      },
      {
        figura: "💧",
        palavra: "LAGO",
        artigo: "o",
        figurasCena: ["💧", "🌋", "🦖"],
        lacunas: [0, 1],
        letrasMoveis: ["L", "A", "G", "B", "O"],
      },
      {
        figura: "🦖",
        palavra: "LAGARTO",
        artigo: "o",
        figurasCena: ["🦖", "🌴", "🥚"],
        lacunas: [0],
        letrasMoveis: ["L", "R", "G"],
      },
    ],
    minijogo: { titulo: "ALIMENTAR O DINO", alvo: "🦖", comida: "🍖" },
  },

  // ==================================================================
  // FASE: CARROS
  // ==================================================================
  carros: {
    nome: "CARROS",
    icone: "🚗",
    palavras: [
      {
        figura: "🛞",
        palavra: "RODA",
        artigo: "a",
        figurasCena: ["🛞", "🚦", "⛽"],
        lacunas: [0],
        letrasMoveis: ["R", "M", "D"],
      },
      {
        figura: "🚗",
        palavra: "CARRO",
        artigo: "o",
        figurasCena: ["🚗", "🚦", "🛞"],
        lacunas: [0, 1],
        letrasMoveis: ["C", "A", "R", "G", "O"],
      },
      {
        figura: "🚌",
        palavra: "ONIBUS",
        exibir: "ONIBUS",
        artigo: "o",
        figurasCena: ["🚌", "🚗", "🚦"],
        lacunas: [0],
        letrasMoveis: ["O", "U", "A"],
      },
    ],
    minijogo: { titulo: "ABASTECER O CARRO", alvo: "🚗", comida: "⛽" },
  },

  // ==================================================================
  // FASE: ANIMAIS
  // ==================================================================
  animais: {
    nome: "ANIMAIS",
    icone: "🦁",
    palavras: [
      {
        figura: "🐱",
        palavra: "GATO",
        artigo: "o",
        figurasCena: ["🐱", "🦁", "🐘"],
        lacunas: [0],
        letrasMoveis: ["G", "P", "B"],
      },
      {
        figura: "🦆",
        palavra: "PATO",
        artigo: "o",
        figurasCena: ["🦆", "🐱", "🐘"],
        lacunas: [0, 1],
        letrasMoveis: ["P", "A", "T", "M", "O"],
      },
      {
        figura: "🐘",
        palavra: "ELEFANTE",
        artigo: "o",
        figurasCena: ["🐘", "🦁", "🦒"],
        lacunas: [0],
        letrasMoveis: ["E", "I", "A"],
      },
    ],
    minijogo: { titulo: "ALIMENTAR O LEÃO", alvo: "🦁", comida: "🥩" },
  },

  // ==================================================================
  // FASE: RATO GULOSO
  // Baseada na página "Ratos gostam de queijo?" (Língua Portuguesa, 1º ano).
  // O texto conta que o rato come de tudo e prefere comidas de cheiro forte
  // (queijo, bacon, leite). As palavras vêm dessa história.
  // ==================================================================
  ratos: {
    nome: "O RATO GULOSO",
    icone: "🐭",
    // Historinha de abertura, narrada em voz alta antes da 1ª palavra.
    historia:
      "Você sabia, Antonella? O rato come de tudo! Ele adora comidas de cheiro forte, " +
      "como o queijo, o bacon e o leite. Vamos brincar com as palavras dessa história!",
    palavras: [
      {
        // Palavra 1 (fácil): falta a consoante inicial -> [ _ ][ A ][ T ][ O ]
        figura: "🐭",
        palavra: "RATO",
        artigo: "o",
        figurasCena: ["🐭", "🧀", "🥛"],
        lacunas: [0],
        letrasMoveis: ["R", "M", "P"],
      },
      {
        // Palavra 2 (médio): falta a sílaba inicial -> [ _ ][ _ ][ I ][ T ][ E ]
        figura: "🥛",
        palavra: "LEITE",
        artigo: "o",
        figurasCena: ["🥛", "🐭", "🧀"],
        lacunas: [0, 1],
        letrasMoveis: ["L", "E", "I", "B", "A"],
      },
      {
        // Palavra 3: consoante inicial de palavra maior -> [ _ ][ A ][ C ][ O ][ N ]
        figura: "🥓",
        palavra: "BACON",
        artigo: "o",
        figurasCena: ["🥓", "🧀", "🐭"],
        lacunas: [0],
        letrasMoveis: ["B", "D", "V"],
      },
    ],
    minijogo: { titulo: "DAR QUEIJO AO RATO", alvo: "🐭", comida: "🧀" },
  },

  /* ==================================================================
     MOLDE DE FASE NOVA — copie este bloco, renomeie a chave "modelo",
     preencha com o conteúdo da página do livro e pronto: a fase aparece
     automaticamente na tela de seleção da Caçada dos Sons.

  minhaFase: {
    nome: "TÍTULO DA FASE",
    icone: "🌟",
    historia: "Historinha curta da página, narrada na abertura.", // opcional
    palavras: [
      {
        figura: "🐝",
        palavra: "BOLA",            // CAIXA ALTA, sem acento
        // exibir: "MAÇÃ",          // use só se tiver acento/til
        artigo: "a",
        figurasCena: ["🐝", "🌼", "🍯"],
        lacunas: [0],              // [0] fácil | [0,1] sílaba inicial
        letrasMoveis: ["B", "P", "D"],
      },
      // ...mais palavras (2ª e 3ª em ordem de dificuldade)...
    ],
    minijogo: { titulo: "COMER O MEL", alvo: "🐻", comida: "🍯" },
  },

  ================================================================== */
};
