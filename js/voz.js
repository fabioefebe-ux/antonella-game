/* ========================================================================
   MÓDULO DE VOZ — Narração em Português do Brasil (pt-BR)
   Usa window.speechSynthesis para ler TODO texto em voz alta.
   Velocidade calma e legível (rate 0.95), pensada para alfabetização.
   Escolhe automaticamente a voz pt-BR mais natural disponível no aparelho
   (prioriza vozes Google/Siri/network sobre as offline mais robóticas).
   ======================================================================== */

const Voz = (function () {
  const suportado = "speechSynthesis" in window;
  let vozPtBr = null;
  let ratePadrao = 0.95; // levemente mais rápida = menos "robótica" (Caçada ajusta para 0.9)

  // Nomes de vozes pt-BR que costumam soar mais naturais, em ordem de
  // preferência. No Android/iOS essas costumam existir; escolhemos a melhor.
  const NOMES_PREFERIDOS = [
    "luciana",          // iOS (Siri pt-BR) — bem natural
    "google português", // Chrome/Android — natural
    "google portugues",
    "pt-br-x-afs",      // Android (voz "network"/premium)
    "microsoft francisca", // Windows/Edge — voz neural, boa
    "microsoft thalita",
    "francisca",
    "thalita",
    "camila",
    "vitoria",
    "maria",            // Windows offline (mais robótica) — último caso
  ];

  // Dá uma "nota" para cada voz pt-BR: quanto maior, melhor/mais natural.
  function pontuarVoz(v) {
    const nome = (v.name || "").toLowerCase();
    let pontos = 0;

    // Prioridade forte por nome conhecido (quanto mais no topo da lista, melhor).
    const idx = NOMES_PREFERIDOS.findIndex((n) => nome.indexOf(n) !== -1);
    if (idx !== -1) pontos += (NOMES_PREFERIDOS.length - idx) * 10;

    // Vozes "network"/online/premium soam melhor que as locais offline.
    if (nome.indexOf("network") !== -1) pontos += 6;
    if (v.localService === false) pontos += 4;

    // pt-BR exato ganha de um "pt" genérico (ex.: pt-PT).
    const lang = (v.lang || "").toLowerCase().replace("_", "-");
    if (lang === "pt-br") pontos += 5;
    else if (lang.startsWith("pt")) pontos += 1;

    return pontos;
  }

  // A lista de vozes carrega de forma assíncrona em muitos navegadores.
  function escolherVoz() {
    if (!suportado) return;
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes || !vozes.length) return;

    // Considera só as vozes em português e escolhe a de maior pontuação.
    const emPortugues = vozes.filter(function (v) {
      const lang = (v.lang || "").toLowerCase();
      return lang.indexOf("pt") !== -1;
    });

    if (emPortugues.length) {
      emPortugues.sort(function (a, b) {
        return pontuarVoz(b) - pontuarVoz(a);
      });
      vozPtBr = emPortugues[0];
    } else {
      vozPtBr = null;
    }
  }

  if (suportado) {
    escolherVoz();
    // Recarrega quando o navegador terminar de listar as vozes.
    window.speechSynthesis.onvoiceschanged = escolherVoz;
    // No celular a lista às vezes demora; tenta de novo por alguns segundos.
    let tentativas = 0;
    const timer = setInterval(function () {
      if (vozPtBr || tentativas++ > 10) {
        clearInterval(timer);
        return;
      }
      escolherVoz();
    }, 300);
  }

  /* ----------------------------------------------------------------------
     ÁUDIO PRÉ-GRAVADO (voz premium, ex.: ElevenLabs)
     ----------------------------------------------------------------------
     Ideia: falas fixas e muito repetidas (elogios, passos) podem ter um MP3
     gravado com voz de alta qualidade. Cada fala pode ser identificada por
     uma "chave" (ex.: "parabens"). Se existir um arquivo audio/<chave>.mp3,
     tocamos ele; senão, caímos na voz do navegador (fallback automático).

     Os arquivos ficam na pasta audio/ na raiz do projeto. A pasta é opcional:
     sem ela, o jogo funciona 100% com a voz nativa, como sempre.
     -------------------------------------------------------------------- */
  const PASTA_AUDIO = "audio/";
  const cacheAudio = {}; // chave -> HTMLAudioElement (ou false se não existe)
  let audioAtual = null; // áudio tocando agora (para poder parar)

  // Pré-carrega/consulta um áudio pela chave. Resolve com o elemento Audio
  // se o arquivo existir e puder tocar, ou com null se não existir.
  function obterAudio(chave) {
    return new Promise(function (resolve) {
      if (!chave) return resolve(null);
      if (cacheAudio[chave] === false) return resolve(null);
      if (cacheAudio[chave]) return resolve(cacheAudio[chave]);

      const a = new Audio(PASTA_AUDIO + chave + ".mp3");
      a.preload = "auto";

      let resolvido = false;
      function concluir(valor) {
        if (resolvido) return;
        resolvido = true;
        clearTimeout(tempo);
        resolve(valor);
      }

      // canplaythrough = arquivo existe e está pronto para tocar.
      a.addEventListener(
        "canplaythrough",
        function () {
          cacheAudio[chave] = a;
          concluir(a);
        },
        { once: true }
      );
      // error = arquivo não existe / não pôde carregar -> usa voz nativa.
      a.addEventListener(
        "error",
        function () {
          cacheAudio[chave] = false;
          concluir(null);
        },
        { once: true }
      );
      // Rede de segurança: se o arquivo demorar demais (rede lenta), não trava
      // a narração esperando; usa a voz nativa agora. NÃO marca como ausente no
      // cache, então numa próxima vez ele ainda pode carregar do cache do disco.
      const tempo = setTimeout(function () {
        concluir(null);
      }, 1500);
    });
  }

  /**
   * Fala um texto em voz alta.
   * @param {string} texto - o que será falado
   * @param {object} [opcoes] - { rate, pitch, aoTerminar, audio }
   *   opcoes.audio - chave do MP3 pré-gravado (ex.: "parabens"). Se o arquivo
   *                  existir, toca ele; senão, usa a voz do navegador.
   */
  function falar(texto, opcoes = {}) {
    // Interrompe qualquer fala/áudio anterior para não sobrepor.
    parar();

    const chave = opcoes.audio;
    if (chave) {
      // Guarda o texto para servir de fallback se o play do áudio for bloqueado.
      opcoes._textoFallback = texto;
      // Tenta o áudio pré-gravado; se não houver, cai na voz nativa.
      obterAudio(chave).then(function (audio) {
        if (audio) {
          tocarArquivo(audio, opcoes);
        } else {
          falarNativo(texto, opcoes);
        }
      });
      return;
    }

    falarNativo(texto, opcoes);
  }

  // Toca um MP3 pré-gravado e dispara aoTerminar ao final.
  function tocarArquivo(audio, opcoes) {
    audioAtual = audio;
    try {
      audio.currentTime = 0;
    } catch (e) {
      /* alguns navegadores reclamam antes de carregar; ignora */
    }

    const aoTerminar =
      typeof opcoes.aoTerminar === "function" ? opcoes.aoTerminar : null;

    // Registra o término como pendente (mesmo mecanismo da fala nativa), para
    // que parar() ou uma nova fala não deixem a navegação presa.
    let registro = null;
    if (aoTerminar) {
      registro = { fn: aoTerminar, timer: null };
      terminoPendente = registro;
    }
    function limparListeners() {
      audio.removeEventListener("ended", terminar);
      audio.removeEventListener("error", terminar);
    }
    function terminar() {
      limparListeners();
      if (audioAtual === audio) audioAtual = null;
      if (registro && terminoPendente === registro) resolverPendente();
      else if (!registro && aoTerminar) aoTerminar();
    }
    audio.addEventListener("ended", terminar);
    audio.addEventListener("error", terminar);

    const p = audio.play();
    // Se o navegador bloquear o play (sem gesto do usuário), cai na voz nativa.
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        limparListeners();
        if (audioAtual === audio) audioAtual = null;
        // Cancela a pendência do áudio para o falarNativo criar a sua própria.
        if (registro && terminoPendente === registro) terminoPendente = null;
        falarNativo(opcoes._textoFallback || "", opcoes);
      });
    }
  }

  // Callback da narração nativa que ainda não terminou. Guardamos aqui para
  // garantir que ele SEMPRE dispare uma vez — inclusive quando a fala é
  // cancelada por outra ou quando o evento onend não chega (comum no celular).
  let terminoPendente = null;

  // Dispara (uma única vez) o callback de término pendente, se houver.
  function resolverPendente() {
    if (!terminoPendente) return;
    const cb = terminoPendente;
    terminoPendente = null;
    if (cb.timer) clearTimeout(cb.timer);
    if (typeof cb.fn === "function") cb.fn();
  }

  // Estima quanto tempo uma fala deve durar (ms), pelo tamanho do texto e
  // pela velocidade. Serve de rede de segurança caso o onend nunca dispare.
  function duracaoEstimada(texto, rate) {
    const palavras = (texto || "").trim().split(/\s+/).length;
    // ~0,42s por palavra em rate 1; ajusta pela velocidade + folga fixa.
    const base = (palavras * 420) / (rate || 1);
    return Math.min(15000, Math.max(1500, base + 1200));
  }

  // Fala usando a síntese de voz do navegador (comportamento original).
  function falarNativo(texto, opcoes) {
    const aoTerminar =
      typeof opcoes.aoTerminar === "function" ? opcoes.aoTerminar : null;

    if (!suportado || !texto) {
      if (aoTerminar) aoTerminar();
      return;
    }

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    const rate = opcoes.rate != null ? opcoes.rate : ratePadrao;
    fala.rate = rate; // calma e legível
    fala.pitch = opcoes.pitch != null ? opcoes.pitch : 1.05; // tom amigável, sem soar agudo/robótico
    fala.volume = 1;

    if (vozPtBr) fala.voice = vozPtBr;

    if (aoTerminar) {
      // Registra o callback como pendente, protegido contra dupla execução.
      const registro = { fn: aoTerminar, timer: null };
      terminoPendente = registro;

      const concluir = function () {
        // Só resolve se este registro ainda é o pendente (não foi substituído).
        if (terminoPendente === registro) resolverPendente();
      };
      fala.onend = concluir;
      fala.onerror = concluir;

      // Rede de segurança: no celular o onend às vezes não dispara. Garante
      // que a navegação siga mesmo assim, após a duração estimada da fala.
      registro.timer = setTimeout(concluir, duracaoEstimada(texto, rate));
    }

    window.speechSynthesis.speak(fala);
  }

  /** Interrompe imediatamente qualquer narração em andamento. */
  function parar() {
    // Resolve o callback pendente ANTES de cancelar: assim uma fala nova nunca
    // "engole" a navegação que dependia do término da fala anterior.
    resolverPendente();

    if (suportado) window.speechSynthesis.cancel();
    if (audioAtual) {
      try {
        audioAtual.pause();
        audioAtual.currentTime = 0;
      } catch (e) {
        /* silencioso */
      }
      audioAtual = null;
    }
  }

  /** Ajusta a velocidade padrão de fala usada quando não é passado rate. */
  function definirRatePadrao(valor) {
    if (typeof valor === "number" && valor > 0) ratePadrao = valor;
  }

  return { falar, parar, definirRatePadrao, suportado };
})();
