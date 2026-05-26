"""
Generuje preview per wariant:
  visualizations/preview/<folder>/index.html  (8 plików — po jednym na wariant)
  visualizations/preview/index.html           (landing z gridem kafelków)

Każdy preview ładuje React + Babel + minimalny zestaw shared/* + wariantowy
CSS + JSX, i renderuje wariant w #root na pełną szerokość viewportu.

Słownik PREVIEWS musi być zgodny z visualizations/shared/previews.js.

Uruchom: python tools/generate-previews.py
"""

from __future__ import annotations

from pathlib import Path
import json
import textwrap


# Słownik wariantów — zgodny ze shared/previews.js
PREVIEWS = [
    {"id": "safe",     "folder": "safe",     "label": "A · Safe",      "description": "Light corporate, TELUS-leaning",                 "component": "Variation",         "componentProps": {"variant": "safe"}},
    {"id": "bold",     "folder": "bold",     "label": "B · Bold",      "description": "Dark editorial, Diffco-leaning",                 "component": "Variation",         "componentProps": {"variant": "bold"}},
    {"id": "journey",  "folder": "telus",    "label": "C · TELUS",     "description": "TELUS-leaning + Empat industries + Diffco cases", "component": "TelusVariation",    "componentProps": {}},
    {"id": "diffco",   "folder": "diffco",   "label": "D · Diffco",    "description": "Dark, AI-engineering",                            "component": "DiffcoVariation",   "componentProps": {}},
    {"id": "premium",  "folder": "premium",  "label": "E · Premium",   "description": "Quiet, whitespace, theatrical product moment",   "component": "PremiumVariation",  "componentProps": {}},
    {"id": "saas",     "folder": "dx",       "label": "F · SaaS / DX", "description": "Bright, friendly, illustrative, plan tiles",      "component": "DxVariation",       "componentProps": {}},
    {"id": "remix",    "folder": "remix",    "label": "G · Remix",     "description": "Best-of A–F, editorial z chapter switcher",      "component": "RemixVariation",    "componentProps": {}},
    {"id": "codewars", "folder": "codewars", "label": "H · Codewars",  "description": "Dark terminal, kata cards, syntax-highlight",     "component": "CodewarsVariation", "componentProps": {}},
]


REPO_ROOT = Path(__file__).resolve().parent.parent
VIS_ROOT = REPO_ROOT / "visualizations"
PREVIEW_ROOT = VIS_ROOT / "preview"

# Shared scripts ładowane przez każdy preview — kolejność istotna.
SHARED_SCRIPTS = [
    "shared/shared.jsx",
    "shared/nav-footer.jsx",
    "shared/sections.jsx",
    "shared/how-we-work.jsx",
    "shared/pages.jsx",
    "shared/tweaks-panel.jsx",  # używany przez Variation (safe/bold)
    "shared/variation.jsx",     # komponent dla wariantów safe/bold
]


def variant_assets(preview: dict) -> tuple[list[str], list[str]]:
    """Zwraca (css_paths, jsx_paths) względem visualizations/ dla wariantu.

    Warianty safe/bold nie mają własnego folderu — używają shared/variation.jsx
    (ładowane w SHARED_SCRIPTS) i tylko shared/styles.css.

    Warianty z folderem ładują {folder}-styles.css, opcjonalnie
    {folder}-pages-styles.css, {folder}-variation.jsx, opcjonalnie
    {folder}-pages.jsx (jeśli istnieją).
    """
    folder = preview["folder"]
    if folder in ("safe", "bold"):
        return [], []

    base = VIS_ROOT / "variations" / folder
    css = []
    jsx = []
    styles = base / f"{folder}-styles.css"
    pages_styles = base / f"{folder}-pages-styles.css"
    variation_jsx = base / f"{folder}-variation.jsx"
    pages_jsx = base / f"{folder}-pages.jsx"

    if styles.exists():
        css.append(f"variations/{folder}/{folder}-styles.css")
    if pages_styles.exists():
        css.append(f"variations/{folder}/{folder}-pages-styles.css")
    if variation_jsx.exists():
        jsx.append(f"variations/{folder}/{folder}-variation.jsx")
    if pages_jsx.exists():
        jsx.append(f"variations/{folder}/{folder}-pages.jsx")
    return css, jsx


# Wszystkie wariantowe CSS-y są też ładowane w canvas, niektóre warianty
# (np. remix) referują klasy z innych wariantów (telus, diffco, premium).
# Żeby preview/remix nie wybuchło stylistycznie, ładujemy CSS-y wszystkich
# wariantów (są lekkie). JSX-y wariantowe ładujemy tylko dla wybranego
# wariantu — żeby ReactDOM.render odpalił właściwy komponent.
def all_variant_css() -> list[str]:
    css = []
    for p in PREVIEWS:
        c, _ = variant_assets(p)
        for path in c:
            if path not in css:
                css.append(path)
    return css


