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
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
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
<div><h5>{e(f["studioH"])}</h5><p style="font-size:14px;line-height:1.55;color:rgba(255,255,255,0.65);max-width:30ch;margin:0">{studio}</p><p class="dx-footer-reg">{e(f["reg"])}</p></div>
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
    rotator = (f'<p class="kn-rotator"><span>{e(rot_words[0])}</span> '
               f'<strong class="kino-rot-word" data-rotate="{words_attr}">{e(rot_words[1][0])}</strong>'
               f'<span class="kino-caret" aria-hidden="true"></span></p>')
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
    return f"""<a class="kn-card" href="{btn_href}" data-reveal>
<i>{e(it["num"])}</i>
<h3>{e(it["title"])}</h3>
<p>{e(it["desc"])}</p>
<span class="kn-card-for">{e(it["forWho"])}</span>
<span class="kn-card-arw">{e(btn_label)} →</span>
</a>
"""


def sec_features(lang):
    c = C[lang]
    p = PATHS[lang]
    label = "Zobacz wszystkie usługi" if lang == "pl" else "See all services"
    rows = "".join(
        _feature(lang, it, i, "", label, p["services"])
        for i, it in enumerate(c["services"]["items"][:6])
    )
    hint = "Usługi — przewiń →" if lang == "pl" else "Services — scroll →"
    return (f'<section class="kn-services" data-zone="paper"><div class="kn-services-inner">'
            f'<p class="kn-hint">{e(hint)}</p><div class="kn-scroll">{rows}</div></div></section>' + chr(10))


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
    pr = C[lang]["partners"]
    pnames = " · ".join(pr["names"])
    return f"""<section class="dx-ribbon" data-zone="warm">
<div class="dx-ribbon-inner">
<div style="margin-bottom:48px;max-width:26ch">
<span class="dx-eyebrow">{e(c["eyebrow"])}</span>
<h2 class="dx-h1" style="margin-top:12px">{e(c["title"])}</h2>
</div>
<div class="dx-ribbon-grid">{cards}</div>
<p class="dx-proof-partners"><span class="dx-eyebrow">{e(pr["title"])}</span> <span>{e(pnames)}</span> <span class="dx-proof-note">{e(pr["note"])}</span></p>
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
    founders = "".join(
        f'<div class="dx-founder" data-reveal><div class="dx-founder-photo">'
        f'<img src="/assets/img/team-{i + 1:02d}.svg" alt="{e(f["name"])}" loading="lazy" width="480" height="600"></div>'
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

def sec_cases_home(lang):
    c = C[lang]["workPage"]
    p = PATHS[lang]
    fx = {
        "pl": ["SYSTEM OD 12 LAT →", "← AI SŁYSZY TURBINY"],
        "en": ["RUNNING FOR 12 YEARS →", "← AI HEARS TURBINES"],
    }[lang]
    link_t = "Pełne studium przypadku" if lang == "pl" else "Full case study"
    rows = []
    for i, w in enumerate(c["cases"]):
        eff = " · ".join(x.split(" — ")[0] for x in w["effects"]["items"][:2])
        txt = (f'<div class="kn-case-txt"><p class="kn-hint">{e(w["tag"])}</p>'
               f'<h3>{e(w["title"])}</h3><p class="kn-case-p">{e(w["challenge"]["ps"][0])}</p>'
               f'<p class="kn-case-eff">{e(eff)}</p>'
               f'<a class="dx-link-quiet" href="{p["cases"]}">{link_t} →</a></div>')
        big = f'<div class="kn-fx" data-k="{0.06 if i % 2 == 0 else -0.06}" aria-hidden="true">{e(fx[i])}</div>'
        inner = txt + big if i % 2 == 0 else big + txt
        rows.append(f'<div class="kn-case" data-reveal>{inner}</div>')
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


def page_home(lang):
    return (sec_hero(lang) + sec_band(lang) + sec_stats(lang) + sec_cases_home(lang) + sec_ai_demo(lang) + sec_pull(lang)
            + sec_features(lang) + sec_process(lang) + sec_about(lang) + sec_close(lang))


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
<div class="dx-case-art"><img src="/assets/img/scene-case-{i + 1:02d}.svg" alt="{e(w["title"])}" loading="lazy" width="1920" height="1080"></div>
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


RENDERERS = {
    "home": page_home,
    "services": page_services,
    "cases": page_cases,
    "contact": page_contact,
    "thanks": page_thanks,
    "legal": page_legal,
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
            if bad in low:
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
