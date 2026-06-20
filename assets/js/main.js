(function () {
  "use strict";

  /* ============ header on scroll ============ */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ============ copy prompt button ============ */
  var copyBtns = document.querySelectorAll(".copy-btn");
  var toast = document.getElementById("copyToast");
  var toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  copyBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-copy-target");
      var target = document.getElementById(targetId);
      if (!target) return;
      var text = target.textContent;

      function done(success) {
        if (success) {
          var label = btn.querySelector(".copy-btn-label");
          var prevText = label ? label.textContent : "";
          btn.classList.add("is-copied");
          if (label) label.textContent = "Copiado!";
          showToast("Prompt copiado! Cole no Gemini.");
          setTimeout(function () {
            btn.classList.remove("is-copied");
            if (label) label.textContent = prevText;
          }, 1800);
        } else {
          showToast("Não foi possível copiar. Selecione o texto manualmente.");
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { fallbackCopy(text, done); }
        );
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, cb) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      cb(ok);
    } catch (e) {
      cb(false);
    }
  }

  /* ============ scroll reveal ============ */
  var revealEls = document.querySelectorAll(
    ".step-card, .intro-grid, .result-card, .gallery-card, .faq-item, .viral-counter, .steps-heading"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============ video: pause when offscreen (perf) ============ */
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo && "IntersectionObserver" in window) {
    var videoIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            heroVideo.play().catch(function () {});
          } else {
            heroVideo.pause();
          }
        });
      },
      { threshold: 0.05 }
    );
    videoIO.observe(heroVideo);
  }
})();
