// Zelvra landing page interactions — vanilla JS, no framework, no build step.
(function () {
  "use strict";

  var EMAIL = "hello@zelvra.tech";

  /* ---------------------------------------------------------------------- *
   * Mobile navigation toggle
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
  }

  /* ---------------------------------------------------------------------- *
   * Interactive sample brief tabs
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
        "If margin pressure, softer demand, or cautious guidance is visible, make that the risk lens.",
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
        "If management hedges, softens demand language, or calls out cost pressure, mark it as the risk to watch.",
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
    setStatus("Copied " + EMAIL);
    window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(function () {
      copyButton.textContent = "Copy email";
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
          if (legacyCopy()) {
            flashCopied();
          } else {
            selectEmailField();
            setStatus("Email selected. Press Ctrl+C to copy " + EMAIL + ".");
          }
        });
        return;
      }

      if (legacyCopy()) {
        flashCopied();
      } else {
        selectEmailField();
        setStatus("Email selected. Press Ctrl+C to copy " + EMAIL + ".");
      }
    });
  }

  if (openEmail) {
    openEmail.addEventListener("click", function () {
      setStatus("Opening your email app. If nothing opens, use Copy email.");
    });
  }
})();
