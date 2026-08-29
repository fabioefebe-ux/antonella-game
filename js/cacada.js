/* ========================================================================
   A CAÇADA DOS SONS — Mecânica principal (Método Fônico + ABA + TEACCH/PECS)
   --------------------------------------------------------------------------
   Fluxo pedagógico da atividade:
     1) ENCONTRO DO ALVO  -> a criança acha a figura do tema. O jogo diz
        "Antonella! Você encontrou o LOBO!". Ao clicar na figura, reproduz o
        FONEMA prolongado ("LLLLL-OBO") com animação de vibração no card.
     2) CONSTRUÇÃO COM LETRAS MÓVEIS -> lacunas grandes [ _ ][ O ][ B ][ O ]
        e blocos de letras coloridas arrastáveis. Clicar num bloco toca o
        fonema daquela letra. A criança arrasta a letra certa para a lacuna.
     3) REFORÇO ABA:
        - acerto  -> aplausos (Web Audio) + confete + narração entusiasmada
                     "Muito bem, Antonella! LLLLL com O faz LÓ!"
        - erro    -> sem punição; apenas repete suave o fonema correto.
     4) RECOMPENSA -> estrela no cartão de rotina (TEACCH) + minijogo de 15s
        com o tema escolhido (reforçador positivo).

   Zero leitura: tudo narrado via Voz (pt-BR, rate 0.8).
   ======================================================================== */

/* ------------------------------------------------------------------ */
/* FONEMAS — como cada letra "soa" prolongada (aproximação em pt-BR).  */
/* Consoantes contínuas alongam a letra; oclusivas usam apoio de vogal.*/
/* ------------------------------------------------------------------ */
const Fonema = (function () {
  // Texto que a síntese de voz lê para imitar o fonema prolongado.
  const MAPA = {
    A: "Aaaaa", E: "Eeeee", I: "Iiiii", O: "Ooooo", U: "Uuuuu",
    B: "Bê", C: "Cê", D: "Dê", F: "Fffff", G: "Guê",
    H: "H mudo", J: "Jjjjj", L: "Lllll", M: "Mmmmm", N: "Nnnnn",
    P: "Pê", Q: "Quê", R: "Rrrrr", S: "Sssss", T: "Tê",
    V: "Vvvvv", X: "Xxxxx", Z: "Zzzzz",
    "Ç": "Sssss", "Ã": "Ãaaa", "Õ": "Õooo",
  };

  function de(letra) {
    if (!letra) return "";
    const chave = letra.toUpperCase();
    return MAPA[chave] || chave;
  }

  return { de };
})();

/* ------------------------------------------------------------------ */
/* APLAUSO — som de palmas sintetizado via Web Audio API (sem arquivo).*/
/* ------------------------------------------------------------------ */
const Aplauso = (function () {
  let ctx = null;

  function garantirContexto() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    // Alguns navegadores suspendem o contexto até um gesto do usuário.
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Uma "palma" = ruído branco curto com queda rápida de volume.
  function umaPalma(quando) {
    if (!ctx) return;
    const dur = 0.13;
    const taxa = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, taxa * dur, taxa);
    const dados = buffer.getChannelData(0);
    for (let i = 0; i < dados.length; i++) {
      // Ruído com decaimento exponencial (imita o estalo da palma).
      dados[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / dados.length, 3);
    }
    const fonte = ctx.createBufferSource();
    fonte.buffer = buffer;

    const filtro = ctx.createBiquadFilter();
    filtro.type = "bandpass";
    filtro.frequency.value = 1200 + Math.random() * 600;

    const ganho = ctx.createGain();
    ganho.gain.value = 0.35;

    fonte.connect(filtro);
    filtro.connect(ganho);
    ganho.connect(ctx.destination);
    fonte.start(quando);
  }

  // Salva de palmas: várias palmas em sequência rápida.
  function tocar() {
    const c = garantirContexto();
    if (!c) return;
    const inicio = c.currentTime;
    const quantas = 10;
    for (let i = 0; i < quantas; i++) {
      // Espaçamento irregular deixa mais natural.
      umaPalma(inicio + i * (0.08 + Math.random() * 0.04));
    }
  }

  return { tocar };
})();

