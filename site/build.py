#!/usr/bin/env python3
"""Generator statyczny vistechnologie.pl (stdlib). Uruchomienie: python site/build.py
Renderuje strony z site/content.json + kopiuje site/static/ -> dist/, potem uruchamia checker."""
import json
import re
import shutil
import sys
from html import escape
from pathlib import Path

from icons import write_icons

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DIST = ROOT / "dist"
C = json.loads((SITE / "content.json").read_text(encoding="utf-8"))

DOMAIN = "https://vistechnologie.pl"
FORM_ACTION = "/kontakt/wyslij.php"

# Tryb podglądu (--base /prefiks): serwis hostowany spod podścieżki (np. GitHub Pages).
# Pusty BASE = produkcja (root domeny) — postprocess() jest wtedy no-opem.
BASE = ""
PREVIEW_NOTE = {
    "pl": "Wersja podglądowa strony — formularz kontaktowy jest tu nieaktywny. Napisz bezpośrednio na biuro@vistechnologie.pl.",
    "en": "Preview version — the contact form is inactive here. Write to us directly at biuro@vistechnologie.pl.",
}

# klucz, ścieżka PL, ścieżka EN
PAGES = [
    ("home", "/", "/en/"),
    ("services", "/uslugi/", "/en/services/"),
    ("cases", "/realizacje/", "/en/case-studies/"),
    ("contact", "/kontakt/", "/en/contact/"),
    ("thanks", "/kontakt/dziekujemy/", "/en/contact/thank-you/"),
    ("legal", "/polityka-prywatnosci/", "/en/privacy-policy/"),
    ("crane", "/monitoring-suwnic/", "/en/crane-monitoring/"),
    ("localcontent", "/local-content/", "/en/local-content/"),
    ("meeting", "/umow-spotkanie/", "/en/book-a-meeting/"),
    ("pilot", "/pilotaz-monitoringu/", "/en/crane-monitoring-pilot/"),
]
NOINDEX = {"thanks", "notfound"}
PATHS = {
    "pl": {k: pl for k, pl, _ in PAGES},
    "en": {k: en for k, _, en in PAGES},
}
LOCALE = {"pl": "pl_PL", "en": "en_US"}


def e(s):
    return escape(str(s), quote=True)


# ---------- szkielet strony ----------

