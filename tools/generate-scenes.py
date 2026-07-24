#!/usr/bin/env python3
"""Kinowe sceny domenowe (SVG) — malarskie, sylwetkowe grafiki zamiast infografik.
Uruchomienie: python tools/generate-scenes.py  ->  site/static/assets/img/scene-*.svg
Zaprojektowane jako tła pełnoekranowych sekcji (1920x1080); podmienialne 1:1 na
prawdziwe zdjęcia o tych samych ścieżkach."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "site" / "static" / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
SIL = "#0A0E18"        # sylwetki
SIL2 = "#111726"       # plan drugi


def svg(body, defs="", w=W, h=H):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">'
            f'<defs>{defs}</defs>{body}</svg>\n')


def lin(id_, stops, x1=0, y1=0, x2=0, y2=1):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{s}</linearGradient>'


def rad(id_, stops, cx=0.5, cy=0.5, r=0.5):
    s = "".join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>' for o, c, a in stops)
    return f'<radialGradient id="{id_}" cx="{cx}" cy="{cy}" r="{r}">{s}</radialGradient>'


def stars(n, y0, y1, seed=7, fill="#F5F2EC"):
    out, v = [], seed
    for i in range(n):
        v = (v * 48271) % 2147483647
        x = v % W
        v = (v * 48271) % 2147483647
        y = y0 + v % max(1, (y1 - y0))
        v = (v * 48271) % 2147483647
        r = 0.8 + (v % 14) / 10
        v = (v * 48271) % 2147483647
        op = 0.25 + (v % 55) / 100
        out.append(f'<circle cx="{x}" cy="{y}" r="{r:.1f}" fill="{fill}" opacity="{op:.2f}"/>')
    return "".join(out)


def turbine_sil(cx, ground, hub_h, s=1.0, rot=15, fill=SIL, light=False):
    cy = ground - hub_h
    t = f'<path d="M{cx - 10 * s} {ground} L{cx - 4 * s} {cy} L{cx + 4 * s} {cy} L{cx + 10 * s} {ground} Z" fill="{fill}"/>'
    for ang in (0, 120, 240):
        t += (f'<g transform="rotate({ang + rot} {cx} {cy})">'
              f'<path d="M{cx - 6 * s} {cy} q-3 -{34 * s} 0 -{118 * s} q2 -{26 * s} 6 -{26 * s} '
              f'q4 0 6 {26 * s} q3 {84 * s} 0 {118 * s} Z" fill="{fill}"/></g>')
    t += f'<circle cx="{cx}" cy="{cy}" r="{11 * s}" fill="{fill}"/>'
    if light:
        t += (f'<circle cx="{cx}" cy="{cy - 16 * s}" r="{5 * s}" fill="#FF5A4E" opacity="0.9"/>'
              f'<circle cx="{cx}" cy="{cy - 16 * s}" r="{14 * s}" fill="#FF5A4E" opacity="0.25"/>')
    return t


def person(cx, base, s=1.0, fill=SIL, arm=None):
    """Prosta, wiarygodna sylwetka stojąca; arm='up' unosi rękę."""
    p = (f'<circle cx="{cx}" cy="{base - 62 * s}" r="{11 * s}" fill="{fill}"/>'
         f'<path d="M{cx - 10 * s} {base} L{cx - 8 * s} {base - 30 * s} L{cx - 11 * s} {base - 52 * s} '
         f'Q{cx} {base - 58 * s} {cx + 11 * s} {base - 52 * s} L{cx + 8 * s} {base - 30 * s} L{cx + 10 * s} {base} '
         f'L{cx + 4 * s} {base} L{cx + 2 * s} {base - 24 * s} L{cx - 2 * s} {base - 24 * s} L{cx - 4 * s} {base} Z" fill="{fill}"/>')
    if arm == "up":
        p += f'<path d="M{cx + 9 * s} {base - 50 * s} q{14 * s} -{6 * s} {18 * s} -{22 * s} l{5 * s} {3 * s} q-{5 * s} {20 * s} -{21 * s} {26 * s} Z" fill="{fill}"/>'
    return p


# ============================================================
def scene_turbine():  # serwis turbin — technik na gondoli o zmierzchu
    defs = (lin("sky", [(0, "#0A1026"), (0.45, "#1D2C52"), (0.75, "#7A4A38"), (0.92, "#E8934C")])
            + rad("sun", [(0, "#FFD9A0", 0.95), (0.4, "#F2A65A", 0.5), (1, "#F2A65A", 0)])
            + lin("sea", [(0, "#2A2438"), (1, "#0C0F1C")]))
    b = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
    b += f'<ellipse cx="1310" cy="905" rx="520" ry="240" fill="url(#sun)"/>'
    b += stars(70, 0, 380)
    b += f'<rect y="900" width="{W}" height="{H - 900}" fill="url(#sea)"/>'
    # dalekie turbiny
    b += turbine_sil(360, 905, 300, 0.62, rot=40, fill=SIL2)
    b += turbine_sil(700, 905, 360, 0.8, rot=75, fill=SIL2)
    # główna turbina z technikiem na gondoli
    cx, ground, hub = 1360, 1010, 640
    b += turbine_sil(cx, ground, hub, 1.7, rot=104, light=True)
    ny = ground - hub
    b += f'<rect x="{cx - 62}" y="{ny - 26}" width="150" height="34" rx="15" fill="{SIL}"/>'
    b += person(cx + 62, ny - 24, 1.05, arm="up")
    b += f'<path d="M{cx + 62} {ny - 86} q60 -26 130 -20" stroke="{SIL}" stroke-width="3" fill="none"/>'
    # ptaki
    b += ('<path d="M420 300 q14 -12 28 0 M448 300 q14 -12 28 0" stroke="#0A0E18" stroke-width="4" fill="none" opacity="0.7"/>'
          '<path d="M560 250 q11 -9 22 0 M582 250 q11 -9 22 0" stroke="#0A0E18" stroke-width="3.4" fill="none" opacity="0.6"/>')
    return svg(b, defs)


def scene_ai():  # AI — dłoń i neuronowa mgławica
    defs = (lin("aisky", [(0, "#0B0A1E"), (0.6, "#191542"), (1, "#241B4E")])
            + rad("aigl", [(0, "#B9A8FF", 0.5), (0.5, "#7C5CFF", 0.2), (1, "#7C5CFF", 0)])
            + rad("aigl2", [(0, "#FFB56B", 0.6), (1, "#FFB56B", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#aisky)"/>'
    b += stars(120, 0, 800)
    b += f'<ellipse cx="960" cy="460" rx="560" ry="330" fill="url(#aigl)"/>'
    # mgławica neuronowa (deterministycznie)
    pts, v = [], 13
    for i in range(46):
        v = (v * 48271) % 2147483647
        a = v % 6283 / 1000
        v = (v * 48271) % 2147483647
        rr = 90 + v % 300
        import math
        x = 960 + math.cos(a) * rr * 1.35
        y = 430 + math.sin(a) * rr * 0.72
        pts.append((x, y, 2.5 + (v % 40) / 10))
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            dx, dy = pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]
            if dx * dx + dy * dy < 26000:
                b += (f'<line x1="{pts[i][0]:.0f}" y1="{pts[i][1]:.0f}" x2="{pts[j][0]:.0f}" y2="{pts[j][1]:.0f}" '
                      f'stroke="#9F8CFF" stroke-width="1.1" opacity="0.4"/>')
    for x, y, r in pts:
        c = "#FFD9A0" if r > 5.2 else "#CDBfFF".replace("f", "F")
        b += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="{c}" opacity="0.9"/>'
    b += f'<ellipse cx="960" cy="500" rx="130" ry="80" fill="url(#aigl2)"/>'
    # dłoń (sylwetka, otwarta ku górze)
    b += ('<path d="M700 1080 L760 890 Q790 850 830 852 L846 800 Q852 782 868 786 Q882 790 878 810 L864 862 '
          'L892 856 L916 776 Q922 756 940 762 Q956 768 950 790 L928 864 L956 860 L986 766 Q994 744 1012 752 '
          'Q1028 760 1020 784 L992 872 L1020 872 L1052 796 Q1062 776 1078 784 Q1094 794 1086 814 L1050 910 '
          'Q1090 900 1120 924 Q1160 956 1150 1010 L1140 1080 Z" fill="#0A0E18"/>')
    return svg(b, defs)


def scene_tablet():  # mobile/tablet — pracownik z tabletem w magazynie
    defs = (lin("whs", [(0, "#0C111E"), (0.7, "#182238"), (1, "#0E1523")])
            + rad("tgl", [(0, "#BFE0FF", 0.85), (0.35, "#7FB4E8", 0.35), (1, "#7FB4E8", 0)])
            + lin("floor", [(0, "#1B2437"), (1, "#0A0E18")]))
    b = f'<rect width="{W}" height="{H}" fill="url(#whs)"/>'
    b += f'<rect y="820" width="{W}" height="{H - 820}" fill="url(#floor)"/>'
    # perspektywa podłogi
    for i in range(7):
        x = 240 + i * 240
        b += f'<line x1="{x}" y1="1080" x2="960" y2="800" stroke="#26314B" stroke-width="2" opacity="0.5"/>'
    # regały po bokach (perspektywicznie)
    for side in (-1, 1):
        for k in range(3):
            x0 = 960 + side * (330 + k * 330)
            w_ = 240 - k * 40
            hgt = 520 - k * 90
            x = x0 - w_ // 2
            b += f'<rect x="{x}" y="{820 - hgt}" width="{w_}" height="{hgt}" fill="{SIL2 if k else SIL}"/>'
            for r_ in range(3):
                b += f'<rect x="{x + 14}" y="{820 - hgt + 60 + r_ * (hgt // 3 - 20)}" width="{w_ - 28}" height="10" fill="#26314B"/>'
    # lampy
    for x in range(420, 1600, 280):
        b += (f'<rect x="{x - 44}" y="120" width="88" height="14" rx="7" fill="{SIL}"/>'
              f'<ellipse cx="{x}" cy="140" rx="70" ry="16" fill="#BFE0FF" opacity="0.12"/>')
    # pracownik z tabletem (świecący ekran)
    cx, base = 960, 1020
    b += f'<ellipse cx="{cx}" cy="770" rx="210" ry="150" fill="url(#tgl)"/>'
    b += f'<circle cx="{cx}" cy="{base - 250}" r="34" fill="{SIL}"/>'
    b += (f'<path d="M{cx - 62} {base} L{cx - 52} {base - 120} L{cx - 58} {base - 196} '
          f'Q{cx} {base - 222} {cx + 58} {base - 196} L{cx + 52} {base - 120} L{cx + 62} {base} '
          f'L{cx + 26} {base} L{cx + 16} {base - 84} L{cx - 16} {base - 84} L{cx - 26} {base} Z" fill="{SIL}"/>')
    b += (f'<path d="M{cx - 56} {base - 186} q-30 26 -22 62 l44 26 Z" fill="{SIL}"/>'
          f'<path d="M{cx + 56} {base - 186} q30 26 22 62 l-44 26 Z" fill="{SIL}"/>')
    b += (f'<rect x="{cx - 68}" y="{base - 132}" width="136" height="92" rx="10" fill="#0E1523" stroke="#3B4763" stroke-width="4"/>'
          f'<rect x="{cx - 58}" y="{base - 122}" width="116" height="72" rx="6" fill="#BFE0FF" opacity="0.92"/>')
    return svg(b, defs)


def scene_terminal():  # systemy dedykowane / case PCC — terminal intermodalny o świcie
    defs = (lin("tsky", [(0, "#0B1026"), (0.5, "#27355C"), (0.8, "#8A5A3C"), (0.95, "#F2A65A")])
            + rad("tsun", [(0, "#FFE0AC", 0.95), (0.45, "#F2A65A", 0.45), (1, "#F2A65A", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#tsky)"/>'
    b += f'<ellipse cx="620" cy="880" rx="480" ry="220" fill="url(#tsun)"/>'
    b += stars(50, 0, 340)
    b += f'<rect y="880" width="{W}" height="{H - 880}" fill="{SIL}"/>'
    # suwnice bramowe (2)
    for gx, s in ((430, 1.0), (1210, 1.32)):
        gw, gh = int(360 * s), int(330 * s)
        top = 880 - gh
        b += (f'<rect x="{gx}" y="{top}" width="{int(22 * s)}" height="{gh}" fill="{SIL}"/>'
              f'<rect x="{gx + gw}" y="{top}" width="{int(22 * s)}" height="{gh}" fill="{SIL}"/>'
              f'<rect x="{gx - int(40 * s)}" y="{top}" width="{gw + int(102 * s)}" height="{int(26 * s)}" fill="{SIL}"/>'
              f'<rect x="{gx + gw // 2 - int(8 * s)}" y="{top + int(26 * s)}" width="{int(16 * s)}" height="{int(70 * s)}" fill="{SIL}"/>'
              f'<rect x="{gx + gw // 2 - int(34 * s)}" y="{top + int(96 * s)}" width="{int(68 * s)}" height="{int(30 * s)}" fill="{SIL}"/>')
    # stosy kontenerów (sylwetki + 2 kolorowe akcenty)
    import itertools
    stacks = [(160, 3), (300, 4), (760, 2), (900, 5), (1040, 3), (1620, 4), (1760, 2)]
    ci = 0
    for x, n in stacks:
        for k in range(n):
            fill = SIL
            if (x + k) % 7 == 2 and ci < 3:
                fill = ["#B4552F", "#39547A", "#B4552F"][ci]; ci += 1
            b += f'<rect x="{x}" y="{880 - 64 * (k + 1)}" width="128" height="58" rx="4" fill="{fill}"/>'
    # pociąg na pierwszym planie
    b += f'<rect y="1006" width="{W}" height="8" fill="#1B2437"/>'
    for i in range(6):
        x = 60 + i * 320
        b += (f'<rect x="{x}" y="930" width="290" height="70" rx="8" fill="{SIL2}"/>'
              f'<circle cx="{x + 60}" cy="1010" r="22" fill="{SIL}"/><circle cx="{x + 230}" cy="1010" r="22" fill="{SIL}"/>')
    return svg(b, defs)


def scene_web():  # aplikacje webowe — wieczorne biuro, człowiek przy ekranach
    defs = (lin("osky", [(0, "#101828"), (1, "#1A2438")])
            + rad("mgl", [(0, "#BFE0FF", 0.7), (0.5, "#7FB4E8", 0.22), (1, "#7FB4E8", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#osky)"/>'
    # okno z miastem
    b += f'<rect x="1180" y="120" width="620" height="700" rx="16" fill="#0C1322"/>'
    for gx in range(1220, 1770, 90):
        hgt = 200 + (gx * 7) % 260
        b += f'<rect x="{gx}" y="{820 - hgt}" width="52" height="{hgt}" fill="#131B2E"/>'
        v = gx
        for _ in range(9):
            v = (v * 48271) % 2147483647
            wx = gx + 6 + v % 38
            v = (v * 48271) % 2147483647
            wy = 820 - hgt + 14 + v % max(1, hgt - 30)
            b += f'<rect x="{wx}" y="{wy}" width="7" height="9" fill="#F2C879" opacity="0.75"/>'
    # biurko + ekrany
    b += f'<rect x="180" y="760" width="900" height="26" rx="12" fill="{SIL}"/>'
    b += f'<rect x="220" y="790" width="30" height="290" fill="{SIL2}"/><rect x="990" y="790" width="30" height="290" fill="{SIL2}"/>'
    b += f'<ellipse cx="600" cy="600" rx="400" ry="240" fill="url(#mgl)"/>'
    for mx, mw in ((260, 330), (620, 330)):
        b += (f'<rect x="{mx}" y="470" width="{mw}" height="220" rx="12" fill="#0E1523" stroke="#3B4763" stroke-width="5"/>'
              f'<rect x="{mx + 12}" y="482" width="{mw - 24}" height="196" rx="6" fill="#9CC4EE" opacity="0.9"/>'
              f'<rect x="{mx + mw // 2 - 20}" y="690" width="40" height="46" fill="{SIL}"/>'
              f'<rect x="{mx + mw // 2 - 70}" y="736" width="140" height="14" rx="7" fill="{SIL}"/>')
    # osoba (tył głowy przy biurku)
    b += f'<circle cx="470" cy="620" r="46" fill="{SIL}"/>'
    b += f'<path d="M370 786 Q380 668 470 668 Q560 668 570 786 Z" fill="{SIL}"/>'
    # roślina
    b += ('<path d="M1090 700 q-8 -90 40 -140 M1090 700 q10 -70 -30 -120 M1090 700 q30 -50 10 -110" '
          f'stroke="#2F4A3C" stroke-width="10" fill="none" stroke-linecap="round"/>'
          f'<rect x="1058" y="700" width="66" height="80" rx="10" fill="{SIL2}"/>')
    return svg(b, defs)


def scene_maintenance():  # utrzymanie — inżynier z czołówką przy maszynie
    defs = (lin("msky", [(0, "#0C0F1A"), (1, "#161B2A")])
            + rad("beam", [(0, "#FFE9B8", 0.85), (0.45, "#F2C879", 0.3), (1, "#F2C879", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#msky)"/>'
    # wielka maszyna / przekładnia
    b += f'<rect x="1050" y="240" width="720" height="840" rx="26" fill="{SIL2}"/>'
    import math
    for cx, cy, r0, teeth in ((1420, 560, 190, 12), (1660, 830, 120, 9)):
        pts = []
        for i in range(teeth * 2):
            a = i / (teeth * 2) * 2 * math.pi
            rr = r0 if i % 2 == 0 else r0 * 0.82
            pts.append(f"{cx + math.cos(a) * rr:.0f},{cy + math.sin(a) * rr:.0f}")
        b += f'<polygon points="{" ".join(pts)}" fill="{SIL}"/>'
        b += f'<circle cx="{cx}" cy="{cy}" r="{r0 * 0.4:.0f}" fill="{SIL2}"/>'
    # promień czołówki
    b += f'<path d="M700 470 L1240 380 L1240 660 Z" fill="url(#beam)" opacity="0.9"/>'
    b += f'<ellipse cx="1240" cy="520" rx="220" ry="180" fill="url(#beam)" opacity="0.5"/>'
    # inżynier
    cx, base = 660, 1080
    b += f'<circle cx="{cx + 12}" cy="{base - 580}" r="40" fill="{SIL}"/>'
    b += f'<rect x="{cx + 26}" y="{base - 600}" width="34" height="18" rx="8" fill="#F2C879"/>'
    b += (f'<path d="M{cx - 70} {base} L{cx - 56} {base - 300} L{cx - 64} {base - 470} '
          f'Q{cx} {base - 540} {cx + 74} {base - 470} L{cx + 90} {base - 380} '
          f'L{cx + 150} {base - 420} L{cx + 162} {base - 396} L{cx + 96} {base - 330} '
          f'L{cx + 66} {base - 300} L{cx + 80} {base} L{cx + 22} {base} L{cx + 8} {base - 210} '
          f'L{cx - 14} {base - 210} L{cx - 22} {base} Z" fill="{SIL}"/>')
    # iskry
    for sx, sy in ((1240, 640), (1300, 600), (1210, 700)):
        b += f'<circle cx="{sx}" cy="{sy}" r="4" fill="#FFD9A0"/><circle cx="{sx + 16}" cy="{sy + 14}" r="2.4" fill="#FFD9A0" opacity="0.7"/>'
    return svg(b, defs)


def scene_infra():  # infrastruktura — korytarz serwerowni
    defs = (lin("ssky", [(0, "#0A0F1C"), (1, "#131A2C")])
            + rad("doorg", [(0, "#BFE0FF", 0.8), (1, "#7FB4E8", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#ssky)"/>'
    b += f'<rect x="880" y="330" width="160" height="420" fill="url(#doorg)"/>'
    b += f'<rect x="905" y="360" width="110" height="390" fill="#DCEBFA" opacity="0.85"/>'
    # perspektywiczne racki
    for side in (-1, 1):
        for k in range(4):
            depth = k / 4
            x0 = 960 + side * (200 + k * 300 + 140 * (1 - depth))
            w_ = 260 - k * 45
            hgt = 760 - k * 150
            top = 540 - hgt // 2 + 120
            x = x0 - w_ // 2 if side < 0 else x0 - w_ // 2
            b += f'<rect x="{x:.0f}" y="{top}" width="{w_}" height="{hgt}" rx="8" fill="{SIL if k < 2 else SIL2}"/>'
            v = int(abs(x0))
            for r_ in range(int(hgt // 46)):
                yy = top + 20 + r_ * 46
                v = (v * 48271) % 2147483647
                col = "#57D0A5" if v % 5 else "#F2A65A"
                b += (f'<rect x="{x + 16:.0f}" y="{yy}" width="{w_ - 32}" height="8" rx="4" fill="#232B40"/>'
                      f'<circle cx="{x + w_ - 30:.0f}" cy="{yy + 4}" r="4.5" fill="{col}" opacity="0.9"/>')
    # podłoga z odbiciem
    b += f'<rect y="920" width="{W}" height="{H - 920}" fill="#0A0F1C"/>'
    b += f'<rect x="880" y="920" width="160" height="130" fill="#7FB4E8" opacity="0.12"/>'
    return svg(b, defs)


def scene_www():  # strony internetowe — billboard-ekran nad sylwetką
    defs = (lin("wsky", [(0, "#101426"), (0.7, "#232048"), (1, "#3A2A55")])
            + rad("wgl", [(0, "#FF9E80", 0.5), (1, "#FF9E80", 0)])
            + lin("scr", [(0, "#FFD1B0"), (0.5, "#FF9E80"), (1, "#B libera")]))
    defs = defs.replace("#B libera", "#B9A8FF")  # gradient ekranu
    b = f'<rect width="{W}" height="{H}" fill="url(#wsky)"/>'
    b += stars(90, 0, 700)
    b += f'<ellipse cx="960" cy="470" rx="640" ry="360" fill="url(#wgl)"/>'
    # wielki „ekran” strony
    b += (f'<g transform="rotate(-4 960 430)">'
          f'<rect x="520" y="200" width="880" height="500" rx="26" fill="#0E1523" stroke="#4A4370" stroke-width="6"/>'
          f'<rect x="548" y="252" width="824" height="420" rx="14" fill="url(#scr)"/>'
          f'<circle cx="566" cy="227" r="7" fill="#FF7A6B"/><circle cx="592" cy="227" r="7" fill="#F2C879"/><circle cx="618" cy="227" r="7" fill="#57D0A5"/>'
          f'<rect x="600" y="320" width="420" height="44" rx="12" fill="#141B2C" opacity="0.85"/>'
          f'<rect x="600" y="392" width="300" height="20" rx="10" fill="#141B2C" opacity="0.6"/>'
          f'<rect x="600" y="560" width="170" height="52" rx="26" fill="#141B2C"/>'
          f'</g>')
    # sylwetki patrzące
    b += f'<rect y="960" width="{W}" height="{H - 960}" fill="{SIL}"/>'
    b += person(760, 968, 1.7)
    b += person(1140, 970, 1.45)
    return svg(b, defs)


def scene_case_turbine():  # case APT/Chordata — farma + fala akustyczna
    defs = (lin("csky", [(0, "#0A1026"), (0.55, "#233457"), (0.85, "#61455F"), (1, "#8A5470")])
            + rad("cmoon", [(0, "#EAF2FF", 0.95), (0.5, "#BFD5F5", 0.3), (1, "#BFD5F5", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#csky)"/>'
    b += f'<circle cx="1560" cy="260" r="86" fill="#EAF2FF"/>'
    b += f'<ellipse cx="1560" cy="260" rx="260" ry="240" fill="url(#cmoon)"/>'
    b += stars(110, 0, 640)
    b += f'<rect y="920" width="{W}" height="{H - 920}" fill="{SIL}"/>'
    b += turbine_sil(300, 925, 320, 0.75, rot=30, fill=SIL2)
    b += turbine_sil(1680, 925, 280, 0.66, rot=70, fill=SIL2)
    b += turbine_sil(880, 960, 520, 1.35, rot=100, light=True)
    # fala akustyczna z gondoli
    for rr, op in ((120, 0.65), (190, 0.42), (270, 0.25), (360, 0.14)):
        b += f'<path d="M{880 + 40} {960 - 520 - rr * 0.55:.0f} a {rr} {rr} 0 0 1 0 {rr * 1.1:.0f}" fill="none" stroke="#57D0A5" stroke-width="5" opacity="{op}"/>'
    return svg(b, defs)


def scene_hero():  # panorama domen: terminal + turbiny + horyzont danych
    defs = (lin("hsky", [(0, "#0A1026"), (0.42, "#1D2C52"), (0.72, "#7A4A38"), (0.9, "#E8934C")])
            + rad("hsun", [(0, "#FFE0AC", 0.95), (0.45, "#F2A65A", 0.5), (1, "#F2A65A", 0)]))
    b = f'<rect width="{W}" height="{H}" fill="url(#hsky)"/>'
    b += f'<ellipse cx="960" cy="900" rx="640" ry="260" fill="url(#hsun)"/>'
    b += stars(90, 0, 420)
    b += f'<rect y="905" width="{W}" height="{H - 905}" fill="{SIL}"/>'
    # lewa: suwnica + kontenery
    b += (f'<rect x="150" y="580" width="18" height="325" fill="{SIL}"/><rect x="470" y="580" width="18" height="325" fill="{SIL}"/>'
          f'<rect x="110" y="558" width="420" height="24" fill="{SIL}"/>'
          f'<rect x="300" y="582" width="12" height="60" fill="{SIL}"/><rect x="276" y="640" width="60" height="26" fill="{SIL}"/>')
    for x, n in ((90, 3), (230, 2), (560, 4)):
        for k in range(n):
            b += f'<rect x="{x}" y="{905 - 56 * (k + 1)}" width="112" height="50" rx="4" fill="{SIL2 if k % 2 else SIL}"/>'
    # prawa: turbiny
    b += turbine_sil(1420, 908, 420, 1.05, rot=95, light=True)
    b += turbine_sil(1700, 908, 300, 0.72, rot=35, fill=SIL2)
    # horyzont danych — delikatna fala świetlna
    b += ('<path d="M0 760 Q240 700 480 748 T960 736 T1440 752 T1920 726" fill="none" stroke="#57D0A5" stroke-width="3.2" opacity="0.6"/>'
          '<path d="M0 800 Q240 760 480 792 T960 780 T1440 796 T1920 772" fill="none" stroke="#F2C879" stroke-width="2.2" opacity="0.45"/>')
    return svg(b, defs)


FILES = {
    "scene-hero.svg": scene_hero,
    "scene-01.svg": scene_terminal,     # systemy dedykowane
    "scene-02.svg": scene_web,          # aplikacje webowe
    "scene-03.svg": scene_tablet,       # mobile / tablet
    "scene-04.svg": scene_maintenance,  # utrzymanie i rozwój
    "scene-05.svg": scene_ai,           # wdrożenia AI
    "scene-06.svg": scene_turbine,      # monitoring / IoT — technik na gondoli
    "scene-07.svg": scene_infra,        # infrastruktura
    "scene-08.svg": scene_www,          # strony internetowe
    "scene-case-01.svg": scene_terminal,
    "scene-case-02.svg": scene_case_turbine,
}


def main():
    for name, fn in FILES.items():
        (OUT / name).write_text(fn(), encoding="utf-8", newline="\n")
    print(f"OK: {len(FILES)} scen -> {OUT}")


if __name__ == "__main__":
    main()
