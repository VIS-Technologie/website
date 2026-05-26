/* eslint-disable */
// Słownik mapowań artboard ID → folder preview + komponent React.
// Jedno źródło prawdy dla:
//   - canvas/design-canvas.jsx (budowa URL przy kliku w artboard)
//   - tools/generate-previews.py (generowanie preview/<folder>/index.html)
// Trzymaj zgodne z PREVIEWS w tools/generate-previews.py.

window.PREVIEWS = [
  { id: "safe",     folder: "safe",     label: "A · Safe",        description: "Light corporate, TELUS-leaning",                 component: "Variation",         componentProps: { variant: "safe" } },
  { id: "bold",     folder: "bold",     label: "B · Bold",        description: "Dark editorial, Diffco-leaning",                 component: "Variation",         componentProps: { variant: "bold" } },
  { id: "journey",  folder: "telus",    label: "C · TELUS",       description: "TELUS-leaning + Empat industries + Diffco cases", component: "TelusVariation",    componentProps: {} },
  { id: "diffco",   folder: "diffco",   label: "D · Diffco",      description: "Dark, AI-engineering",                            component: "DiffcoVariation",   componentProps: {} },
  { id: "premium",  folder: "premium",  label: "E · Premium",     description: "Quiet, whitespace, theatrical product moment",   component: "PremiumVariation",  componentProps: {} },
  { id: "saas",     folder: "dx",       label: "F · SaaS / DX",   description: "Bright, friendly, illustrative, plan tiles",      component: "DxVariation",       componentProps: {} },
  { id: "remix",    folder: "remix",   label: "G · Remix",       description: "Best-of A–F, editorial z chapter switcher",      component: "RemixVariation",    componentProps: {} },
  { id: "codewars", folder: "codewars", label: "H · Codewars",    description: "Dark terminal, kata cards, syntax-highlight",     component: "CodewarsVariation", componentProps: {} },
];

// Helper: zwraca folder preview dla danego artboard id.
window.previewFolderFor = function (id) {
  const entry = (window.PREVIEWS || []).find((p) => p.id === id);
  return entry ? entry.folder : null;
};