def head(lang, key, path, other_path):
    m = C[lang]["site"]["meta"][key]
    other = "en" if lang == "pl" else "pl"
    xdef = path if lang == "pl" else other_path
    robots = '<meta name="robots" content="noindex,nofollow">\n' if key in NOINDEX else ""
    canonical = "" if key == "notfound" else (
        f'<link rel="canonical" href="{DOMAIN}{path}">\n'
        f'<link rel="alternate" hreflang="{lang}" href="{DOMAIN}{path}">\n'
        f'<link rel="alternate" hreflang="{other}" href="{DOMAIN}{other_path}">\n'
        f'<link rel="alternate" hreflang="x-default" href="{DOMAIN}{xdef}">\n'
    )
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(m["title"])}</title>
<meta name="description" content="{e(m["desc"])}">
{robots}{canonical}<meta property="og:title" content="{e(m["title"])}">
<meta property="og:description" content="{e(m["desc"])}">
<meta property="og:type" content="website">
<meta property="og:url" content="{DOMAIN}{path}">
<meta property="og:locale" content="{LOCALE[lang]}">
<meta property="og:image" content="{DOMAIN}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#0E0E0E" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F2F0E9" media="(prefers-color-scheme: light)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script>(function(){{try{{var t=localStorage.getItem("vt_theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}}catch(e){{}}}})();</script>
<link rel="stylesheet" href="/assets/styles.css">
</head>
"""


def nav(lang, active, pl_path, en_path):
    c = C[lang]
    n, s = c["nav"], c["site"]
    p = PATHS[lang]
    home = p["home"]
    about_href = home + ("#o-nas" if lang == "pl" else "#about")

    def link(k, label):
        on = ' class="on"' if active == k else ""
        return f'<a href="{p[k]}"{on}>{e(label)}</a>'

    pl_on = ' class="on"' if lang == "pl" else ""
    en_on = ' class="on"' if lang == "en" else ""
    return f"""<nav class="dx-nav">
<div class="dx-nav-inner">
<a class="dx-logo" href="{home}"><span class="dx-logo-mark"></span><span>vistechnologie</span></a>
<button class="dx-nav-toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="{e(s["menuLabel"])}"><span></span><span></span><span></span></button>
<div class="dx-nav-links" id="menu">
{link("services", n["services"])}
{link("crane", n["crane"])}
{link("localcontent", n["localcontent"])}
{link("cases", n["work"])}
<a href="{about_href}">{e(n["about"])}</a>
{link("contact", n["contact"])}
</div>
<div class="dx-nav-side">
<div class="dx-lang"><a{pl_on} href="{pl_path}" hreflang="pl">PL</a><span>/</span><a{en_on} href="{en_path}" hreflang="en">EN</a></div>
<a class="dx-cta" href="{p["contact"]}">{e(c["cta"])} →</a>
</div>
</div>
</nav>
"""


def cookie_note(lang):
    c = C[lang]["cookieNote"]
    legal = PATHS[lang]["legal"]
    return f"""<div class="dx-cookie-note" hidden>
<p>{e(c["text"])} <a href="{legal}#cookies">{e(c["link"])}</a></p>
<button type="button" class="dx-btn dx-btn-dark">{e(c["btn"])}</button>
</div>
"""


def footer(lang):
    c = C[lang]
    f, n = c["footer"], c["nav"]
    p = PATHS[lang]
    about_href = p["home"] + ("#o-nas" if lang == "pl" else "#about")
    services_links = "\n".join(
        f'<li><a href="{p["services"]}">{e(s["title"])}</a></li>'
        for s in c["services"]["items"][:4]
    )
    studio = e(f["studioLines"]).replace("\n", "<br>")
    return f"""<footer class="dx-footer">
<div class="dx-footer-inner">
<div class="dx-footer-mark">vistechnologie</div>
<div class="dx-footer-grid">
<div><h5>{e(f["studioH"])}</h5><p class="dx-footer-studio">{studio}</p><p class="dx-footer-reg">{e(f["reg"])}</p></div>
<div><h5>{e(n["services"])}</h5><ul>
{services_links}
</ul></div>
<div><h5>{e(f["companyH"])}</h5><ul>
<li><a href="{about_href}">{e(n["about"])}</a></li>
<li><a href="{p["cases"]}">{e(n["work"])}</a></li>
<li><a href="{p["contact"]}">{e(n["contact"])}</a></li>
</ul></div>
<div><h5>{e(f["legalH"])}</h5><ul>
<li><a href="{p["legal"]}">{e(f["privacyLink"])}</a></li>
<li><a href="{p["legal"]}#cookies">{e(f["cookiesLink"])}</a></li>
</ul></div>
</div>
<div class="dx-footer-tail"><span>{e(f["rights"])}</span><span>{e(f["made"])}</span></div>
</div>
</footer>
"""


def layout(lang, key, body):
    p = PATHS[lang]
    path = p[key]
    other = PATHS["en" if lang == "pl" else "pl"][key]
    pl_path = PATHS["pl"][key]
    en_path = PATHS["en"][key]
    s = C[lang]["site"]
    main_id = "tresc" if lang == "pl" else "content"
    return (head(lang, key, path, other)
            + f'<body class="dx">\n<a class="skip-link" href="#{main_id}">{e(s["skip"])}</a>\n'
            + nav(lang, key, pl_path, en_path)
            + f'<main id="{main_id}">\n{body}</main>\n'
            + (f'<a class="kn-fab" href="{p["contact"]}">{e(s["fab"])} \u2192</a>' if key not in ("contact", "thanks", "notfound") else "")
            + cookie_note(lang)
            + footer(lang)
            + '<script src="/assets/site.js"></script>\n</body>\n</html>\n')


# ---------- sekcje strony głównej ----------

def sec_hero(lang):
    c = C[lang]
    h = c["hero"]
    p = PATHS[lang]
    rot_words = {
        "pl": ("Wdrażamy AI, które", ["czyta dokumenty przewozowe", "słyszy zużycie turbin, zanim stanie farma",
                                      "pilnuje operacji terminala 24/7", "uczy się procesów Twojej firmy"]),
        "en": ("We deploy AI that", ["reads freight documents", "hears turbine wear before downtime",
                                     "watches terminal operations 24/7", "learns your company's processes"]),
    }[lang]
    words_attr = e(json.dumps(rot_words[1], ensure_ascii=False))
    sr_all = e(rot_words[0] + " " + "; ".join(rot_words[1]) + ".")
    rotator = (f'<p class="kn-rotator"><span class="sr-only">{sr_all}</span>'
               f'<span aria-hidden="true"><span>{e(rot_words[0])}</span> '
               f'<strong class="kino-rot-word" data-rotate="{words_attr}">{e(rot_words[1][0])}</strong>'
               f'<span class="kino-caret"></span></span></p>')
    pre_words = h["pre"].strip().split()
    cut = max(1, len(pre_words) // 2)
    l1 = " ".join(pre_words[:cut])
    l2 = " ".join(pre_words[cut:])
    l3a, l3b = h["em"], h["post"].strip()
    return f"""<section class="dx-hero kn-hero">
<h1 class="kn-h1">
<span class="kn-line" data-k="0.22">{e(l1)}</span>
<span class="kn-line kn-outline" data-k="-0.3">{e(l2)}</span>
<span class="kn-line" data-k="0.16"><em>{e(l3a)}</em> {e(l3b)}</span>
</h1>
<p class="kn-sub">{e(h["sub"])}</p>
{rotator}
<div class="dx-hero-actions">
<a class="dx-btn dx-btn-primary" href="{p["contact"]}">{e(h["ctaPrimary"])} →</a>
<a class="dx-link-quiet" href="{p["cases"]}">{e(h["ctaSecondary"])} →</a>
</div>
</section>
"""


def sec_band(lang):
    items = {
        "pl": ["12 lat jednego systemu w produkcji", "AI, które słyszy usterki turbin", "MVP w 8–12 tygodni", "systemy mission-critical 24/7"],
        "en": ["12 years of one system in production", "AI that hears turbine faults", "MVP in 8–12 weeks", "mission-critical systems 24/7"],
    }[lang]
    seq = "".join(f"<span>{e(x)}</span><span>—</span>" for x in items)
    seq2 = "".join(f'<span aria-hidden="true">{e(x)}</span><span aria-hidden="true">—</span>' for x in items)
    return f'<div class="kn-band"><div class="kn-band-track">{seq}{seq2}</div></div>' + chr(10)


def sec_partners(lang):
    c = C[lang]["partners"]
    names = "".join(f"<span>{e(n)}</span>" for n in c["names"])
    names_dup = "".join(f'<span aria-hidden="true">{e(n)}</span>' for n in c["names"])
    return f"""<section class="dx-logos">
<div class="dx-logos-inner">
<div class="dx-logos-eyebrow">{e(c["title"])}</div>
<div class="dx-logos-row"><div class="dx-logos-track">{names}{names_dup}</div></div>
<p class="dx-partners-note">{e(c["note"])}</p>
</div>
</section>
"""


def _feature(lang, it, i, eyebrow, btn_label, btn_href):
    return f"""<a class="kn-row" href="{btn_href}" data-reveal>
<i>{e(it["num"])}</i>
<div class="kn-row-main"><h3>{e(it["title"])}</h3><p>{e(it["desc"])}</p><span class="kn-row-for">{e(it["forWho"])}</span></div>
<span class="kn-row-arw" aria-hidden="true">→</span>
</a>
"""


def sec_features(lang):
    c = C[lang]
    p = PATHS[lang]
    hint = "Usługi" if lang == "pl" else "Services"
    rows = "".join(
        _feature(lang, it, i, "", "", p["services"])
        for i, it in enumerate(c["services"]["items"])
    )
    return (f'<section class="kn-services" data-zone="paper"><div class="kn-services-inner">'
            f'<p class="kn-hint">{e(hint)}</p><div class="kn-rows">{rows}</div></div></section>' + chr(10))


def sec_pull(lang):
    c = C[lang]["pull"]
    return f"""<section class="dx-pull">
<div class="dx-pull-inner" data-reveal>
<h2>{e(c["text"])}<em>{e(c["em"])}</em></h2>
<div class="dx-pull-attr">{e(c["attr"])}</div>
</div>
</section>
"""


def sec_stats(lang):
    c = C[lang]["stats"]
    tints = ["tint-yellow", "tint-blue", "tint-pink", ""]

    def big(txt):
        m = re.match(r"^(\D*?)(\d+)(\D.*|$)", txt)
        if not m:
            return e(txt)
        pre, num, post = m.groups()
        return f'{e(pre)}<span data-count="{num}">0</span>{e(post)}'

    cards = "".join(
        f'<div class="dx-ribbon-card {tints[i]}" data-reveal><div class="dx-ribbon-num dx-ribbon-num-text">{big(s["big"])}</div><div class="dx-ribbon-label">{e(s["label"])}</div></div>'
        for i, s in enumerate(c["items"])
    )
    return f"""<section class="dx-ribbon" data-zone="warm">
<div class="dx-ribbon-inner">
<div style="margin-bottom:48px;max-width:26ch">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
</div>
<div class="dx-ribbon-grid">{cards}</div>
</div>
</section>
"""


def sec_process(lang):
    c = C[lang]["process"]
    tints = ["", "tint-yellow", "tint-blue", "featured", "tint-pink"]
    cards = "".join(
        f'<div class="dx-proc-card {tints[i]}" data-reveal><div class="dx-proc-num">{e(s["num"])}</div><div class="dx-proc-name">{e(s["t"])}</div><div class="dx-proc-desc">{e(s["d"])}</div><div class="dx-proc-dur">{e(s["dur"])}</div></div>'
        for i, s in enumerate(c["steps"])
    )
    return f"""<section class="dx-plans">
<div class="dx-plans-inner">
<div class="dx-plans-head">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
<p class="dx-body">{e(c["sub"])}</p>
</div>
<div class="dx-proc-grid">{cards}</div>
<div class="dx-billing"><h3>{e(c["billingTitle"])}</h3><p>{e(c["billing"])}</p></div>
</div>
</section>
"""


def sec_about(lang):
    c = C[lang]["about"]
    sid = "o-nas" if lang == "pl" else "about"
    paras = "".join(f"<p>{e(p)}</p>" for p in c["paras"])
    def _initials(name):
        parts = [w for w in name.split() if w]
        return "".join(w[0] for w in parts[:2]).upper()

    founders = "".join(
        f'<div class="dx-founder" data-reveal><div class="dx-founder-photo kn-mono" aria-hidden="true">'
        f'<span>{e(_initials(f["name"]))}</span></div>'
        f'<div class="dx-founder-name">{e(f["name"])}</div><div class="dx-founder-role">{e(f["role"])}</div>'
        + (f'<p class="dx-founder-note">{e(f["note"])}</p>' if f["note"] else "")
        + "</div>"
        for i, f in enumerate(c["founders"])
    )
    return f"""<section class="dx-about" id="{sid}" data-zone="cool">
<div class="dx-about-inner">
<div class="dx-about-head">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
</div>
<div class="dx-about-cols">
<div class="dx-about-text">{paras}</div>
<aside class="dx-about-aside">
<div class="dx-about-mission"><span class="dx-eyebrow">{e(c["missionLabel"])}</span><p>{e(c["mission"])}</p></div>
<p class="dx-about-team">{e(c["team"])}</p>
<p class="dx-about-loc">{e(c["location"])}</p>
</aside>
</div>
<span class="dx-eyebrow" style="display:block;margin-bottom:20px">{e(c["foundersLabel"])}</span>
<div class="dx-founders">{founders}</div>
<p class="dx-about-lead-note">{e(c["leadNote"])}</p>
</div>
</section>
"""


def sec_close(lang):
    c = C[lang]["close"]
    p = PATHS[lang]
    return f"""<section class="dx-close">
<div class="dx-close-inner" data-reveal>
<h2>{e(c["title"])}</h2>
<p>{e(c["sub"])}</p>
<a class="dx-btn dx-btn-yellow" href="{p["contact"]}">{e(c["cta"])} →</a>
</div>
</section>
"""


def page_head_block(bg, eyebrow, title, sub=None):
    cls = {"blue": "", "yellow": " bg-yellow", "pink": " bg-pink"}[bg]
    sub_html = f"<p>{e(sub)}</p>" if sub else ""
    return f"""<section class="dx-page-head{cls}">
<div class="dx-page-head-inner">
<span class="dx-hero-eyebrow">{e(eyebrow)}</span>
<h1 class="dx-display">{e(title)}</h1>
{sub_html}</div>
</section>
"""


# ---------- strony ----------

def sec_partners_kn(lang):
    pr = C[lang]["partners"]
    cards = []
    for it in pr["items"]:
        cards.append(
            f'<div class="kn-part" data-reveal>'
            + f'<b>{e(it["name"])}</b>'
            + (f'<span>{e(it["full"])}</span>' if it.get("full") else "")
            + f'<span class="kn-part-role">{e(it["role"])}</span>'
            + f'<p>{e(it["desc"])}</p>'
            + '</div>'
        )
    intro = f'<p class="kn-part-sub">{e(pr["sub"])}</p>' if pr.get("sub") else ""
    return f"""<section class="kn-partners" data-zone="paper">
<div class="kn-partners-inner">
<p class="kn-hint">{e(pr["title"])}</p>{intro}
<div class="kn-part-grid">{"".join(cards)}</div>
</div>
</section>
"""


def sec_cases_home(lang):
    c = C[lang]["workPage"]
    p = PATHS[lang]
    fx = {
        "pl": ["SYSTEM OD 12 LAT", "AI SŁYSZY TURBINY"],
        "en": ["RUNNING FOR 12 YEARS", "AI HEARS TURBINES"],
    }[lang]
    link_t = "Pełne studium przypadku" if lang == "pl" else "Full case study"
    rows = []
    for i, w in enumerate(c["cases"]):
        eff = " · ".join(x.split(" — ")[0] for x in w["effects"]["items"][:2])
        txt = (f'<div class="kn-case-txt"><div><p class="kn-hint">{e(w["tag"])}</p>'
               f'<h3>{e(w["title"])}</h3></div>'
               f'<div class="kn-case-side"><p class="kn-case-p">{e(w["challenge"]["ps"][0])}</p>'
               f'<p class="kn-case-eff">{e(eff)}</p>'
               f'<a class="dx-link-quiet" href="{p["cases"]}">{link_t} →</a></div></div>')
        half = f'<span>{e(fx[i])}</span><span>{e(fx[i])}</span>'
        rev = " rev" if i % 2 else ""
        strip = (f'<div class="kn-fx-strip"><div class="kn-fx{rev}" aria-hidden="true">'
                 f'{half}{half}</div></div>')
        rows.append(f'<div class="kn-case" data-reveal>{strip}{txt}</div>')
    return f'<section class="kn-cases" data-zone="paper"><div class="kn-cases-inner">{"".join(rows)}</div></section>' + chr(10)


def sec_ai_demo(lang):
    """Żywy dowód AI: symulacja detekcji anomalii akustycznej (canvas w site.js)."""
    t = {
        "pl": {
            "eyebrow": "AI w praktyce", "title": "Nasze modele słuchają maszyn.",
            "sub": "Fragment na żywo: tak algorytm wychwytuje anomalię akustyczną w pracy turbiny — zanim zauważy ją SCADA.",
            "s0": "nasłuch sygnału…", "s1": "⚠ anomalia: łożysko główne · pewność 96%", "s2": "→ zlecenie serwisowe utworzone",
        },
        "en": {
            "eyebrow": "AI in practice", "title": "Our models listen to machines.",
            "sub": "Live fragment: this is how the algorithm catches an acoustic anomaly in a turbine — before SCADA notices.",
            "s0": "listening to the signal…", "s1": "⚠ anomaly: main bearing · confidence 96%", "s2": "→ service order created",
        },
    }[lang]
    return f"""<section class="kino-ai" data-zone="cool">
<div class="kino-ai-inner">
<div class="kino-ai-head" data-reveal>
<span class="dx-eyebrow">{e(t["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(t["title"])}</h2>
<p class="dx-body">{e(t["sub"])}</p>
</div>
<div class="kino-ai-demo" data-reveal data-s0="{e(t["s0"])}" data-s1="{e(t["s1"])}" data-s2="{e(t["s2"])}">
<canvas class="kino-ai-canvas" aria-hidden="true"></canvas>
<div class="kino-ai-chip" role="status">{e(t["s0"])}</div>
</div>
</div>
</section>
"""


def sec_tech_kn(lang):
    t = C[lang]["tech"]
    rows = "".join(
        f'<div class="kn-tech-row" data-reveal><span class="kn-tech-k">{e(g["k"])}</span>'
        f'<span class="kn-tech-v">{e(g["v"])}</span></div>'
        for g in t["groups"])
    return f"""<section class="kn-tech" data-zone="paper">
<div class="kn-tech-inner">
<p class="kn-hint">{e(t["title"])}</p>
<div class="kn-tech-grid">{rows}</div>
</div>
</section>
"""


def page_home(lang):
    return (sec_hero(lang) + sec_band(lang) + sec_stats(lang) + sec_partners_kn(lang) + sec_cases_home(lang) + sec_ai_demo(lang) + sec_pull(lang)
            + sec_features(lang) + sec_tech_kn(lang) + sec_process(lang) + sec_about(lang) + sec_close(lang))


def page_services(lang):
    c = C[lang]
    p = PATHS[lang]
    label = "Zapytaj" if lang == "pl" else "Inquire"
    rows = "".join(
        _feature(lang, it, i, it["num"], label, p["contact"])
        for i, it in enumerate(c["services"]["items"])
    )
    pills = "".join(f'<span class="dx-tech-pill">{e(t)}</span>' for t in c["tech"]["list"])
    return (page_head_block("blue", c["services"]["eyebrow"], c["services"]["title"])
            + f'<section class="dx-features"><div class="dx-features-inner">{rows}</div></section>\n'
            + f'<section class="dx-tech"><div class="dx-tech-inner" data-reveal><div class="dx-tech-row">{pills}</div>'
            + f'<p class="dx-tech-motto">{e(c["tech"]["motto"])}</p></div></section>\n'
            + sec_close(lang))


def _sim_tos(lang):
    L = {
        "pl": {"title": "VIS·TOS — operacje terminala", "live": "LIVE", "trains": "Pociągi",
               "yard": "Plac składowy", "kpi": ["kontenery / doba", "wagony w obsłudze", "faktury dziś"],
               "rows": [("TR-4102", "Gdańsk → Rotterdam", "rozładunek"), ("TR-4103", "Gdynia → Hamburg", "w drodze"),
                        ("TR-4099", "Duisburg → Warszawa", "załadunek"), ("TR-4104", "Antwerpia → Kutno", "planowanie"),
                        ("US-2201", "Chicago → Kansas City", "w drodze")],
               "log": "system: walidacja rozkładu masy OK · wagon 12 zatwierdzony"},
        "en": {"title": "VIS·TOS — terminal operations", "live": "LIVE", "trains": "Trains",
               "yard": "Container yard", "kpi": ["containers / day", "wagons in service", "invoices today"],
               "rows": [("TR-4102", "Gdańsk → Rotterdam", "unloading"), ("TR-4103", "Hamburg → Vienna", "en route"),
                        ("TR-4099", "Duisburg → Warsaw", "loading"), ("TR-4104", "Antwerp → Prague", "planning"),
                        ("US-2201", "Chicago → Kansas City", "en route")],
               "log": "system: mass distribution validated OK · wagon 12 approved"},
    }[lang]
    rows = "".join(
        f'<div class="sim-row"><b>{e(r[0])}</b><span>{e(r[1])}</span>'
        f'<i class="sim-chip s{n % 4}">{e(r[2])}</i></div>'
        for n, r in enumerate(L["rows"])
    )
    yard = "".join(f'<span class="y{(n * 7) % 5}"></span>' for n in range(60))
    kpi = "".join(
        f'<div class="sim-kpi"><b data-kpi="{v}">{v}</b><span>{e(k)}</span></div>'
        for k, v in zip(L["kpi"], (318, 47, 96))
    )
    return f"""<div class="sim" data-sim="tos" aria-hidden="true">
<div class="sim-bar"><span class="sd r"></span><span class="sd y"></span><span class="sd g"></span>
<span class="sim-title">{e(L["title"])}</span><span class="sim-live">● {e(L["live"])}</span></div>
<div class="sim-cols">
<div class="sim-panel"><h4>{e(L["trains"])}</h4>{rows}</div>
<div class="sim-panel"><h4>{e(L["yard"])}</h4><div class="sim-yard">{yard}</div></div>
<div class="sim-panel sim-kpis">{kpi}</div>
</div>
<div class="sim-log">{e(L["log"])}</div>
</div>
"""


def _sim_farm(lang):
    L = {
        "pl": {"title": "VIS·FARM — monitoring akustyczny", "live": "LIVE", "turb": "Turbiny",
               "sig": "Sygnał akustyczny — T-04", "alerts": "Zdarzenia",
               "a1": "nasłuch — wszystkie zespoły w normie", "ok": "norma", "warn": "anomalia"},
        "en": {"title": "VIS·FARM — acoustic monitoring", "live": "LIVE", "turb": "Turbines",
               "sig": "Acoustic signal — T-04", "alerts": "Events",
               "a1": "listening — all assemblies nominal", "ok": "nominal", "warn": "anomaly"},
    }[lang]
    turbs = "".join(
        f'<div class="sim-row sim-turb" data-t="{n}"><b>T-0{n + 1}</b><span>{12 + (n * 3) % 5}.{n * 2 % 9} rpm</span>'
        f'<i class="sim-chip s1">{e(L["ok"])}</i></div>'
        for n in range(5)
    )
    return f"""<div class="sim" data-sim="farm" aria-hidden="true"
 data-warn="{e(L["warn"])}" data-ok="{e(L["ok"])}">
<div class="sim-bar"><span class="sd r"></span><span class="sd y"></span><span class="sd g"></span>
<span class="sim-title">{e(L["title"])}</span><span class="sim-live">● {e(L["live"])}</span></div>
<div class="sim-cols">
<div class="sim-panel"><h4>{e(L["turb"])}</h4>{turbs}</div>
<div class="sim-panel sim-wave"><h4>{e(L["sig"])}</h4><canvas class="sim-canvas"></canvas></div>
<div class="sim-panel"><h4>{e(L["alerts"])}</h4><div class="sim-alerts"><div class="sim-al ok">{e(L["a1"])}</div></div></div>
</div>
</div>
"""


def page_cases(lang):
    c = C[lang]["workPage"]
    tints = ["tint-blue", "tint-yellow"]
    arts = []
    for i, w in enumerate(c["cases"]):
        did_items = ""
        if w["did"].get("items"):
            lis = "".join(f'<li><strong>{e(it["t"])}</strong> — {e(it["d"])}</li>' for it in w["did"]["items"])
            did_items = f'<ul class="dx-case-list">{lis}</ul>'
        did_ps = "".join(f"<p>{e(p)}</p>" for p in w["did"]["ps"])
        ch_ps = "".join(f"<p>{e(p)}</p>" for p in w["challenge"]["ps"])
        eff = "".join(f"<li>{e(x)}</li>" for x in w["effects"]["items"])
        arts.append(f"""<article class="dx-case {tints[i]}" data-reveal>
<header><div class="dx-feature-eyebrow">{e(w["tag"])}</div><h2 class="dx-case-title">{e(w["title"])}</h2></header>
<div class="dx-case-art dx-case-sim">{_sim_tos(lang) if i == 0 else _sim_farm(lang)}</div>
<div class="dx-case-cols">
<div class="dx-case-block"><h3>{e(w["challenge"]["h"])}</h3>{ch_ps}</div>
<div class="dx-case-block"><h3>{e(w["did"]["h"])}</h3>{did_ps}{did_items}</div>
<div class="dx-case-block"><h3>{e(w["effects"]["h"])}</h3><ul class="dx-case-list">{eff}</ul></div>
</div>
<p class="dx-case-closing">{e(w["closing"])}</p>
</article>""")
    body = "\n".join(arts)
    return (page_head_block("yellow", c["eyebrow"], c["title"])
            + f'<section class="dx-cases"><div class="dx-cases-inner">{body}</div></section>\n'
            + sec_close(lang))


def page_contact(lang):
    c = C[lang]
    ct = c["contact"]
    s = c["site"]
    fl = ct["formLabels"]
    p = PATHS[lang]
    info = "".join(
        f'<div class="dx-info-row"><span class="k">{e(k)}</span><span class="v">{e(v)}</span></div>'
        for k, v in ct["info"]
    )
    return (page_head_block("pink", c["nav"]["contact"], ct["title"], ct["sub"])
            + f"""<section class="dx-contact-wrap">
<div class="dx-contact-grid">
<div data-reveal>
<div class="dx-form-error" role="alert">{e(s["formError"])}</div>
<form method="post" action="{FORM_ACTION}">
<input type="hidden" name="lang" value="{lang}">
<p class="dx-hp" aria-hidden="true"><label>WWW <input type="text" name="www" tabindex="-1" autocomplete="off"></label></p>
<div class="dx-field"><label for="f-name">{e(fl["name"])}</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>
<div class="dx-field"><label for="f-email">{e(fl["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
<div class="dx-field"><label for="f-company">{e(fl["company"])}</label><input id="f-company" name="company" type="text" autocomplete="organization"></div>
<div class="dx-field"><label for="f-message">{e(fl["message"])}</label><textarea id="f-message" name="message" rows="6" required></textarea></div>
<label class="dx-rodo"><input type="checkbox" name="rodo" required> <span>{e(ct["rodoCheckbox"])}</span></label>
<button type="submit" class="dx-btn dx-btn-primary">{e(fl["send"])} →</button>
<p class="dx-clause">{e(ct["clausePre"])}<a href="{p["legal"]}">{e(ct["clauseLink"])}</a>{e(ct["clausePost"])}</p>
</form>
</div>
<div data-reveal>{info}</div>
</div>
</section>
""")


def _select(fid, name, label, choose, options):
    opts = f'<option value="" disabled selected>{e(choose)}</option>' + "".join(
        f'<option value="{e(o["v"])}">{e(o["t"])}</option>' for o in options)
    return (f'<div class="dx-field"><label for="{fid}">{e(label)}</label>'
            f'<select id="{fid}" name="{name}" required>{opts}</select></div>')


def _form_shell(lang, form_id, error_msg, fields, submit_label, below, cross_pre, cross_key, cross_label):
    """Wspólny układ stron-formularzy: grid jak /kontakt/ (formularz + kolumna info)."""
    ct = C[lang]["contact"]
    p = PATHS[lang]
    info = "".join(
        f'<div class="dx-info-row"><span class="k">{e(k)}</span><span class="v">{e(v)}</span></div>'
        for k, v in ct["info"]
    )
    return f"""<section class="dx-contact-wrap">
<div class="dx-contact-grid">
<div data-reveal>
<div class="dx-form-error" role="alert">{e(error_msg)}</div>
<form method="post" action="{FORM_ACTION}">
<input type="hidden" name="lang" value="{lang}">
<input type="hidden" name="form" value="{form_id}">
<p class="dx-hp" aria-hidden="true"><label>WWW <input type="text" name="www" tabindex="-1" autocomplete="off"></label></p>
{fields}
<label class="dx-rodo"><input type="checkbox" name="rodo" required> <span>{e(ct["rodoCheckbox"])}</span></label>
<button type="submit" class="dx-btn dx-btn-primary">{e(submit_label)} →</button>
{below}<p class="dx-clause">{e(ct["clausePre"])}<a href="{p["legal"]}">{e(ct["clauseLink"])}</a>{e(ct["clausePost"])}</p>
<p class="dx-clause">{e(cross_pre)}<a href="{p[cross_key]}">{e(cross_label)} →</a></p>
</form>
</div>
<div data-reveal>{info}</div>
</div>
</section>
"""


def page_meeting(lang):
    mt = C[lang]["meeting"]
    fl = mt["labels"]
    fields = (
        f'<div class="dx-field"><label for="f-name">{e(fl["name"])}</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>'
        f'<div class="dx-field"><label for="f-email">{e(fl["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>'
        f'<div class="dx-field"><label for="f-company">{e(fl["company"])}</label><input id="f-company" name="company" type="text" autocomplete="organization"></div>'
        + _select("f-topic", "topic", fl["topic"], fl["choose"], mt["topicOptions"])
        + _select("f-mode", "mode", fl["mode"], fl["choose"], mt["modeOptions"])
        + f'<div class="dx-field"><label for="f-slots">{e(fl["slots"])}</label><input id="f-slots" name="slots" type="text" required placeholder="{e(mt["slotsPlaceholder"])}"></div>'
        f'<div class="dx-field"><label for="f-message">{e(fl["message"])}</label><textarea id="f-message" name="message" rows="4"></textarea></div>'
    )
    below = f'<p class="dx-clause">{e(mt["promise"])}</p>'
    return (page_head_block("pink", mt["eyebrow"], mt["title"], mt["sub"])
            + _form_shell(lang, "meeting", mt["formError"], fields,
                          fl["send"], below, mt["crossPre"], "pilot", mt["crossLink"]))


def page_pilot(lang):
    pt = C[lang]["pilot"]
    fl = pt["labels"]
    fields = (
        f'<div class="dx-field"><label for="f-name">{e(fl["name"])}</label><input id="f-name" name="name" type="text" required autocomplete="name"></div>'
        f'<div class="dx-field"><label for="f-email">{e(fl["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>'
        f'<div class="dx-field"><label for="f-company">{e(fl["company"])}</label><input id="f-company" name="company" type="text" required autocomplete="organization"></div>'
        + _select("f-cranes", "cranes", fl["cranes"], fl["choose"], pt["cranesOptions"])
        + _select("f-ctype", "ctype", fl["ctype"], fl["choose"], pt["ctypeOptions"])
        + f'<div class="dx-field"><label for="f-location">{e(fl["location"])}</label><input id="f-location" name="location" type="text" required placeholder="{e(pt["locationPlaceholder"])}"></div>'
        + _select("f-horizon", "horizon", fl["horizon"], fl["choose"], pt["horizonOptions"])
        + f'<div class="dx-field"><label for="f-message">{e(fl["message"])}</label><textarea id="f-message" name="message" rows="4"></textarea></div>'
    )
    return (page_head_block("pink", pt["eyebrow"], pt["title"], pt["sub"])
            + _form_shell(lang, "pilot", pt["formError"], fields,
                          fl["send"], "", pt["crossPre"], "meeting", pt["crossLink"]))


def page_thanks(lang):
    ct = C[lang]["contact"]
    s = C[lang]["site"]
    p = PATHS[lang]
    return f"""<section class="dx-simple">
<h1 class="dx-h1">{e(ct["sentTitle"])}</h1>
<p>{e(ct["sentSub"])}</p>
<a class="dx-btn dx-btn-primary" href="{p["home"]}">{e(s["backHome"])} →</a>
</section>
"""


def page_legal(lang):
    lg = C[lang]["legal"]

    def blocks(bs):
        out = []
        for b in bs:
            if "ul" in b:
                out.append("<ul>" + "".join(f"<li>{e(li)}</li>" for li in b["ul"]) + "</ul>")
            else:
                out.append(f"<p>{e(b['p'])}</p>")
        return "".join(out)

    def sections(sec):
        return "".join(
            f'<div class="dx-legal-section"><h3>{e(s["h"])}</h3>{blocks(s["blocks"])}</div>'
            for s in sec
        )

    return f"""<section class="dx-legal">
<div class="dx-legal-inner">
<span class="dx-hero-eyebrow">{e(lg["eyebrow"])}</span>
<h1 class="dx-legal-title">{e(lg["title"])}</h1>
<p class="dx-legal-updated">{e(lg["updated"])}</p>
<h2>{e(lg["privacy"]["title"])}</h2>
{sections(lg["privacy"]["sections"])}
<h2 id="cookies">{e(lg["cookies"]["title"])}</h2>
{sections(lg["cookies"]["sections"])}
</div>
</section>
"""


def page_404():
    s = C["pl"]["site"]
    en = C["en"]["site"]
    return (head("pl", "notfound", "/404.html", "/404.html")
            + f'<body class="dx">\n<a class="skip-link" href="#tresc">{e(s["skip"])}</a>\n'
            + nav("pl", None, "/", "/en/")
            + f"""<main id="tresc">
<section class="dx-simple">
<h1 class="dx-h1">{e(s["notFoundTitle"])}</h1>
<p>{e(s["notFoundText"])}</p>
<a class="dx-btn dx-btn-primary" href="/">{e(s["backHome"])} →</a>
<p style="margin-top:24px"><a href="/en/">{e(en["notFoundTitle"])} — English →</a></p>
</section>
</main>
"""
            + cookie_note("pl")
            + footer("pl")
            + '<script src="/assets/site.js"></script>\n</body>\n</html>\n')


# ---------- podstrony produktowe (prefiksy .sw- i .lc- w styles.css) ----------

def _tytul(cls, txt, em):
    """Tytul z wyroznionym ogonem. `em` musi byc koncowka `txt` — inaczej nie podswietlamy nic."""
    if em and txt.endswith(em):
        return f'<h2 class="{cls}">{e(txt[:-len(em)])}<em>{e(em)}</em></h2>'
    return f'<h2 class="{cls}">{e(txt)}</h2>'


def _karta(it):
    return f'<div class="sw-card"><h3>{e(it["h"])}</h3><p>{e(it["p"])}</p></div>'


# ZDJECIE crane-hero.jpg — pochodzenie i warunek podpisu
#
# Autor: Karmelki90. Licencja: CC0 (zrzeczenie sie praw, domena publiczna).
# Zrodlo: Wikimedia Commons. Ujecie: Baltic Hub T3, Gdansk.
#
# CC0 NIE WYMAGA atrybucji i dlatego podpisu pod zdjeciem tu nie ma.
#
# JESLI KIEDYKOLWIEK PODMIENISZ TO ZDJECIE: wiekszosc zdjec suwnic na Wikimedia
# Commons jest na CC BY-SA, ktora atrybucji WYMAGA — i to widocznej przy zdjeciu,
# nie w stopce dokumentu. Wtedy podpis musi wrocic (<figcaption>). Rejestr licencji
# zdjec uzywanych w materialach: APT, docs/foto-suwnice-zrodla.md.
# Najlepszym wyjsciem jest wlasne zdjecie z obiektu — wtedy pytanie znika.
def page_crane(lang):
    c = C[lang]["crane"]
    p = PATHS[lang]
    h1 = (f'<h1>{e(c["title"][:-len(c["titleEm"])])}<em>{e(c["titleEm"])}</em></h1>'
          if c["title"].endswith(c["titleEm"]) else f'<h1>{e(c["title"])}</h1>')

    hero = f"""<section class="sw sw-hero">
<p class="dx-eyebrow">{e(c["eyebrow"])}</p>
{h1}
<p class="sw-lead">{e(c["lead"])}</p>
<div class="sw-cta">
<a class="dx-btn dx-btn-primary" href="#start">{e(c["ctaPrimary"])} \u2192</a>
<a class="dx-link-quiet" href="#case">{e(c["ctaSecondary"])} \u2193</a>
</div>
<figure class="sw-figure">
<img src="/assets/img/crane-hero.jpg" width="1800" height="747" alt="{e(c["photoAlt"])}" loading="eager">
</figure>
</section>
"""

    ryzyka = f"""<section class="sw sw-sec" id="ryzyko">
<p class="dx-eyebrow">{e(c["riskEyebrow"])}</p>
{_tytul("sw-h2", c["riskTitle"], c["riskTitleEm"])}
<p class="sw-lead">{e(c["riskLead"])}</p>
<div class="sw-cards-2">{"".join(_karta(it) for it in c["risks"])}</div>
</section>
"""

    spec = "".join(f'<li><i></i><span>{e(x)}</span></li>' for x in c["spec"])
    mozliwosci = "".join(
        f'<div><h3>{e(it["h"])}</h3><p>{e(it["p"])}</p></div>' for it in c["capabilities"])
    dostarczamy = f"""<section class="sw sw-sec" id="deliver">
<p class="dx-eyebrow">{e(c["deliverEyebrow"])}</p>
{_tytul("sw-h2", c["deliverTitle"], c["deliverTitleEm"])}
<p class="sw-lead">{e(c["deliverLead"])}</p>
<div class="sw-produkt">
<div class="sw-spec"><h3>{e(c["specTitle"])}</h3><p>{e(c["specSub"])}</p><ul>{spec}</ul></div>
<div class="sw-mozliwosci">{mozliwosci}</div>
</div>
</section>
"""

    fakty = "".join(f'<li><b>{e(it["h"])}</b><span>{e(it["p"])}</span></li>' for it in c["caseFacts"])
    wyniki = "".join(_karta(it) for it in c["caseResults"])
    ptaszki = "".join(f'<li>{e(x)}</li>' for x in c["caseChecks"])
    case = f"""<section class="sw sw-sec" id="case">
<p class="dx-eyebrow">{e(c["caseEyebrow"])}</p>
{_tytul("sw-h2", c["caseTitle"], c["caseTitleEm"])}
<p class="sw-lead">{e(c["caseLead"])}</p>
<div class="sw-case">
<div><p class="sw-kicker">{e(c["caseColA"])}</p><ul class="sw-facts">{fakty}</ul></div>
<div><p class="sw-kicker">{e(c["caseColB"])}</p>{wyniki}</div>
</div>
<ul class="sw-ptaszki">{ptaszki}</ul>
</section>
"""

    uniw = f"""<section class="sw sw-sec" id="platform">
<p class="dx-eyebrow">{e(c["univEyebrow"])}</p>
{_tytul("sw-h2", c["univTitle"], c["univTitleEm"])}
<p class="sw-lead">{e(c["univLead"])}</p>
<div class="sw-cards-3">{"".join(_karta(it) for it in c["univ"])}</div>
</section>
"""

    cele = [p["pilot"], p["meeting"]]
    drogi = "".join(
        f'<div class="sw-card"><h3>{e(it["h"])}</h3><p>{e(it["p"])}</p>'
        f'<p class="sw-card-cta"><a class="dx-btn {"dx-btn-primary" if i == 0 else "dx-btn-dark"}" '
        f'href="{cele[i]}">{e(it["btn"])} \u2192</a></p></div>'
        for i, it in enumerate(c["start"]))
    start = f"""<section class="sw sw-close" id="start">
<p class="dx-eyebrow">{e(c["startEyebrow"])}</p>
{_tytul("sw-h2", c["startTitle"], c["startTitleEm"])}
<div class="sw-cards-2">{drogi}</div>
<p class="sw-more"><a class="dx-link-quiet" href="{p["localcontent"]}">{e(c["noteLink"])} \u2192</a></p>
</section>
"""
    return hero + ryzyka + dostarczamy + case + uniw + start


def page_localcontent(lang):
    c = C[lang]["localcontent"]
    p = PATHS[lang]
    h1 = (f'<h1>{e(c["title"][:-len(c["titleEm"])])}<em>{e(c["titleEm"])}</em></h1>'
          if c["title"].endswith(c["titleEm"]) else f'<h1>{e(c["title"])}</h1>')

    hero = f"""<section class="lc lc-hero">
<div class="lc-flag" role="img" aria-label="{e(c["flagLabel"])}"><div class="lc-flag-b"></div><div class="lc-flag-c"></div></div>
<p class="dx-eyebrow">{e(c["eyebrow"])}</p>
{h1}
<p class="lc-lead">{e(c["lead"])}</p>
</section>
"""

    krit = "".join(
        f'<li><i class="lc-dot"></i><span>{e(t)}</span><span class="lc-w">{e(w)}</span></li>'
        for t, w in c["crit"])
    punkty = "".join(f'<div><h3>{e(it["h"])}</h3><p>{e(it["p"])}</p></div>' for it in c["points"])
    kryteria = f"""<section class="lc lc-sec" id="criteria">
<p class="dx-eyebrow">{e(c["critEyebrow"])}</p>
{_tytul("lc-h2", c["critTitle"], c["critTitleEm"])}
<p class="lc-lead">{e(c["critLead"])}</p>
<div class="lc-grid">
<div class="lc-card"><h3>{e(c["critCard"])}</h3><ul class="lc-crit">{krit}</ul>
<div class="lc-sum"><b>{e(c["critSum"])}</b><span>{e(c["critSumText"])}</span></div></div>
<div class="lc-points">{punkty}</div>
</div>
</section>
"""

    sektory = "".join(
        f'<div class="lc-sektor{" on" if on else ""}">{e(n)}<span>{e(o)}</span></div>'
        for n, o, on in c["sektory"])
    sek = f"""<section class="lc lc-sec" id="sectors">
<p class="dx-eyebrow">{e(c["sekEyebrow"])}</p>
{_tytul("lc-h2", c["sekTitle"], c["sekTitleEm"])}
<p class="lc-lead">{e(c["sekLead"])}</p>
<div class="lc-sektory">{sektory}</div>
</section>
"""

    def karta_co(it):
        link = (f' <a class="dx-link-quiet" href="{p["crane"]}">{e(it["link"])} \u2192</a>'
                if it.get("link") else "")
        return f'<div class="lc-card"><h3>{e(it["h"])}</h3><p>{e(it["p"])}{link}</p></div>'

    co = f"""<section class="lc lc-sec" id="what-we-do">
<p class="dx-eyebrow">{e(c["coEyebrow"])}</p>
{_tytul("lc-h2", c["coTitle"], c["coTitleEm"])}
<p class="lc-lead">{e(c["coLead"])}</p>
<div class="lc-co">{"".join(karta_co(it) for it in c["co"])}</div>
</section>
"""

    close = f"""<section class="lc lc-close" id="ask">
<p class="dx-eyebrow">{e(c["closeEyebrow"])}</p>
{_tytul("lc-h2", c["closeTitle"], c["closeTitleEm"])}
<p class="lc-lead">{e(c["closeLead"])}</p>
<div class="lc-cta">
<a class="dx-btn dx-btn-primary" href="{p["contact"]}">{e(c["closeBtn"])} \u2192</a>
<a class="dx-link-quiet" href="{p["crane"]}">{e(c["closeLink"])} \u2192</a>
</div>
</section>
"""
    return hero + kryteria + sek + co + close


RENDERERS = {
    "home": page_home,
    "crane": page_crane,
    "localcontent": page_localcontent,
    "services": page_services,
    "cases": page_cases,
    "contact": page_contact,
    "thanks": page_thanks,
    "legal": page_legal,
    "meeting": page_meeting,
    "pilot": page_pilot,
}


# ---------- build ----------

def postprocess(html, lang=None, key=None):
    """W trybie podglądu: prefiksuje wewnętrzne ścieżki, dodaje noindex i notkę o formularzu.
    Linki canonical/hreflang/og zostają absolutne do domeny produkcyjnej."""
    if not BASE:
        return html
    html = re.sub(r'(href|src|action)="/', rf'\1="{BASE}/', html)
    if '<meta name="robots"' not in html:
        html = html.replace("<title>", '<meta name="robots" content="noindex,nofollow">\n<title>', 1)
    if key == "contact" and lang in PREVIEW_NOTE:
        note = ('<div style="background:var(--dx-surface-2);border:1px solid var(--dx-yellow);'
                'border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:14px">'
                + e(PREVIEW_NOTE[lang]) + "</div>\n")
        html = html.replace('<div class="dx-form-error"', note + '<div class="dx-form-error"', 1)
    return html


def build():
    # Czyszczenie zawartości zamiast rmtree(DIST): na Windows katalog bywa
    # otwarty jako CWD serwera podglądu i nie da się go usunąć w całości.
    DIST.mkdir(parents=True, exist_ok=True)
    for child in DIST.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()
    shutil.copytree(SITE / "static", DIST, dirs_exist_ok=True)

    for key, pl_path, en_path in PAGES:
        for lang, path in (("pl", pl_path), ("en", en_path)):
            out = DIST / path.lstrip("/") / "index.html"
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(postprocess(layout(lang, key, RENDERERS[key](lang)), lang, key),
                           encoding="utf-8", newline="\n")

    (DIST / "404.html").write_text(postprocess(page_404()), encoding="utf-8", newline="\n")

    if BASE:
        (DIST / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8", newline="\n")
        (DIST / ".nojekyll").write_text("", encoding="utf-8")

    urls = [DOMAIN + p for k, pl, en in PAGES if k not in NOINDEX for p in (pl, en)]
    items = "\n".join(f"<url><loc>{u}</loc></url>" for u in urls)
    (DIST / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{items}\n</urlset>\n",
        encoding="utf-8", newline="\n")

    write_icons(DIST)


# ---------- checker ----------

FORBIDDEN = ["tauron", "pyxis", "unpkg.com", "fonts.googleapis", "gstatic.com", "wrocław", "northwind"]

# Wyjatki od FORBIDDEN: string -> strony, na ktorych jest dozwolony swiadomie.
#
# "tauron": nazwa operatora farmy wiatrowej w opisie wdrozenia referencyjnego.
# Zakaz zostal wpisany, gdy nie mielismy prawa uzywac tej nazwy. Kamil zdjal to
# ograniczenie (2026-09-10): oprogramowanie napisal i wdrozyl on, raport dla
# operatora zostal zatwierdzony, a podwykonawca do dnia dzisiejszego nie zaplacil
# i wedlug umowy nie moze posilkowac sie wynikami tego raportu.
#
# Zakaz zostaje dla CALEJ RESZTY serwisu — nazwa ma sie pojawiac wylacznie tam,
# gdzie jest opisanym wdrozeniem, a nie przypadkiem w innym tekscie.
#
# DO POTWIERDZENIA PRZED PUBLIKACJA: nazwa klienta na publicznej stronie to co
# innego niz nazwa na spotkaniu. Warto miec krotka pisemna zgode operatora na
# uzycie nazwy w materialach marketingowych. Do tego czasu wystarczy w
# content.json zamienic naglowek case study na "Farma wiatrowa w Polsce" —
# liczby i oba wyniki dzialaja bez nazwy.
FORBIDDEN_EXCEPT = {
    "tauron": {"monitoring-suwnic/index.html", "en/crane-monitoring/index.html"},
}


def check():
    errors = []
    html_files = sorted(DIST.rglob("*.html"))
    ids = {}
    for f in html_files:
        txt = f.read_text(encoding="utf-8")
        ids[f] = set(re.findall(r'id="([^"]+)"', txt))

    text_files = sorted(p for ext in ("*.html", "*.css", "*.js", "*.php", "*.txt", "*.svg", "*.xml") for p in DIST.rglob(ext))
    for f in text_files:
        low = f.read_text(encoding="utf-8").lower()
        rel = f.relative_to(DIST).as_posix()
        for bad in FORBIDDEN:
            if bad in low and rel not in FORBIDDEN_EXCEPT.get(bad, ()):
                errors.append(f"{rel}: zakazany string '{bad}'")

    for f in html_files:
        txt = f.read_text(encoding="utf-8")
        rel = f.relative_to(DIST).as_posix()

        if rel != "404.html" and 'hreflang="' not in txt:
            errors.append(f"{rel}: brak hreflang")
        if rel.endswith("index.html") and ("polityka-prywatnosci" in rel or "privacy-policy" in rel):
            if "0000565307" not in txt:
                errors.append(f"{rel}: brak numeru KRS w polityce")

        for m in re.finditer(r'(?:href|src|action)="([^"]+)"', txt):
            url = m.group(1)
            if url.startswith(("http://", "https://", "mailto:", "tel:")):
                if DOMAIN not in url and url.startswith(("http://", "https://")):
                    errors.append(f"{rel}: zewnętrzny URL {url}")
                continue
            if url.startswith("#"):
                if url[1:] not in ids[f]:
                    errors.append(f"{rel}: brak kotwicy {url}")
                continue
            path, _, frag = url.partition("#")
            path = path.split("?")[0]
            if BASE and path.startswith(BASE + "/"):
                path = path[len(BASE):]
            if not path.startswith("/"):
                errors.append(f"{rel}: względny URL {url}")
                continue
            target = DIST / path.lstrip("/")
            if path.endswith("/"):
                target = target / "index.html"
            if not target.exists():
                errors.append(f"{rel}: martwy link {url}")
                continue
            if frag and target.suffix == ".html" and target in ids and frag not in ids[target]:
                errors.append(f"{rel}: brak kotwicy #{frag} w {path}")

    for name in ["assets/styles.css", "assets/site.js", "kontakt/wyslij.php", ".htaccess",
                 "robots.txt", "favicon.svg", "favicon.ico", "apple-touch-icon.png", "sitemap.xml",
                 "assets/fonts/inter-400.woff2", "assets/fonts/inter-700.woff2"]:
        if not (DIST / name).exists():
            errors.append(f"brak pliku {name}")

    return errors


def main():
    global BASE, DIST
    import argparse
    ap = argparse.ArgumentParser(description="Generator statyczny vistechnologie.pl")
    ap.add_argument("--base", default="", help='prefiks ścieżek dla podglądu spod podścieżki (np. "/website" dla GitHub Pages)')
    ap.add_argument("--out", default=None, help="katalog wyjściowy (domyślnie dist/)")
    args = ap.parse_args()
    BASE = args.base.rstrip("/")
    if BASE and not BASE.startswith("/"):
        # m.in. Git Bash (MSYS) potrafi zamienić "/website" na "C:/Program Files/Git/website"
        sys.exit(f'BŁĄD: --base musi zaczynać się od "/" (otrzymano: {BASE}). '
                 'W Git Bash uruchom z MSYS_NO_PATHCONV=1 albo użyj PowerShella.')
    if args.out:
        DIST = Path(args.out).resolve()

    build()
    errors = check()
    pages = len(list(DIST.rglob("*.html")))
    if errors:
        print(f"BŁĘDY ({len(errors)}):")
        for err in errors:
            print(" -", err)
        sys.exit(1)
    tryb = f"podgląd (base={BASE})" if BASE else "produkcja"
    print(f"OK: {pages} stron HTML, checker czysty ({tryb} -> {DIST.name}/).")


if __name__ == "__main__":
    main()
