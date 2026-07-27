/* vistechnologie.pl — silnik „KINETYKA”: typografia w ruchu, reflektor
   za kursorem, AI na żywo. Vanilla JS; reduced-motion = wersja statyczna. */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  doc.documentElement.classList.add("js");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* cookie */
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
  /* nav */
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
  /* błąd formularza */
  var err = doc.querySelector(".dx-form-error");
  if (err && /[?&](blad|error)=1/.test(location.search)) err.classList.add("show");

  /* progress */
  var progress = doc.createElement("div");
  progress.className = "vt-progress"; progress.setAttribute("aria-hidden", "true");
  body.appendChild(progress);

  /* reflektor za kursorem */
  if (fine && !reduced) {
    var spot = doc.createElement("div");
    spot.className = "kn-spot"; spot.setAttribute("aria-hidden", "true");
    body.appendChild(spot);
    doc.addEventListener("mousemove", function (ev) {
      doc.documentElement.style.setProperty("--mx", ev.clientX + "px");
      doc.documentElement.style.setProperty("--my", ev.clientY + "px");
    }, { passive: true });
  }

  /* reveal */
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

  /* liczniki */
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

  /* kinetyka: [data-k] — przesuw poziomy sprzężony ze scrollem */
  var kin = [].slice.call(doc.querySelectorAll("[data-k]"));
  var ticking = false;
  var apply = function () {
    ticking = false;
    var y = window.pageYOffset || 0;
    var docH = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (y / docH * 100).toFixed(2) + "%";
    if (reduced) return;
    kin.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -60 || r.top > window.innerHeight + 60) return;
      el.style.transform = "translateX(" + (-(y * parseFloat(el.getAttribute("data-k")))).toFixed(1) + "px)";
    });
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* rotator w hero */
  var rot = doc.querySelector(".kino-rot-word");
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
          setTimeout(step, 24);
        } else {
          w = words[wi]; chi++;
          rot.textContent = w.slice(0, chi);
          if (chi >= w.length) { deleting = true; setTimeout(step, 2600); return; }
          setTimeout(step, 44 + Math.random() * 40);
        }
      };
      setTimeout(step, 2200);
    }
  }

  /* AI demo — detekcja anomalii */
  var demo = doc.querySelector(".kino-ai-demo");
  if (demo) {
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
    resize(); window.addEventListener("resize", resize);
    var t = 0, visible = false, CYCLE = 560, A_START = 240, A_END = 320;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(demo);
    } else visible = true;
    var sample = function (x, tt) {
      var ph = x * 0.045 + tt * 0.06;
      var y = Math.sin(ph) * 12 + Math.sin(ph * 2.7 + 1.2) * 6 + Math.sin(ph * 0.4) * 8;
      var fr = tt % CYCLE, a = fr - A_START;
      if (a > 0 && fr < A_END) {
        var k = Math.exp(-Math.pow(x - (W - 160), 2) / 5200);
        y += (Math.sin(ph * 9.5) * 34 + Math.sin(ph * 14) * 18) * k * Math.min(1, a / 20);
      }
      return y;
    };
    var draw = function (tt) {
      var fr = tt % CYCLE;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(244,242,236,0.07)"; ctx.lineWidth = 1;
      for (var gy = 30; gy < H - 20; gy += 34) { ctx.beginPath(); ctx.moveTo(16, gy); ctx.lineTo(W - 16, gy); ctx.stroke(); }
      var mid = H * 0.44;
      ctx.beginPath();
      for (var x = 16; x < W - 16; x += 3) {
        var y = mid + sample(x, tt);
        if (x === 16) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#D8FF3A"; ctx.lineWidth = 2; ctx.stroke();
      var scanX = 16 + ((tt * 2.4) % (W - 32));
      ctx.strokeStyle = "rgba(244,242,236,0.7)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(scanX, 18); ctx.lineTo(scanX, H - 26); ctx.stroke();
      if (fr >= A_START && fr < A_END + 90) {
        ctx.strokeStyle = "#FF5A4E"; ctx.lineWidth = 2.5; ctx.setLineDash([7, 5]);
        ctx.strokeRect(W - 220, mid - 74, 130, 148); ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,90,78,0.08)"; ctx.fillRect(W - 220, mid - 74, 130, 148);
      }
      if (chip) {
        if (fr === A_START + 20) { chip.textContent = states[1]; chip.className = "kino-ai-chip warn"; }
        else if (fr === A_END + 60) { chip.textContent = states[2]; chip.className = "kino-ai-chip ok"; }
        else if (fr === 10) { chip.textContent = states[0]; chip.className = "kino-ai-chip"; }
      }
    };
    if (!reduced) {
      var frame = function () { requestAnimationFrame(frame); if (!visible) return; t++; draw(t); };
      requestAnimationFrame(frame);
    } else {
      draw(A_START + 40);
      if (chip) { chip.textContent = states[1]; chip.className = "kino-ai-chip warn"; }
    }
  }

  /* dopasowanie kinetycznych linii do szerokości (PL/EN) */
  var fitLines = function () {
    [].slice.call(doc.querySelectorAll(".kn-line")).forEach(function (el) {
      el.style.fontSize = "";
      var cw = el.clientWidth, sw = el.scrollWidth;
      if (sw > cw + 2) {
        var fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = Math.floor(fs * cw / sw * 0.985) + "px";
      }
    });
  };
  fitLines();
  window.addEventListener("resize", fitLines);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitLines);

  /* poziomy scroller usług: kółko, przeciąganie, strzałki */
  [].slice.call(doc.querySelectorAll(".kn-scroll")).forEach(function (sc) {
    sc.addEventListener("wheel", function (ev) {
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX) && sc.scrollWidth > sc.clientWidth + 4) {
        var atStart = sc.scrollLeft <= 2 && ev.deltaY < 0;
        var atEnd = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 2 && ev.deltaY > 0;
        if (!atStart && !atEnd) { ev.preventDefault(); sc.scrollLeft += ev.deltaY; }
      }
    }, { passive: false });
    var down = false, sx = 0, sl = 0;
    sc.addEventListener("pointerdown", function (ev) { down = true; sx = ev.clientX; sl = sc.scrollLeft; sc.classList.add("grab"); });
    doc.addEventListener("pointermove", function (ev) { if (down) sc.scrollLeft = sl - (ev.clientX - sx); });
    doc.addEventListener("pointerup", function () { down = false; sc.classList.remove("grab"); });
    var wrap = sc.parentNode;
    var mk = function (dir, label) {
      var btn = doc.createElement("button");
      btn.type = "button"; btn.className = "kn-arw kn-arw-" + (dir > 0 ? "r" : "l");
      btn.setAttribute("aria-label", label);
      btn.textContent = dir > 0 ? "→" : "←";
      btn.addEventListener("click", function () { sc.scrollBy({ left: dir * Math.min(440, sc.clientWidth * 0.8), behavior: reduced ? "auto" : "smooth" }); });
      return btn;
    };
    var bar = doc.createElement("div");
    bar.className = "kn-arws";
    bar.appendChild(mk(-1, "Poprzednie")); bar.appendChild(mk(1, "Następne"));
    wrap.insertBefore(bar, sc);
    var upd = function () {
      bar.children[0].disabled = sc.scrollLeft <= 2;
      bar.children[1].disabled = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 2;
    };
    sc.addEventListener("scroll", upd, { passive: true }); upd();
  });

  /* pauza ruchomych pasków tapnięciem/kliknięciem (WCAG 2.2.2) */
  [].slice.call(doc.querySelectorAll(".kn-band, .kn-fx-strip")).forEach(function (el) {
    el.addEventListener("click", function () { el.classList.toggle("paused"); });
  });

  /* symulatory systemów w case studies */
  var L2 = {
    tosStatus: doc.documentElement.lang === "en"
      ? ["planning", "en route", "unloading", "loading", "done"]
      : ["planowanie", "w drodze", "rozładunek", "załadunek", "gotowe"],
    tosLogs: doc.documentElement.lang === "en"
      ? ["system: dangerous goods check OK · wagon {n}", "invoice #{n} issued automatically", "gate: truck {n} checked in", "crane 2: container moved to slot {n}"]
      : ["system: kontrola ładunków niebezpiecznych OK · wagon {n}", "faktura #{n} wystawiona automatycznie", "brama: awizacja ciężarówki {n}", "suwnica 2: kontener na pole {n}"]
  };
  var tos = doc.querySelector('[data-sim="tos"]');
  if (tos && !reduced) {
    var rows = [].slice.call(tos.querySelectorAll(".sim-row .sim-chip"));
    var yard = [].slice.call(tos.querySelectorAll(".sim-yard span"));
    var kpis = [].slice.call(tos.querySelectorAll("[data-kpi]"));
    var log = tos.querySelector(".sim-log");
    var vis2 = false, step = 0;
    new IntersectionObserver(function (en) { vis2 = en[0].isIntersecting; }, { threshold: 0.25 }).observe(tos);
    setInterval(function () {
      if (!vis2) return;
      step++;
      var chip = rows[step % rows.length];
      var si = (parseInt(chip.className.replace(/\D/g, ""), 10) + 1) % L2.tosStatus.length;
      chip.className = "sim-chip s" + (si % 4);
      chip.textContent = L2.tosStatus[si];
      var cell = yard[Math.floor((step * 17) % yard.length)];
      cell.className = "y" + ((step % 4) + 1);
      if (step % 2 === 0) {
        var k = kpis[step % kpis.length];
        k.textContent = parseInt(k.getAttribute("data-kpi"), 10) + Math.floor(step / 2) % 23;
      }
      var msg = L2.tosLogs[step % L2.tosLogs.length].replace("{n}", 100 + (step * 7) % 899);
      log.innerHTML = "<b>›</b> " + msg;
    }, 1600);
  }
  var farm = doc.querySelector('[data-sim="farm"]');
  if (farm) {
    var fc = farm.querySelector(".sim-canvas");
    var fctx = fc.getContext("2d");
    var warnTxt = farm.getAttribute("data-warn"), okTxt = farm.getAttribute("data-ok");
    var fresize = function () {
      fc.width = fc.clientWidth * 1.5; fc.height = fc.clientHeight * 1.5;
      fctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
    };
    fresize(); window.addEventListener("resize", fresize);
    var fvis = false, ft = 0, FC = 420, FA = 180, FB = 260;
    new IntersectionObserver(function (en) { fvis = en[0].isIntersecting; if (fvis) fresize(); }, { threshold: 0.25 }).observe(farm);
    var turb4 = farm.querySelector('[data-t="3"] .sim-chip');
    var alerts = farm.querySelector(".sim-alerts");
    var fsample = function (x, tt) {
      var ph = x * 0.06 + tt * 0.07;
      var y = Math.sin(ph) * 8 + Math.sin(ph * 2.4 + 1) * 4;
      var fr = tt % FC, a = fr - FA;
      if (a > 0 && fr < FB) {
        var k = Math.exp(-Math.pow(x - fc.clientWidth * 0.68, 2) / 2600);
        y += (Math.sin(ph * 9) * 22 + Math.sin(ph * 15) * 11) * k * Math.min(1, a / 16);
      }
      return y;
    };
    var fdraw = function () {
      var W2 = fc.clientWidth, H2 = fc.clientHeight, fr = ft % FC;
      fctx.clearRect(0, 0, W2, H2);
      fctx.strokeStyle = "rgba(244,242,236,0.06)";
      for (var gy = 20; gy < H2; gy += 24) { fctx.beginPath(); fctx.moveTo(0, gy); fctx.lineTo(W2, gy); fctx.stroke(); }
      var mid = H2 * 0.5;
      fctx.beginPath();
      for (var x = 0; x < W2; x += 3) {
        var y = mid + fsample(x, ft);
        x === 0 ? fctx.moveTo(x, y) : fctx.lineTo(x, y);
      }
      fctx.strokeStyle = "#D8FF3A"; fctx.lineWidth = 1.8; fctx.stroke();
      if (fr >= FA && fr < FB + 60) {
        fctx.strokeStyle = "#FF5A4E"; fctx.setLineDash([6, 4]);
        fctx.strokeRect(W2 * 0.68 - 55, mid - 44, 110, 88); fctx.setLineDash([]);
      }
      if (fr === FA + 14 && turb4) {
        turb4.className = "sim-chip warn"; turb4.textContent = warnTxt;
        var d = doc.createElement("div"); d.className = "sim-al warn";
        d.textContent = "⚠ T-04 · " + warnTxt + " · conf 0.96";
        alerts.prepend(d);
      }
      if (fr === FB + 80 && turb4) {
        var d2 = doc.createElement("div"); d2.className = "sim-al lime";
        d2.textContent = doc.documentElement.lang === "en" ? "→ work order #4211 created" : "→ zlecenie serwisowe #4211 utworzone";
        alerts.prepend(d2);
        while (alerts.children.length > 3) alerts.removeChild(alerts.lastChild);
      }
      if (fr === 4 && turb4) { turb4.className = "sim-chip s1"; turb4.textContent = okTxt; }
    };
    if (!reduced) {
      var floop = function () { requestAnimationFrame(floop); if (!fvis) return; ft++; fdraw(); };
      requestAnimationFrame(floop);
    } else { ft = FA + 30; fresize(); fdraw(); }
  }

  body.classList.add("no-gl");
})();
