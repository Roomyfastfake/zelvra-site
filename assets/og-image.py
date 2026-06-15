"""Generate assets/og-image.png (1200x630) for Open Graph / Twitter cards.

Regenerate after a brand change with:

    py -3 assets/og-image.py

Pure Pillow, no build step or external services. Output is committed so the
deploy stays static.
"""

import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
OUT = os.path.join(os.path.dirname(__file__), "og-image.png")

# Brand palette (mirrors styles.css :root).
BG_TOP = (5, 7, 13)
BG_MID = (7, 9, 16)
ACCENT = (85, 184, 255)
ACCENT_SOFT = (139, 208, 255)
SUCCESS = (121, 224, 194)
TEXT = (246, 248, 251)
MUTED = (158, 170, 189)


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


def main():
    img = Image.new("RGB", (W, H), BG_TOP)
    draw = ImageDraw.Draw(img)

    # Vertical gradient background.
    for y in range(H):
        t = y / H
        color = lerp(BG_TOP, BG_MID, t) if t < 0.5 else lerp(BG_MID, BG_TOP, (t - 0.5) * 2)
        draw.line([(0, y), (W, y)], fill=color)

    # Faint grid, matching the site's market-grid texture.
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        gdraw.line([(x, 0), (x, H)], fill=(255, 255, 255, 8))
    for y in range(0, H, 60):
        gdraw.line([(0, y), (W, y)], fill=(255, 255, 255, 8))
    img = Image.alpha_composite(img.convert("RGBA"), grid)

    # Soft accent glow, top-right.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = 1050, 90
    for r in range(420, 0, -14):
        a = int(34 * (1 - r / 420))
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(ACCENT[0], ACCENT[1], ACCENT[2], a))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    M = 90  # content margin

    # --- Logo mark: rounded square + rising curve + diagonal (mirrors favicon) ---
    box = 78
    bx, by = M, 70
    draw.rounded_rectangle([bx, by, bx + box, by + box], radius=16, fill=(11, 20, 33),
                           outline=ACCENT_SOFT, width=2)
    s = box / 64.0
    curve = [(14, 40), (23, 37), (25, 25), (34, 23), (42, 21), (44, 15), (51, 14)]
    draw.line([(bx + px * s, by + py * s) for px, py in curve], fill=ACCENT, width=4, joint="curve")
    draw.line([(bx + 14 * s, by + 50 * s), (bx + 51 * s, by + 14 * s)], fill=SUCCESS, width=3)

    # Wordmark
    word_font = bold(56)
    draw.text((bx + box + 24, by + 6), "Zelvra", font=word_font, fill=TEXT)

    # --- Eyebrow (letter-spaced uppercase) ---
    eyebrow_font = semi(24)
    ex, ey = M, 248
    for ch in "PRE-LAUNCH RESEARCH BRIEF SERVICE":
        draw.text((ex, ey), ch, font=eyebrow_font, fill=ACCENT_SOFT)
        ex += draw.textlength(ch, font=eyebrow_font) + 3

    # --- Headline (word-wrapped, big and bold) ---
    headline = "Financial filings turned into sharp, publish-ready research briefs."
    head_font = bold(72)
    max_w = W - 2 * M
    words = headline.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=head_font) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)

    y = 300
    for line in lines:
        draw.text((M, y), line, font=head_font, fill=TEXT)
        y += 84

    # --- Footer row: url + small descriptor, divider line above ---
    draw.line([(M, H - 86), (W - M, H - 86)], fill=(207, 225, 255, 40), width=1)
    url_font = semi(30)
    draw.text((M, H - 64), "zelvra.tech", font=url_font, fill=TEXT)
    desc_font = reg(26)
    desc = "Filings, earnings & transcripts into research briefs"
    dw = draw.textlength(desc, font=desc_font)
    draw.text((W - M - dw, H - 62), desc, font=desc_font, fill=MUTED)

    img.convert("RGB").save(OUT, "PNG")
    print("wrote", OUT, img.size)


if __name__ == "__main__":
    main()
