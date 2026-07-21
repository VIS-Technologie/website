(function () {
  "use strict";

  // Belka cookies — pokazywana przez JS (bez JS nie ma belki; wystarczy link w stopce).
  var note = document.querySelector(".dx-cookie-note");
  if (note) {
    var KEY = "vt-cookie-note";
    var seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!seen) note.hidden = false;
    var btn = note.querySelector("button");
    if (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, "1"); } catch (e) {}
        note.hidden = true;
      });
    }
  }

  // Menu mobilne
  var nav = document.querySelector(".dx-nav");
  var toggle = document.querySelector(".dx-nav-toggle");
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

  // Komunikat błędu formularza (redirect z wyslij.php)
  var err = document.querySelector(".dx-form-error");
  if (err && /[?&](blad|error)=1/.test(location.search)) err.classList.add("show");
})();
