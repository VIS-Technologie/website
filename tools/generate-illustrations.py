#!/usr/bin/env python3
"""Generuje ilustracje SVG marki „Sygnał” do site/static/assets/img/ (stdlib, deterministycznie).

Uruchomienie: python tools/generate-illustrations.py
Pliki: hero-art.svg, service-01..08.svg, case-01..02.svg, team-01..03.svg
Portrety zespołu to przykładowe, wektorowe wizerunki-placeholder do czasu dostarczenia zdjęć.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site" / "static" / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

INK = "#0A161F"
INK2 = "#12242F"
PANEL = "#132833"
CARD = "#1A3541"
MINT = "#2BD9A9"
AMBER = "#FFB454"
TEAL = "#0B7A66"
PAPER = "#FAFAF7"
LINE = "rgba(10,22,31,0.14)"
LINE_S = "rgba(10,22,31,0.3)"
FG2 = "#46545C"
BAR = "#D8DDD6"      # „tekst” na jasnym
BAR_D = "rgba(255,255,255,0.22)"  # „tekst” na ciemnym


def svg(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" role="img" aria-hidden="true">{rect}{body}</svg>\n')


def card(x, y, w, h, r=14, fill="#fff", stroke=LINE, sw=1.5, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def bar(x, y, w, h=10, fill=BAR, r=None):
    r = r if r is not None else h / 2
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>'


def dot(x, y, r=4, fill=MINT):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'


def grid_dots(x0, y0, x1, y1, step=26, fill="rgba(10,22,31,0.08)", r=1.5):
    out = []
    y = y0
    while y <= y1:
        x = x0
        while x <= x1:
            out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>')
            x += step
        y += step
    return "".join(out)


def wave(x0, y, width, amp=16, period=52, stroke=MINT, sw=3, opacity=1.0):
    n = int(width // period)
    d = f"M{x0} {y}"
    for i in range(n):
        x = x0 + i * period
        d += f" Q{x + period / 4} {y - amp} {x + period / 2} {y} T{x + period} {y}"
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" opacity="{opacity}" stroke-linecap="round"/>'


def chip(x, y, w, label_w, fill=CARD, accent=MINT):
    return (card(x, y, w, 36, r=18, fill=fill, stroke="rgba(255,255,255,0.14)")
            + dot(x + 20, y + 18, 5, accent) + bar(x + 34, y + 13, label_w, 10, BAR_D))


# ============================================================ hero
def hero_art():
    b = []
    b.append(card(0, 0, 1200, 900, r=28, fill=INK2, stroke="rgba(255,255,255,0.1)", sw=2))
    b.append(grid_dots(40, 40, 1160, 860, step=40, fill="rgba(255,255,255,0.05)", r=1.6))
    # pasek górny
    b.append(card(48, 48, 1104, 76, r=16, fill=PANEL, stroke="rgba(255,255,255,0.1)"))
    b.append(dot(88, 86, 6, MINT) + bar(106, 80, 120, 12, BAR_D))
    b.append(dot(288, 86, 6, AMBER) + bar(306, 80, 90, 12, BAR_D))
    b.append(dot(438, 86, 6, "#fff") + bar(456, 80, 104, 12, BAR_D))
    b.append(bar(980, 76, 132, 24, "rgba(43,217,169,0.25)", r=12))
    # duża karta telemetrii (fala)
    b.append(card(48, 156, 724, 420, r=20, fill=PANEL, stroke="rgba(255,255,255,0.1)"))
    b.append(bar(84, 192, 170, 12, BAR_D) + bar(84, 216, 110, 9, "rgba(255,255,255,0.12)"))
    for i, yy in enumerate(range(280, 521, 60)):
        b.append(f'<line x1="84" y1="{yy}" x2="736" y2="{yy}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>')
    b.append(wave(84, 400, 650, amp=52, period=118, stroke=MINT, sw=4))
    b.append(wave(84, 430, 650, amp=24, period=74, stroke=AMBER, sw=2.5, opacity=0.7))
    b.append(dot(555, 348, 7, "#fff"))
    b.append(card(500, 288, 128, 40, r=10, fill=INK, stroke=MINT))
    b.append(bar(516, 302, 96, 12, "rgba(43,217,169,0.8)"))
    # kolumna statusów
    b.append(card(796, 156, 356, 420, r=20, fill=PANEL, stroke="rgba(255,255,255,0.1)"))
    b.append(bar(828, 192, 140, 12, BAR_D))
    for i, yy in enumerate([236, 300, 364, 428, 492]):
        acc = MINT if i in (0, 1, 3) else (AMBER if i == 2 else "rgba(255,255,255,0.3)")
        b.append(card(828, yy, 292, 48, r=12, fill=CARD, stroke="rgba(255,255,255,0.08)"))
        b.append(dot(854, yy + 24, 6, acc))
        b.append(bar(872, yy + 18, 150 - i * 12, 10, BAR_D))
        b.append(bar(1058, yy + 18, 40, 10, "rgba(255,255,255,0.14)"))
    # siatka kontenerów
    b.append(card(48, 608, 1104, 244, r=20, fill=PANEL, stroke="rgba(255,255,255,0.1)"))
    b.append(bar(84, 640, 190, 12, BAR_D))
    cols, rows = 14, 3
    for r_ in range(rows):
        for c_ in range(cols):
            x = 84 + c_ * 74
            y = 676 + r_ * 52
            fill = "rgba(255,255,255,0.1)"
            if (r_ * cols + c_) % 7 == 2:
                fill = "rgba(43,217,169,0.55)"
            elif (r_ * cols + c_) % 11 == 5:
                fill = "rgba(255,180,84,0.55)"
            b.append(f'<rect x="{x}" y="{y}" width="62" height="40" rx="6" fill="{fill}"/>')
    return svg(1200, 900, "".join(b))


# ============================================================ usługi
def scene(inner, tint="none"):
    b = [grid_dots(36, 36, 764, 564, step=38)]
    b.append(inner)
    return svg(800, 600, "".join(b))


def sc_browser(content, x=90, y=90, w=620, h=420):
    top = (card(x, y, w, h, r=18, sw=2, stroke=LINE_S)
           + f'<line x1="{x}" y1="{y + 54}" x2="{x + w}" y2="{y + 54}" stroke="{LINE}" stroke-width="1.5"/>'
           + dot(x + 28, y + 27, 5, "#E8837A") + dot(x + 48, y + 27, 5, AMBER) + dot(x + 68, y + 27, 5, MINT)
           + bar(x + 96, y + 20, 180, 14, "#EEF0EA", r=7))
    return top + content(x, y + 54, w, h - 54)


def service_01():  # systemy dedykowane — architektura modułów
    def links():
        pts = [(210, 210), (210, 330), (210, 450), (560, 330)]
        c = (395, 330)
        out = "".join(f'<path d="M{p[0]} {p[1]} L{c[0]} {c[1]}" stroke="{LINE_S}" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>' for p in pts)
        return out
    b = links()
    for i, (x, y) in enumerate([(120, 170), (120, 290), (120, 410)]):
        b += card(x, y, 180, 80, r=14)
        b += dot(x + 26, y + 28, 6, [MINT, AMBER, TEAL][i]) + bar(x + 42, y + 22, 100, 11)
        b += bar(x + 26, y + 48, 120, 8, "#EEF0EA")
    b += card(310, 240, 170, 180, r=18, fill=INK, stroke=INK)
    b += bar(338, 272, 100, 12, BAR_D) + bar(338, 296, 76, 9, "rgba(255,255,255,0.14)")
    b += wave(338, 360, 114, amp=14, period=38, stroke=MINT, sw=3)
    b += dot(338 + 6, 396, 4, AMBER) + bar(354, 391, 70, 9, BAR_D)
    b += card(540, 260, 150, 140, r=14)
    b += bar(566, 288, 86, 11) + bar(566, 312, 100, 8, "#EEF0EA") + bar(566, 330, 62, 8, "#EEF0EA")
    b += f'<path d="M480 330 L540 330" stroke="{TEAL}" stroke-width="2.5" marker-end="none"/>'
    b += dot(540, 330, 5, TEAL)
    return scene(b)


def service_02():  # aplikacje webowe i portale
    def content(x, y, w, h):
        s = f'<line x1="{x + 150}" y1="{y}" x2="{x + 150}" y2="{y + h}" stroke="{LINE}" stroke-width="1.5"/>'
        for i, yy in enumerate(range(int(y) + 26, int(y) + 200, 34)):
            fill = MINT if i == 1 else "#EEF0EA"
            s += bar(x + 24, yy, 100 if i != 1 else 84, 10, fill)
        for i in range(2):
            for j in range(2):
                cx = x + 178 + j * 226
                cy = y + 24 + i * 120
                s += card(cx, cy, 202, 100, r=12, fill="#FBFCFA")
                s += bar(cx + 20, cy + 20, 90, 10) + bar(cx + 20, cy + 42, 140, 8, "#EEF0EA")
                s += bar(cx + 20, cy + 66, 56, 16, ["rgba(43,217,169,0.35)", "rgba(255,180,84,0.4)", "#EEF0EA", "rgba(11,122,102,0.25)"][i * 2 + j], r=8)
        s += bar(x + 178, y + 276, 424, 10, "#EEF0EA") + bar(x + 178, y + 300, 360, 10, "#EEF0EA")
        return s
    return scene(sc_browser(content))


def service_03():  # mobilne i tabletowe
    b = card(150, 100, 210, 400, r=28, fill="#fff", stroke=LINE_S, sw=2.5)
    b += bar(225, 122, 60, 8, "#EEF0EA")
    for i, yy in enumerate(range(160, 400, 62)):
        b += card(174, yy, 162, 48, r=12, fill="#FBFCFA")
        b += dot(198, yy + 24, 7, [MINT, AMBER, TEAL, "#D8DDD6"][i])
        b += bar(214, yy + 18, 90, 9)
    b += card(174, 412, 162, 56, r=12, fill=INK, stroke=INK)
    b += bar(214, 434, 82, 11, BAR_D)
    # tablet z mapą
    b += card(400, 170, 260, 260, r=20, fill="#fff", stroke=LINE_S, sw=2.5)
    b += card(420, 190, 220, 180, r=12, fill="#EDF3EC", stroke=LINE)
    b += f'<path d="M420 300 Q490 250 540 292 T640 268" stroke="{TEAL}" stroke-width="3" fill="none" stroke-dasharray="8 7" stroke-linecap="round"/>'
    b += f'<path d="M530 260 c0 -16 24 -16 24 0 c0 12 -12 16 -12 26 c0 -10 -12 -14 -12 -26 Z" fill="{AMBER}"/>'
    b += dot(542, 258, 4.5, "#fff")
    b += bar(420, 390, 120, 10) + bar(420, 410, 160, 8, "#EEF0EA")
    return scene(b)


def service_04():  # utrzymanie i rozwój
    b = card(110, 130, 400, 300, r=18, sw=2, stroke=LINE_S)
    b += bar(140, 160, 140, 12) + bar(140, 184, 90, 9, "#EEF0EA")
    for yy in range(240, 401, 40):
        b += f'<line x1="140" y1="{yy}" x2="480" y2="{yy}" stroke="{LINE}" stroke-width="1"/>'
    b += f'<path d="M140 380 L210 340 L270 356 L340 290 L410 306 L480 250" stroke="{TEAL}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    b += dot(480, 250, 6, TEAL)
    b += card(404, 214, 132, 40, r=10, fill=INK, stroke=INK) + bar(422, 228, 96, 12, "rgba(43,217,169,0.8)")
    for i, yy in enumerate([150, 230, 310, 390]):
        b += card(560, yy, 140, 56, r=12)
        ok = i != 2
        acc = MINT if ok else AMBER
        b += f'<circle cx="{588}" cy="{yy + 28}" r="10" fill="none" stroke="{acc}" stroke-width="2.5"/>'
        if ok:
            b += f'<path d="M583 {yy + 28} l4 4 l7 -8" stroke="{acc}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        else:
            b += f'<line x1="588" y1="{yy + 22}" x2="588" y2="{yy + 31}" stroke="{acc}" stroke-width="2.5" stroke-linecap="round"/>' + dot(588, yy + 36, 1.6, acc)
        b += bar(608, yy + 22, 70, 10)
    return scene(b)


def service_05():  # wdrożenia AI
    b = card(110, 180, 170, 220, r=14, sw=2, stroke=LINE_S)
    b += f'<path d="M110 194 q0 -14 14 -14 h108 l48 44 v162 q0 14 -14 14" fill="none"/>'
    for i, yy in enumerate(range(214, 370, 26)):
        b += bar(136, yy, 118 - (i % 3) * 22, 9, "#EEF0EA" if i else BAR)
    b += f'<path d="M292 290 L340 290" stroke="{LINE_S}" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>'
    # sieć neuronowa
    layers = [(370, [230, 290, 350]), (460, [200, 260, 320, 380]), (550, [260, 320])]
    for li in range(len(layers) - 1):
        for y1 in layers[li][1]:
            for y2 in layers[li + 1][1]:
                b += f'<line x1="{layers[li][0]}" y1="{y1}" x2="{layers[li + 1][0]}" y2="{y2}" stroke="rgba(11,122,102,0.25)" stroke-width="1.5"/>'
    for li, (x, ys) in enumerate(layers):
        for j, y in enumerate(ys):
            fill = INK if li == 1 else (MINT if li == 2 else "#fff")
            b += f'<circle cx="{x}" cy="{y}" r="13" fill="{fill}" stroke="{INK}" stroke-width="2"/>'
    b += f'<path d="M563 290 L610 290" stroke="{LINE_S}" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>'
    b += card(610, 250, 96, 80, r=14, fill="#fff", stroke=MINT, sw=2.5)
    b += f'<path d="M640 290 l9 9 l18 -20" stroke="{TEAL}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    return scene(b)


def turbine(cx, cy, ground, s=1.0, rot=18):
    t = f'<path d="M{cx - 11 * s} {ground} L{cx - 5 * s} {cy} L{cx + 5 * s} {cy} L{cx + 11 * s} {ground} Z" fill="{INK}"/>'
    for ang in (0, 120, 240):
        t += (f'<g transform="rotate({ang + rot} {cx} {cy})">'
              f'<path d="M{cx - 7 * s} {cy} q-3 -{30 * s} 0 -{100 * s} q2 -{26 * s} 7 -{26 * s} '
              f'q5 0 7 {26 * s} q3 {70 * s} 0 {100 * s} Z" fill="{INK}"/></g>')
    t += dot(cx, cy, 13 * s, AMBER) + dot(cx, cy, 5.5 * s, INK)
    return t


def service_06():  # monitoring i IoT
    b = ""
    cx, cy = 250, 250
    b += turbine(cx, cy, 470, 1.0)
    for r_, op in [(70, 0.55), (100, 0.35), (130, 0.2)]:
        b += f'<path d="M{cx + 30} {cy - r_ * 0.55} a {r_} {r_} 0 0 1 0 {r_ * 1.1}" fill="none" stroke="{TEAL}" stroke-width="2.5" opacity="{op}"/>'
    # karta pomiarowa
    b += card(440, 150, 250, 300, r=18, sw=2, stroke=LINE_S)
    b += bar(468, 180, 120, 12) + bar(468, 204, 80, 9, "#EEF0EA")
    heights = [36, 58, 44, 84, 66, 100, 54]
    for i, hh in enumerate(heights):
        x = 468 + i * 28
        fill = MINT if i == 5 else ("rgba(11,122,102,0.35)" if i % 2 else "#D8DDD6")
        b += f'<rect x="{x}" y="{330 - hh}" width="16" height="{hh}" rx="5" fill="{fill}"/>'
    b += wave(468, 388, 194, amp=12, period=48, stroke=AMBER, sw=2.5)
    b += dot(468 + 8, 420, 4, MINT) + bar(484, 415, 90, 9, "#EEF0EA")
    return scene(b)


def service_07():  # infrastruktura IT
    b = ""
    for i in range(3):
        y = 170 + i * 92
        b += card(130, y, 300, 72, r=14, sw=2, stroke=LINE_S)
        b += dot(162, y + 36, 6, MINT if i != 1 else AMBER)
        b += bar(182, y + 30, 110, 10)
        for j in range(4):
            b += f'<line x1="{330 + j * 18}" y1="{y + 22}" x2="{330 + j * 18}" y2="{y + 50}" stroke="{LINE_S}" stroke-width="2.5" stroke-linecap="round"/>'
    # chmura
    b += (f'<path d="M520 260 a44 44 0 0 1 84 -14 a36 36 0 0 1 6 71 h-118 a32 32 0 0 1 28 -57 Z" '
          f'fill="#fff" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
    b += f'<path d="M470 350 q60 34 128 0" stroke="{LINE_S}" stroke-width="2" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>'
    # tarcza
    b += (f'<path d="M594 360 l44 16 v40 q0 40 -44 58 q-44 -18 -44 -58 v-40 Z" '
          f'fill="{INK}" stroke="{INK}" stroke-width="2"/>')
    b += f'<path d="M576 420 l12 12 l26 -28" stroke="{MINT}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    return scene(b)


def service_08():  # strony internetowe
    def content(x, y, w, h):
        s = bar(x + 40, y + 44, 250, 20, INK, r=6)
        s += bar(x + 40, y + 78, 190, 12, "#EEF0EA")
        s += bar(x + 40, y + 120, 96, 30, MINT, r=15)
        s += bar(x + 150, y + 120, 96, 30, "#EEF0EA", r=15)
        s += card(x + 330, y + 30, 250, 150, r=12, fill="#EDF3EC", stroke=LINE)
        s += f'<circle cx="{x + 380}" cy="{y + 80}" r="18" fill="{AMBER}"/>'
        s += f'<path d="M{x + 344} {y + 166} l60 -52 l48 34 l52 -46 l70 64 Z" fill="rgba(11,122,102,0.4)"/>'
        for j in range(3):
            s += card(x + 40 + j * 186, y + 210, 160, 90, r=12, fill="#FBFCFA")
            s += bar(x + 60 + j * 186, y + 232, 80, 9) + bar(x + 60 + j * 186, y + 252, 110, 8, "#EEF0EA")
        return s
    return scene(sc_browser(content, 80, 80, 640, 440))


# ============================================================ case studies
def case_01():  # PCC Intermodal — operacje terminalowe
    b = [card(0, 0, 1680, 720, r=0, fill=PAPER, stroke="none", sw=0)]
    b.append(grid_dots(40, 40, 1640, 680, step=44))
    # nagłówek KPI
    for i, acc in enumerate([MINT, AMBER, TEAL]):
        x = 90 + i * 250
        b.append(card(x, 70, 226, 64, r=14))
        b.append(dot(x + 28, 102, 6, acc))
        b.append(bar(x + 46, 88, 130, 11))
        b.append(bar(x + 46, 110, 60, 8, "#EEF0EA"))
    # gantt
    b.append(card(90, 170, 760, 470, r=18, sw=2, stroke=LINE_S))
    b.append(bar(122, 200, 180, 12))
    rows = [(240, 150, 300, MINT), (300, 260, 210, "#D8DDD6"), (360, 200, 340, AMBER),
            (420, 130, 180, "#D8DDD6"), (480, 330, 260, TEAL), (540, 180, 300, "#D8DDD6")]
    for y, x0, w_, cfill in rows:
        b.append(bar(122, y + 4, 70, 9, "#EEF0EA"))
        b.append(f'<rect x="{122 + x0 - 100}" y="{y - 6}" width="{w_}" height="26" rx="9" fill="{cfill}" opacity="0.75"/>')
    b.append(f'<line x1="520" y1="188" x2="520" y2="620" stroke="{AMBER}" stroke-width="2.5" stroke-dasharray="7 7"/>')
    # pociąg z kontenerami
    b.append(card(890, 170, 700, 260, r=18, sw=2, stroke=LINE_S))
    b.append(bar(922, 200, 200, 12))
    b.append(f'<line x1="922" y1="360" x2="1558" y2="360" stroke="{INK}" stroke-width="3"/>')
    for i in range(6):
        x = 922 + i * 106
        fill = ["rgba(43,217,169,0.6)", "rgba(255,180,84,0.6)", "rgba(11,122,102,0.45)"][i % 3]
        b.append(f'<rect x="{x}" y="{300}" width="92" height="52" rx="7" fill="{fill}" stroke="{LINE_S}" stroke-width="1.5"/>')
        b.append(f'<circle cx="{x + 22}" cy="366" r="8" fill="none" stroke="{INK}" stroke-width="2.5"/>')
        b.append(f'<circle cx="{x + 70}" cy="366" r="8" fill="none" stroke="{INK}" stroke-width="2.5"/>')
    # dokumenty -> system
    b.append(card(890, 470, 330, 170, r=18, sw=2, stroke=LINE_S))
    for i, yy in enumerate(range(500, 610, 34)):
        b.append(dot(922, yy + 5, 4, MINT if i != 1 else AMBER))
        b.append(bar(940, yy, 190 - i * 24, 10, "#D8DDD6" if i else BAR))
    b.append(card(1260, 470, 330, 170, r=18, fill=INK, stroke=INK))
    b.append(bar(1292, 500, 130, 12, BAR_D))
    b.append(wave(1292, 580, 260, amp=22, period=64, stroke=MINT, sw=3.5))
    b.append(bar(1292, 606, 90, 9, "rgba(255,255,255,0.14)"))
    return svg(1680, 720, "".join(b))


def case_02():  # APT / Chordata — akustyka turbin
    b = [card(0, 0, 1680, 720, r=0, fill=PAPER, stroke="none", sw=0)]
    b.append(grid_dots(40, 40, 1640, 680, step=44))
    # turbiny
    b.append(turbine(240, 280, 640, 1.35, rot=10))
    b.append(turbine(470, 380, 640, 0.85, rot=52))
    for r_, op in [(110, 0.5), (155, 0.3), (200, 0.18)]:
        b.append(f'<path d="M{330} {280 - r_ * 0.6} a {r_} {r_} 0 0 1 0 {r_ * 1.2}" fill="none" stroke="{TEAL}" stroke-width="3" opacity="{op}"/>')
    # sensor przy wieży
    b.append(card(160, 520, 130, 56, r=12, fill=INK, stroke=INK))
    b.append(dot(186, 548, 6, MINT) + bar(202, 542, 62, 10, BAR_D))
    b.append(f'<path d="M290 548 q60 20 120 -30" stroke="{LINE_S}" stroke-width="2" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>')
    # spektrum akustyczne
    b.append(card(640, 120, 560, 380, r=18, sw=2, stroke=LINE_S))
    b.append(bar(672, 152, 200, 12) + bar(672, 176, 120, 9, "#EEF0EA"))
    heights = [40, 66, 52, 90, 74, 120, 96, 150, 118, 88, 132, 70, 54, 44]
    for i, hh in enumerate(heights):
        x = 672 + i * 36
        fill = AMBER if i == 7 else ("rgba(11,122,102,0.4)" if i % 2 else "#D8DDD6")
        b.append(f'<rect x="{x}" y="{440 - hh}" width="22" height="{hh}" rx="7" fill="{fill}"/>')
    b.append(f'<line x1="672" y1="290" x2="1168" y2="290" stroke="{AMBER}" stroke-width="2" stroke-dasharray="7 7" opacity="0.7"/>')
    # karta alertu + model
    b.append(card(1240, 120, 350, 170, r=18, fill=INK, stroke=INK))
    b.append(f'<path d="M1286 214 l16 -28 l16 28 Z" fill="none" stroke="{AMBER}" stroke-width="3" stroke-linejoin="round"/>')
    b.append(f'<line x1="1302" y1="196" x2="1302" y2="205" stroke="{AMBER}" stroke-width="3" stroke-linecap="round"/>')
    b.append(bar(1330, 182, 170, 12, BAR_D) + bar(1330, 206, 120, 9, "rgba(255,255,255,0.14)"))
    b.append(bar(1272, 248, 150, 26, "rgba(255,180,84,0.3)", r=13))
    b.append(card(1240, 330, 350, 170, r=18, sw=2, stroke=LINE_S))
    b.append(bar(1272, 360, 140, 12))
    b.append(wave(1272, 430, 280, amp=26, period=68, stroke=TEAL, sw=3.5))
    b.append(wave(1272, 452, 280, amp=12, period=44, stroke=MINT, sw=2, opacity=0.7))
    return svg(1680, 720, "".join(b))


# ============================================================ portrety (przykładowe wizerunki)
def portrait(bg, ring, skin, hair_fill, hair_path, torso, collar, extras=""):
    b = [f'<rect width="480" height="600" fill="{bg}"/>']
    b.append(f'<circle cx="240" cy="600" r="300" fill="rgba(255,255,255,0.5)"/>')
    b.append(f'<circle cx="240" cy="250" r="150" fill="none" stroke="{ring}" stroke-width="10" opacity="0.5"/>')
    # tors
    b.append(torso)
    # szyja
    b.append(f'<rect x="212" y="300" width="56" height="70" rx="24" fill="{skin}"/>')
    # głowa
    b.append(f'<ellipse cx="240" cy="238" rx="82" ry="94" fill="{skin}"/>')
    # uszy
    b.append(f'<circle cx="158" cy="248" r="14" fill="{skin}"/><circle cx="322" cy="248" r="14" fill="{skin}"/>')
    # włosy
    b.append(f'<path d="{hair_path}" fill="{hair_fill}"/>')
    b.append(collar)
    b.append(extras)
    return svg(480, 600, "".join(b))


def team_01():  # Kamil — CEO/CTO: ciemne włosy, okulary, granatowy sweter
    torso = f'<path d="M100 600 q0 -150 140 -150 q140 0 140 150 Z" fill="{INK}"/>'
    collar = f'<path d="M196 462 q44 26 88 0 l-8 26 q-36 18 -72 0 Z" fill="{MINT}"/>'
    hair = "M158 232 q-6 -96 82 -100 q88 4 82 100 q-2 26 -8 30 q4 -58 -34 -64 q-46 22 -80 0 q-38 6 -34 64 q-6 -4 -8 -30 Z"
    glasses = (f'<g stroke="{INK2}" stroke-width="6" fill="none" opacity="0.9">'
               f'<rect x="176" y="230" width="56" height="44" rx="14"/>'
               f'<rect x="248" y="230" width="56" height="44" rx="14"/>'
               f'<line x1="232" y1="248" x2="248" y2="248"/></g>')
    return portrait("#F5EFE2", AMBER, "#E5AE85", "#241B14", hair, torso, collar, glasses)


def team_02():  # Ireneusz — COO: jaśniejsze włosy, broda, koszula petrol
    torso = f'<path d="M100 600 q0 -150 140 -150 q140 0 140 150 Z" fill="{TEAL}"/>'
    collar = (f'<path d="M206 452 l34 34 l34 -34 l14 12 l-48 44 l-48 -44 Z" fill="#fff"/>')
    hair = "M160 216 q0 -84 80 -84 q80 0 80 84 q0 12 -6 18 q-6 -44 -30 -48 q-44 18 -88 0 q-24 4 -30 48 q-6 -6 -6 -18 Z"
    beard = (f'<path d="M166 268 Q172 392 240 396 Q308 392 314 268 Q300 344 240 348 Q180 344 166 268 Z" fill="#6B4F35"/>'
             f'<path d="M210 320 q30 -16 60 0 q-8 16 -30 16 q-22 0 -30 -16 Z" fill="#6B4F35"/>')
    return portrait("#E9F1ED", MINT, "#EFC49E", "#6B4F35", hair, torso, collar, beard)


def team_03():  # Katarzyna — CFO: dłuższe włosy, marynarka, bursztynowe kolczyki
    torso = f'<path d="M104 600 q0 -146 136 -146 q136 0 136 146 Z" fill="{INK2}"/>'
    lapel = (f'<path d="M240 454 l-30 60 l30 86 l30 -86 Z" fill="#fff"/>'
             f'<path d="M210 514 l-26 -34 l26 -22 Z" fill="{INK}"/>'
             f'<path d="M270 514 l26 -34 l-26 -22 Z" fill="{INK}"/>')
    hair = ("M240 130 q-92 0 -96 108 q-2 62 -14 118 q-6 28 18 28 l32 0 q-14 -76 -6 -128 "
            "q10 -44 66 -44 q56 0 66 44 q8 52 -6 128 l32 0 q24 0 18 -28 q-12 -56 -14 -118 q-4 -108 -96 -108 Z")
    face = f'<ellipse cx="240" cy="252" rx="62" ry="74" fill="#EABF97"/>'
    earrings = f'<circle cx="158" cy="272" r="7" fill="{AMBER}"/><circle cx="322" cy="272" r="7" fill="{AMBER}"/>'
    return portrait("#F0F2EE", AMBER, "#EABF97", "#3A2C1E", hair, torso, lapel, face + earrings)


FILES = {
    "hero-art.svg": hero_art,
    "service-01.svg": service_01,
    "service-02.svg": service_02,
    "service-03.svg": service_03,
    "service-04.svg": service_04,
    "service-05.svg": service_05,
    "service-06.svg": service_06,
    "service-07.svg": service_07,
    "service-08.svg": service_08,
    "case-01.svg": case_01,
    "case-02.svg": case_02,
    "team-01.svg": team_01,
    "team-02.svg": team_02,
    "team-03.svg": team_03,
}


def main():
    for name, fn in FILES.items():
        (OUT / name).write_text(fn(), encoding="utf-8", newline="\n")
    print(f"OK: {len(FILES)} ilustracji -> {OUT.relative_to(OUT.parent.parent.parent)}")


if __name__ == "__main__":
    main()
