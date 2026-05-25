# Strona internetowa

## Struktura

```
website/
├── src/                  # Kod źródłowy strony
│   ├── index.html
│   ├── css/              # Style
│   ├── js/               # Skrypty
│   ├── components/       # Wielokrotnego użytku fragmenty HTML
│   └── pages/            # Podstrony
├── assets/               # Statyczne zasoby
│   ├── images/
│   ├── icons/
│   └── fonts/
├── visualizations/       # Wizualizacje danych
│   ├── data/             # Pliki źródłowe (JSON/CSV)
│   ├── charts/           # HTML z osadzonymi wykresami
│   └── scripts/          # JS budujący wykresy (Chart.js / D3)
├── design/               # Output z Claude Designer
└── docs/                 # Dokumentacja
```

## Uruchomienie lokalne

```powershell
cd src
python -m http.server 8000
```

Otwórz http://localhost:8000
