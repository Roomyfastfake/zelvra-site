// Zelvra static site interactions — vanilla JS, no framework, no build step.
// Safe to load on every page: each block no-ops if its elements are absent.
(function () {
  "use strict";

  /* ---------------------------------------------------------------------- *
   * Force HTTPS (belt-and-braces; primary fix is the host/CDN redirect)
   * ---------------------------------------------------------------------- */
  if (
    window.location.protocol === "http:" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    window.location.replace(
      "https://" + window.location.host + window.location.pathname +
      window.location.search + window.location.hash
    );
  }

  var EMAIL = "hello@zelvra.tech";

  /* ---------------------------------------------------------------------- *
   * Mobile navigation toggle (keyboard accessible)
   * ---------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (header && navToggle && nav) {
    var setNav = function (open) {
      header.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", function () {
      setNav(!header.classList.contains("nav-open"));
    });

    // Close the menu after tapping a link so the in-page scroll is visible.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    // Escape closes the menu and returns focus to the toggle.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------- *
   * Contact: copy email + status messaging
   * ---------------------------------------------------------------------- */
  var emailInput = document.getElementById("contact-email");
  var copyButton = document.getElementById("copy-email");
  var openEmail = document.getElementById("open-email");
  var status = document.getElementById("contact-status");
  var copyResetTimer;

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function selectEmailField() {
    if (!emailInput) return false;
    emailInput.focus();
    emailInput.select();
    if (typeof emailInput.setSelectionRange === "function") {
      emailInput.setSelectionRange(0, emailInput.value.length);
    }
    return true;
  }

  function flashCopied() {
    if (!copyButton) return;
    copyButton.textContent = "Copied";
    copyButton.classList.add("is-copied");
    setStatus("Copied " + EMAIL);
    window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(function () {
      copyButton.textContent = "Copy email";
      copyButton.classList.remove("is-copied");
    }, 1800);
  }

  function legacyCopy() {
    if (!selectEmailField()) return false;
    try {
      return document.execCommand("copy");
    } catch (error) {
      return false;
    }
  }

  function manualFallback() {
    selectEmailField();
    setStatus("Email selected. Press Ctrl+C to copy " + EMAIL + ".");
  }

  if (emailInput) {
    emailInput.addEventListener("click", function () {
      selectEmailField();
      setStatus("Email selected. Press Ctrl+C to copy " + EMAIL + ".");
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      // Modern, secure-context clipboard first; fall back to execCommand,
      // then to selecting the field so the user can copy manually.
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        navigator.clipboard.writeText(EMAIL).then(flashCopied, function () {
          if (legacyCopy()) flashCopied();
          else manualFallback();
        });
        return;
      }

      if (legacyCopy()) flashCopied();
      else manualFallback();
    });
  }

  if (openEmail) {
    openEmail.addEventListener("click", function () {
      setStatus("Opening your email app. If nothing opens, use Copy email.");
    });
  }
})();
