/* vistechnologie.pl — koncepcja „KINO”: jasna baza + pełnoekranowe kadry
   domenowe z parallaksą przy przewijaniu. Vanilla JS, zero zależności. */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var note = doc.querySelector(".dx-cookie-note");
  if (note) {
    var KEY = "vt-cookie-note", seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!seen) note.hidden = false;
    var btn = note.querySelector("button");
    if (btn) btn.addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      note.hidden = true;
    });
  }
  var nav = doc.querySelector(".dx-nav"), toggle = doc.querySelector(".dx-nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var links = nav.querySelectorAll(".dx-nav-links a");
    for (var i = 0; i < links.length; i++) links[i].addEventListener("click", function () {
      nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    });
  }
  var err = doc.querySelector(".dx-form-error");
  if (err && /[?&](blad|error)=1/.test(location.search)) err.classList.add("show");

  var progress = doc.createElement("div");
  progress.className = "vt-progress"; progress.setAttribute("aria-hidden", "true");
  body.appendChild(progress);

  var revealEls = [].slice.call(doc.querySelectorAll("[data-reveal]"));
  if (reduced || !("IntersectionObserver" in window)) revealEls.forEach(function (el) { el.classList.add("in"); });
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (s) {
          return s.hasAttribute && s.hasAttribute("data-reveal");
        }) : [el];
        el.style.transitionDelay = Math.min(Math.max(0, sibs.indexOf(el)) % 8, 5) * 70 + "ms";
        el.classList.add("in"); io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var counters = [].slice.call(doc.querySelectorAll("[data-count]"));
  var runCount = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduced) { el.textContent = target; return; }
    var t0 = null;
    var tick = function (t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1100);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window) || reduced) counters.forEach(runCount);
    else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  var zones = [].slice.call(doc.querySelectorAll("[data-zone]"));
  if (zones.length && "IntersectionObserver" in window) {
    var zio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        body.className = body.className.replace(/\bzone-\w+\b/g, "").trim();
        body.classList.add("zone-" + en.target.getAttribute("data-zone"));
      });
    }, { rootMargin: "-40% 0px -40% 0px" });
    zones.forEach(function (s) { zio.observe(s); });
  }

  /* parallax kadrów */
  var plx = [].slice.call(doc.querySelectorAll("[data-plx]"));
  var ticking = false;
  var apply = function () {
    ticking = false;
    var docH = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = ((window.pageYOffset || 0) / docH * 100).toFixed(2) + "%";
    if (reduced) return;
    var vh = window.innerHeight;
    plx.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var mid = r.top + r.height / 2 - vh / 2;
      var y = Math.max(-56, Math.min(56, -mid * 0.08));
      el.style.transform = "scale(1.14) translateY(" + y.toFixed(1) + "px)";
    });
  };
  var onScroll = function () {
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  body.classList.add("no-gl");
})();

/* ---------- KINO: AI widoczne na stronie ---------- */
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* rotator w hero: AI "pisze" */
  var rot = document.querySelector(".kino-rot-word");
  if (rot) {
    var words = [];
    try { words = JSON.parse(rot.getAttribute("data-rotate")) || []; } catch (e) {}
    if (words.length > 1 && !reduced) {
      var wi = 0, chi = words[0].length, deleting = true;
      var step = function () {
        var w = words[wi];
        if (deleting) {
          chi--; rot.textContent = w.slice(0, chi);
          if (chi <= 0) { deleting = false; wi = (wi + 1) % words.length; }
          setTimeout(step, 26);
        } else {
          w = words[wi]; chi++;
          rot.textContent = w.slice(0, chi);
          if (chi >= w.length) { deleting = true; setTimeout(step, 2600); return; }
          setTimeout(step, 46 + Math.random() * 40);
        }
      };
      setTimeout(step, 2200);
    }
  }

  /* demo: detekcja anomalii akustycznej */
  var demo = document.querySelector(".kino-ai-demo");
  if (!demo) return;
  var canvas = demo.querySelector(".kino-ai-canvas");
  var chip = demo.querySelector(".kino-ai-chip");
  var ctx = canvas.getContext("2d");
  var states = [demo.getAttribute("data-s0"), demo.getAttribute("data-s1"), demo.getAttribute("data-s2")];
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  var resize = function () {
    W = demo.clientWidth; H = demo.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  var t = 0, visible = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(demo);
  } else visible = true;

  var CYCLE = 560;             /* klatek na pełny cykl */
  var A_START = 240, A_END = 320;  /* okno anomalii */
  var sample = function (x, tt) {
    var ph = (x * 0.045) + tt * 0.06;
    var y = Math.sin(ph) * 12 + Math.sin(ph * 2.7 + 1.2) * 6 + Math.sin(ph * 0.4) * 8;
    var frame = (tt % CYCLE);
    var anomAge = frame - A_START;
    if (anomAge > 0 && frame < A_END) {
      var k = Math.exp(-Math.pow((x - (W - 160)), 2) / 5200);
      y += (Math.sin(ph * 9.5) * 34 + Math.sin(ph * 14) * 18) * k * Math.min(1, anomAge / 20);
    }
    return y;
  };

  var frame = function () {
    requestAnimationFrame(frame);
    if (!visible) return;
    t++;
    var fr = t % CYCLE;
    ctx.clearRect(0, 0, W, H);
    /* siatka */
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (var gy = 30; gy < H - 20; gy += 34) {
      ctx.beginPath(); ctx.moveTo(16, gy); ctx.lineTo(W - 16, gy); ctx.stroke();
    }
    /* przebieg */
    var mid = H * 0.44;
    ctx.beginPath();
    for (var x = 16; x < W - 16; x += 3) {
      var y = mid + sample(x, t);
      if (x === 16) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#7FB4E8"; ctx.lineWidth = 2; ctx.stroke();
    /* skan AI */
    var scanX = 16 + ((t * 2.4) % (W - 32));
    ctx.strokeStyle = "rgba(232,147,76,0.85)"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(scanX, 18); ctx.lineTo(scanX, H - 26); ctx.stroke();
    /* okno anomalii */
    if (fr >= A_START && fr < A_END + 90) {
      var ax = W - 220;
      ctx.strokeStyle = "#FF6B52"; ctx.lineWidth = 2.5;
      ctx.setLineDash([7, 5]);
      ctx.strokeRect(ax, mid - 74, 130, 148);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,107,82,0.09)";
      ctx.fillRect(ax, mid - 74, 130, 148);
    }
    /* status */
    if (chip) {
      if (fr === A_START + 20) { chip.textContent = states[1]; chip.className = "kino-ai-chip warn"; }
      else if (fr === A_END + 60) { chip.textContent = states[2]; chip.className = "kino-ai-chip ok"; }
      else if (fr === 10) { chip.textContent = states[0]; chip.className = "kino-ai-chip"; }
    }
  };
  if (!reduced) requestAnimationFrame(frame);
  else {
    /* statyczna klatka z zaznaczoną anomalią */
    t = A_START + 40; visible = true;
    var mid2 = H * 0.44;
    ctx.beginPath();
    for (var x2 = 16; x2 < W - 16; x2 += 3) {
      var y2 = mid2 + sample(x2, t);
      if (x2 === 16) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = "#7FB4E8"; ctx.lineWidth = 2; ctx.stroke();
    if (chip) { chip.textContent = states[1]; chip.className = "kino-ai-chip warn"; }
  }
})();
