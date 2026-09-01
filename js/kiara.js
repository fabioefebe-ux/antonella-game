/* ========================================================================
   KIARA — Companheira de autoestima da Antonella
   --------------------------------------------------------------------------
   A Kiara é a gatinha frajola que acompanha a Antonella no jogo. Este módulo
   cuida do REFORÇO POSITIVO e da AUTOESTIMA:

     • Elogios variados (esforço, capacidade e afeto) — no lugar de repetir
       sempre "Parabéns". Muitos citam a Kiara para criar vínculo.
     • Afirmações positivas ("Eu consigo", "Eu sou inteligente").
     • Medalhas/conquistas guardadas no localStorage (o "álbum da Antonella").

   Base pedagógica: valorizar o ESFORÇO e a identidade constrói mais
   autoestima do que só elogiar o acerto. Nunca há punição.
   ======================================================================== */

const Kiara = (function () {
  const NOME = "Antonella";
  const EMOJI = "🐈‍⬛"; // a gatinha frajola

  // ---------------- Bancos de elogios ----------------
  // Elogios de ACERTO — variados, alternando esforço, capacidade e afeto.
  const ELOGIOS = [
    "Parabéns, " + NOME + "! Você conseguiu!",
    "Muito bem, " + NOME + "! Você é muito inteligente!",
    "Uau! A Kiara está orgulhosa de você, " + NOME + "!",
    "Isso mesmo! Você está ficando craque, " + NOME + "!",
    "Que legal, " + NOME + "! Você conseguiu sozinha!",
    "Você é demais, " + NOME + "! A Kiara adorou!",
    "Boa, " + NOME + "! Você é uma leitora e tanto!",
    "Você é especial, " + NOME + "! Continue assim!",
    "A Kiara está pulando de alegria com você, " + NOME + "!",
    "Você pensou bem e acertou, " + NOME + "! Que orgulho!",
  ];

  // Incentivos de ERRO — sem punição, valorizando a tentativa.
  const INCENTIVOS = [
    "Quase lá, " + NOME + "! Tente de novo, você consegue!",
    "Vamos tentar juntas, " + NOME + "! A Kiara acredita em você!",
    "Ops! Tente mais uma vez, " + NOME + ". Você é capaz!",
    "Não faz mal, " + NOME + "! Errar faz parte de aprender.",
    "Tente de novo, " + NOME + "! A Kiara está aqui com você.",
  ];

  // Afirmações positivas — para o "espelho" da autoestima.
  const AFIRMACOES = [
    "Eu sou inteligente!",
    "Eu consigo!",
    "Eu sou especial!",
    "Eu aprendo cada vez mais!",
    "Eu sou capaz!",
    "Eu sou corajosa!",
  ];

  function sortear(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  // Vibração curta de recompensa ao acertar (feedback tátil no celular).
  // Silenciosa e segura onde não há suporte (desktop, iOS Safari).
  function vibrarAcerto() {
    try {
      if (navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate([30, 40, 30]); // dois toquinhos alegres
      }
    } catch (e) {
      /* sem suporte — ignora */
    }
  }

  // Evita repetir o mesmo elogio duas vezes seguidas.
  let ultimoElogio = "";
  function elogio() {
    let f = sortear(ELOGIOS);
    let tentativas = 0;
    while (f === ultimoElogio && tentativas++ < 5) f = sortear(ELOGIOS);
    ultimoElogio = f;
    return f;
  }

  function incentivo() {
    return sortear(INCENTIVOS);
  }

  function afirmacao() {
    return sortear(AFIRMACOES);
  }

  // ---------------- Medalhas / conquistas ----------------
  // Catálogo de medalhas. cada uma: id, emoji, titulo, descricao.
  const MEDALHAS = {
    primeira_fase: {
      emoji: "🌟",
      titulo: "PRIMEIRA CONQUISTA",
      descricao: "Você terminou a sua primeira fase!",
    },
    montou_nome: {
      emoji: "✍️",
      titulo: "MEU NOME",
      descricao: "Você escreveu o seu nome, ANTONELLA!",
    },
    cinco_estrelas: {
      emoji: "⭐",
      titulo: "CHUVA DE ESTRELAS",
      descricao: "Você ganhou 5 estrelas!",
    },
    tentou_de_novo: {
      emoji: "💪",
      titulo: "NÃO DESISTI",
      descricao: "Você tentou de novo e conseguiu!",
    },
    cinco_fases: {
      emoji: "🏆",
      titulo: "SUPER LEITORA",
      descricao: "Você terminou 5 fases!",
    },
    todas_fases: {
      emoji: "👑",
      titulo: "RAINHA DAS LETRAS",
      descricao: "Você terminou todas as fases!",
    },
    caçadora: {
      emoji: "🔎",
      titulo: "CAÇADORA DE SONS",
      descricao: "Você completou uma Caçada dos Sons!",
    },
  };

  const CHAVE_LS = "antonella_kiara_v1";

  // Estado guardado: medalhas ganhas + contadores.
  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE_LS);
      if (bruto) return JSON.parse(bruto);
    } catch (e) {
      /* localStorage indisponível — segue com estado em memória */
    }
    return { medalhas: {}, fasesConcluidas: 0, totalEstrelas: 0 };
  }

  function salvar(estado) {
    try {
      localStorage.setItem(CHAVE_LS, JSON.stringify(estado));
    } catch (e) {
      /* silencioso */
    }
  }

  let estado = carregar();

  // Concede uma medalha (se ainda não tiver). Retorna a medalha se for NOVA,
  // ou null se já tinha. Útil para a tela mostrar "nova medalha!".
  function darMedalha(id) {
    if (!MEDALHAS[id]) return null;
    if (estado.medalhas[id]) return null; // já conquistada
    estado.medalhas[id] = { data: Date.now() };
    salvar(estado);
    return Object.assign({ id: id }, MEDALHAS[id]);
  }

  function temMedalha(id) {
    return !!estado.medalhas[id];
  }

  // Lista todas as medalhas do catálogo, marcando quais já foram ganhas.
  function listarMedalhas() {
    return Object.keys(MEDALHAS).map(function (id) {
      return Object.assign(
        { id: id, ganha: !!estado.medalhas[id] },
        MEDALHAS[id]
      );
    });
  }

  function totalGanhas() {
    return Object.keys(estado.medalhas).length;
  }

  function totalCatalogo() {
    return Object.keys(MEDALHAS).length;
  }

  // Marca uma fase específica como concluída (por id) e diz se é a 1ª vez.
  function marcarFaseConcluida(idFase) {
    if (!idFase) return false;
    if (!estado.fasesFeitas) estado.fasesFeitas = {};
    const primeiraVez = !estado.fasesFeitas[idFase];
    estado.fasesFeitas[idFase] = true;
    salvar(estado);
    return primeiraVez;
  }

  // Uma fase (por id) já foi concluída alguma vez?
  function faseConcluida(idFase) {
    return !!(estado.fasesFeitas && estado.fasesFeitas[idFase]);
  }

  // Quantas fases distintas já foram concluídas.
  function totalFasesFeitas() {
    return estado.fasesFeitas ? Object.keys(estado.fasesFeitas).length : 0;
  }

  // Registra uma fase concluída; devolve a lista de medalhas NOVAS obtidas.
  // Agora recebe o idFase para marcar o progresso individual.
  function registrarFaseConcluida(idFase, totalFases, estrelasNaFase) {
    const novas = [];

    // Marca esta fase específica (para o progresso na seleção).
    marcarFaseConcluida(idFase);

    // Conta fases distintas concluídas (não infla ao repetir a mesma fase).
    estado.fasesConcluidas = totalFasesFeitas();
    salvar(estado);

    if (estado.fasesConcluidas === 1) {
      const m = darMedalha("primeira_fase");
      if (m) novas.push(m);
    }
    if (estado.fasesConcluidas >= 5) {
      const m = darMedalha("cinco_fases");
      if (m) novas.push(m);
    }
    if (typeof totalFases === "number" && estado.fasesConcluidas >= totalFases) {
      const m = darMedalha("todas_fases");
      if (m) novas.push(m);
    }
    return novas;
  }

  // Registra estrelas ganhas (acumula) e devolve medalhas novas.
  function registrarEstrelas(qtd) {
    const novas = [];
    estado.totalEstrelas = (estado.totalEstrelas || 0) + (qtd || 0);
    salvar(estado);
    if (estado.totalEstrelas >= 5) {
      const m = darMedalha("cinco_estrelas");
      if (m) novas.push(m);
    }
    return novas;
  }

  return {
    EMOJI: EMOJI,
    // elogios
    elogio: elogio,
    incentivo: incentivo,
    afirmacao: afirmacao,
    // medalhas
    darMedalha: darMedalha,
    temMedalha: temMedalha,
    listarMedalhas: listarMedalhas,
    totalGanhas: totalGanhas,
    totalCatalogo: totalCatalogo,
    registrarFaseConcluida: registrarFaseConcluida,
    registrarEstrelas: registrarEstrelas,
    // progresso das fases
    faseConcluida: faseConcluida,
    marcarFaseConcluida: marcarFaseConcluida,
    totalFasesFeitas: totalFasesFeitas,
    // feedback tátil
    vibrarAcerto: vibrarAcerto,
  };
})();
