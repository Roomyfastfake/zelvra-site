#!/usr/bin/env python3
"""Generate assets/og-image.png (1200x630) with stdlib only — no deps, no build step.

On-brand social card: dark background, blue/teal glow, faint grid, a rising
accent line, the ZELVRA wordmark, and a tagline. Rerun to regenerate.
"""
import os
import struct
import zlib

W, H = 1200, 630

# Brand palette (from styles.css :root)
BG = (5, 7, 13)
ACCENT = (85, 184, 255)
ACCENT_STRONG = (139, 208, 255)
SUCCESS = (121, 224, 194)
TEXT = (246, 248, 251)
MUTED = (158, 170, 189)

buf = bytearray(W * H * 3)


def idx(x, y):
    return (y * W + x) * 3


def clamp(v):
    return 0 if v < 0 else 255 if v > 255 else int(v)


def set_px(x, y, rgb):
    if 0 <= x < W and 0 <= y < H:
        i = idx(x, y)
        buf[i], buf[i + 1], buf[i + 2] = clamp(rgb[0]), clamp(rgb[1]), clamp(rgb[2])


def get_px(x, y):
    i = idx(x, y)
    return buf[i], buf[i + 1], buf[i + 2]


def add_px(x, y, rgb, a):
    if 0 <= x < W and 0 <= y < H:
        i = idx(x, y)
        buf[i] = clamp(buf[i] + rgb[0] * a)
        buf[i + 1] = clamp(buf[i + 1] + rgb[1] * a)
        buf[i + 2] = clamp(buf[i + 2] + rgb[2] * a)


def blend_px(x, y, rgb, a):
    if 0 <= x < W and 0 <= y < H:
        i = idx(x, y)
        buf[i] = clamp(buf[i] * (1 - a) + rgb[0] * a)
        buf[i + 1] = clamp(buf[i + 1] * (1 - a) + rgb[1] * a)
        buf[i + 2] = clamp(buf[i + 2] * (1 - a) + rgb[2] * a)


# --- Background: vertical gradient ---
for y in range(H):
    t = y / (H - 1)
    # 05070d -> 070910 -> 05070d (subtle)
    r = 5 + 2 * (1 - abs(t - 0.45) / 0.55)
    g = 7 + 2 * (1 - abs(t - 0.45) / 0.55)
    b = 13 + 3 * (1 - abs(t - 0.45) / 0.55)
    row = (clamp(r), clamp(g), clamp(b))
    for x in range(W):
        i = idx(x, y)
        buf[i], buf[i + 1], buf[i + 2] = row

# --- Radial glows (additive) ---
glows = [
    (980, 130, 460, ACCENT, 0.22),   # top-right blue
    (170, 560, 380, SUCCESS, 0.10),  # bottom-left teal
]
for (cx, cy, rad, col, strength) in glows:
    for y in range(max(0, cy - rad), min(H, cy + rad)):
        for x in range(max(0, cx - rad), min(W, cx + rad)):
            dx, dy = x - cx, y - cy
            d2 = dx * dx + dy * dy
            if d2 < rad * rad:
                f = (1 - (d2 ** 0.5) / rad)
                add_px(x, y, col, strength * f * f)

# --- Faint grid ---
for x in range(0, W, 48):
    for y in range(H):
        add_px(x, y, (255, 255, 255), 0.012)
for y in range(0, H, 48):
    for x in range(W):
        add_px(x, y, (255, 255, 255), 0.010)


def draw_line(x0, y0, x1, y1, col, width, alpha):
    steps = int(max(abs(x1 - x0), abs(y1 - y0))) * 2 + 1
    for s in range(steps + 1):
        t = s / steps
        x = x0 + (x1 - x0) * t
        y = y0 + (y1 - y0) * t
        for ox in range(-width, width + 1):
            for oy in range(-width, width + 1):
                if ox * ox + oy * oy <= width * width:
                    blend_px(int(x) + ox, int(y) + oy, col, alpha)


# --- Rising accent line (research/up-and-to-the-right) ---
pts = [(90, 545), (300, 500), (470, 520), (640, 445), (820, 470), (1110, 360)]
for j in range(len(pts) - 1):
    (ax, ay), (bx, by) = pts[j], pts[j + 1]
    draw_line(ax, ay, bx, by, ACCENT_STRONG, 2, 0.85)
# node dots
for (px, py) in pts:
    for ox in range(-4, 5):
        for oy in range(-4, 5):
            if ox * ox + oy * oy <= 16:
                blend_px(px + ox, py + oy, ACCENT_STRONG, 0.9)

# --- 5x7 uppercase bitmap font ---
FONT = {
    'A': ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    'B': ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    'C': ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
    'E': ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    'F': ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    'H': ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    'I': ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    'L': ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    'N': ["10001", "11001", "10101", "10101", "10101", "10011", "10001"],
    'O': ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    'R': ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    'S': ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    'T': ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    'V': ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
    'Z': ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
    '.': ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
    ' ': ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
}


def text_width(s, scale, spacing):
    return len(s) * (5 * scale + spacing) - spacing if s else 0


def draw_text(s, x, y, scale, col, spacing, alpha=1.0):
    cx = x
    for ch in s:
        glyph = FONT.get(ch, FONT[' '])
        for ry, row in enumerate(glyph):
            for rxi, bit in enumerate(row):
                if bit == '1':
                    for sx in range(scale):
                        for sy in range(scale):
                            blend_px(cx + rxi * scale + sx, y + ry * scale + sy, col, alpha)
        cx += 5 * scale + spacing


# --- Small top label ---
draw_text("ZELVRA.TECH", 90, 92, 3, ACCENT_STRONG, 3, 0.95)

# --- Big wordmark ---
draw_text("ZELVRA", 90, 215, 18, TEXT, 18)

# --- Tagline ---
draw_text("RESEARCH BRIEFS FOR FINANCE CREATORS", 92, 392, 4, MUTED, 4, 0.95)

# --- Encode PNG ---
raw = bytearray()
for y in range(H):
    raw.append(0)  # filter type 0
    start = y * W * 3
    raw.extend(buf[start:start + W * 3])

compressed = zlib.compress(bytes(raw), 9)


def chunk(tag, data):
    c = struct.pack(">I", len(data)) + tag + data
    crc = zlib.crc32(tag + data) & 0xFFFFFFFF
    return c + struct.pack(">I", crc)


png = b"\x89PNG\r\n\x1a\n"
png += chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
png += chunk(b"IDAT", compressed)
png += chunk(b"IEND", b"")

out = os.path.join(os.path.dirname(__file__), "..", "assets", "og-image.png")
out = os.path.normpath(out)
with open(out, "wb") as f:
    f.write(png)
print("wrote", out, len(png), "bytes")
