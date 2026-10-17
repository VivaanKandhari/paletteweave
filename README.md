# PaletteWeave

Open index.html directly in a modern browser. No dependencies. Run `node test.cjs` for meaningful algorithm checks.

Learn 3/6/8/12-colour palettes using Lloyd clustering in RGB or OKLab; compare nearest-colour rendering with Floyd–Steinberg diffusion; inspect colour proportions and pixel error; export a mosaic SVG. The default sample is an original procedural landscape. Uploaded images are resized to a maximum 160×112, composited on white and processed only in page memory. There are no application network requests.

The SVG contains one rectangle per output pixel. This is intentionally simple and can create large SVGs. There is no alpha preservation, print colour management, professional gamut mapping or artistic-quality metric. Dithering changes texture and may increase pixelwise error. Centroids use nearest sampled source colours as in-gamut representatives. Rendering always matches in OKLab.

Established methods, not claimed research novelty: OKLab conversion https://bottosson.github.io/posts/oklab/ ; Lloyd clustering; farthest-point initialization; Floyd–Steinberg error diffusion. AI disclosure: Codex generated implementation and materials. The entrant should review and understand the project before its mandatory live presentation.

