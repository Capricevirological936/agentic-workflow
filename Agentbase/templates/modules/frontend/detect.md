# Frontend Kategori Tespiti

Bu kategori frontend meta-framework'ler icin build, routing ve rendering kurallari saglar.

## Variants

| Varyant | Tespit Dosyasi | Oncelik | Not |
|---------|---------------|---------|-----|
| Next.js | `frontend/nextjs/detect.md` | 1 | Next.js tespit edilirse React SPA aktive edilmez |
| React SPA | `frontend/react/detect.md` | 2 | Standalone React SPA'lar (Vite, CRA, custom bundler) |
| HTML/CSS/JS | `frontend/html/detect.md` | 3-fallback | Hicbir framework tespit edilmezse devreye girer |

## Provides

- Framework-spesifik rendering ve routing kurallari
- Build optimizasyon kontrolleri
- Code review agent'a framework pattern'leri eklenir
- Vanilla web projelerinde semantik HTML ve erisilebirlik kurallari

## Affects Core

- code-review: framework-spesifik anti-pattern kontrolu
- task-hunter: IMPLEMENTATION_RULES'a framework kurallari eklenir
