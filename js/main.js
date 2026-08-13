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
    // close menu when a link is tapped
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

    var original = btn.textContent;
    var copyMode = false;

    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";

      if (!isOpen) {
        pre.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        btn.textContent = "Copy BibTeX";
        copyMode = true;
      } else if (copyMode) {
        // second click → copy to clipboard
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

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
