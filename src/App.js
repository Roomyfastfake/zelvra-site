import React, { useEffect, useState } from "react";

const h = React.createElement;
const email = "hello@zelvra.tech";
const sampleSubject = "Zelvra sample brief request";
const sampleBody = `Hi Zelvra,

I'd like to request a sample brief.

Company or ticker:
Source material or link:
Intended use:

Thanks,`;
const contactHref = "#contact";
const sampleMailHref = `mailto:${email}?subject=${encodeURIComponent(sampleSubject)}&body=${encodeURIComponent(sampleBody)}`;

const navLinks = [
  ["What we do", "#what-we-do"],
  ["Process", "#process"],
  ["Sample", "#sample"],
  ["Contact", "#contact"],
];

const sourcePills = ["10-K", "Q4 call", "Transcript"];
const chartBars = [36, 62, 48, 76, 54, 70];

const features = [
  {
    title: "Filing summaries",
    body: "Condensed reads of 10-Ks, 10-Qs, investor decks, and annual reports with the numbers that shape the story.",
  },
  {
    title: "Call takeaways",
    body: "Management commentary, guidance language, segment updates, and repeated themes separated from the noise.",
  },
  {
    title: "Content angles",
    body: "Hooks, narrative framing, source notes, and risk flags that can become a newsletter, post, memo, or script.",
  },
];

const steps = [
  {
    title: "Send the company/report",
    body: "Share a ticker, filing, earnings report, transcript, deck, or source link you want turned into a brief.",
  },
  {
    title: "Zelvra extracts the numbers and narrative",
    body: "The brief pulls out source-backed figures, management language, business drivers, and the main tension.",
  },
  {
    title: "Receive a concise brief ready to turn into content",
    body: "Use the output as a starting point for newsletters, posts, scripts, memos, or internal research notes.",
  },
];

const samples = {
  earnings: {
    label: "Earnings call",
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
    upside: "If growth durability, pricing power, or segment mix is visible in the source, frame it as the constructive read.",
    risk: "If margin pressure, softer demand, or cautious guidance is visible, make that the risk lens.",
    angle:
      "Turn the quarter into a creator-ready post: what changed, why it matters, and what to watch next.",
  },
  filing: {
    label: "10-K filing",
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
    upside: "If revenue mix, cost discipline, or liquidity improves, explain the source-backed constructive read.",
    risk: "If concentration, obligations, or risk language increases, flag it without overstating the conclusion.",
    angle:
      "Build a newsletter section around what changed in the filing, not what the company repeated from last year.",
  },
  transcript: {
    label: "Transcript",
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
    upside: "If demand, pricing, or spending discipline sounds stronger, capture the precise language that supports it.",
    risk: "If management hedges, softens demand language, or calls out cost pressure, mark it as the risk to watch.",
    angle:
      "Compare what management emphasized with what the numbers showed, then turn the gap into a clean content hook.",
  },
};

const offerItems = [
  "A concise brief built from the filing, report, transcript, or deck you send.",
  "A hook, key numbers, narrative takeaways, risk flags, and content angles.",
  "Source-aware language you can adapt into a post, newsletter, memo, or script.",
  "A clear label that the output is research content, not financial advice.",
];

function Brand({ footer = false }) {
  return h(
    "a",
    { className: footer ? "brand footer-brand" : "brand", href: "#top", "aria-label": "Zelvra home" },
    h("img", { className: "brand-mark", src: "./assets/zelvra-mark.svg", alt: "", "aria-hidden": "true" }),
    h("span", null, "Zelvra"),
  );
}

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return h(
    "header",
    { className: `site-header ${navOpen ? "nav-open" : ""}` },
    h(Brand),
    h(
      "button",
      {
        className: "nav-toggle",
        type: "button",
        "aria-expanded": navOpen,
        "aria-controls": "site-nav",
        onClick: () => setNavOpen((current) => !current),
      },
      h("span", { className: "sr-only" }, "Toggle navigation"),
      h("span", null),
      h("span", null),
    ),
    h(
      "nav",
      { className: "site-nav", id: "site-nav", "aria-label": "Primary navigation" },
      navLinks.map(([label, href]) => h("a", { href, key: href, onClick: closeNav }, label)),
    ),
    h("a", { className: "header-cta", href: contactHref }, "Request a sample brief"),
  );
}

function HeroVisual() {
  return h(
    "div",
    { className: "hero-visual", "aria-label": "Research brief preview" },
    h("div", { className: "market-grid", "aria-hidden": "true" }),
    h(
      "article",
      { className: "brief-panel" },
      h("div", { className: "panel-topline" }, h("span", null, "Brief queue"), h("span", null, "Source-backed")),
      h(
        "div",
        { className: "ticker-row" },
        sourcePills.map((pill) => h("span", { className: "ticker-pill", key: pill }, pill)),
      ),
      h(
        "div",
        { className: "signal-chart", "aria-hidden": "true" },
        chartBars.map((height, index) => h("span", { key: `${height}-${index}`, style: { height: `${height}%` } })),
      ),
      h("div", { className: "brief-lines" }, h("span", null), h("span", null), h("span", null)),
      h("div", { className: "source-strip" }, h("span", null, "Revenue"), h("span", null, "Margins"), h("span", null, "Guidance")),
    ),
  );
}

