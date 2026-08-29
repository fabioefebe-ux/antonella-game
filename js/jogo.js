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
    esconder.classList.remove("tela--ativa");
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
      mostrarFeedback("⭐ PARABÉNS, " + NOME + "! VOCÊ CONSEGUIU! ⭐", "acerto");
      Voz.falar("Parabéns, " + NOME + "! Você conseguiu!", {
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
      Voz.falar("Quase lá, " + NOME + "! Tente ouvir de novo.");
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

  function iniciarFase(fase) {
    trocarTela(telaFase1, telaFases);
    estrelas = 0;
    atualizarPlacarFase1();

    // Título da fase aparece no placar de progresso via o próprio motor.
    // Cada acerto de cena soma uma estrela no placar da fase.
    Fase1.aoGanharEstrela = function () {
      estrelas++;
      atualizarPlacarFase1();
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
          // Ao terminar a fase, volta para a seleção de fases.
          setTimeout(function () {
            trocarTela(telaFases, telaFase1);
          }, 1200);
        },
      }
    );
  }

  // Monta os cards da tela de seleção de fases a partir de FASES.
  function montarSelecaoFases() {
    if (!listaFases || typeof FASES === "undefined") return;
    listaFases.innerHTML = "";
    FASES.forEach(function (fase, indice) {
      const botao = document.createElement("button");
      botao.className = "card card--fase";
      botao.setAttribute("aria-label", "Fase " + fase.titulo);

      const num = document.createElement("span");
      num.className = "card--fase__num";
      num.textContent = indice === 0 ? "★" : indice; // abertura vira estrela

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
        Voz.falar("Vamos jogar... " + fase.titulo + "!", {
          aoTerminar: function () {
            iniciarFase(fase);
          },
        });
        if (!Voz.suportado) iniciarFase(fase);
      });

      listaFases.appendChild(botao);
    });
  }

  function abrirSelecaoFases() {
    montarSelecaoFases();
    trocarTela(telaFases, telaMenu);
  }

  btnJogar.addEventListener("click", function () {
    // Fala ao ser clicado e abre a seleção de fases.
    Voz.falar("Vamos brincar, " + NOME + "! Escolha uma fase.", {
      aoTerminar: abrirSelecaoFases,
    });
    // Segurança: se a voz não estiver disponível, abre a seleção mesmo assim.
    if (!Voz.suportado) abrirSelecaoFases();
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
    Cacada.iniciar(refsCacada(), { aoConcluir: rodarCacada });
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
      Voz.falar("Vamos para a Caçada dos Sons, " + NOME + "!", {
        aoTerminar: iniciarCacada,
      });
      if (!Voz.suportado) iniciarCacada();
    });
  }

  if (cacadaVoltar) {
    cacadaVoltar.addEventListener("click", function () {
      Cacada.encerrar();
      trocarTela(telaMenu, telaCacada);
    });
  }

  btnOuvirTitulo.addEventListener("click", function () {
    Voz.falar(TITULO);
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
