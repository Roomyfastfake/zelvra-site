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

  /* ---------------------------------------------------------------------- *
   * Brief page: scroll progress indicator (sample brief pages)
   * ---------------------------------------------------------------------- */
  var progressBar = document.getElementById("read-progress-bar");

  if (progressBar) {
    var updateProgress = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      if (ratio < 0) ratio = 0;
      if (ratio > 1) ratio = 1;
      progressBar.style.width = (ratio * 100).toFixed(2) + "%";
    };

    var progressTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (progressTicking) return;
        progressTicking = true;
        window.requestAnimationFrame(function () {
          updateProgress();
          progressTicking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------------------------------------------------------------------- *
   * Brief page: highlight the active table-of-contents link (scrollspy)
   *
   * Click and hash navigation are authoritative: a valid URL hash stays active
   * until a real user scroll gesture hands control back to the position spy.
   * This avoids directional smooth-scroll races caused by scroll-padding and
   * scroll-margin placing the final anchor below the spy line.
   * ---------------------------------------------------------------------- */
  var tocNav = document.getElementById("brief-toc-nav");

  if (tocNav) {
    var tocLinks = Array.prototype.slice.call(tocNav.querySelectorAll("a"));
    var linkById = {};
    var sections = [];

    tocLinks.forEach(function (link) {
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      var section = id ? document.getElementById(id) : null;
      if (section) {
        linkById[id] = link;
        sections.push(section);
      }
    });

    if (sections.length) {
      var briefHeader = document.querySelector(".site-header");
      // Offset line sitting just below the sticky header.
      var tocOffset = function () {
        var rootStyles = window.getComputedStyle(document.documentElement);
        var sectionStyles = window.getComputedStyle(sections[0]);
        var scrollPadding = parseFloat(rootStyles.scrollPaddingTop) || 0;
        var scrollMargin = parseFloat(sectionStyles.scrollMarginTop) || 0;

        return scrollPadding + scrollMargin || (briefHeader ? briefHeader.offsetHeight : 76) + 48;
      };

      var activeId = null;
      var setActive = function (id) {
        if (!id || id === activeId) return;
        activeId = id;
        tocLinks.forEach(function (link) {
          link.classList.toggle("is-active", link === linkById[id]);
        });
      };

      // Position spy: the active section is the LAST one whose top has passed
      // the offset line — i.e. the section currently being read. Taking the
      // last (not the first) qualifying section stops an earlier long section
      // from winning. The bottom of the page forces the final section active.
      var currentSectionId = function () {
        var doc = document.documentElement;
        if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
          return sections[sections.length - 1].id;
        }
        var offset = tocOffset();
        var current = sections[0].id;
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].getBoundingClientRect().top <= offset) {
            current = sections[i].id;
          } else {
            break;
          }
        }
        return current;
      };

      // hashTargetId: while set, the URL hash is the source of truth. A real
      // scroll gesture clears it and hands control back to the position spy.
      var hashTargetId = null;
      var setHashTarget = function (id) {
        if (!linkById[id]) return;
        hashTargetId = id;
        setActive(id);
      };
      var releaseHashTarget = function () {
        if (hashTargetId === null) return;
        hashTargetId = null;
      };

      var runSpy = function () {
        if (hashTargetId !== null) {
          setActive(hashTargetId);
          return;
        }
        setActive(currentSectionId());
      };

      // Clicking a TOC link locks to that target immediately (native hash +
      // smooth scroll still run; the lock keeps the right item lit meanwhile).
      tocLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          setHashTarget((link.getAttribute("href") || "").replace(/^#/, ""));
        });
      });

      // Hash navigation (including TOC clicks) is the source of truth.
      window.addEventListener("hashchange", function () {
        var id = (window.location.hash || "").replace(/^#/, "");
        if (linkById[id]) setHashTarget(id);
        else {
          hashTargetId = null;
          runSpy();
        }
      });

      // A genuine user scroll gesture hands control straight back to the spy.
      window.addEventListener("wheel", releaseHashTarget, { passive: true });
      window.addEventListener("touchmove", releaseHashTarget, { passive: true });
      window.addEventListener("keydown", function (event) {
        switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
          case "PageUp":
          case "PageDown":
          case "Home":
          case "End":
          case " ":
          case "Spacebar":
            releaseHashTarget();
            break;
        }
      });

      var spyTicking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (spyTicking) return;
          spyTicking = true;
          window.requestAnimationFrame(function () {
            runSpy();
            spyTicking = false;
          });
        },
        { passive: true }
      );
      window.addEventListener("resize", runSpy, { passive: true });

      // Initial state: a URL hash wins and locks so the browser's jump to the
      // anchor cannot revert it; otherwise compute from scroll position.
      var initialId = (window.location.hash || "").replace(/^#/, "");
      if (initialId && linkById[initialId]) {
        setHashTarget(initialId);
        // Re-assert after full load in case the browser is still settling.
        window.addEventListener("load", function () {
          if (hashTargetId === initialId) setActive(initialId);
        });
      } else {
        setActive(currentSectionId());
      }
    }
  }

  /* ---------------------------------------------------------------------- *
   * Brief page: copy the publish-ready X / Twitter thread
   * ---------------------------------------------------------------------- */
  var copyThreadButton = document.getElementById("copy-thread");

  if (copyThreadButton) {
    var threadStatus = document.getElementById("copy-thread-status");
    var threadResetTimer;

    var getThreadText = function () {
      var targetId = copyThreadButton.getAttribute("data-copy-target");
      var container = targetId ? document.getElementById(targetId) : null;
      if (!container) return "";
      var posts = Array.prototype.slice.call(container.querySelectorAll(".tweet p"));
      return posts
        .map(function (p) {
          // Normalise each line so HTML source indentation never leaks into
          // the copied text, while preserving intentional line breaks.
          return (p.textContent || "")
            .split("\n")
            .map(function (line) {
              return line.trim();
            })
            .filter(Boolean)
            .join("\n");
        })
        .filter(Boolean)
        .join("\n\n");
    };

    var flashThreadCopied = function () {
      copyThreadButton.textContent = "Copied";
      copyThreadButton.classList.add("is-copied");
      if (threadStatus) threadStatus.textContent = "Thread copied to your clipboard.";
      window.clearTimeout(threadResetTimer);
      threadResetTimer = window.setTimeout(function () {
        copyThreadButton.textContent = "Copy X thread";
        copyThreadButton.classList.remove("is-copied");
      }, 1800);
    };

    var legacyCopyThread = function (text) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (error) {
        ok = false;
      }
      document.body.removeChild(area);
      return ok;
    };

    copyThreadButton.addEventListener("click", function () {
      var text = getThreadText();
      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(flashThreadCopied, function () {
          if (legacyCopyThread(text)) flashThreadCopied();
          else if (threadStatus) threadStatus.textContent = "Copy failed — select the thread text manually.";
        });
        return;
      }

      if (legacyCopyThread(text)) flashThreadCopied();
      else if (threadStatus) threadStatus.textContent = "Copy failed — select the thread text manually.";
    });
  }
})();
