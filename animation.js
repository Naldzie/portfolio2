/* animation.js
   - typing loop
   - animated glowing geometric shapes on a full-page canvas
   - preloader fade-out
   - continuous glowing hexagon avatar animation
*/

(() => {
  /* -------------------------
     Typing / rotating titles
     ------------------------- */
  const titles = ["Developer", "Designer", "Tech Enthusiast", "Student"];
  const typeTarget = document.getElementById("typewriter");
  let tIndex = 0, charIndex = 0, typing = true;
  const TYPING_SPEED = 80;
  const ERASING_SPEED = 40;
  const HOLD = 1200;

  function typeTick() {
    const current = titles[tIndex];
    if (typing) {
      if (charIndex <= current.length) {
        typeTarget.textContent = current.slice(0, charIndex);
        charIndex++;
        setTimeout(typeTick, TYPING_SPEED);
      } else {
        typing = false;
        setTimeout(typeTick, HOLD);
      }
    } else {
      if (charIndex > 0) {
        charIndex--;
        typeTarget.textContent = current.slice(0, charIndex);
        setTimeout(typeTick, ERASING_SPEED);
      } else {
        tIndex = (tIndex + 1) % titles.length;
        typing = true;
        setTimeout(typeTick, 220);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (typeTarget) typeTick();
  });

  /* -------------------------
     Preloader: fade out on load
     ------------------------- */
  window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    if (!pre) return;
    pre.style.transition = "opacity 600ms ease, visibility 600ms";
    pre.style.opacity = "0";
    setTimeout(() => {
      pre.style.visibility = "hidden";
      pre.remove();
    }, 700);
  });

  /* -------------------------
     Animated glowing shapes background
     ------------------------- */
  const canvas = document.getElementById("bg-shapes");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, shapes = [];
  const SHAPE_COUNT = Math.max(20, Math.floor(window.innerWidth / 60));

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

  function makeShapes() {
    shapes = [];
    for (let i = 0; i < SHAPE_COUNT; i++) {
      const type = ["circle", "square", "triangle"][randInt(0, 2)];
      const size = rand(18, 62);
      shapes.push({
        x: rand(-50, W + 50),
        y: rand(-50, H + 50),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.15, 0.15),
        size,
        type,
        rot: rand(0, Math.PI * 2),
        vrot: rand(-0.004, 0.004),
        hue: randInt(190, 300),
        alpha: rand(0.08, 0.24),
      });
    }
  }
  makeShapes();

  function drawShape(s) {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.shadowColor = `hsla(${s.hue}, 85%, 70%, 0.8)`;
    ctx.shadowBlur = 18;
    const grad = ctx.createLinearGradient(-s.size, -s.size, s.size, s.size);
    grad.addColorStop(0, `hsla(${s.hue},85%,65%,0.45)`);
    grad.addColorStop(1, `hsla(${s.hue + 18},75%,45%,0.2)`);
    ctx.fillStyle = grad;
    ctx.strokeStyle = `hsla(${s.hue},85%,65%,0.15)`;
    ctx.lineWidth = 1.4;
    if (s.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, s.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.type === "square") {
      ctx.beginPath();
      ctx.rect(-s.size * 0.6, -s.size * 0.6, s.size * 1.2, s.size * 1.2);
      ctx.fill();
    } else {
      const r = s.size * 0.9;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.65);
      ctx.lineTo(r * 0.6, r * 0.55);
      ctx.lineTo(-r * 0.6, r * 0.55);
      ctx.closePath();
      ctx.fill();
    }
    ctx.stroke();
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(24,24,36,0.05)");
    g.addColorStop(1, "rgba(16,26,32,0.08)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < shapes.length; i++) {
      const s = shapes[i];
      s.x += s.vx; s.y += s.vy; s.rot += s.vrot;
      if (s.x < -120) s.x = W + rand(6, 80);
      if (s.x > W + 120) s.x = -rand(6, 80);
      if (s.y < -120) s.y = H + rand(6, 80);
      if (s.y > H + 120) s.y = -rand(6, 80);
      drawShape(s);
    }

    // subtle connection lines
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const a = shapes[i], b = shapes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(64,255,255,${(0.07 * (1 - d / 140)).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }

  setInterval(() => {
    shapes.forEach((s) => {
      s.vx += rand(-0.02, 0.02);
      s.vy += rand(-0.01, 0.01);
      s.alpha = Math.max(0.05, Math.min(0.32, s.alpha + rand(-0.02, 0.02)));
    });
  }, 4200);

  requestAnimationFrame(step);
  window.addEventListener("resize", () => { resize(); makeShapes(); });

  /* -------------------------
     Continuous Hexagon Glow Animation
     ------------------------- */
  const hexGlow = document.querySelector(".hex-glow");
  if (hexGlow) {
    let glowPulse = 0;
    function animateHex() {
      glowPulse += 0.02;
      const scale = 1 + Math.sin(glowPulse) * 0.04;
      const blur = 20 + Math.sin(glowPulse) * 6;
      hexGlow.style.transform = `scale(${scale})`;
      hexGlow.style.filter = `blur(${blur}px)`;
      requestAnimationFrame(animateHex);
    }
    animateHex();
  }

})();