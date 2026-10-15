"""Generate per-brief Open Graph cards (1200x630) for the sample brief pages.

Same look as og-image.py, but each card carries the brief's ticker, headline and
three headline numbers, so a shared link previews the actual brief. Only use
numbers that already appear on the brief page itself.

    py -3 assets/og-briefs.py
"""

import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
HERE = os.path.dirname(__file__)

BG_TOP = (5, 7, 13)
BG_MID = (7, 9, 16)
ACCENT = (85, 184, 255)
ACCENT_SOFT = (139, 208, 255)
SUCCESS = (121, 224, 194)
TEXT = (246, 248, 251)
MUTED = (158, 170, 189)
CHIP_BG = (12, 20, 33)
CHIP_LINE = (40, 62, 92)

BRIEFS = [
    {
        "out": "og-asml-q3-2026.png",
        "eyebrow": "SAMPLE BRIEF  ·  ASML  ·  Q3 2026",
        "headline": "Planned 2027-28 supply won't meet demand.",
        "chips": [
            ("€11.66B", "sales, +55% YoY"),
            ("57.5%", "gross margin, above guide"),
            ("€11.8B", "operating cash flow"),
        ],
    },
    {
        "out": "og-nflx-q2-2026.png",
        "eyebrow": "SAMPLE BRIEF  ·  NETFLIX  ·  Q2 2026",
        "headline": "Growth slowed, and the Q3 margin jump is mostly a one-off.",
        "chips": [
            ("$12.56B", "revenue, +13.4% YoY"),
            ("$0.80", "diluted EPS, beat"),
            ("31.5%", "FY26 operating margin guide"),
        ],
    },
]


def load_font(candidates, size):
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


FONTS = "C:/Windows/Fonts/"
bold = lambda s: load_font([FONTS + "segoeuib.ttf", FONTS + "arialbd.ttf"], s)
semi = lambda s: load_font([FONTS + "seguisb.ttf", FONTS + "segoeuib.ttf", FONTS + "arialbd.ttf"], s)
reg = lambda s: load_font([FONTS + "segoeui.ttf", FONTS + "arial.ttf"], s)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def background():
    img = Image.new("RGB", (W, H), BG_TOP)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        color = lerp(BG_TOP, BG_MID, t) if t < 0.5 else lerp(BG_MID, BG_TOP, (t - 0.5) * 2)
        draw.line([(0, y), (W, y)], fill=color)
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        gdraw.line([(x, 0), (x, H)], fill=(255, 255, 255, 8))
    for y in range(0, H, 60):
        gdraw.line([(0, y), (W, y)], fill=(255, 255, 255, 8))
    img = Image.alpha_composite(img.convert("RGBA"), grid)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = 1050, 90
    for r in range(420, 0, -14):
        a = int(34 * (1 - r / 420))
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(ACCENT[0], ACCENT[1], ACCENT[2], a))
    return Image.alpha_composite(img, glow)


def wrap(draw, text, font, max_w):
    lines, cur = [], ""
    for w in text.split():
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def render(brief):
    img = background()
    draw = ImageDraw.Draw(img)
    M = 80

    # Logo mark + wordmark (smaller than the homepage card).
    box = 56
    bx, by = M, 54
    draw.rounded_rectangle([bx, by, bx + box, by + box], radius=12, fill=(11, 20, 33),
                           outline=ACCENT_SOFT, width=2)
    s = box / 64.0
    curve = [(14, 40), (23, 37), (25, 25), (34, 23), (42, 21), (44, 15), (51, 14)]
    draw.line([(bx + px * s, by + py * s) for px, py in curve], fill=ACCENT, width=3, joint="curve")
    draw.line([(bx + 14 * s, by + 50 * s), (bx + 51 * s, by + 14 * s)], fill=SUCCESS, width=2)
    draw.text((bx + box + 18, by + 4), "Zelvra", font=bold(40), fill=TEXT)

    # Eyebrow.
    ef = semi(24)
    ex, ey = M, 152
    for ch in brief["eyebrow"]:
        draw.text((ex, ey), ch, font=ef, fill=ACCENT_SOFT)
        ex += draw.textlength(ch, font=ef) + 2

    # Headline: shrink until it fits in two lines.
    size = 66
    while True:
        hf = bold(size)
        lines = wrap(draw, brief["headline"], hf, W - 2 * M)
        if len(lines) <= 2 or size <= 44:
            break
        size -= 4
    y = 196
    for line in lines:
        draw.text((M, y), line, font=hf, fill=TEXT)
        y += int(size * 1.18)

    # Three KPI chips.
    gap = 20
    cw = (W - 2 * M - 2 * gap) // 3
    ch = 120
    cy0 = 392
    for i, (value, label) in enumerate(brief["chips"]):
        x0 = M + i * (cw + gap)
        draw.rounded_rectangle([x0, cy0, x0 + cw, cy0 + ch], radius=14, fill=CHIP_BG,
                               outline=CHIP_LINE, width=2)
        draw.text((x0 + 22, cy0 + 16), value, font=bold(44), fill=TEXT)
        draw.text((x0 + 22, cy0 + 74), label, font=reg(22), fill=MUTED)

    # Footer.
    draw.line([(M, H - 80), (W - M, H - 80)], fill=(207, 225, 255, 40), width=1)
    draw.text((M, H - 60), "zelvra.tech", font=semi(28), fill=TEXT)
    desc = "Every figure tied to the filing line it came from"
    df = reg(24)
    draw.text((W - M - draw.textlength(desc, font=df), H - 57), desc, font=df, fill=MUTED)

    out = os.path.join(HERE, brief["out"])
    img.convert("RGB").save(out, "PNG", optimize=True)
    print("wrote", out)


if __name__ == "__main__":
    for b in BRIEFS:
        render(b)
