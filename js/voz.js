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

  /**
   * Fala um texto em voz alta.
   * @param {string} texto - o que será falado
   * @param {object} [opcoes] - { rate, aoTerminar }
   */
  function falar(texto, opcoes = {}) {
    if (!suportado || !texto) {
      // Fallback: se não houver síntese de voz, apenas chama o callback.
      if (typeof opcoes.aoTerminar === "function") opcoes.aoTerminar();
      return;
    }

    // Cancela qualquer fala anterior para não sobrepor narrações.
    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = opcoes.rate != null ? opcoes.rate : ratePadrao; // calma e legível
    fala.pitch = opcoes.pitch != null ? opcoes.pitch : 1.05; // tom amigável, sem soar agudo/robótico
    fala.volume = 1;

    if (vozPtBr) fala.voice = vozPtBr;

    if (typeof opcoes.aoTerminar === "function") {
      fala.onend = opcoes.aoTerminar;
      fala.onerror = opcoes.aoTerminar;
    }

    window.speechSynthesis.speak(fala);
  }

  /** Interrompe imediatamente qualquer narração em andamento. */
  function parar() {
    if (suportado) window.speechSynthesis.cancel();
  }

  /** Ajusta a velocidade padrão de fala usada quando não é passado rate. */
  function definirRatePadrao(valor) {
    if (typeof valor === "number" && valor > 0) ratePadrao = valor;
  }

  return { falar, parar, definirRatePadrao, suportado };
})();