def render_preview(preview: dict) -> str:
    folder = preview["folder"]
    label = preview["label"]
    component = preview["component"]
    props_json = json.dumps(preview["componentProps"])

    css_links = []
    css_links.append('<link rel="stylesheet" href="../../shared/styles.css" />')
    for css_path in all_variant_css():
        css_links.append(f'<link rel="stylesheet" href="../../{css_path}" />')

    scripts = []
    for src in SHARED_SCRIPTS:
        scripts.append(f'<script type="text/babel" src="../../{src}"></script>')
    _, jsx_paths = variant_assets(preview)
    for src in jsx_paths:
        scripts.append(f'<script type="text/babel" src="../../{src}"></script>')

    css_block = "\n".join(css_links)
    scripts_block = "\n".join(scripts)

    # Bootstrap: parsujemy props i wstrzykujemy. Babel rozumie spread `{...obj}`.
    bootstrap = textwrap.dedent(f"""\
        <script type="text/babel">
          const props = {props_json};
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement({component}, props));
        </script>
        """).strip()

    return textwrap.dedent(f"""\
        <!doctype html>
        <html lang="pl">
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Vis Technologie — preview: {label}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        {css_block}
        <style>
          body {{ margin: 0; }}
          .preview-back {{
            position: fixed; top: 12px; right: 12px; z-index: 9999;
            padding: 6px 12px; font: 13px/1 system-ui, sans-serif;
            background: rgba(20,20,20,0.7); color: rgba(255,255,255,0.9);
            text-decoration: none; border-radius: 6px; backdrop-filter: blur(8px);
          }}
          .preview-back:hover {{ background: rgba(20,20,20,0.9); }}
        </style>
        </head>
        <body>
        <a class="preview-back" href="../../canvas/" aria-label="Powrót do canvas">← canvas</a>
        <div id="root"></div>

        <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>

        {scripts_block}

        {bootstrap}
        </body>
        </html>
        """)


def render_landing() -> str:
    tiles = []
    for p in PREVIEWS:
        tiles.append(textwrap.dedent(f"""\
            <a class="tile" href="./{p['folder']}/">
              <h2>{p['label']}</h2>
              <p>{p['description']}</p>
            </a>"""))
    tiles_block = "\n".join(tiles)

    return textwrap.dedent(f"""\
        <!doctype html>
        <html lang="pl">
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Vis Technologie — wszystkie preview</title>
        <style>
          body {{ font: 14px system-ui, sans-serif; background: #f4f1ea; padding: 40px; margin: 0; color: #0e1116; }}
          h1 {{ font-size: 24px; margin: 0 0 6px; }}
          .sub {{ color: #666; margin: 0 0 24px; }}
          .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }}
          a.tile {{ display: block; padding: 24px; background: white; border-radius: 8px; text-decoration: none; color: inherit;
                  box-shadow: 0 1px 3px rgba(0,0,0,.08); transition: transform .12s, box-shadow .12s; }}
          a.tile:hover {{ transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.12); }}
          a.tile h2 {{ font-size: 16px; margin: 0 0 4px; }}
          a.tile p {{ font-size: 13px; margin: 0; color: #666; }}
          .back {{ display: inline-block; margin-bottom: 24px; color: #1746A0; text-decoration: none; }}
        </style>
        </head>
        <body>
        <a class="back" href="../canvas/">← canvas</a>
        <h1>Vis Technologie — wszystkie preview</h1>
        <p class="sub">Kliknij wariant, aby otworzyć jako osobny widok.</p>
        <div class="grid">
        {tiles_block}
        </div>
        </body>
        </html>
        """)


def main() -> int:
    PREVIEW_ROOT.mkdir(parents=True, exist_ok=True)

    for p in PREVIEWS:
        folder_path = PREVIEW_ROOT / p["folder"]
        folder_path.mkdir(parents=True, exist_ok=True)
        out = folder_path / "index.html"
        out.write_text(render_preview(p), encoding="utf-8")
        print(f"OK: {out.relative_to(REPO_ROOT)}")

    landing = PREVIEW_ROOT / "index.html"
    landing.write_text(render_landing(), encoding="utf-8")
    print(f"OK: {landing.relative_to(REPO_ROOT)}")

    print()
    print(f"Wygenerowano {len(PREVIEWS)} preview + landing.")
    print("Otwórz w przeglądarce po uruchomieniu serwera w visualizations/:")
    print("  python -m http.server 8000")
    print("  http://localhost:8000/preview/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