function Hero() {
  return h(
    "section",
    { className: "hero section-shell", "aria-labelledby": "hero-title" },
    h(
      "div",
      { className: "hero-copy" },
      h("p", { className: "eyebrow" }, "Pre-launch research brief service"),
      h("h1", { id: "hero-title" }, "Financial filings turned into sharp, publish-ready research briefs."),
      h(
        "p",
        { className: "hero-subhead" },
        "Zelvra helps finance creators and operators turn earnings reports, 10-Ks, and transcripts into clear content fuel without drowning in filings.",
      ),
      h(
        "div",
        { className: "hero-actions", "aria-label": "Primary actions" },
        h("a", { className: "button button-primary", href: contactHref }, "Request a sample brief"),
        h("a", { className: "button button-secondary", href: "#process" }, "See how it works"),
      ),
      h("p", { className: "credibility-note" }, "Built for speed, clarity, and source-backed research."),
    ),
    h(HeroVisual),
  );
}

function Problem() {
  return h(
    "section",
    { className: "problem section-shell", id: "what-we-do", "aria-labelledby": "problem-title" },
    h("div", { className: "section-kicker" }, "The problem"),
    h(
      "div",
      { className: "split" },
      h("h2", { id: "problem-title" }, "The signal is buried in long filings and noisy calls."),
      h(
        "div",
        { className: "body-stack" },
        h(
          "p",
          null,
          "Financial filings are dense, earnings calls move quickly, and the useful story is rarely sitting in one paragraph. Creators and operators need the key numbers, narrative shifts, and risks fast enough to turn them into clean output.",
        ),
        h(
          "p",
          null,
          "Zelvra is built around the practical middle ground: source-backed research that is concise enough to use and careful enough to trust.",
        ),
      ),
    ),
  );
}

function Solution() {
  return h(
    "section",
    { className: "solution section-shell", "aria-labelledby": "solution-title" },
    h(
      "div",
      { className: "section-heading" },
      h("p", { className: "section-kicker" }, "What Zelvra delivers"),
      h("h2", { id: "solution-title" }, "Briefs that turn source material into usable finance content."),
    ),
    h(
      "div",
      { className: "card-grid" },
      features.map((feature, index) =>
        h(
          "article",
          { className: "feature-card", key: feature.title },
          h("span", { className: "card-index" }, String(index + 1).padStart(2, "0")),
          h("h3", null, feature.title),
          h("p", null, feature.body),
        ),
      ),
    ),
  );
}

function Process() {
  return h(
    "section",
    { className: "process section-shell", id: "process", "aria-labelledby": "process-title" },
    h(
      "div",
      { className: "section-heading" },
      h("p", { className: "section-kicker" }, "Process"),
      h("h2", { id: "process-title" }, "A simple path from source material to usable brief."),
    ),
    h(
      "div",
      { className: "steps", "aria-label": "Zelvra process" },
      steps.map((step, index) =>
        h(
          "article",
          { className: "step", key: step.title },
          h("span", null, index + 1),
          h("h3", null, step.title),
          h("p", null, step.body),
        ),
      ),
    ),
  );
}

