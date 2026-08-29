/* ========================================================================
   CONFETES — Animação de comemoração no <canvas>
   Sem bibliotecas externas. Chame Confete.explodir() ao acertar.
   ======================================================================== */

const Confete = (function () {
  const canvas = document.getElementById("canvas-confete");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const cores = ["#ff5fa2", "#ffcb2b", "#38d39f", "#8a5cff", "#ff8a3d", "#5ec6ff"];
  let particulas = [];
  let animando = false;

  function ajustarTamanho() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", ajustarTamanho);
  ajustarTamanho();

  function criarParticula() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      tamanho: 8 + Math.random() * 10,
      cor: cores[Math.floor(Math.random() * cores.length)],
      velY: 2 + Math.random() * 4,
      velX: -2 + Math.random() * 4,
      giro: Math.random() * Math.PI,
      velGiro: -0.2 + Math.random() * 0.4,
    };
  }

  function desenhar() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particulas.forEach((p) => {
      p.y += p.velY;
      p.x += p.velX;
      p.giro += p.velGiro;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.cor;
      ctx.fillRect(-p.tamanho / 2, -p.tamanho / 2, p.tamanho, p.tamanho * 0.6);
      ctx.restore();
    });

    // Mantém apenas as partículas que ainda estão na tela.
    particulas = particulas.filter((p) => p.y < canvas.height + 30);

    if (particulas.length > 0) {
      requestAnimationFrame(desenhar);
    } else {
      animando = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /** Dispara uma chuva de confetes coloridos. */
  function explodir(quantidade = 120) {
    if (!ctx) return;
    for (let i = 0; i < quantidade; i++) {
      particulas.push(criarParticula());
    }
    if (!animando) {
      animando = true;
      requestAnimationFrame(desenhar);
    }
  }

  return { explodir };
})();
