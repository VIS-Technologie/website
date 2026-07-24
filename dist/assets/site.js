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
