/* ========================================================================
   PAINEL DO EDUCADOR — Ficha de Registro Discreta
   --------------------------------------------------------------------------
   Objetivo: o professor/mediador acompanha o progresso da Antonella sem
   interromper a brincadeira. É um AVALIADOR DISCRETO:

   • Acesso oculto: engrenagem ⚙️ no canto; abre o painel só com
     pressão longa de 3s OU clique duplo (a criança dificilmente aciona).
   • Coleta automática de métricas via API Painel.registrar* (chamada pelo
     jogo). Nada aparece para a criança durante o jogo.
   • Interface: modal com tabela-resumo por palavra + totais da sessão.
   • Exportação: "Copiar Relatório de Desempenho" e "Baixar TXT".

   Persistência: as sessões ficam no localStorage para não se perderem ao
   recarregar. Tudo local, sem enviar dados para fora.
   ======================================================================== */

const Painel = (function () {
  const CHAVE = "antonella_sessoes_v1";
  const NOME = "Antonella";

  // Sessão atual em andamento (uma "sessão" = uma escolha de tema até sair).
  let sessao = null;
  let palavraCorrente = null;

  // ---------------- Persistência ----------------
  function carregarSessoes() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || [];
    } catch (e) {
      return [];
    }
  }

  function salvarSessoes(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch (e) {
      /* armazenamento indisponível: mantém só em memória */
    }
  }

  function persistirSessaoAtual() {
    if (!sessao) return;
    const lista = carregarSessoes();
    const idx = lista.findIndex(function (s) {
      return s.id === sessao.id;
    });
    if (idx >= 0) lista[idx] = sessao;
    else lista.push(sessao);
    salvarSessoes(lista);
  }

  // ---------------- API de coleta (chamada pelo jogo) ----------------
  // Inicia uma sessão nova ao entrar num tema.
  function iniciarSessao(tema) {
    sessao = {
      id: "s" + Date.now(),
      tema: tema || "-",
      inicio: Date.now(),
      fim: null,
      palavras: [], // uma entrada por palavra jogada
    };
    palavraCorrente = null;
    persistirSessaoAtual();
  }

  // Marca o início do trabalho numa palavra.
  function iniciarPalavra(palavra) {
    if (!sessao) iniciarSessao("-");
    palavraCorrente = {
      palavra: palavra || "-",
      tentativas: 0,     // total de encaixes tentados (certos + errados)
      erros: 0,          // tentativas erradas
      acertouPrimeira: null, // true se acertou a 1ª letra de primeira
      toquesBoca: 0,     // vezes que ouviu a dica de fonema (boca/som)
      fonemasOk: [],     // fonemas/letras acertados de primeira
      inicio: Date.now(),
      fim: null,
    };
    sessao.palavras.push(palavraCorrente);
    persistirSessaoAtual();
  }

  // Registra uma tentativa de encaixe de letra.
  // acertou: bool; letra: string; dePrimeira: bool (1ª tentativa daquela lacuna)
  function registrarTentativa(acertou, letra, dePrimeira) {
    if (!palavraCorrente) return;
    palavraCorrente.tentativas++;
    if (acertou) {
      if (dePrimeira) palavraCorrente.fonemasOk.push(letra);
      // A "1ª letra de primeira" define acertouPrimeira (só a inicial).
      if (palavraCorrente.acertouPrimeira === null) {
        palavraCorrente.acertouPrimeira = !!dePrimeira;
      }
    } else {
      palavraCorrente.erros++;
      if (palavraCorrente.acertouPrimeira === null) {
        palavraCorrente.acertouPrimeira = false;
      }
    }
    persistirSessaoAtual();
  }

  // Registra que a criança pediu a dica do fonema (tocou na boca/som).
  function registrarToqueBoca() {
    if (!palavraCorrente) return;
    palavraCorrente.toquesBoca++;
    persistirSessaoAtual();
  }

  // Fecha a palavra corrente.
  function concluirPalavra() {
    if (palavraCorrente) {
      palavraCorrente.fim = Date.now();
      persistirSessaoAtual();
    }
  }

  // Fecha a sessão (ao sair do modo).
  function encerrarSessao() {
    if (sessao) {
      sessao.fim = Date.now();
      persistirSessaoAtual();
    }
    sessao = null;
    palavraCorrente = null;
  }

  // ---------------- Cálculos para o relatório ----------------
  function duracao(ms) {
    if (!ms || ms < 0) ms = 0;
    const s = Math.round(ms / 1000);
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return (min > 0 ? min + " min " : "") + seg + " s";
  }

  function fim(s) {
    return s.fim || Date.now();
  }

  // Monta o texto do relatório (usado por copiar e baixar).
  function gerarTexto() {
    const lista = carregarSessoes();
    const linhas = [];
    linhas.push("RELATÓRIO DE DESEMPENHO — " + NOME);
    linhas.push("Gerado em: " + new Date().toLocaleString("pt-BR"));
    linhas.push("Sessões registradas: " + lista.length);
    linhas.push("========================================");

    lista.forEach(function (s, i) {
      linhas.push("");
      linhas.push(
        "SESSÃO " + (i + 1) + " | Tema: " + s.tema +
        " | Duração: " + duracao(fim(s) - s.inicio)
      );
      linhas.push(
        "Palavra | Tentativas | Erros | Acertou a 1ª letra | Dicas de som (boca) | Fonemas de 1ª"
      );
      s.palavras.forEach(function (p) {
        linhas.push(
          "  " + p.palavra +
          " | " + p.tentativas +
          " | " + p.erros +
          " | " + (p.acertouPrimeira ? "Sim" : "Não") +
          " | " + p.toquesBoca +
          " | " + (p.fonemasOk.join(" ") || "-")
        );
      });
    });

    // Totais gerais (indicadores rápidos para o portfólio).
    const totPalavras = lista.reduce(function (a, s) { return a + s.palavras.length; }, 0);
    const totDicas = lista.reduce(function (a, s) {
      return a + s.palavras.reduce(function (b, p) { return b + p.toquesBoca; }, 0);
    }, 0);
    const totAcerto1 = lista.reduce(function (a, s) {
      return a + s.palavras.filter(function (p) { return p.acertouPrimeira; }).length;
    }, 0);
    linhas.push("");
    linhas.push("========================================");
    linhas.push("RESUMO GERAL");
    linhas.push("Palavras trabalhadas: " + totPalavras);
    linhas.push("Palavras com acerto de primeira: " + totAcerto1);
    linhas.push("Total de dicas de som pedidas (suporte): " + totDicas);
    return linhas.join("\n");
  }

  // ---------------- Interface (modal + tabela) ----------------
  let modal = null;

  function construirModal() {
    modal = document.createElement("div");
    modal.id = "painel-modal";
    modal.className = "painel-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Painel do Educador");
    modal.hidden = true;

    modal.innerHTML =
      '<div class="painel-caixa">' +
      '  <div class="painel-cabecalho">' +
      '    <h2 class="painel-titulo">Painel do Educador — ' + NOME + "</h2>" +
      '    <button class="painel-fechar" aria-label="Fechar painel">✕</button>' +
      "  </div>" +
      '  <div class="painel-corpo" id="painel-corpo"></div>' +
      '  <div class="painel-acoes">' +
      '    <button class="painel-btn" id="painel-copiar">📋 Copiar Relatório de Desempenho</button>' +
      '    <button class="painel-btn" id="painel-baixar">⬇️ Baixar TXT</button>' +
      '    <button class="painel-btn painel-btn--limpar" id="painel-limpar">🗑️ Limpar registros</button>' +
      "  </div>" +
      '  <p class="painel-status" id="painel-status" role="status"></p>' +
      "</div>";

    document.body.appendChild(modal);

    modal.querySelector(".painel-fechar").addEventListener("click", fechar);
    modal.addEventListener("click", function (ev) {
      if (ev.target === modal) fechar(); // clique fora fecha
    });
    modal.querySelector("#painel-copiar").addEventListener("click", copiarRelatorio);
    modal.querySelector("#painel-baixar").addEventListener("click", baixarTxt);
    modal.querySelector("#painel-limpar").addEventListener("click", function () {
      salvarSessoes([]);
      sessao = null;
      palavraCorrente = null;
      renderizarTabela();
      status("Registros apagados.");
    });
  }

  function renderizarTabela() {
    const corpo = modal.querySelector("#painel-corpo");
    const lista = carregarSessoes();

    if (lista.length === 0) {
      corpo.innerHTML = '<p class="painel-vazio">Ainda não há registros. Assim que a ' +
        NOME + " brincar na Caçada dos Sons, os dados aparecem aqui.</p>";
      return;
    }

    let html = "";
    lista.forEach(function (s, i) {
      html +=
        '<div class="painel-sessao">' +
        '<div class="painel-sessao__cab">Sessão ' + (i + 1) +
        " · Tema: <strong>" + s.tema + "</strong> · " +
        "Duração: " + duracao(fim(s) - s.inicio) + "</div>";
      html +=
        '<table class="painel-tabela"><thead><tr>' +
        "<th>Palavra</th><th>Tentativas</th><th>Erros</th>" +
        "<th>Acertou 1ª</th><th>Dicas de som</th><th>Fonemas de 1ª</th>" +
        "</tr></thead><tbody>";
      s.palavras.forEach(function (p) {
        html +=
          "<tr>" +
          "<td>" + p.palavra + "</td>" +
          "<td>" + p.tentativas + "</td>" +
          "<td>" + p.erros + "</td>" +
          "<td>" + (p.acertouPrimeira ? "✅" : "—") + "</td>" +
          "<td>" + p.toquesBoca + "</td>" +
          "<td>" + (p.fonemasOk.join(" ") || "—") + "</td>" +
          "</tr>";
      });
      html += "</tbody></table></div>";
    });
    corpo.innerHTML = html;
  }

  function status(msg) {
    const s = modal.querySelector("#painel-status");
    if (!s) return;
    s.textContent = msg;
    clearTimeout(status._t);
    status._t = setTimeout(function () {
      s.textContent = "";
    }, 2500);
  }

  function abrir() {
    if (!modal) construirModal();
    renderizarTabela();
    modal.hidden = false;
  }

  function fechar() {
    if (modal) modal.hidden = true;
  }

  // ---------------- Exportação ----------------
  function copiarRelatorio() {
    const texto = gerarTexto();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(
        function () { status("Relatório copiado! Cole no portfólio."); },
        function () { copiaFallback(texto); }
      );
    } else {
      copiaFallback(texto);
    }
  }

  // Fallback de cópia para navegadores sem Clipboard API.
  function copiaFallback(texto) {
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      status("Relatório copiado! Cole no portfólio.");
    } catch (e) {
      status("Não consegui copiar. Use Baixar TXT.");
    }
    document.body.removeChild(ta);
  }

  function baixarTxt() {
    const texto = gerarTexto();
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const data = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "relatorio-" + NOME.toLowerCase() + "-" + data + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    status("Arquivo TXT gerado.");
  }

  // ---------------- Acesso oculto (engrenagem) ----------------
  function criarBotaoOculto() {
    const btn = document.createElement("button");
    btn.id = "painel-engrenagem";
    btn.className = "painel-engrenagem";
    btn.setAttribute("aria-label", "Painel do Educador (segure 3 segundos ou clique duas vezes)");
    btn.innerHTML = '<span aria-hidden="true">⚙️</span>';
    document.body.appendChild(btn);

    // Pressão longa de 3s.
    let timerHold = null;
    function iniciarHold() {
      btn.classList.add("painel-engrenagem--segurando");
      timerHold = setTimeout(function () {
        cancelarHold();
        abrir();
      }, 3000);
    }
    function cancelarHold() {
      btn.classList.remove("painel-engrenagem--segurando");
      if (timerHold) {
        clearTimeout(timerHold);
        timerHold = null;
      }
    }
    btn.addEventListener("mousedown", iniciarHold);
    btn.addEventListener("touchstart", function (e) {
      e.preventDefault();
      iniciarHold();
    }, { passive: false });
    btn.addEventListener("mouseup", cancelarHold);
    btn.addEventListener("mouseleave", cancelarHold);
    btn.addEventListener("touchend", cancelarHold);
    btn.addEventListener("touchcancel", cancelarHold);

    // Clique duplo (atalho alternativo).
    btn.addEventListener("dblclick", function () {
      cancelarHold();
      abrir();
    });
  }

  function init() {
    if (typeof document === "undefined") return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", criarBotaoOculto);
    } else {
      criarBotaoOculto();
    }
  }
  init();

  return {
    // API de coleta usada pelo jogo:
    iniciarSessao: iniciarSessao,
    iniciarPalavra: iniciarPalavra,
    registrarTentativa: registrarTentativa,
    registrarToqueBoca: registrarToqueBoca,
    concluirPalavra: concluirPalavra,
    encerrarSessao: encerrarSessao,
    // Controle da UI (se precisar abrir por código):
    abrir: abrir,
    fechar: fechar,
  };
})();