/* ------------------------------------------------------------------ */
/* CONTEÚDO DOS TEMAS                                                   */
/* O conteúdo das fases fica em js/temas.js (constante global TEMAS).   */
/* Este motor apenas consome esses dados. Se temas.js não carregar,     */
/* usamos um objeto vazio para não quebrar (a tela mostra sem fases).   */
/* ------------------------------------------------------------------ */
if (typeof window !== "undefined" && typeof window.TEMAS === "undefined") {
  // Garante que a referência exista mesmo se temas.js faltar.
  window.TEMAS = typeof TEMAS !== "undefined" ? TEMAS : {};
}

const Cacada = (function () {
  const NOME = "Antonella";
  const RATE = 0.9; // um pouco mais calma que o padrão (por causa dos fonemas), sem soar arrastada

  let el = {};
  let aoConcluir = null;
  let temaAtual = null;
  let indicePalavra = 0; // qual palavra do tema está em jogo
  let passo = 0; // 0 procurar, 1 ouvir/fonema, 2 montar, 3 prêmio
  let bloqueado = false;

  // Atalho seguro para o Painel do Educador (só registra se existir).
  function registro(metodo) {
    if (typeof Painel === "undefined" || typeof Painel[metodo] !== "function") {
      return;
    }
    const args = Array.prototype.slice.call(arguments, 1);
    Painel[metodo].apply(Painel, args);
  }

  // Aponta temaAtual.alvo para a palavra corrente do tema.
  function selecionarPalavra(indice) {
    indicePalavra = indice;
    temaAtual.alvo = temaAtual.palavras[indice];
    atualizarMedidor(indice); // "Palavra X de N" com estrelas já conquistadas
    // Registro discreto: começa a contabilizar esta palavra.
    registro("iniciarPalavra", palavraExibida());
  }

  // ---------------- Medidor de progresso (TEACCH) ----------------
  // Mostra "PALAVRA X DE N" e uma fileira de estrelas: cheias = concluídas,
  // vazias = a fazer. Fica logo acima da instrução, dentro do cenário.
  function atualizarMedidor(concluidas) {
    if (!el.cenario) return;
    let medidor = document.getElementById("cacada-medidor");
    if (!medidor) {
      medidor = document.createElement("div");
      medidor.id = "cacada-medidor";
      medidor.className = "medidor-teacch";
      // Insere como primeiro filho do cenário (acima da instrução).
      el.cenario.insertBefore(medidor, el.cenario.firstChild);
    }
    const total = temaAtual.palavras.length;
    let estrelas = "";
    for (let i = 0; i < total; i++) {
      estrelas += i < concluidas ? "⭐" : "☆";
    }
    medidor.innerHTML =
      '<span class="medidor-teacch__texto">PALAVRA ' +
      (concluidas + 1 > total ? total : concluidas + 1) +
      " DE " +
      total +
      '</span><span class="medidor-teacch__estrelas" aria-hidden="true">' +
      estrelas +
      "</span>";
  }

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

  function palavraExibida() {
    return temaAtual.alvo.exibir || temaAtual.alvo.palavra;
  }

  // Fala o fonema prolongado da 1ª letra + resto da palavra: "LLLLL-OBO".
  function fonemaDaPalavra() {
    const palavra = temaAtual.alvo.palavra;
    const inicial = palavra.charAt(0);
    const resto = palavraExibida().slice(1);
    return Fonema.de(inicial) + "... " + resto;
  }

  // ---------------- Rotina visual (TEACCH) ----------------
  function marcarRotina(indiceAtivo) {
    passo = indiceAtivo;
    const passos = el.rotina.querySelectorAll(".rotina__passo");
    passos.forEach(function (p, i) {
      p.classList.remove("rotina__passo--ativo", "rotina__passo--feito");
      if (i < indiceAtivo) p.classList.add("rotina__passo--feito");
      else if (i === indiceAtivo) p.classList.add("rotina__passo--ativo");
    });
  }

  // ---------------- Seletor de temas ----------------
  function prepararSelecaoTemas() {
    el.cenario.hidden = true;
    el.temas.hidden = false;
    marcarRotina(-1);

    // Gera os cards de tema dinamicamente a partir de TEMAS (temas.js).
    // Assim, cada fase nova adicionada em temas.js aparece aqui sozinha.
    const lista = el.temas.querySelector(".temas__lista");
    if (lista) {
      lista.innerHTML = "";
      Object.keys(TEMAS).forEach(function (chave) {
        const tema = TEMAS[chave];
        const btn = document.createElement("button");
        btn.className = "tema";
        btn.dataset.tema = chave;
        btn.setAttribute("aria-label", "Tema " + tema.nome);
        btn.innerHTML =
          '<span class="card__figura" aria-hidden="true">' + (tema.icone || "🌟") + "</span>" +
          '<span class="card__nome">' + tema.nome + "</span>";

        function falarTema() {
          Voz.falar(tema.nome);
        }
        btn.onmouseenter = falarTema;
        btn.onfocus = falarTema;
        btn.ontouchstart = falarTema;

        btn.onclick = function () {
          Voz.falar("Vamos para o mundo... " + tema.nome + "!", {
            aoTerminar: function () {
              escolherTema(chave);
            },
          });
        };

        lista.appendChild(btn);
      });
    }

    Voz.falar(NOME + ", escolha o seu mundo favorito para começar a caçada!", {
      audio: "escolha_mundo",
    });
  }

  // Classes de cenário com visual próprio no CSS (as demais usam o padrão).
  const CENARIOS_COM_ESTILO = { dinos: 1, carros: 1, animais: 1 };

  function escolherTema(chave) {
    temaAtual = TEMAS[chave];
    // Aplica o visual do tema; se a chave não tiver estilo próprio, usa base.
    const classeVisual = CENARIOS_COM_ESTILO[chave] ? "cenario--" + chave : "cenario--tema";
    el.cenario.className = "cenario " + classeVisual;
    el.cenario.hidden = false;
    el.temas.hidden = true;
    // Registro discreto: nova sessão para este tema.
    registro("iniciarSessao", temaAtual.nome);
    selecionarPalavra(0); // prepara a primeira palavra do tema

    // Historinha de abertura (opcional): ancora a fase no texto do livro.
    if (temaAtual.historia) {
      contarHistoria(temaAtual.historia, iniciarPassoProcurar);
    } else {
      iniciarPassoProcurar();
    }
  }

  // Narra a história de abertura mostrando o texto e uma figura grande.
  // Ao terminar (ou se não houver voz), segue para o primeiro passo.
  function contarHistoria(texto, depois) {
    bloqueado = true;
    marcarRotina(-1); // ainda não começou a rotina de passos
    el.instrucao.textContent = "📖 " + temaAtual.nome;
    el.palco.innerHTML = "";

    const fig = document.createElement("div");
    fig.className = "palco__figura palco__figura--grande";
    fig.setAttribute("aria-hidden", "true");
    fig.textContent = temaAtual.icone || (temaAtual.palavras[0] && temaAtual.palavras[0].figura) || "📖";
    el.palco.appendChild(fig);

    const balao = document.createElement("p");
    balao.className = "historia-balao";
    balao.textContent = texto;
    el.palco.appendChild(balao);

    // Botão para começar (também serve se a criança quiser pular a narração).
    const btn = document.createElement("button");
    btn.className = "botao botao--gigante botao--jogar";
    btn.innerHTML = '<span class="botao__texto">COMEÇAR ➔</span>';
    let iniciou = false;
    function comecar() {
      if (iniciou) return;
      iniciou = true;
      Voz.parar();
      if (typeof depois === "function") depois();
    }
    btn.onclick = comecar;
    el.palco.appendChild(btn);

    // Botão para ouvir a história de novo.
    const btnOuvir = document.createElement("button");
    btnOuvir.className = "botao botao--audio botao--audio-grande";
    btnOuvir.innerHTML =
      '<span aria-hidden="true">🔊</span><span class="botao__texto-pequeno">OUVIR DE NOVO</span>';
    btnOuvir.setAttribute("aria-label", "Ouvir a história de novo");
    btnOuvir.onclick = function () {
      Voz.falar(texto);
    };
    el.palco.appendChild(btnOuvir);

    // Narra a história; ao terminar (garantido pelo voz.js), libera o começo.
    Voz.falar(texto, { aoTerminar: comecar });
  }

  // ================= PASSO 1: ENCONTRO DO ALVO (👁️) =================
  function iniciarPassoProcurar() {
    bloqueado = false;
    marcarRotina(0);
    const alvo = temaAtual.alvo;
    const total = temaAtual.palavras.length;
    el.instrucao.textContent =
      "PALAVRA " + (indicePalavra + 1) + " DE " + total +
      " ➔ PROCURE O " + palavraExibida() + " NA CENA 👁️";
    el.palco.innerHTML = "";

    const figuras = embaralhar(
      alvo.figurasCena.map(function (f) {
        return { fig: f, certo: f === alvo.figura };
      })
    );

    const linha = document.createElement("div");
    linha.className = "cards";
    figuras.forEach(function (item) {
      const b = document.createElement("button");
      b.className = "card";
      b.innerHTML =
        '<span class="card__figura" aria-hidden="true">' + item.fig + "</span>";
      b.setAttribute("aria-label", item.certo ? palavraExibida() : "figura");
      b.onclick = function () {
        if (bloqueado) return;
        if (item.certo) {
          bloqueado = true;
          b.classList.add("card--acerto");
          // Narração do encontro do alvo.
          Voz.falar(
            NOME + "! Você encontrou " + alvo.artigo + " " + palavraExibida() + "!",
            { aoTerminar: iniciarPassoFonema }
          );
        } else {
          b.classList.add("card--erro");
          setTimeout(function () {
            b.classList.remove("card--erro");
          }, 500);
          Voz.falar("Quase lá, " + NOME + "! Procure de novo.", { audio: "quase_procure" });
        }
      };
      linha.appendChild(b);
    });
    el.palco.appendChild(linha);

    Voz.falar("Passo um: procure " + alvo.artigo + " " + palavraExibida() + " na cena, " + NOME + ".");
  }

  // ================= PASSO 2: INSTRUÇÃO FÔNICA EXPLÍCITA (👂) =========
  function iniciarPassoFonema() {
    bloqueado = false;
    marcarRotina(1);
    const alvo = temaAtual.alvo;
    const inicial = alvo.palavra.charAt(0);
    el.instrucao.textContent = "OUÇA O SOM DA LETRA 👂 ➔ " + inicial;
    el.palco.innerHTML = "";

    // Card do alvo que vibra ao tocar o fonema.
    const card = document.createElement("button");
    card.className = "alvo-fonico";
    card.setAttribute("aria-label", "Ouvir o som de " + palavraExibida());
    card.innerHTML =
      '<span class="alvo-fonico__fig" aria-hidden="true">' + alvo.figura + "</span>" +
      '<span class="boca-som" aria-hidden="true"></span>';

    function tocarFonemaAlvo() {
      // Registro discreto: a criança pediu a dica de som (nível de suporte).
      registro("registrarToqueBoca");
      // Animação: vibração + "boca" pulsando enquanto fala o fonema.
      card.classList.add("alvo-fonico--vibrando");
      Voz.falar(fonemaDaPalavra(), {
        aoTerminar: function () {
          card.classList.remove("alvo-fonico--vibrando");
        },
      });
    }
    card.onclick = function () {
      if (bloqueado) return;
      tocarFonemaAlvo();
    };
    el.palco.appendChild(card);

    // ----- Recurso avançado OPCIONAL: falar o som pelo microfone -----
    // Só aparece se o navegador suportar reconhecimento de fala.
    let dicaMic = null;
    if (typeof Microfone !== "undefined" && Microfone.suportado) {
      const btnMic = document.createElement("button");
      btnMic.className = "botao botao--microfone";
      btnMic.innerHTML =
        '<span aria-hidden="true">🎙️</span>' +
        '<span class="botao__texto-pequeno">FAZER O SOM</span>';
      btnMic.setAttribute("aria-label", "Falar o som da letra");
      btnMic.onclick = function () {
        if (bloqueado) return;
        escutarFonema(btnMic, dicaMic);
      };
      el.palco.appendChild(btnMic);

      dicaMic = document.createElement("p");
      dicaMic.className = "palco__dica";
      el.palco.appendChild(dicaMic);
    }

    const btnAvancar = document.createElement("button");
    btnAvancar.className = "botao botao--gigante botao--jogar";
    btnAvancar.innerHTML = '<span class="botao__texto">MONTAR ➔</span>';
    btnAvancar.onclick = function () {
      if (bloqueado) return; // evita avançar durante a comemoração por voz
      iniciarPassoMontar();
    };
    el.palco.appendChild(btnAvancar);

    // Narra a instrução, reproduz o fonema e convida a falar (se houver mic).
    Voz.falar("Passo dois: escute o som da letra " + inicial + ".", {
      aoTerminar: function () {
        tocarFonemaAlvo();
        if (typeof Microfone !== "undefined" && Microfone.suportado) {
          Voz.falar(NOME + ", faça o som da letra! Toque no microfone.");
        }
      },
    });
  }

  // Lista de respostas faladas aceitas para a palavra atual.
  // Aceita a palavra inteira, a letra inicial e o nome da letra (ex.: "éle").
  function respostasAceitas() {
    const palavra = palavraExibida();
    const inicial = temaAtual.alvo.palavra.charAt(0);
    const nomesLetra = {
      A: "á", B: "bê", C: "cê", D: "dê", E: "é", F: "efe", G: "gê",
      H: "agá", I: "i", J: "jota", L: "ele", M: "eme", N: "ene",
      O: "ó", P: "pê", Q: "quê", R: "erre", S: "esse", T: "tê",
      U: "u", V: "vê", X: "xis", Z: "zê",
    };
    const aceitas = [palavra, inicial];
    if (nomesLetra[inicial]) aceitas.push(nomesLetra[inicial]);
    // Sílaba inicial aproximada (ex.: "LO") ajuda quando ela fala a sílaba.
    aceitas.push(silabaInicial());
    return aceitas;
  }

  // Escuta a criança e valida o fonema/palavra falado.
  function escutarFonema(btnMic, dica) {
    const aceitas = respostasAceitas();
    // Registro discreto: pediu apoio de som ao usar o microfone também conta.
    Microfone.ouvir({
      aoComecar: function () {
        btnMic.classList.add("botao--ouvindo");
        if (dica) dica.textContent = "🎧 ESTOU OUVINDO...";
      },
      aoResultado: function (alternativas) {
        const acertou = aceitas.some(function (alvo) {
          return Microfone.corresponde(alternativas, alvo);
        });
        if (acertou) {
          // Mesmo reforço do acerto por toque/drag: aplausos + confete + avança.
          bloqueado = true;
          registro("registrarTentativa", true, temaAtual.alvo.palavra.charAt(0), true);
          registro("concluirPalavra");
          if (dica) dica.textContent = "";
          reforcoPositivo();
        } else {
          const ouvido = (alternativas[0] || "").toUpperCase();
          if (dica) dica.textContent = ouvido ? "OUVI: " + ouvido : "";
          // Sem punição: repete o fonema correto suavemente.
          Voz.falar("Escute o som de novo: " + Fonema.de(temaAtual.alvo.palavra.charAt(0)));
        }
      },
      aoErro: function (motivo) {
        if (!dica) return;
        if (motivo === "not-allowed" || motivo === "service-not-allowed") {
          dica.textContent = "SEM PERMISSÃO PARA O MICROFONE 🎙️ — PODE ARRASTAR AS LETRAS";
        } else if (motivo === "no-speech") {
          dica.textContent = "NÃO OUVI. TENTE DE NOVO OU ARRASTE AS LETRAS";
        } else {
          dica.textContent = "PODE ARRASTAR AS LETRAS TAMBÉM 🧩";
        }
      },
      aoTerminar: function () {
        btnMic.classList.remove("botao--ouvindo");
      },
    });
  }

  // ================= PASSO 3: CONSTRUÇÃO COM LETRAS MÓVEIS (🧩) =======
  // Estado da montagem da palavra atual.
  let montagem = null;

  function iniciarPassoMontar() {
    bloqueado = false;
    marcarRotina(2);
    const alvo = temaAtual.alvo;
    const palavra = palavraExibida();
    const lacunas = alvo.lacunas || [0]; // posições que a criança monta
    el.instrucao.textContent = "MONTE A PALAVRA " + palavra + " 🧩";
    el.palco.innerHTML = "";

    const fig = document.createElement("div");
    fig.className = "palco__figura";
    fig.setAttribute("aria-hidden", "true");
    fig.textContent = alvo.figura;
    el.palco.appendChild(fig);

    // Monta a fileira: cada posição é lacuna (vazia) ou letra fixa.
    const fileira = document.createElement("div");
    fileira.className = "letras-palavra";

    const casasLacuna = []; // {indice, el} das posições a preencher, em ordem
    for (let i = 0; i < palavra.length; i++) {
      const casa = document.createElement("div");
      if (lacunas.indexOf(i) !== -1) {
        casa.className = "lacuna-letra";
        casa.textContent = "_";
        casa.setAttribute("aria-label", "Lacuna");
        casa.dataset.pos = i;
        casasLacuna.push({ indice: i, el: casa });
      } else {
        casa.className = "lacuna-letra lacuna-letra--fixa";
        casa.textContent = palavra.charAt(i);
      }
      fileira.appendChild(casa);
    }
    el.palco.appendChild(fileira);

    // Estado da montagem: preenche as lacunas na ordem (esquerda -> direita).
    montagem = {
      palavra: palavra,
      casas: casasLacuna,
      atual: 0, // índice em casasLacuna da próxima lacuna a preencher
      errosNaLacuna: 0, // erros na lacuna ativa (para saber "acerto de 1ª")
    };
    destacarLacunaAtiva();

    // Blocos de letras móveis coloridos e arrastáveis.
    const blocos = document.createElement("div");
    blocos.className = "letras-moveis";
    embaralhar(alvo.letrasMoveis).forEach(function (letra) {
      blocos.appendChild(criarBlocoLetra(letra, blocos));
    });
    el.palco.appendChild(blocos);
    montagem.blocos = blocos;

    // Cada lacuna aceita drop; só a ativa reage de fato.
    casasLacuna.forEach(function (c) {
      c.el.addEventListener("dragover", function (ev) {
        if (bloqueado) return;
        ev.preventDefault();
        if (c === lacunaAtiva()) c.el.classList.add("lacuna-letra--sobre");
      });
      c.el.addEventListener("dragleave", function () {
        c.el.classList.remove("lacuna-letra--sobre");
      });
      c.el.addEventListener("drop", function (ev) {
        ev.preventDefault();
        c.el.classList.remove("lacuna-letra--sobre");
        if (bloqueado) return;
        const letra = ev.dataTransfer.getData("text/plain");
        const bloco = blocos.querySelector('[data-letra="' + letra + '"]:not(.letra-movel--usada)');
        tentarEncaixarLetra(letra, bloco);
      });
    });

    // Instrução falada: uma letra ou a sílaba inicial.
    if (lacunas.length > 1) {
      Voz.falar(
        "Passo três: monte o começo da palavra " +
          palavra +
          " arrastando as letras na ordem, " +
          NOME +
          "."
      );
    } else {
      Voz.falar(
        "Passo três: arraste a letra " +
          palavra.charAt(lacunas[0]) +
          " para a casinha, " +
          NOME +
          "."
      );
    }
  }

  // Objeto da lacuna que deve ser preenchida agora.
  function lacunaAtiva() {
    if (!montagem) return null;
    return montagem.casas[montagem.atual] || null;
  }

  // Letra esperada na lacuna ativa.
  function letraEsperada() {
    const c = lacunaAtiva();
    return c ? montagem.palavra.charAt(c.indice) : null;
  }

  function destacarLacunaAtiva() {
    if (!montagem) return;
    montagem.casas.forEach(function (c) {
      c.el.classList.remove("lacuna-letra--alvo");
    });
    const c = lacunaAtiva();
    if (c) c.el.classList.add("lacuna-letra--alvo");
  }

  function criarBlocoLetra(letra, blocos) {
    const bloco = document.createElement("button");
    bloco.className = "letra-movel";
    bloco.textContent = letra;
    bloco.setAttribute("draggable", "true");
    bloco.setAttribute("aria-label", "Letra " + letra);
    bloco.dataset.letra = letra;

    // Clicar/passar o mouse num bloco toca o fonema daquela letra.
    function tocarFonemaLetra() {
      if (bloqueado) return;
      bloco.classList.add("letra-movel--soando");
      Voz.falar(Fonema.de(letra), {
        aoTerminar: function () {
          bloco.classList.remove("letra-movel--soando");
        },
      });
    }
    bloco.onmouseenter = tocarFonemaLetra;
    bloco.onfocus = tocarFonemaLetra;

    bloco.addEventListener("dragstart", function (ev) {
      if (bloqueado || bloco.classList.contains("letra-movel--usada")) {
        return ev.preventDefault();
      }
      ev.dataTransfer.setData("text/plain", letra);
      bloco.classList.add("letra-movel--arrastando");
    });
    bloco.addEventListener("dragend", function () {
      bloco.classList.remove("letra-movel--arrastando");
    });

    // Alternativa por clique/toque: tenta encaixar na lacuna ativa.
    bloco.addEventListener("click", function () {
      if (bloco.classList.contains("letra-movel--usada")) return;
      tocarFonemaLetra();
      tentarEncaixarLetra(letra, bloco);
    });

    return bloco;
  }

  function tentarEncaixarLetra(letra, bloco) {
    if (bloqueado || !montagem) return;
    const casa = lacunaAtiva();
    if (!casa) return;
    const esperada = letraEsperada();

    if (letra === esperada) {
      // Registro discreto: acerto; "de primeira" = sem erros nesta lacuna.
      registro("registrarTentativa", true, letra, montagem.errosNaLacuna === 0);

      // ----- ACERTO nesta lacuna -----
      casa.el.textContent = letra;
      casa.el.classList.remove("lacuna-letra--alvo");
      casa.el.classList.add("lacuna-letra--preenchida");
      if (bloco) bloco.classList.add("letra-movel--usada");

      montagem.atual++;
      montagem.errosNaLacuna = 0; // zera para a próxima lacuna
      if (montagem.atual >= montagem.casas.length) {
        // Todas as lacunas preenchidas -> palavra completa, reforço ABA.
        bloqueado = true;
        registro("concluirPalavra");
        reforcoPositivo();
      } else {
        // Ainda faltam letras: confirma o som e destaca a próxima casinha.
        destacarLacunaAtiva();
        Voz.falar("Isso! Agora o som de " + Fonema.de(letraEsperada()) + ".");
      }
    } else {
      // Registro discreto: erro nesta lacuna.
      montagem.errosNaLacuna++;
      registro("registrarTentativa", false, letra, false);

      // ----- ERRO: sem punição; repete o fonema correto suavemente -----
      if (bloco) {
        bloco.classList.add("letra-movel--erro");
        setTimeout(function () {
          bloco.classList.remove("letra-movel--erro");
        }, 500);
      }
      Voz.falar("Escute o som de novo: " + Fonema.de(esperada));
    }
  }

  // ---------------- Reforço positivo (ABA) ----------------
  function reforcoPositivo() {
    Aplauso.tocar();          // som de aplausos (Web Audio)
    Confete.explodir(180);    // confete
    const inicial = temaAtual.alvo.palavra.charAt(0);
    const vogalSeguinte = proximaVogal();
    // "LLLLL com O faz LÓ!"
    const frase =
      "Muito bem, " +
      NOME +
      "! " +
      Fonema.de(inicial) +
      " com " +
      (vogalSeguinte || "") +
      " faz " +
      silabaInicial() +
      "!";
    mostrarFeedback("👏 MUITO BEM, " + NOME + "! 👏", "acerto");
    Voz.falar(frase, { aoTerminar: iniciarPassoPremio });
  }

  // Primeira vogal após a inicial (para "L com O").
  function proximaVogal() {
    const p = palavraExibida();
    for (let i = 1; i < p.length; i++) {
      if ("AEIOUÃÕ".indexOf(p.charAt(i)) !== -1) return p.charAt(i);
    }
    return "";
  }

  // Sílaba inicial aproximada (inicial + primeira vogal), ex.: "LO".
  function silabaInicial() {
    return (temaAtual.alvo.palavra.charAt(0) + proximaVogal()).toUpperCase();
  }

  // ================= PASSO 4: RECOMPENSA (⭐) POR PALAVRA ==============
  function iniciarPassoPremio() {
    // Cada palavra completa vale uma estrela no cartão de rotina TEACCH.
    if (typeof Cacada.aoGanharEstrela === "function") Cacada.aoGanharEstrela();
    Confete.explodir(120);

    const total = temaAtual.palavras.length;
    const feitas = indicePalavra + 1;
    const ultima = feitas >= total;

    // Atualiza o medidor: acende a estrela da palavra recém-concluída.
    atualizarMedidor(feitas);

    if (ultima) {
      // Concluiu todas as palavras do tema -> marca o passo PRÊMIO e libera o minijogo.
      marcarRotina(3);
      const passos = el.rotina.querySelectorAll(".rotina__passo");
      if (passos[3]) passos[3].classList.add("rotina__passo--ativo");
      mostrarFeedback("⭐ VOCÊ COMPLETOU TODAS AS PALAVRAS! ⭐", "acerto");
      Voz.falar(
        "Uau, " + NOME + "! Você montou todas as palavras. Ganhou o prêmio!",
        { audio: "montou_tudo", aoTerminar: iniciarMinijogo }
      );
    } else {
      // Ainda há palavras -> comemora a estrela e vai para a próxima.
      mostrarFeedback(
        "⭐ ESTRELA " + feitas + " DE " + total + "! ⭐",
        "acerto"
      );
      Voz.falar(
        "Você ganhou uma estrela! Faltam mais " +
          (total - feitas) +
          ". Vamos para a próxima palavra!",
        {
          aoTerminar: function () {
            selecionarPalavra(indicePalavra + 1);
            iniciarPassoProcurar();
          },
        }
      );
    }
  }

  // Minijogo reforçador de 15 s: tocar/clicar no alvo para "alimentá-lo".
  function iniciarMinijogo() {
    const mj = temaAtual.minijogo;
    let pontos = 0;
    let restante = 15;
    el.instrucao.textContent = mj.titulo + " " + mj.comida;
    el.palco.innerHTML = "";
    el.palco.classList.add("palco--minijogo");

    const painel = document.createElement("div");
    painel.className = "minijogo__painel";
    const relogio = document.createElement("div");
    relogio.className = "minijogo__relogio";
    relogio.textContent = "⏱️ " + restante;
    const contador = document.createElement("div");
    contador.className = "minijogo__pontos";
    contador.textContent = mj.comida + " 0";
    painel.appendChild(relogio);
    painel.appendChild(contador);
    el.palco.appendChild(painel);

    const arena = document.createElement("div");
    arena.className = "minijogo__arena";
    el.palco.appendChild(arena);

    const bicho = document.createElement("div");
    bicho.className = "minijogo__alvo";
    bicho.setAttribute("aria-hidden", "true");
    bicho.textContent = mj.alvo;
    arena.appendChild(bicho);

    Voz.falar(
      "Ganhou um jogo! Toque no " +
        temaAtual.nome.slice(0, -1).toLowerCase() +
        " para dar comida, " +
        NOME +
        "!"
    );

    // Faz surgir uma "comida" em posição aleatória; clicar nela pontua.
    let comidaEl = null;
    function novaComida() {
      if (comidaEl) comidaEl.remove();
      comidaEl = document.createElement("button");
      comidaEl.className = "minijogo__comida";
      comidaEl.textContent = mj.comida;
      comidaEl.setAttribute("aria-label", "Comida");
      comidaEl.style.left = 10 + Math.random() * 78 + "%";
      comidaEl.style.top = 10 + Math.random() * 68 + "%";
      comidaEl.onclick = function () {
        pontos++;
        contador.textContent = mj.comida + " " + pontos;
        bicho.classList.add("minijogo__alvo--feliz");
        setTimeout(function () {
          bicho.classList.remove("minijogo__alvo--feliz");
        }, 250);
        Confete.explodir(24);
        novaComida();
      };
      arena.appendChild(comidaEl);
    }
    novaComida();

    // Cronômetro de 15 segundos.
    const intervalo = setInterval(function () {
      restante--;
      relogio.textContent = "⏱️ " + restante;
      if (restante <= 0) {
        clearInterval(intervalo);
        if (comidaEl) comidaEl.remove();
        el.palco.classList.remove("palco--minijogo");
        Voz.falar("Que divertido, " + NOME + "! Você deu " + pontos + " comidinhas!", {
          aoTerminar: function () {
            setTimeout(function () {
              if (typeof aoConcluir === "function") aoConcluir();
            }, 400);
          },
        });
      }
    }, 1000);
  }

  // ---------------- Comandos PECS ----------------
  function ligarComandosPecs() {
    el.pecs.querySelectorAll(".pecs__btn").forEach(function (btn) {
      const comando = btn.dataset.comando;
      btn.onclick = function () {
        acionarComando(comando);
      };
    });
  }

  function acionarComando(comando) {
    if (comando === "olhe") {
      Voz.falar("Olhe para a tela, " + NOME + ".");
    } else if (comando === "ouca") {
      // Repete o fonema/instrução conforme o passo atual.
      if (!temaAtual) {
        Voz.falar("Escute com atenção, " + NOME + ".");
      } else if (passo === 2) {
        Voz.falar("Escute: " + Fonema.de(temaAtual.alvo.palavra.charAt(0)));
      } else {
        Voz.falar(fonemaDaPalavra());
      }
    } else if (comando === "monte") {
      if (temaAtual && passo < 2) {
        Voz.falar("Logo você vai montar a palavra!");
      } else {
        Voz.falar("Arraste a letra certa para a casinha.");
      }
    }
  }

  // ---------------- API pública ----------------
  function iniciar(refs, opcoes) {
    el = refs;
    opcoes = opcoes || {};
    aoConcluir = opcoes.aoConcluir || null;
    Voz.definirRatePadrao(RATE);
    ligarComandosPecs();
    prepararSelecaoTemas();
  }

  function encerrar() {
    registro("encerrarSessao");
    if (typeof Microfone !== "undefined" && Microfone.parar) Microfone.parar();
    Voz.definirRatePadrao(0.95);
    Voz.parar();
  }

  return { iniciar, encerrar, aoGanharEstrela: null };
})();
