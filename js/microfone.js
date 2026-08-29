/* ========================================================================
   MICROFONE — Reconhecimento de fala (Web Speech Recognition) em pt-BR
   --------------------------------------------------------------------------
   Envolve a API SpeechRecognition / webkitSpeechRecognition para ouvir a
   resposta falada da criança e devolver o texto reconhecido.
   Referência da API: MDN Web Speech API (SpeechRecognition).
   ======================================================================== */

const Microfone = (function () {
  const API = window.SpeechRecognition || window.webkitSpeechRecognition;
  const suportado = !!API;
  let reconhecimento = null;
  let ouvindo = false;

  /**
   * Começa a ouvir a criança.
   * @param {object} cb - callbacks:
   *   aoResultado(textoReconhecido) - quando entende a fala
   *   aoErro(motivo)                - quando dá erro / permissão negada
   *   aoComecar()                   - quando o microfone abre
   *   aoTerminar()                  - quando para de ouvir
   */
  function ouvir(cb) {
    cb = cb || {};
    if (!suportado) {
      if (typeof cb.aoErro === "function") cb.aoErro("nao-suportado");
      return;
    }
    // Evita duas escutas simultâneas.
    if (ouvindo) parar();

    reconhecimento = new API();
    reconhecimento.lang = "pt-BR";
    reconhecimento.interimResults = false; // só o resultado final
    reconhecimento.maxAlternatives = 3;    // várias hipóteses ajudam a validar
    reconhecimento.continuous = false;

    reconhecimento.onstart = function () {
      ouvindo = true;
      if (typeof cb.aoComecar === "function") cb.aoComecar();
    };

    reconhecimento.onresult = function (evento) {
      // Junta todas as alternativas reconhecidas em uma lista de textos.
      const alternativas = [];
      const resultado = evento.results[0];
      for (let i = 0; i < resultado.length; i++) {
        alternativas.push(resultado[i].transcript);
      }
      if (typeof cb.aoResultado === "function") cb.aoResultado(alternativas);
    };

    reconhecimento.onerror = function (evento) {
      if (typeof cb.aoErro === "function") cb.aoErro(evento.error || "erro");
    };

    reconhecimento.onend = function () {
      ouvindo = false;
      if (typeof cb.aoTerminar === "function") cb.aoTerminar();
    };

    try {
      reconhecimento.start();
    } catch (e) {
      // start() pode lançar se chamado duas vezes seguidas.
      if (typeof cb.aoErro === "function") cb.aoErro("start-falhou");
    }
  }

  function parar() {
    if (reconhecimento && ouvindo) {
      try {
        reconhecimento.stop();
      } catch (e) {
        /* silencioso */
      }
    }
    ouvindo = false;
  }

  /**
   * Normaliza um texto para comparação: minúsculas, sem acentos, sem espaços
   * nas pontas. Ajuda a validar a fala da criança de forma tolerante.
   */
  function normalizar(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9\s]/g, "")     // remove pontuação
      .trim();
  }

  /**
   * Verifica se alguma das alternativas faladas corresponde ao esperado.
   * Aceita correspondência exata OU quando a palavra esperada aparece dentro
   * da frase reconhecida (ex.: "é um gato" contém "gato").
   * @param {string[]} alternativas - textos reconhecidos
   * @param {string} esperado - palavra correta
   * @returns {boolean}
   */
  function corresponde(alternativas, esperado) {
    const alvo = normalizar(esperado);
    if (!alvo) return false;
    return (alternativas || []).some(function (alt) {
      const dito = normalizar(alt);
      if (!dito) return false;
      return (
        dito === alvo ||
        dito.split(/\s+/).indexOf(alvo) !== -1 || // palavra isolada na frase
        dito.indexOf(alvo) !== -1                 // contém a palavra
      );
    });
  }

  return { ouvir, parar, corresponde, normalizar, suportado };
})();