function Sample() {
  const [activeSample, setActiveSample] = useState("earnings");
  const sample = samples[activeSample];

  return h(
    "section",
    { className: "sample section-shell", id: "sample", "aria-labelledby": "sample-title" },
    h(
      "div",
      { className: "sample-copy" },
      h("p", { className: "section-kicker" }, "Sample preview"),
      h("h2", { id: "sample-title" }, "A source-backed brief structure without invented company claims."),
      h(
        "p",
        null,
        "This preview shows how a Zelvra brief is organized. It is illustrative only, not a recommendation, rating, or current company analysis.",
      ),
      h(
        "div",
        { className: "sample-tabs", role: "tablist", "aria-label": "Sample brief source type" },
        Object.entries(samples).map(([id, item]) =>
          h(
            "button",
            {
              className: activeSample === id ? "sample-tab active" : "sample-tab",
              key: id,
              type: "button",
              role: "tab",
              "aria-selected": activeSample === id,
              onClick: () => setActiveSample(id),
            },
            item.label,
          ),
        ),
      ),
    ),
    h(
      "article",
      { className: "sample-card", "aria-label": "Sample brief structure" },
      h(
        "div",
        { className: "sample-card-header" },
        h(
          "div",
          null,
          h("p", { className: "sample-label" }, "Sample structure"),
          h("h3", null, "Public Company Brief Framework"),
        ),
        h("span", null, "Illustrative only"),
      ),
      h(
        "div",
        { className: "sample-meta" },
        h("div", null, h("span", null, "Source packet"), h("strong", null, sample.source)),
        h("div", null, h("span", null, "Brief focus"), h("strong", null, sample.focus)),
      ),
      h(
        "p",
        { className: "sample-disclaimer" },
        "A real sample brief would insert the source-checked values, quotes, and filing references from the material you provide.",
      ),
      h("div", { className: "sample-section" }, h("h4", null, "Hook"), h("p", null, sample.hook)),
      h(
        "div",
        { className: "sample-section" },
        h("h4", null, "5 key numbers"),
        h(
          "ul",
          { className: "metric-list" },
          sample.metrics.map(([label, value]) => h("li", { key: label }, h("span", null, label), h("strong", null, value))),
        ),
      ),
      h(
        "div",
        { className: "case-grid" },
        h("div", { className: "sample-section" }, h("h4", null, "Upside lens"), h("p", null, sample.upside)),
        h("div", { className: "sample-section" }, h("h4", null, "Risk lens"), h("p", null, sample.risk)),
      ),
      h("div", { className: "sample-section content-angle" }, h("h4", null, "Content angle"), h("p", null, sample.angle)),
    ),
  );
}

function Offer() {
  const [copied, setCopied] = useState(false);
  const [contactStatus, setContactStatus] = useState("Open your email app, or copy the address directly.");

  function selectEmailField(statusMessage) {
    const input = document.getElementById("contact-email");

    if (!input) return false;

    input.focus();
    input.select();

    if (typeof input.setSelectionRange === "function") {
      input.setSelectionRange(0, input.value.length);
    }

    if (statusMessage) {
      setContactStatus(statusMessage);
    }

    return true;
  }

  function copyEmailWithSelectionFallback() {
    const selected = selectEmailField();
    let didCopy = false;

    if (!selected) return false;

    try {
      didCopy = document.execCommand("copy");
    } catch (error) {
      didCopy = false;
    }

    return didCopy;
  }

  async function copyEmail() {
    let didCopy = copyEmailWithSelectionFallback();

    if (!didCopy) {
      try {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          didCopy = true;
        }
      } catch (error) {
        didCopy = false;
      }
    }

    if (didCopy) {
      setCopied(true);
      setContactStatus(`Copied ${email}`);
      window.setTimeout(() => setCopied(false), 1800);
      return;
    }

    selectEmailField(`Email selected. Press Ctrl+C to copy ${email}.`);
  }

  function handleEmailClick() {
    setContactStatus("Opening your email app. If nothing opens, use Copy email.");
  }

  return h(
    "section",
    { className: "offer section-shell", id: "contact", "aria-labelledby": "offer-title" },
    h(
      "div",
      { className: "offer-panel" },
      h("p", { className: "section-kicker" }, "Pre-launch"),
      h("h2", { id: "offer-title" }, "Request one sample brief from a filing, report, or transcript."),
      h(
        "p",
        null,
        "Send the source material and tell Zelvra how you plan to use the output. The sample will show the structure, tone, and level of source-backed detail before broader availability opens.",
      ),
      h(
        "ul",
        { className: "offer-list", "aria-label": "What a sample brief includes" },
        offerItems.map((item) => h("li", { key: item }, item)),
      ),
      h(
        "div",
        { className: "offer-actions" },
        h("a", { className: "button button-primary", href: sampleMailHref, onClick: handleEmailClick }, "Open email app"),
        h(
          "div",
          { className: "email-row" },
          h("input", {
            "aria-label": "Contact email address",
            className: "email-input",
            id: "contact-email",
            onClick: () => selectEmailField(`Email selected. Press Ctrl+C to copy ${email}.`),
            readOnly: true,
            value: email,
          }),
          h("button", { className: "copy-button", type: "button", onClick: copyEmail }, copied ? "Copied" : "Copy email"),
        ),
      ),
      h("p", { className: "contact-status", role: "status", "aria-live": "polite" }, contactStatus),
    ),
  );
}

function Footer() {
  return h(
    "footer",
    { className: "site-footer" },
    h("div", null, h(Brand, { footer: true }), h("p", null, "Turning financial filings into sharp research briefs.")),
    h(
      "div",
      { className: "footer-meta" },
      h("a", { href: contactHref }, email),
      h("p", null, "Research content only. Not financial advice."),
    ),
  );
}

export default function App() {
  useEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.slice(1);

      if (!id) return;

      window.requestAnimationFrame(() => {
        if (id === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return h(
    React.Fragment,
    null,
    h(Header),
    h("main", { id: "top" }, h(Hero), h(Problem), h(Solution), h(Process), h(Sample), h(Offer)),
    h(Footer),
  );
}
