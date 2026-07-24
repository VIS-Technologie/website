/* vistechnologie.pl — warstwa interakcji „Sygnał / Immersive”.
   Vanilla JS, zero zależności. Wszystko degraduje się z gracją:
   bez WebGL i przy prefers-reduced-motion strona wygląda i działa w pełni. */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- cookie note ---------- */
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

  /* ---------- nawigacja mobilna ---------- */
  var nav = doc.querySelector(".dx-nav");
  var toggle = doc.querySelector(".dx-nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var links = nav.querySelectorAll(".dx-nav-links a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  /* ---------- błąd formularza (redirect z wyslij.php) ---------- */
  var err = doc.querySelector(".dx-form-error");
  if (err && /[?&](blad|error)=1/.test(location.search)) err.classList.add("show");

  /* ---------- pasek postępu przewijania ---------- */
  var progress = doc.createElement("div");
  progress.className = "vt-progress";
  progress.setAttribute("aria-hidden", "true");
  body.appendChild(progress);

  /* ---------- reveal przy przewijaniu ---------- */
  var revealEls = [].slice.call(doc.querySelectorAll("[data-reveal]"));
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (s) {
          return s.hasAttribute && s.hasAttribute("data-reveal");
        }) : [el];
        var i = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(i % 8, 5) * 70 + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- liczniki statystyk ---------- */
  var counters = [].slice.call(doc.querySelectorAll("[data-count]"));
  if (counters.length) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (reduced) { el.textContent = target; return; }
      var t0 = null, dur = 1100;
      var tick = function (t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window) || reduced) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- strefy koloru tła (body) ---------- */
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

  /* ---------- parallax hero ---------- */
  var chips = [].slice.call(doc.querySelectorAll(".dx-hero-art-shapes > div"));
  var heroArt = doc.querySelector(".dx-hero-art-frame img");

  /* ---------- scroll: jeden rAF dla wszystkiego ---------- */
  var scrollY = 0, docH = 1, ticking = false;
  var apply = function () {
    ticking = false;
    docH = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (scrollY / docH * 100).toFixed(2) + "%";
    if (!reduced) {
      if (heroArt) heroArt.style.transform = "translateY(" + (scrollY * 0.05).toFixed(1) + "px)";
      chips.forEach(function (c, i) {
        c.style.transform = "translateY(" + (scrollY * (0.10 + i * 0.05)).toFixed(1) + "px)";
      });
    }
  };
  var onScroll = function () {
    scrollY = window.pageYOffset || 0;
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ================= WebGL: „pole sygnału” =================
     Każda ciemna sekcja z <canvas class="vt-gl"> dostaje własny
     kontekst z tym samym shaderem; scroll steruje fazą i paletą. */
  var canvases = [].slice.call(doc.querySelectorAll("canvas.vt-gl"));

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FRAG = [
    "precision mediump float;",
    "uniform vec2 u_res;uniform float u_t;uniform float u_s;uniform float u_v;",
    "float wave(vec2 uv,float base,float amp,float freq,float speed,float phase){",
    "  float y=base+amp*sin(uv.x*freq+u_t*speed+phase+u_s*4.0);",
    "  y+=amp*.4*sin(uv.x*freq*2.3-u_t*speed*1.6+phase*2.0);",
    "  float d=abs(uv.y-y);",
    "  return .0035/(d+.0022);",
    "}",
    "void main(){",
    "  vec2 uv=gl_FragCoord.xy/u_res;",
    "  vec3 ink=vec3(.031,.075,.11);",
    "  vec3 ink2=vec3(.055,.12,.165);",
    "  vec3 mint=vec3(.169,.851,.663);",
    "  vec3 amber=vec3(1.,.706,.329);",
    "  vec3 teal=vec3(.043,.478,.4);",
    "  vec3 col=mix(ink,ink2,uv.y*.8+.15*sin(u_t*.08));",
    "  vec2 g=uv-vec2(.78-.35*u_s,.72);",
    "  col+=mint*.10*(1.-smoothstep(.0,.75,length(g)))*(.7+.3*sin(u_t*.22));",
    "  float m=clamp(u_s*1.4,0.,1.);",
    "  vec3 acc1=mix(mint,amber,m);",
    "  vec3 acc2=mix(amber,mint,m);",
    "  vec3 acc3=mix(teal,mint,m*.6);",
    "  col+=acc1*wave(uv,.62-.1*u_s,.055,4.2,.35,0.)*.85*u_v;",
    "  col+=acc2*wave(uv,.42+.08*u_s,.075,3.1,-.26,2.1)*.5*u_v;",
    "  col+=acc3*wave(uv,.25+.05*sin(u_s*6.283),.05,5.4,.21,4.4)*.6*u_v;",
    "  float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);",
    "  col+=(grain-.5)*.028;",
    "  float vig=smoothstep(1.25,.35,length(uv-vec2(.5,.5)));",
    "  col*=.82+.18*vig;",
    "  gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function initGL(canvas) {
    var gl = canvas.getContext("webgl", { antialias: true, alpha: false, powerPreference: "low-power" })
          || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    return {
      gl: gl, canvas: canvas, visible: false,
      u_res: gl.getUniformLocation(prog, "u_res"),
      u_t: gl.getUniformLocation(prog, "u_t"),
      u_s: gl.getUniformLocation(prog, "u_s"),
      u_v: gl.getUniformLocation(prog, "u_v"),
      vib: parseFloat(canvas.getAttribute("data-vibrance") || "1")
    };
  }

  function sizeGL(ctx) {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = ctx.canvas.clientWidth, h = ctx.canvas.clientHeight;
    if (!w || !h) return;
    var W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (ctx.canvas.width !== W || ctx.canvas.height !== H) {
      ctx.canvas.width = W; ctx.canvas.height = H;
      ctx.gl.viewport(0, 0, W, H);
    }
  }

  var ctxs = [];
  if (!reduced && canvases.length) {
    try {
      canvases.forEach(function (c) {
        var ctx = initGL(c);
        if (ctx) ctxs.push(ctx);
      });
    } catch (e) { ctxs = []; }
  }
  body.classList.add(ctxs.length ? "gl-on" : "no-gl");

  if (ctxs.length && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        for (var k = 0; k < ctxs.length; k++) {
          if (ctxs[k].canvas === en.target) ctxs[k].visible = en.isIntersecting;
        }
      });
    }, { rootMargin: "10% 0px 10% 0px" });
    ctxs.forEach(function (c) { vio.observe(c.canvas); });
  } else {
    ctxs.forEach(function (c) { c.visible = true; });
  }

  if (ctxs.length) {
    var t0 = performance.now();
    var frame = function () {
      var t = (performance.now() - t0) / 1000;
      var s = scrollY / docH;
      for (var k = 0; k < ctxs.length; k++) {
        var ctx = ctxs[k];
        if (!ctx.visible) continue;
        sizeGL(ctx);
        var gl = ctx.gl;
        gl.uniform2f(ctx.u_res, ctx.canvas.width, ctx.canvas.height);
        gl.uniform1f(ctx.u_t, t);
        gl.uniform1f(ctx.u_s, s);
        gl.uniform1f(ctx.u_v, ctx.vib);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
