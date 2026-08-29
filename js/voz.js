/* ========================================================================
   MÓDULO DE VOZ — Narração em Português do Brasil (pt-BR)
   Usa window.speechSynthesis para ler TODO texto em voz alta.
   Velocidade calma e legível (rate 0.85), pensada para alfabetização.
   ======================================================================== */

const Voz = (function () {
  const suportado = "speechSynthesis" in window;
  let vozPtBr = null;
  let ratePadrao = 0.85; // pode ser ajustado por modo (ex.: Caçada usa 0.8)

  // A lista de vozes carrega de forma assíncrona em muitos navegadores.
  function escolherVoz() {
    if (!suportado) return;
    const vozes = window.speechSynthesis.getVoices();
    // Preferimos uma voz pt-BR; se não houver, aceitamos qualquer pt.
    vozPtBr =
      vozes.find((v) => v.lang && v.lang.toLowerCase() === "pt-br") ||
      vozes.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt")) ||
      null;
  }

  if (suportado) {
    escolherVoz();
    // Recarrega quando o navegador terminar de listar as vozes.
    window.speechSynthesis.onvoiceschanged = escolherVoz;
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
    fala.pitch = opcoes.pitch != null ? opcoes.pitch : 1.15; // um tom amigável
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
