// Zelvra static site interactions — vanilla JS, no framework, no build step.
// Safe to load on every page: each block no-ops if its elements are absent.
(function () {
  "use strict";

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
   * Interactive sample brief tabs (home page only)
   * ---------------------------------------------------------------------- */
  var samples = {
    earnings: {
      source: "Q4 earnings release + call transcript",
      focus: "Quarterly narrative, guidance language, and source-backed content angles.",
      hook:
        "Lead with the gap between reported momentum and management's forward-looking tone, then show which numbers support that tension.",
      metrics: [
        ["Reported revenue", "Total, YoY change, and the driver management emphasized."],
        ["Segment performance", "Which segment carried the quarter and which one dragged."],
        ["Margin direction", "Gross or operating margin trend plus the stated explanation."],
        ["Free cash flow", "Cash conversion and any timing items called out in the release."],
        ["Guidance language", "Range, revision, and tone compared with prior commentary."],
      ],
      upside:
        "If growth durability, pricing power, or segment mix is visible in the source, frame it as the constructive read.",
      risk:
        "If margin pressure, softer demand, or cautious guidance is visible, make that the cautionary read.",
      angle:
        "Turn the quarter into a creator-ready post: what changed, why it matters, and what to watch next.",
    },
    filing: {
      source: "Annual report or 10-K",
      focus: "Business model, risk language, segment quality, and annual financial context.",
      hook:
        "Use the annual report to separate durable business quality from one-year noise without turning the brief into a filing dump.",
      metrics: [
        ["Revenue mix", "Segment contribution and any material mix shift."],
        ["Margin profile", "Gross and operating margin direction with likely drivers."],
        ["Operating income", "Core profitability trend before narrative commentary."],
        ["Balance sheet", "Cash, debt, and liquidity context from the filing."],
        ["Risk language", "New, expanded, or more prominent risk-factor wording."],
      ],
      upside:
        "If revenue mix, cost discipline, or liquidity improves, explain the source-backed constructive read.",
      risk:
        "If concentration, obligations, or risk language increases, flag it without overstating the conclusion.",
      angle:
        "Build a newsletter section around what changed in the filing, not what the company repeated from last year.",
    },
    transcript: {
      source: "Earnings call transcript",
      focus: "Management tone, repeated phrases, Q&A pressure points, and narrative shifts.",
      hook:
        "Management language often shows where the story is tightening before it appears cleanly in headline numbers.",
      metrics: [
        ["Guidance range", "What changed, what stayed flat, and how confidently it was framed."],
        ["Demand commentary", "Backlog, pipeline, usage, bookings, or customer tone."],
        ["Pricing commentary", "Signals around revenue quality and competitive pressure."],
        ["Expense commentary", "Cost discipline, hiring, investment, or margin pressure."],
        ["Capital allocation", "Buybacks, debt, reinvestment, or balance-sheet priorities."],
      ],
      upside:
        "If demand, pricing, or spending discipline sounds stronger, capture the precise language that supports it.",
      risk:
        "If management hedges, softens demand language, or calls out cost pressure, mark it as the read to watch.",
      angle:
        "Compare what management emphasized with what the numbers showed, then turn the gap into a clean content hook.",
    },
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".sample-tab"));
  var fields = {};
  document.querySelectorAll("[data-sample-field]").forEach(function (el) {
    fields[el.getAttribute("data-sample-field")] = el;
  });

  function renderSample(key) {
    var data = samples[key];
    if (!data) return;

    if (fields.source) fields.source.textContent = data.source;
    if (fields.focus) fields.focus.textContent = data.focus;
    if (fields.hook) fields.hook.textContent = data.hook;
    if (fields.upside) fields.upside.textContent = data.upside;
    if (fields.risk) fields.risk.textContent = data.risk;
    if (fields.angle) fields.angle.textContent = data.angle;

    if (fields.metrics) {
      fields.metrics.innerHTML = "";
      data.metrics.forEach(function (pair) {
        var li = document.createElement("li");
        var label = document.createElement("span");
        label.textContent = pair[0];
        var value = document.createElement("strong");
        value.textContent = pair[1];
        li.appendChild(label);
        li.appendChild(value);
        fields.metrics.appendChild(li);
      });
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (other) {
        var isActive = other === tab;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-selected", String(isActive));
      });
      renderSample(tab.getAttribute("data-sample"));
    });
  });

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
   * Brief page: scroll progress indicator (sample-nvidia-q1-fy2027.html)
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

      var currentSectionId = function () {
        var doc = document.documentElement;
        // At the very bottom of the page force the last section active so a
        // short trailing section can never be skipped.
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

      // Initial state: honour an incoming URL hash, otherwise compute.
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
