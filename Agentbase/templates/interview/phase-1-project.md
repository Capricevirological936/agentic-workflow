# Phase 1 — Project Foundations

> **Feeds:** `PROJECT.md`, `ARCHITECTURE.md`, `README.md`
> **Goal:** Projenin ne oldugunu, kime hizmet ettigini ve nasil deploy edildigini anlamak.

---

## Auto-Detection (Sorulardan Once Calistir)

Bootstrap bu phase'e baslamadan once asagidaki bilgileri codebase'den otomatik cikarir:

| Field                        | Detection Source                                  | Manifest Path                     |
|------------------------------|---------------------------------------------------|-----------------------------------|
| Project name                 | `package.json#name` / `pyproject.toml#name` / directory name | `manifest.project.name`           |
| Tech stack                   | Dependency files, framework imports, file extensions | `manifest.stack.detected`         |
| Directory structure          | Filesystem scan (max depth 3)                     | `manifest.project.structure`      |
| Existing scripts             | `package.json#scripts` / `Makefile` / `pyproject.toml#scripts` | `manifest.project.scripts`        |
| Monorepo subprojects         | Workspace config / multiple package.json / apps+packages dirs | `manifest.project.subprojects[]`  |
| API framework                | Express/Fastify/Django/Laravel/FastAPI imports     | `manifest.stack.api_framework`    |
| Deploy config                | `Dockerfile`, `docker-compose.yml`, `.github/workflows/`, `vercel.json`, `netlify.toml`, `coolify` config | `manifest.environments.deploy_hints` |

---

## Questions

### Q1 — Proje Aciklamasi
- **Text:** `"Codebase'i analiz ettim. Bu bir [{detected_stack}] projesi gibi gorunuyor. Proje ne yapiyor? Kim icin? (Tek cumle yeterli)"`
- **Type:** open-ended
- **Skip condition:** never — always ask
- **Maps to:** `manifest.project.description`
- **Downstream:** `PROJECT.md` header, `README.md` description section

### Q2 — Ortamlar (Environments)
- **Text:** `"Hangi ortamlarda calisiyor?"`
- **Options:**
  - `a)` Sadece local
  - `b)` Local + staging
  - `c)` Local + production
  - `d)` Local + staging + production
- **Follow-up (if c or d):** `"Production URL/domain nedir?"`
- **Skip condition:** No deploy config detected AND no Dockerfile AND no docker-compose
- **Maps to:** `manifest.environments[]`
- **Downstream:** `PROJECT.md` environments table, `ARCHITECTURE.md` deployment section

### Q3 — Deploy Yontemi
- **Text:** `"Deploy nasil yapiliyor?"`
- **Show hint:** `"[Dockerfile bulundu]"` or `"[CI config bulundu]"` if applicable
- **Options:**
  - `a)` Manuel deploy (SSH + pull)
  - `b)` Git push → otomatik deploy (Coolify/Vercel/Railway/Netlify/diger)
  - `c)` CI/CD pipeline (GitHub Actions/GitLab CI/diger)
  - `d)` Henuz deploy yok
- **Follow-up (if b):** `"Hangi platform?"`
- **Skip condition:** No Dockerfile AND no CI config AND no docker-compose
- **Maps to:** `manifest.environments[].deploy_platform`, `manifest.environments[].deploy_trigger`
- **Downstream:** `ARCHITECTURE.md` deploy pipeline section, CI/CD hook generation

### Q4 — Monorepo Alt Projeler
- **Text:** `"Su alt projeleri tespit ettim: [{subprojects}]. Her birinin rolu ne?"`
- **Type:** key=value list (e.g. `api=backend REST API, mobile=kullanici uygulamasi`)
- **Skip condition:** Monorepo NOT detected (single project)
- **Maps to:** `manifest.project.subprojects[].role`
- **Downstream:** `ARCHITECTURE.md` subproject sections, per-subproject rules generation

### Q5 — API Prefix
- **Text:** `"API prefix yapisiniz nedir? (orn: /api/v1, /v1, prefix yok)"`
- **Type:** short text
- **Skip condition:** No API framework detected
- **Maps to:** `manifest.project.api_prefix`
- **Downstream:** `ARCHITECTURE.md` API structure section, route rules

---

## Phase Completion

When all applicable questions are answered, Bootstrap:

1. Populates `manifest.project.*` and `manifest.environments[]`
2. Generates draft `PROJECT.md` from template + answers
3. Generates draft `ARCHITECTURE.md` structure section
4. Proceeds to **Phase 2 — Technical Preferences**
