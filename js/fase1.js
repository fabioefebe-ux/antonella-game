/* ========================================================================
   MOTOR DE FASE — História interativa com três mecânicas de desafio
   --------------------------------------------------------------------------
   Este arquivo é o MOTOR: ele sabe renderizar qualquer cena, seja qual for
   a fase. O CONTEÚDO das fases fica em js/fases.js (constante FASES).

   Cada cena tem um "tipo":

   1) tipo: "fonico"    -> Ache o card que começa com a letra/sílaba.
        campos: historia, pista, enunciado, cards[{nome,figura}], correta
        (opcional) personagem:true -> muda o enunciado para "primeira letra"

   2) tipo: "arrasta"   -> Complete a palavra ARRASTANDO a sílaba certa até a
                           lacuna (drag and drop).
        campos: historia, figura, palavra, inicio, lacuna, fim, opcoes[]

   3) tipo: "microfone" -> A criança FALA o nome do que vê.
        campos: historia, figura, resposta, sinonimos[] (opcional)

   Tudo é narrado em pt-BR. Feedback afetivo, sem punição.
   ======================================================================== */

const Fase1 = (function () {
  const NOME = "Antonella";

  let el = {};
  let faseCorrente = null; // fase atualmente em jogo (objeto de FASES)
  let cenas = [];          // atalho para faseCorrente.cenas
  let indiceCena = 0;
  let cenaAtual = null;
  let bloqueado = false;
  let aoConcluir = null;

  // ---------------- Utilidades ----------------
  function embaralhar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function mostrarFeedback(texto, tipo) {
    if (!el.feedback) return;
    el.feedback.textContent = texto;
    el.feedback.className = "feedback feedback--visivel feedback--" + tipo;
    clearTimeout(mostrarFeedback._t);
    mostrarFeedback._t = setTimeout(function () {
      el.feedback.classList.remove("feedback--visivel");
    }, 3200);
  }

  function limparPalco() {
    if (el.cards) el.cards.innerHTML = "";
    if (el.palco) el.palco.innerHTML = "";
  }

  // ---------------- Sucesso / erro compartilhados ----------------
  function comemorarEAvancar() {
    bloqueado = true;
    Confete.explodir(160);
    mostrarFeedback("⭐ PARABÉNS, " + NOME + "! VOCÊ CONSEGUIU! ⭐", "acerto");
    if (typeof Fase1.aoGanharEstrela === "function") Fase1.aoGanharEstrela();
    Voz.falar("Parabéns, " + NOME + "! Você conseguiu!", {
      audio: "parabens",
      aoTerminar: function () {
        setTimeout(avancarCena, 700);
      },
    });
  }

  function incentivarErro() {
    mostrarFeedback("QUASE LÁ, " + NOME + "! TENTE OUVIR DE NOVO 🔊", "erro");
    Voz.falar("Quase lá, " + NOME + "! Tente ouvir de novo.", { audio: "quase_la" });
  }

  // ---------------- Renderização por tipo ----------------
  function renderizarCena() {
    bloqueado = false;
    cenaAtual = cenas[indiceCena];
    limparPalco();

    el.historia.textContent = cenaAtual.historia;
    el.progresso.textContent =
      "CENA " + (indiceCena + 1) + " DE " + cenas.length;

    const tipo = cenaAtual.tipo || "fonico";
    if (tipo === "arrasta") renderizarArrasta();
    else if (tipo === "microfone") renderizarMicrofone();
    else if (tipo === "contar") renderizarContar();
    else if (tipo === "parear") renderizarParear();
    else if (tipo === "sinonimo") renderizarSinonimo();
    else if (tipo === "tamanho") renderizarTamanho();
    else if (tipo === "separar") renderizarSeparar();
    else renderizarFonico();
  }

  function narrarHistoria(depois) {
    Voz.falar(cenaAtual.historia, {
      aoTerminar: typeof depois === "function" ? depois : undefined,
    });
  }

  // ========== TIPO 1: FÔNICO (achar o card) ==========
  function renderizarFonico() {
    // enunciadoLivre: texto/narração personalizados (ex.: pontuação), quando a
    // frase padrão "ache o que começa..." não faz sentido. É opcional e não
    // afeta as cenas antigas.
    if (cenaAtual.enunciadoLivre) {
      el.desafio.textContent =
        cenaAtual.enunciadoLivre.toUpperCase() +
        (cenaAtual.pista ? " ➔ " + cenaAtual.pista : "");
    } else if (cenaAtual.personagem) {
      // Cenas de "primeira letra do nome" (Caça às Letras) têm outro enunciado.
      el.desafio.textContent =
        "ACHE A PRIMEIRA LETRA DE " +
        cenaAtual.enunciado.toUpperCase().replace("O NOME ", "") +
        " ➔ " +
        cenaAtual.pista;
    } else {
      el.desafio.textContent =
        "ACHE O QUE COMEÇA " +
        cenaAtual.enunciado.toUpperCase() +
        " ➔ " +
        cenaAtual.pista;
    }

    embaralhar(cenaAtual.cards).forEach(function (card) {
      el.cards.appendChild(criarCard(card));
    });

    narrarHistoria(function () {
      if (cenaAtual.narracaoDesafio) {
        Voz.falar(cenaAtual.narracaoDesafio);
      } else if (cenaAtual.personagem) {
        Voz.falar(
          "Agora, " + NOME + ", ache a primeira letra " + cenaAtual.enunciado + "."
        );
      } else {
        Voz.falar("Agora, " + NOME + ", ache o que começa " + cenaAtual.enunciado + ".");
      }
    });
  }

  function criarCard(card) {
    const botao = document.createElement("button");
    botao.className = "card";
    botao.setAttribute("aria-label", card.nome);

    const fig = document.createElement("span");
    fig.className = "card__figura";
    fig.setAttribute("aria-hidden", "true");
    fig.textContent = card.figura;

    const nome = document.createElement("span");
    nome.className = "card__nome";
    nome.textContent = card.nome;

    botao.appendChild(fig);
    botao.appendChild(nome);

    function falarNome() {
      if (bloqueado) return;
      Voz.falar(card.nome);
    }
    botao.addEventListener("mouseenter", falarNome);
    botao.addEventListener("focus", falarNome);
    botao.addEventListener("touchstart", falarNome, { passive: true });

    botao.addEventListener("click", function () {
      if (bloqueado) return;
      if (card.nome === cenaAtual.correta) {
        botao.classList.add("card--acerto");
        comemorarEAvancar();
      } else {
        botao.classList.add("card--erro");
        setTimeout(function () {
          botao.classList.remove("card--erro");
        }, 500);
        incentivarErro();
      }
    });

    return botao;
  }

  // ========== TIPO 2: ARRASTA E SOLTA (montar palavra) ==========
  function renderizarArrasta() {
    el.desafio.textContent = "COMPLETE A PALAVRA ARRASTANDO A SÍLABA CERTA ➔";

    // Figura do que a palavra representa.
    const fig = document.createElement("div");
    fig.className = "palco__figura";
    fig.setAttribute("aria-hidden", "true");
    fig.textContent = cenaAtual.figura;
    el.palco.appendChild(fig);

    // Palavra com uma lacuna (drop zone) no meio.
    const linha = document.createElement("div");
    linha.className = "palavra-montar";

    if (cenaAtual.inicio) {
      const ini = document.createElement("span");
      ini.className = "palavra-montar__fixo";
      ini.textContent = cenaAtual.inicio;
      linha.appendChild(ini);
    }

    const lacuna = document.createElement("div");
    lacuna.className = "lacuna";
    lacuna.setAttribute("aria-label", "Lacuna da palavra");
    lacuna.textContent = "___";
    linha.appendChild(lacuna);

    if (cenaAtual.fim) {
      const fim = document.createElement("span");
      fim.className = "palavra-montar__fixo";
      fim.textContent = cenaAtual.fim;
      linha.appendChild(fim);
    }
    el.palco.appendChild(linha);

    // Balões coloridos com as sílabas.
    const baloes = document.createElement("div");
    baloes.className = "baloes";
    el.palco.appendChild(baloes);

    embaralhar(cenaAtual.opcoes).forEach(function (silaba) {
      baloes.appendChild(criarBalao(silaba, lacuna));
    });

    // Permite soltar na lacuna.
    ativarDropZone(lacuna, baloes);

    narrarHistoria(function () {
      Voz.falar(
        "Arraste a sílaba certa para completar a palavra " +
          cenaAtual.palavra +
          ", " +
          NOME +
          "."
      );
    });
  }

  function criarBalao(silaba, lacuna) {
    const balao = document.createElement("button");
    balao.className = "balao";
    balao.textContent = silaba;
    balao.setAttribute("draggable", "true");
    balao.setAttribute("aria-label", "Sílaba " + silaba);
    balao.dataset.silaba = silaba;

    // Fala a sílaba ao passar o mouse / focar.
    function falarSilaba() {
      if (bloqueado) return;
      Voz.falar(silaba);
    }
    balao.addEventListener("mouseenter", falarSilaba);
    balao.addEventListener("focus", falarSilaba);

    // --- Drag com mouse (HTML5 Drag and Drop) ---
    balao.addEventListener("dragstart", function (ev) {
      if (bloqueado) {
        ev.preventDefault();
        return;
      }
      ev.dataTransfer.setData("text/plain", silaba);
      balao.classList.add("balao--arrastando");
    });
    balao.addEventListener("dragend", function () {
      balao.classList.remove("balao--arrastando");
    });

    // --- Alternativa por clique/toque: clicar no balão tenta encaixar ---
    balao.addEventListener("click", function () {
      if (bloqueado) return;
      tentarEncaixar(silaba, balao, lacuna);
    });

    // --- Toque: arrastar com o dedo ---
    ativarToqueArrasto(balao, lacuna, silaba);

    return balao;
  }

  function ativarDropZone(lacuna, baloes) {
    lacuna.addEventListener("dragover", function (ev) {
      if (bloqueado) return;
      ev.preventDefault(); // necessário para permitir o drop
      lacuna.classList.add("lacuna--sobre");
    });
    lacuna.addEventListener("dragleave", function () {
      lacuna.classList.remove("lacuna--sobre");
    });
    lacuna.addEventListener("drop", function (ev) {
      ev.preventDefault();
      lacuna.classList.remove("lacuna--sobre");
      if (bloqueado) return;
      const silaba = ev.dataTransfer.getData("text/plain");
      const balao = baloes.querySelector('[data-silaba="' + silaba + '"]');
      tentarEncaixar(silaba, balao, lacuna);
    });
  }

  // Suporte a toque: mede o dedo e detecta se soltou sobre a lacuna.
  function ativarToqueArrasto(balao, lacuna, silaba) {
    let arrastando = false;
    let clone = null;

    balao.addEventListener(
      "touchstart",
      function () {
        if (bloqueado) return;
        arrastando = true;
        balao.classList.add("balao--arrastando");
      },
      { passive: true }
    );

    balao.addEventListener(
      "touchmove",
      function (ev) {
        if (!arrastando) return;
        const toque = ev.touches[0];
        // Move um clone visual acompanhando o dedo.
        if (!clone) {
          clone = balao.cloneNode(true);
          clone.classList.add("balao--fantasma");
          document.body.appendChild(clone);
        }
        clone.style.left = toque.clientX + "px";
        clone.style.top = toque.clientY + "px";
      },
      { passive: true }
    );

    balao.addEventListener("touchend", function (ev) {
      if (!arrastando) return;
      arrastando = false;
      balao.classList.remove("balao--arrastando");
      if (clone) {
        clone.remove();
        clone = null;
      }
      const toque = ev.changedTouches[0];
      const alvo = document.elementFromPoint(toque.clientX, toque.clientY);
      if (alvo && (alvo === lacuna || lacuna.contains(alvo))) {
        tentarEncaixar(silaba, balao, lacuna);
      }
    });
  }

  function tentarEncaixar(silaba, balao, lacuna) {
    if (bloqueado) return;
    if (silaba === cenaAtual.lacuna) {
      // Encaixou certo: preenche a lacuna e comemora.
      lacuna.textContent = silaba;
      lacuna.classList.add("lacuna--preenchida");
      if (balao) balao.classList.add("balao--usado");
      Voz.falar("A palavra é " + cenaAtual.palavra + "!");
      setTimeout(comemorarEAvancar, 400);
    } else {
      if (balao) {
        balao.classList.add("balao--erro");
        setTimeout(function () {
          balao.classList.remove("balao--erro");
        }, 500);
      }
      incentivarErro();
    }
  }

  // ========== TIPO 3: MICROFONE (falar o nome do bichinho) ==========
  function renderizarMicrofone() {
    el.desafio.textContent = "🎙️ FALE O NOME DO BICHINHO QUE VOCÊ VÊ!";

    const fig = document.createElement("div");
    fig.className = "palco__figura palco__figura--grande";
    fig.setAttribute("aria-hidden", "true");
    fig.textContent = cenaAtual.figura;
    el.palco.appendChild(fig);

    const btnMic = document.createElement("button");
    btnMic.className = "botao botao--microfone";
    btnMic.innerHTML =
      '<span aria-hidden="true">🎙️</span><span class="botao__texto-pequeno">FALAR</span>';
    btnMic.setAttribute("aria-label", "Falar o nome do bichinho");
    el.palco.appendChild(btnMic);

    const dica = document.createElement("p");
    dica.className = "palco__dica";
    el.palco.appendChild(dica);

    // A figura SEMPRE avança ao ser tocada. Isso garante que a criança nunca
    // fique presa se o microfone falhar (permissão negada, celular sem suporte
    // estável, etc.) — princípio ABA: sempre há um caminho para o sucesso.
    fig.style.cursor = "pointer";
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "Toque para continuar");
    fig.addEventListener("click", function () {
      if (!bloqueado) comemorarEAvancar();
    });

    if (!Microfone.suportado) {
      // Sem reconhecimento: esconde o botão de microfone e orienta o toque.
      btnMic.hidden = true;
      dica.textContent = "TOQUE NO BICHINHO PARA CONTINUAR 👆";
    } else {
      btnMic.addEventListener("click", function () {
        if (bloqueado) return;
        escutarResposta(btnMic, dica);
      });
      dica.textContent = "TOQUE NO 🎙️ PARA FALAR — OU NO BICHINHO PARA CONTINUAR";
    }

    narrarHistoria(function () {
      Voz.falar(NOME + ", fale o nome do bichinho que você vê! Toque no microfone.");
    });
  }

  function escutarResposta(btnMic, dica) {
    const esperados = [cenaAtual.resposta].concat(cenaAtual.sinonimos || []);

    // Silencia qualquer narração antes de ouvir: o reconhecimento de fala e o
    // TTS competem pelo áudio no celular, e ouvir a própria voz do jogo
    // atrapalha o reconhecimento.
    Voz.parar();

    Microfone.ouvir({
      aoComecar: function () {
        btnMic.classList.add("botao--ouvindo");
        dica.textContent = "🎧 ESTOU OUVINDO...";
      },
      aoResultado: function (alternativas) {
        const acertou = esperados.some(function (palavra) {
          return Microfone.corresponde(alternativas, palavra);
        });
        if (acertou) {
          comemorarEAvancar();
        } else {
          const ouvido = (alternativas[0] || "").toUpperCase();
          dica.textContent = ouvido ? "OUVI: " + ouvido : "";
          incentivarErro();
        }
      },
      aoErro: function (motivo) {
        if (motivo === "not-allowed" || motivo === "service-not-allowed") {
          // Permissão negada: o microfone não vai funcionar. Orienta o toque.
          dica.textContent = "SEM PERMISSÃO PARA O 🎙️ — TOQUE NO BICHINHO PARA CONTINUAR 👆";
          Voz.falar("Sem problema! Toque no bichinho para continuar.");
        } else if (motivo === "no-speech") {
          dica.textContent = "NÃO OUVI NADA. TENTE DE NOVO OU TOQUE NO BICHINHO 👆";
          Voz.falar("Não ouvi nada, " + NOME + ". Tente de novo, ou toque no bichinho.");
        } else if (motivo === "nao-suportado") {
          dica.textContent = "TOQUE NO BICHINHO PARA CONTINUAR 👆";
        } else {
          dica.textContent = "TENTE DE NOVO OU TOQUE NO BICHINHO 👆";
        }
      },
      aoTerminar: function () {
        btnMic.classList.remove("botao--ouvindo");
      },
    });
  }

  // ========== TIPO 4: CONTAR SÍLABAS ==========
  // A cena traz: figura, palavra e silabas[] (ex.: ["CE","BO","LA"]). A criança
  // ouve a palavra batida em sílabas e escolhe QUANTAS são, tocando no número.
  function renderizarContar() {
    el.desafio.textContent = "QUANTAS SÍLABAS TEM ESTA PALAVRA? 👏";

    const silabas = cenaAtual.silabas || [];
    const total = silabas.length;

    // Figura grande do que a palavra representa.
    const fig = document.createElement("div");
    fig.className = "palco__figura palco__figura--grande";
    fig.setAttribute("aria-hidden", "true");
    fig.textContent = cenaAtual.figura;
    el.palco.appendChild(fig);

    // A palavra com as sílabas separadas por tracinho (apoio visual).
    const palavra = document.createElement("div");
    palavra.className = "silabas-palavra";
    silabas.forEach(function (s, i) {
      const bloco = document.createElement("span");
      bloco.className = "silabas-palavra__silaba";
      bloco.textContent = s;
      palavra.appendChild(bloco);
      if (i < total - 1) {
        const traco = document.createElement("span");
        traco.className = "silabas-palavra__traco";
        traco.setAttribute("aria-hidden", "true");
        traco.textContent = "-";
        palavra.appendChild(traco);
      }
    });
    el.palco.appendChild(palavra);

    // Botão para ouvir a palavra "batida" sílaba por sílaba (consciência
    // silábica: cada sílaba é falada com uma pausa, como uma palma).
    const btnOuvir = document.createElement("button");
    btnOuvir.className = "botao botao--audio botao--audio-grande";
    btnOuvir.innerHTML =
      '<span aria-hidden="true">👏</span><span class="botao__texto-pequeno">OUVIR AS SÍLABAS</span>';
    btnOuvir.setAttribute("aria-label", "Ouvir a palavra em sílabas");
    function baterSilabas() {
      // Anima cada bloco de sílaba enquanto fala, uma de cada vez.
      const blocos = palavra.querySelectorAll(".silabas-palavra__silaba");
      let i = 0;
      (function proxima() {
        if (i >= silabas.length) return;
        const b = blocos[i];
        if (b) b.classList.add("silabas-palavra__silaba--ativa");
        Voz.falar(silabas[i], {
          aoTerminar: function () {
            if (b) b.classList.remove("silabas-palavra__silaba--ativa");
            i++;
            setTimeout(proxima, 150);
          },
        });
      })();
    }
    btnOuvir.onclick = baterSilabas;
    el.palco.appendChild(btnOuvir);

    // Cards de números para escolher. Mostra de 1 até o maior número entre as
    // opções desta cena (ou até o total + 1, garantindo alternativas).
    const numeros = cenaAtual.numeros || [1, 2, 3, 4];
    const linhaNums = document.createElement("div");
    linhaNums.className = "numeros-silabas";
    embaralhar(numeros).forEach(function (n) {
      const btn = document.createElement("button");
      btn.className = "card card--numero";
      btn.setAttribute("aria-label", n + (n === 1 ? " sílaba" : " sílabas"));
      btn.textContent = String(n);
      btn.onclick = function () {
        if (bloqueado) return;
        if (n === total) {
          btn.classList.add("card--acerto");
          comemorarEAvancar();
        } else {
          btn.classList.add("card--erro");
          setTimeout(function () {
            btn.classList.remove("card--erro");
          }, 500);
          incentivarErro();
        }
      };
      linhaNums.appendChild(btn);
    });
    el.palco.appendChild(linhaNums);

    // Narra a história e, ao terminar, bate as sílabas automaticamente.
    narrarHistoria(function () {
      Voz.falar("Vamos contar as sílabas de " + cenaAtual.palavra + ".", {
        aoTerminar: baterSilabas,
      });
    });
  }

  // ========== TIPO 5: PAREAR (mesma palavra em MAIÚSCULA e minúscula) ==========
  // A cena traz: alvo (palavra em MAIÚSCULA) e opcoes[] (a mesma palavra e
  // outras, TODAS em minúscula). A criança acha a versão minúscula que é a
  // mesma palavra do alvo. Ensina que a palavra é a mesma em tipos de letra
  // diferentes. A comparação ignora maiúsculas/acentos (tolerante).
  function renderizarParear() {
    el.desafio.textContent = "ACHE A MESMA PALAVRA EM LETRA PEQUENA 👇";

    // Palavra-alvo em MAIÚSCULA, bem grande e em destaque.
    if (cenaAtual.figura) {
      const fig = document.createElement("div");
      fig.className = "palco__figura";
      fig.setAttribute("aria-hidden", "true");
      fig.textContent = cenaAtual.figura;
      el.palco.appendChild(fig);
    }

    const alvo = document.createElement("div");
    alvo.className = "parear-alvo";
    alvo.textContent = cenaAtual.alvo;
    el.palco.appendChild(alvo);

    // Compara ignorando caixa e acentos (ex.: "SORVETE" casa com "sorvete").
    function mesma(a, b) {
      const norm = function (s) {
        return (s || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();
      };
      return norm(a) === norm(b);
    }

    // Cards com as opções em minúscula.
    const linha = document.createElement("div");
    linha.className = "cards";
    embaralhar(cenaAtual.opcoes).forEach(function (palavra) {
      const btn = document.createElement("button");
      btn.className = "card card--palavra-min";
      btn.setAttribute("aria-label", palavra);
      btn.textContent = palavra; // fica em minúscula via CSS (text-transform)

      // Fala a palavra ao passar o mouse / focar.
      function falar() {
        if (!bloqueado) Voz.falar(palavra);
      }
      btn.addEventListener("mouseenter", falar);
      btn.addEventListener("focus", falar);

      btn.onclick = function () {
        if (bloqueado) return;
        if (mesma(palavra, cenaAtual.alvo)) {
          btn.classList.add("card--acerto");
          comemorarEAvancar();
        } else {
          btn.classList.add("card--erro");
          setTimeout(function () {
            btn.classList.remove("card--erro");
          }, 500);
          incentivarErro();
        }
      };
      linha.appendChild(btn);
    });
    el.palco.appendChild(linha);

    narrarHistoria(function () {
      Voz.falar(
        "Ache a palavra " + cenaAtual.alvo + " escrita com letra pequena, " + NOME + "."
      );
    });
  }

  // ========== TIPO 6: SINÔNIMO (palavra que significa o mesmo) ==========
  // A cena traz: palavra (referência) e opcoes[] com { texto, certa }. A
  // criança acha a palavra que quer dizer a MESMA coisa. Vocabulário simples
  // e concreto. A opção correta é marcada com certa:true (não é comparada por
  // texto, pois o sinônimo é uma palavra DIFERENTE).
  function renderizarSinonimo() {
    el.desafio.textContent = "ACHE A PALAVRA QUE QUER DIZER O MESMO 💬";

    if (cenaAtual.emoji) {
      const fig = document.createElement("div");
      fig.className = "palco__figura";
      fig.setAttribute("aria-hidden", "true");
      fig.textContent = cenaAtual.emoji;
      el.palco.appendChild(fig);
    }

    // Palavra de referência em destaque.
    const alvo = document.createElement("div");
    alvo.className = "parear-alvo";
    alvo.textContent = cenaAtual.palavra;
    el.palco.appendChild(alvo);

    // Cards com as opções de sinônimo.
    const linha = document.createElement("div");
    linha.className = "cards";
    embaralhar(cenaAtual.opcoes).forEach(function (op) {
      const btn = document.createElement("button");
      btn.className = "card card--palavra";
      btn.setAttribute("aria-label", op.texto);

      const nome = document.createElement("span");
      nome.className = "card__nome";
      nome.textContent = op.texto;
      btn.appendChild(nome);

      function falar() {
        if (!bloqueado) Voz.falar(op.texto);
      }
      btn.addEventListener("mouseenter", falar);
      btn.addEventListener("focus", falar);

      btn.onclick = function () {
        if (bloqueado) return;
        if (op.certa) {
          btn.classList.add("card--acerto");
          comemorarEAvancar();
        } else {
          btn.classList.add("card--erro");
          setTimeout(function () {
            btn.classList.remove("card--erro");
          }, 500);
          incentivarErro();
        }
      };
      linha.appendChild(btn);
    });
    el.palco.appendChild(linha);

    narrarHistoria(function () {
      Voz.falar(
        "Ache a palavra que quer dizer o mesmo que " + cenaAtual.palavra + ", " + NOME + "."
      );
    });
  }

  // ========== TIPO 7: TAMANHO (achar a palavra GRANDE ou pequena) ==========
  // A cena traz: palavra e alvo ("grande" ou "pequeno"). O motor mostra a
  // MESMA palavra em dois tamanhos e a criança acha a do tamanho pedido.
  // Trabalha a percepção visual do texto (destaque/tamanho da letra).
  function renderizarTamanho() {
    const querGrande = (cenaAtual.alvo || "grande").toLowerCase() === "grande";
    el.desafio.textContent = querGrande
      ? "ACHE A PALAVRA GRANDE 🔎"
      : "ACHE A PALAVRA PEQUENA 🔎";

    if (cenaAtual.emoji) {
      const fig = document.createElement("div");
      fig.className = "palco__figura";
      fig.setAttribute("aria-hidden", "true");
      fig.textContent = cenaAtual.emoji;
      el.palco.appendChild(fig);
    }

    // Dois cards com a MESMA palavra: um grande, um pequeno.
    const linha = document.createElement("div");
    linha.className = "cards";

    // certoGrande = true => o card grande é o correto.
    const dados = [
      { grande: true },
      { grande: false },
    ];
    embaralhar(dados).forEach(function (d) {
      const btn = document.createElement("button");
      btn.className =
        "card card--tamanho " +
        (d.grande ? "card--texto-grande" : "card--texto-pequeno");
      btn.setAttribute(
        "aria-label",
        cenaAtual.palavra + (d.grande ? " grande" : " pequena")
      );
      btn.textContent = cenaAtual.palavra;

      btn.onclick = function () {
        if (bloqueado) return;
        if (d.grande === querGrande) {
          btn.classList.add("card--acerto");
          comemorarEAvancar();
        } else {
          btn.classList.add("card--erro");
          setTimeout(function () {
            btn.classList.remove("card--erro");
          }, 500);
          incentivarErro();
        }
      };
      linha.appendChild(btn);
    });
    el.palco.appendChild(linha);

    narrarHistoria(function () {
      Voz.falar(
        "Ache a palavra " +
          cenaAtual.palavra +
          " escrita " +
          (querGrande ? "bem grande" : "pequenininha") +
          ", " +
          NOME +
          "."
      );
    });
  }

  // ========== TIPO 8: SEPARAR (achar o espaço entre palavras) ==========
  // A cena traz: grudada (duas palavras coladas, ex.: "OGATO") e opcoes[] com
  // { texto, certa } mostrando separações possíveis ("O GATO", "OG ATO"...).
  // A criança acha onde fica o espaço. Trabalha o espaçamento entre palavras.
  function renderizarSeparar() {
    el.desafio.textContent = "ACHE ONDE FICA O ESPAÇO ENTRE AS PALAVRAS ✂️";

    if (cenaAtual.emoji) {
      const fig = document.createElement("div");
      fig.className = "palco__figura";
      fig.setAttribute("aria-hidden", "true");
      fig.textContent = cenaAtual.emoji;
      el.palco.appendChild(fig);
    }

    // Palavras grudadas em destaque (sem espaço).
    const grudada = document.createElement("div");
    grudada.className = "parear-alvo";
    grudada.textContent = cenaAtual.grudada;
    el.palco.appendChild(grudada);

    // Cards com as opções de separação.
    const linha = document.createElement("div");
    linha.className = "cards";
    embaralhar(cenaAtual.opcoes).forEach(function (op) {
      const btn = document.createElement("button");
      btn.className = "card card--palavra";
      btn.setAttribute("aria-label", op.texto);

      const nome = document.createElement("span");
      nome.className = "card__nome";
      nome.textContent = op.texto;
      btn.appendChild(nome);

      function falar() {
        if (!bloqueado) Voz.falar(op.texto);
      }
      btn.addEventListener("mouseenter", falar);
      btn.addEventListener("focus", falar);

      btn.onclick = function () {
        if (bloqueado) return;
        if (op.certa) {
          btn.classList.add("card--acerto");
          comemorarEAvancar();
        } else {
          btn.classList.add("card--erro");
          setTimeout(function () {
            btn.classList.remove("card--erro");
          }, 500);
          incentivarErro();
        }
      };
      linha.appendChild(btn);
    });
    el.palco.appendChild(linha);

    narrarHistoria(function () {
      Voz.falar(
        "Ache onde fica o espaço para separar as palavras, " + NOME + "."
      );
    });
  }

  // ---------------- Avanço / fim ----------------
  function avancarCena() {
    indiceCena++;
    if (indiceCena < cenas.length) {
      renderizarCena();
    } else {
      Confete.explodir(220);
      mostrarFeedback("🎉 VOCÊ TERMINOU A FASE, " + NOME + "! 🎉", "acerto");
      Voz.falar(
        "Uau, " + NOME + "! Você terminou a fase inteira! Que orgulho!",
        {
          audio: "terminou_fase",
          aoTerminar: function () {
            if (typeof aoConcluir === "function") aoConcluir();
          },
        }
      );
    }
  }

  // ---------------- API pública ----------------
  // refs: elementos de DOM da tela da fase
  // opcoes.fase: objeto de fase (de FASES). Se ausente, usa FASES[0].
  function iniciar(refs, opcoes) {
    el = refs;
    opcoes = opcoes || {};
    aoConcluir = opcoes.aoConcluir || null;

    // Descobre qual fase jogar (por objeto, por id ou a primeira).
    faseCorrente =
      opcoes.fase ||
      (typeof FASES !== "undefined" ? FASES[0] : { cenas: [] });
    cenas = faseCorrente.cenas || [];
    indiceCena = 0;

    if (el.btnOuvir) {
      el.btnOuvir.onclick = function () {
        if (cenaAtual) narrarHistoria();
      };
    }

    renderizarCena();
  }

  return { iniciar, aoGanharEstrela: null };
})();
