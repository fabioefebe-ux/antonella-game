/* ========================================================================
   MUNDO MÁGICO DA ANTONELLA — Lógica do jogo
   Atividade de alfabetização: a criança OUVE a palavra e escolhe, entre
   opções em letras bastão, qual corresponde à figura mostrada.
   Tudo é narrado em voz alta (pt-BR). Feedback afetivo, sem punição.
   ======================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ---------------- Referências de elementos ----------------
  const telaMenu = document.getElementById("tela-menu");
  const telaJogo = document.getElementById("tela-jogo");
  const btnJogar = document.getElementById("btn-jogar");
  const btnOuvirTitulo = document.getElementById("btn-ouvir-titulo");
  const btnVoltar = document.getElementById("btn-voltar");
  const btnOuvirPalavra = document.getElementById("btn-ouvir-palavra");
  const figura = document.getElementById("figura-atividade");
  const opcoesEl = document.getElementById("opcoes");
  const placarEl = document.getElementById("placar-estrelas");
  const feedbackEl = document.getElementById("feedback");

  // Elementos da tela de seleção de fases
  const telaFases = document.getElementById("tela-fases");
  const listaFases = document.getElementById("lista-fases");
  const fasesVoltar = document.getElementById("fases-voltar");

  // Elementos da tela de fase (história interativa)
  const telaFase1 = document.getElementById("tela-fase1");
  const fase1Voltar = document.getElementById("fase1-voltar");
  const fase1Placar = document.getElementById("fase1-placar");

  // Elementos do modo "A Caçada dos Sons" (TEACCH + PECS)
  const btnCacada = document.getElementById("btn-cacada");
  const telaCacada = document.getElementById("tela-cacada");
  const cacadaVoltar = document.getElementById("cacada-voltar");
  const cacadaPlacar = document.getElementById("cacada-placar");

  // Elementos de autoestima: comemoração (Kiara) e álbum de medalhas
  const telaComemora = document.getElementById("tela-comemora");
  const comemoraTitulo = document.getElementById("comemora-titulo");
  const comemoraEstrelas = document.getElementById("comemora-estrelas");
  const comemoraFrase = document.getElementById("comemora-frase");
  const comemoraMedalha = document.getElementById("comemora-medalha");
  const comemoraProxima = document.getElementById("comemora-proxima");
  const comemoraAlbum = document.getElementById("comemora-album");
  const comemoraMenu = document.getElementById("comemora-menu");
  const btnAlbum = document.getElementById("btn-album");
  const telaAlbum = document.getElementById("tela-album");
  const albumVoltar = document.getElementById("album-voltar");
  const albumGrade = document.getElementById("album-grade");
  const albumContagem = document.getElementById("album-contagem");

  // Espelho de afirmações
  const btnEspelho = document.getElementById("btn-espelho");
  const telaEspelho = document.getElementById("tela-espelho");
  const espelhoVoltar = document.getElementById("espelho-voltar");
  const espelhoCartoes = document.getElementById("espelho-cartoes");

  let indiceFaseAtual = -1; // qual fase está sendo jogada (para "próxima")

  const NOME = "Antonella";
  const TITULO = "Mundo Mágico da Antonella";

  // ---------------- Banco de palavras (figura + palavra) ----------------
  // Palavras curtas, comuns na alfabetização. Emojis servem como figura.
  const BANCO = [
    { palavra: "BOLA", figura: "⚽" },
    { palavra: "GATO", figura: "🐱" },
    { palavra: "MAÇÃ", figura: "🍎" },
    { palavra: "CASA", figura: "🏠" },
    { palavra: "SOL", figura: "☀️" },
    { palavra: "PATO", figura: "🦆" },
    { palavra: "FLOR", figura: "🌸" },
    { palavra: "BOLO", figura: "🎂" },
    { palavra: "PEIXE", figura: "🐟" },
    { palavra: "URSO", figura: "🐻" },
  ];

  let estrelas = 0;
  let rodadaAtual = null;
  let bloqueado = false; // evita cliques enquanto narra o feedback

  // ---------------- Utilidades ----------------
  function embaralhar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function trocarTela(mostrar, esconder) {
    // A nova tela entra imediatamente (fade-in). A que sai faz um fade-out
    // curto por cima e só então some — dando uma transição suave e coordenada.
    if (esconder && esconder !== mostrar) {
      const saindo = esconder;
      saindo.classList.remove("tela--ativa");
      saindo.classList.add("tela--saindo");
      setTimeout(function () {
        saindo.classList.remove("tela--saindo");
      }, 240);
    }
    mostrar.classList.add("tela--ativa");
  }

  function mostrarFeedback(texto, tipo) {
    feedbackEl.textContent = texto;
    feedbackEl.className = "feedback feedback--visivel feedback--" + tipo;
    clearTimeout(mostrarFeedback._t);
    mostrarFeedback._t = setTimeout(function () {
      feedbackEl.classList.remove("feedback--visivel");
    }, 3200);
  }

  // ---------------- Fluxo de rodada ----------------
  function novaRodada() {
    bloqueado = false;
    const correta = BANCO[Math.floor(Math.random() * BANCO.length)];

    // Monta 3 opções: a correta + 2 diferentes (distratores).
    const distratores = embaralhar(
      BANCO.filter((item) => item.palavra !== correta.palavra)
    ).slice(0, 2);
    const opcoes = embaralhar([correta, ...distratores]);

    rodadaAtual = correta;
    figura.textContent = correta.figura;

    // Desenha os botões de opção.
    opcoesEl.innerHTML = "";
    opcoes.forEach(function (item) {
      const botao = document.createElement("button");
      botao.className = "opcao";
      botao.textContent = item.palavra;
      botao.setAttribute("aria-label", "Opção " + item.palavra);
      botao.addEventListener("click", function () {
        aoEscolher(item, botao);
      });
      opcoesEl.appendChild(botao);
    });

    // Narra a instrução e a palavra-alvo.
    Voz.falar("Ouça bem, " + NOME + ". Onde está a palavra... " + correta.palavra + "?");
  }

  function aoEscolher(item, botao) {
    if (bloqueado) return;

    if (item.palavra === rodadaAtual.palavra) {
      // ----- ACERTOU -----
      bloqueado = true;
      botao.classList.add("opcao--acerto");
      estrelas++;
      atualizarPlacar();
      Confete.explodir(140);
      if (typeof Kiara !== "undefined") Kiara.vibrarAcerto();
      mostrarFeedback("⭐ PARABÉNS, " + NOME + "! VOCÊ CONSEGUIU! ⭐", "acerto");
      Voz.falar("Parabéns, " + NOME + "! Você conseguiu!", {
        audio: "parabens",
        aoTerminar: function () {
          setTimeout(novaRodada, 600);
        },
      });
    } else {
      // ----- ERROU (incentivo suave, sem punição) -----
      botao.classList.add("opcao--erro");
      setTimeout(function () {
        botao.classList.remove("opcao--erro");
      }, 500);
      mostrarFeedback("QUASE LÁ, " + NOME + "! TENTE OUVIR DE NOVO 🔊", "erro");
      Voz.falar("Quase lá, " + NOME + "! Tente ouvir de novo.", { audio: "quase_la" });
    }
  }

  function atualizarPlacar() {
    // Mostra até 5 estrelas cheias, depois só o número para não estourar.
    if (estrelas <= 5) {
      placarEl.textContent = "⭐".repeat(estrelas);
    } else {
      placarEl.textContent = "⭐ x" + estrelas;
    }
  }

  function repetirPalavra() {
    if (!rodadaAtual) return;
    Voz.falar("A palavra é... " + rodadaAtual.palavra);
  }

  // ---------------- Eventos ----------------
  // ---------------- Fase 1 (história interativa) ----------------
  function atualizarPlacarFase1() {
    if (!fase1Placar) return;
    fase1Placar.textContent = estrelas <= 5 ? "⭐".repeat(estrelas) : "⭐ x" + estrelas;
  }

  function iniciarFase(fase, indice) {
    // De onde viemos pode ser a seleção OU a tela de comemoração.
    telaFases.classList.remove("tela--ativa");
    telaComemora.classList.remove("tela--ativa");
    telaFase1.classList.add("tela--ativa");

    indiceFaseAtual = typeof indice === "number" ? indice : FASES.indexOf(fase);
    estrelas = 0;
    atualizarPlacarFase1();

    // Cada acerto de cena soma uma estrela no placar da fase.
    Fase1.aoGanharEstrela = function () {
      estrelas++;
      atualizarPlacarFase1();
    };

    // A criança errou e depois acertou: guarda para dar a medalha "Não Desisti"
    // na tela de comemoração.
    var naoDesistiuNaFase = false;
    Fase1.aoNaoDesistir = function () {
      naoDesistiuNaFase = true;
    };

    Fase1.iniciar(
      {
        historia: document.getElementById("fase1-historia"),
        desafio: document.getElementById("fase1-desafio"),
        progresso: document.getElementById("fase1-progresso"),
        cards: document.getElementById("fase1-cards"),
        palco: document.getElementById("fase1-palco"),
        btnOuvir: document.getElementById("fase1-ouvir"),
        feedback: feedbackEl,
      },
      {
        fase: fase,
        aoConcluir: function () {
          // Registra conquistas e mostra a tela de comemoração da Kiara.
          const novas = [];
          if (typeof Kiara !== "undefined") {
            // Medalha "Não Desisti" tem prioridade de aparecer primeiro.
            if (naoDesistiuNaFase) {
              const md = Kiara.darMedalha("tentou_de_novo");
              if (md) novas.push(md);
            }
            novas.push.apply(
              novas,
              Kiara.registrarFaseConcluida(fase.id, FASES.length, estrelas)
            );
            novas.push.apply(novas, Kiara.registrarEstrelas(estrelas));
            // Medalha especial: montou o próprio nome.
            if (fase.id === "meu-nome") {
              const m = Kiara.darMedalha("montou_nome");
              if (m) novas.push(m);
            }
          }
          setTimeout(function () {
            mostrarComemoracao(novas);
          }, 900);
        },
      }
    );
  }

  // ---------------- Tela de comemoração (a Kiara celebra) ----------------
  function mostrarComemoracao(medalhasNovas) {
    // Estrelas conquistadas nesta fase (até 5 desenhadas).
    comemoraEstrelas.textContent =
      estrelas <= 5 ? "⭐".repeat(Math.max(1, estrelas)) : "⭐ x" + estrelas;

    // Título e elogio variados da Kiara.
    comemoraTitulo.textContent = "VOCÊ CONSEGUIU!";
    const frase =
      typeof Kiara !== "undefined"
        ? Kiara.elogio()
        : "Parabéns, Antonella! Você conseguiu!";
    comemoraFrase.textContent = frase;

    // Se ganhou uma medalha nova, mostra em destaque.
    const novas = medalhasNovas || [];
    if (novas.length) {
      const m = novas[0]; // mostra a primeira nova (as demais ficam no álbum)
      comemoraMedalha.hidden = false;
      comemoraMedalha.querySelector(".medalha-nova__emoji").textContent = m.emoji;
      comemoraMedalha.querySelector(".medalha-nova__texto").textContent =
        "NOVA MEDALHA: " + m.titulo + "! " + m.descricao;
    } else {
      comemoraMedalha.hidden = true;
    }

    // A "próxima" existe se houver fase seguinte.
    const temProxima = indiceFaseAtual >= 0 && indiceFaseAtual < FASES.length - 1;
    comemoraProxima.style.display = temProxima ? "" : "none";

    // Troca para a tela de comemoração.
    telaFase1.classList.remove("tela--ativa");
    telaComemora.classList.add("tela--ativa");
    Confete.explodir(220);

    // A Kiara fala o elogio; se ganhou medalha, anuncia também.
    let fala = frase;
    if (novas.length) {
      fala += " E você ganhou uma medalha nova: " + novas[0].titulo + "!";
    }
    Voz.falar(fala);
  }

  function irParaProximaFase() {
    Voz.parar();
    const prox = indiceFaseAtual + 1;
    if (prox < FASES.length) {
      iniciarFase(FASES[prox], prox);
    } else {
      trocarTela(telaMenu, telaComemora);
    }
  }

  if (comemoraProxima) {
    comemoraProxima.addEventListener("click", irParaProximaFase);
  }
  if (comemoraMenu) {
    comemoraMenu.addEventListener("click", function () {
      Voz.parar();
      trocarTela(telaMenu, telaComemora);
    });
  }
  if (comemoraAlbum) {
    comemoraAlbum.addEventListener("click", function () {
      abrirAlbum(telaComemora);
    });
  }

  // ---------------- Álbum de medalhas ----------------
  function montarAlbum() {
    if (!albumGrade || typeof Kiara === "undefined") return;
    const lista = Kiara.listarMedalhas();
    albumGrade.innerHTML = "";
    lista.forEach(function (m) {
      const card = document.createElement("div");
      card.className = "medalha" + (m.ganha ? "" : " medalha--bloqueada");

      const emoji = document.createElement("div");
      emoji.className = "medalha__emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = m.ganha ? m.emoji : "🔒";

      const titulo = document.createElement("div");
      titulo.className = "medalha__titulo";
      titulo.textContent = m.titulo;

      const desc = document.createElement("div");
      desc.className = "medalha__descricao";
      desc.textContent = m.ganha ? m.descricao : "Ainda não conquistada";

      card.appendChild(emoji);
      card.appendChild(titulo);
      card.appendChild(desc);
      albumGrade.appendChild(card);
    });

    if (albumContagem) {
      albumContagem.textContent =
        "VOCÊ JÁ TEM " + Kiara.totalGanhas() + " DE " + Kiara.totalCatalogo() + " MEDALHAS!";
    }
  }

  let telaOrigemAlbum = null; // de onde abrimos o álbum, para voltar certo
  function abrirAlbum(origem) {
    telaOrigemAlbum = origem || telaMenu;
    montarAlbum();
    trocarTela(telaAlbum, telaOrigemAlbum);
    Voz.falar("Estas são as suas medalhas, Antonella! Que orgulho!");
  }

  if (btnAlbum) {
    btnAlbum.addEventListener("click", function () {
      abrirAlbum(telaMenu);
    });
  }
  if (albumVoltar) {
    albumVoltar.addEventListener("click", function () {
      Voz.parar();
      trocarTela(telaOrigemAlbum || telaMenu, telaAlbum);
    });
  }

  // ---------------- Espelho de afirmações ----------------
  // Afirmações positivas: a criança toca no cartão e OUVE a frase, repetindo
  // com a Kiara. Reforço de autoestima ("Eu sou inteligente", "Eu consigo").
  const AFIRMACOES_ESPELHO = [
    { texto: "EU SOU INTELIGENTE", fala: "Eu sou inteligente!" },
    { texto: "EU CONSIGO", fala: "Eu consigo!" },
    { texto: "EU SOU ESPECIAL", fala: "Eu sou especial!" },
    { texto: "EU SOU CAPAZ", fala: "Eu sou capaz!" },
    { texto: "EU SOU CORAJOSA", fala: "Eu sou corajosa!" },
    { texto: "EU APRENDO CADA DIA", fala: "Eu aprendo cada vez mais!" },
  ];

  function montarEspelho() {
    if (!espelhoCartoes) return;
    espelhoCartoes.innerHTML = "";
    AFIRMACOES_ESPELHO.forEach(function (af) {
      const btn = document.createElement("button");
      btn.className = "afirmacao";
      btn.setAttribute("aria-label", af.fala);

      const coracao = document.createElement("span");
      coracao.className = "afirmacao__coracao";
      coracao.setAttribute("aria-hidden", "true");
      coracao.textContent = "💖";

      const txt = document.createElement("span");
      txt.textContent = af.texto;

      btn.appendChild(coracao);
      btn.appendChild(txt);

      btn.addEventListener("click", function () {
        btn.classList.add("afirmacao--ativa");
        setTimeout(function () {
          btn.classList.remove("afirmacao--ativa");
        }, 900);
        // A Kiara/Antonella diz a afirmação em voz alta.
        Voz.falar(af.fala);
      });

      espelhoCartoes.appendChild(btn);
    });
  }

  function abrirEspelho() {
    montarEspelho();
    trocarTela(telaEspelho, telaMenu);
    Voz.falar("Você é muito especial, Antonella! Toque e repita comigo.");
  }

  if (btnEspelho) {
    btnEspelho.addEventListener("click", abrirEspelho);
  }
  if (espelhoVoltar) {
    espelhoVoltar.addEventListener("click", function () {
      Voz.parar();
      trocarTela(telaMenu, telaEspelho);
    });
  }

  // Monta os cards da tela de seleção de fases a partir de FASES.
  function montarSelecaoFases() {
    if (!listaFases || typeof FASES === "undefined") return;
    listaFases.innerHTML = "";
    FASES.forEach(function (fase, indice) {
      const idxFase = indice; // guarda o índice para o clique
      const botao = document.createElement("button");
      botao.className = "card card--fase";
      botao.setAttribute("aria-label", "Fase " + fase.titulo);

      const num = document.createElement("span");
      num.className = "card--fase__num";
      num.textContent = indice === 0 ? "★" : indice; // abertura vira estrela

      // Marca de fase concluída (estrela dourada no canto).
      const concluida =
        typeof Kiara !== "undefined" && Kiara.faseConcluida(fase.id);
      if (concluida) {
        botao.classList.add("card--fase-feita");
        const selo = document.createElement("span");
        selo.className = "card--fase__selo";
        selo.setAttribute("aria-hidden", "true");
        selo.textContent = "⭐";
        botao.appendChild(selo);
        botao.setAttribute("aria-label", "Fase " + fase.titulo + " (concluída)");
      }

      const fig = document.createElement("span");
      fig.className = "card__figura";
      fig.setAttribute("aria-hidden", "true");
      fig.textContent = fase.icone || "🎮";

      const nome = document.createElement("span");
      nome.className = "card__nome";
      nome.textContent = fase.titulo;

      botao.appendChild(num);
      botao.appendChild(fig);
      botao.appendChild(nome);

      // Fala o nome da fase ao passar o mouse / focar / tocar.
      function falarFase() {
        Voz.falar(fase.titulo);
      }
      botao.addEventListener("mouseenter", falarFase);
      botao.addEventListener("focus", falarFase);
      botao.addEventListener("touchstart", falarFase, { passive: true });

      botao.addEventListener("click", function () {
        // Navegação instantânea: entra na fase na hora e a Kiara fala em
        // paralelo. Mais fluido do que esperar a narração terminar.
        iniciarFase(fase, idxFase);
        Voz.falar("Vamos jogar... " + fase.titulo + "!");
      });

      listaFases.appendChild(botao);
    });
  }

  function abrirSelecaoFases() {
    montarSelecaoFases();
    trocarTela(telaFases, telaMenu);
  }

  btnJogar.addEventListener("click", function () {
    // Abre a seleção na hora e fala em paralelo (navegação instantânea).
    abrirSelecaoFases();
    Voz.falar("Vamos brincar, " + NOME + "! Escolha uma fase.", {
      audio: "vamos_brincar",
    });
  });

  if (fasesVoltar) {
    fasesVoltar.addEventListener("click", function () {
      Voz.parar();
      trocarTela(telaMenu, telaFases);
    });
  }

  if (fase1Voltar) {
    fase1Voltar.addEventListener("click", function () {
      Voz.parar();
      trocarTela(telaFases, telaFase1);
    });
  }

  // ---------------- Modo "A Caçada dos Sons" ----------------
  function atualizarPlacarCacada() {
    if (!cacadaPlacar) return;
    cacadaPlacar.textContent = estrelas <= 5 ? "⭐".repeat(estrelas) : "⭐ x" + estrelas;
  }

  function refsCacada() {
    return {
      rotina: document.getElementById("rotina-teacch"),
      temas: document.getElementById("cacada-temas"),
      cenario: document.getElementById("cacada-cenario"),
      instrucao: document.getElementById("cacada-instrucao"),
      palco: document.getElementById("cacada-palco"),
      pecs: document.getElementById("cacada-pecs"),
      feedback: feedbackEl,
    };
  }

  // Reinicia a Caçada oferecendo a escolha de tema novamente.
  function rodarCacada() {
    Cacada.iniciar(refsCacada(), {
      aoConcluir: function () {
        // Concluir um tema da Caçada rende a medalha de Caçadora de Sons.
        if (typeof Kiara !== "undefined") Kiara.darMedalha("caçadora");
        rodarCacada();
      },
    });
  }

  function iniciarCacada() {
    trocarTela(telaCacada, telaMenu);
    estrelas = 0;
    atualizarPlacarCacada();

    Cacada.aoGanharEstrela = function () {
      estrelas++;
      atualizarPlacarCacada();
    };

    rodarCacada();
  }

  if (btnCacada) {
    btnCacada.addEventListener("click", function () {
      // Entra na Caçada na hora e fala em paralelo (navegação instantânea).
      iniciarCacada();
      Voz.falar("Vamos para a Caçada dos Sons, " + NOME + "!", {
        audio: "vamos_cacada",
      });
    });
  }

  if (cacadaVoltar) {
    cacadaVoltar.addEventListener("click", function () {
      Cacada.encerrar();
      trocarTela(telaMenu, telaCacada);
    });
  }

  btnOuvirTitulo.addEventListener("click", function () {
    Voz.falar(TITULO, { audio: "titulo" });
  });

  btnOuvirPalavra.addEventListener("click", repetirPalavra);

  btnVoltar.addEventListener("click", function () {
    Voz.parar();
    trocarTela(telaMenu, telaJogo);
  });

  // ---------------- Boas-vindas ----------------
  // Muitos navegadores exigem interação do usuário antes de tocar áudio,
  // por isso a primeira narração forte acontece no clique de JOGAR.
  // Aqui apenas deixamos o placar zerado.
  atualizarPlacar();
});
