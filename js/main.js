/* ============================================================
   Pawanesh Kumar Vishwakarma — homepage interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme (dark / light) ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}

  var prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- BibTeX expand + copy ---------- */
  var bibBtns = document.querySelectorAll(".pub__bib-btn");
  Array.prototype.forEach.call(bibBtns, function (btn) {
    var pre = btn.closest(".pub").querySelector(".pub__bib");
    if (!pre) return;

    var copyMode = false;

    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";

      if (!isOpen) {
        pre.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        btn.textContent = "Copy BibTeX";
        copyMode = true;
      } else if (copyMode) {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = "Copied \u2713";
          setTimeout(function () { btn.textContent = "Copy BibTeX"; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallbackCopy);
        } else {
          fallbackCopy();
        }
        function fallbackCopy() {
          var ta = document.createElement("textarea");
          ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      }
    });
  });

     /* ---------- dblp paper count (live, with static fallback) ---------- */
  var dblpEl = document.getElementById("dblpCount");
  if (dblpEl && window.fetch) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 6000);
    fetch("https://dblp.org/pid/442/3253.xml", ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error("dblp " + r.status); return r.text(); })
      .then(function (xml) {
        var doc = new DOMParser().parseFromString(xml, "application/xml");
        var root = doc.documentElement;
        var n = parseInt(root && root.getAttribute("n"), 10);
        if (!isNaN(n) && n >= 0) {
          dblpEl.textContent = n + " indexed " + (n === 1 ? "paper" : "papers");
        }
      })
      .catch(function () { /* keep the static text already in the page */ })
      .then(function () { clearTimeout(timer); });
  }
  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
