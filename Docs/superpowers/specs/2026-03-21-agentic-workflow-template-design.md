# Agentic Workflow Template System — Design Spec

**Tarih:** 2026-03-21
**Durum:** Onaylandı

---

## Ozet

Kaynak projede basariyla kullanilan agentic workflow sistemini, herhangi bir projeye uygulanabilir bir template haline getirmek. Bootstrap komutu Codebase'i analiz edip, fazli roportajla eksik bilgileri toplayarak tum workflow dosyalarini proje-spesifik olarak uretir.

## Temel Kararlar

| Karar | Secim |
|-------|-------|
| Bilgi kaynagi | Codebase analizi + interaktif roportaj |
| Hedef platform | Sadece Claude Code |
| Cikti kapsami | Moduler — codebase'e gore sadece gerekli moduller |
| Kullanici | Herhangi bir gelistirici (bagimsiz template) |
| Backlog.md | Zorunlu — yoksa dur ve kurulum yonergesi ver |
| Roportaj yapisi | Fazli (4 faz), ultra-derin dusunulmus |
| Dosya uretimi | Hibrit — sabit iskelet + generative proje-spesifik icerik |

## Mimari

### Agentbase/Codebase Ayrimi (Kutsal Kural)

```
Agentbase/  →  Ajanlarin SPAWN oldugu yer. Tum config, command, hook, rule BURADA yasir.
Codebase/   →  Gercek proje kodu. Ajanlar BURAYA erisir, okur, yazar. Config OLMAZ.
Docs/       →  Proje dokumanlari. Ajanlar referans olarak okur.
```

**Kutsal Kurallar:**
1. **Git sadece Codebase'de calisir** — Agentbase kendi repo'sunda versiyon kontrolu yapmaz, git komutlari her zaman Codebase dizininde calistirilir.
2. **Bootstrap Codebase'e ASLA yazmaz** — Bootstrap sureci sadece Agentbase/ ve Docs/ altina dosya uretir. Codebase/ dizini salt okunurdur, Bootstrap oraya hicbir dosya yazmaz.

### Template Repo Yapisi

```
agentic-workflow/
├── Agentbase/
│   ├── .claude/
│   │   ├── CLAUDE.md                       # Bootstrap uretecek
│   │   ├── settings.json                   # Bootstrap uretecek
│   │   ├── settings.local.json             # Bos sablon
│   │   ├── agents/                         # Bootstrap dolduracak
│   │   ├── commands/
│   │   │   └── bootstrap.md                # TEK sabit command — orkestrator
│   │   ├── hooks/                          # Bootstrap dolduracak
│   │   ├── rules/                          # Bootstrap dolduracak
│   │   ├── reports/                        # Bos
│   │   └── tracking/                       # Bos
│   │
│   ├── templates/
│   │   ├── core/                           # Her projede uretilen iskeletler
│   │   │   ├── CLAUDE.md.skeleton
│   │   │   ├── settings.skeleton.json
│   │   │   ├── claude-ignore.skeleton
│   │   │   ├── agents/
│   │   │   │   ├── code-review.skeleton.md
│   │   │   │   └── regression-analyzer.skeleton.md
│   │   │   ├── commands/
│   │   │   │   ├── task-hunter.skeleton.md
│   │   │   │   ├── task-master.skeleton.md
│   │   │   │   ├── task-conductor.skeleton.md
│   │   │   │   ├── task-review.skeleton.md
│   │   │   │   ├── task-plan.skeleton.md
│   │   │   │   ├── bug-hunter.skeleton.md
│   │   │   │   ├── bug-review.skeleton.md
│   │   │   │   └── memorize.skeleton.md
│   │   │   ├── hooks/
│   │   │   │   ├── code-review-check.skeleton.js
│   │   │   │   └── test-reminder.skeleton.js
│   │   │   └── rules/
│   │   │       ├── memory-protocol.md          # Sabit
│   │   │       └── workflow-lifecycle.skeleton.md
│   │   │
│   │   ├── modules/                       # Kategori bazli modul yapisi
│   │   │   ├── orm/                       # ORM/Migration kategorisi
│   │   │   │   ├── detect.md              # Kategori-seviye tespit
│   │   │   │   ├── prisma/                # Alt varyant
│   │   │   │   │   ├── detect.md
│   │   │   │   │   ├── hooks/ (3 sabit hook)
│   │   │   │   │   └── rules/ (1 skeleton)
│   │   │   │   ├── eloquent/              # Alt varyant (Laravel)
│   │   │   │   ├── django-orm/            # Alt varyant
│   │   │   │   └── typeorm/               # Alt varyant
│   │   │   ├── deploy/                    # Deploy kategorisi
│   │   │   │   ├── detect.md
│   │   │   │   ├── docker/                # Alt varyant
│   │   │   │   │   ├── detect.md
│   │   │   │   │   ├── commands/ (2 skeleton)
│   │   │   │   │   └── agents/ (1 skeleton)
│   │   │   │   ├── coolify/               # Alt varyant
│   │   │   │   │   ├── detect.md
│   │   │   │   │   ├── commands/ (2 skeleton)
│   │   │   │   │   └── agents/ (1 skeleton)
│   │   │   │   └── vercel/                # Alt varyant
│   │   │   ├── backend/                   # Backend framework kategorisi (recursive)
│   │   │   │   ├── detect.md
│   │   │   │   ├── nodejs/                # Aile
│   │   │   │   │   ├── detect.md
│   │   │   │   │   ├── express/           # Leaf varyant
│   │   │   │   │   ├── fastify/           # Leaf varyant
│   │   │   │   │   └── nestjs/            # Leaf varyant
│   │   │   │   ├── php/                   # Aile
│   │   │   │   │   ├── detect.md
│   │   │   │   │   ├── laravel/           # Leaf varyant
│   │   │   │   │   └── codeigniter4/      # Leaf varyant
│   │   │   │   └── python/                # Aile
│   │   │   │       ├── detect.md
│   │   │   │       ├── django/            # Leaf varyant
│   │   │   │       └── fastapi/           # Leaf varyant
│   │   │   ├── mobile/                    # Mobil kategorisi
│   │   │   │   ├── detect.md
│   │   │   │   ├── expo/                  # Alt varyant
│   │   │   │   │   ├── detect.md
│   │   │   │   │   └── rules/ (1 skeleton)
│   │   │   │   ├── react-native/          # Alt varyant
│   │   │   │   │   ├── detect.md
│   │   │   │   │   └── rules/ (1 skeleton)
│   │   │   │   └── flutter/               # Alt varyant
│   │   │   │       ├── detect.md
│   │   │   │       └── rules/ (1 skeleton)
│   │   │   ├── frontend/                  # Frontend kategorisi
│   │   │   │   ├── detect.md
│   │   │   │   ├── nextjs/                # Alt varyant
│   │   │   │   │   ├── detect.md
│   │   │   │   │   └── rules/ (1 skeleton)
│   │   │   │   ├── react/                 # Alt varyant (SPA)
│   │   │   │   │   ├── detect.md
│   │   │   │   │   └── rules/ (1 skeleton)
│   │   │   │   └── html/                  # Alt varyant (statik)
│   │   │   │       ├── detect.md
│   │   │   │       └── rules/ (1 skeleton)
│   │   │   ├── monorepo/                  # Bagimsiz modul
│   │   │   │   ├── detect.md
│   │   │   │   ├── commands/ (1 skeleton)
│   │   │   │   └── hooks/ (1 skeleton)
│   │   │   └── security/                  # Bagimsiz modul
│   │   │       ├── detect.md
│   │   │       └── commands/ (1 skeleton)
│   │   │
│   │   └── interview/
│   │       ├── phase-1-project.md
│   │       ├── phase-2-technical.md
│   │       ├── phase-3-developer.md
│   │       └── phase-4-rules.md
│   │
│   ├── PROJECT.md              # Bootstrap uretecek
│   ├── STACK.md                # Bootstrap uretecek
│   ├── DEVELOPER.md            # Bootstrap uretecek
│   ├── ARCHITECTURE.md         # Bootstrap uretecek
│   ├── WORKFLOWS.md            # Bootstrap uretecek
│   ├── BACKLOG.md              # Sabit — Backlog CLI kilavuzu
│   ├── CLAUDE.md               # Root CLAUDE.md — Bootstrap uretecek
│   ├── .mcp.json               # Bootstrap uretecek
│   ├── .claude-ignore          # Bootstrap uretecek
│   └── README.md               # Bootstrap uretecek
│
├── Codebase/                   # Kullanici projesini buraya koyar
└── Docs/
    └── agentic/
        └── project-manifest.yaml   # Bootstrap uretecek
```

## Bootstrap Akisi

### On Kosul Kontrolleri

1. **Backlog CLI** — `which backlog` → yoksa DUR, kurulum yonergesi ver
2. **Codebase/** — dizin var ve icerik var → yoksa DUR, symlink yonergesi ver
3. **Onceki Bootstrap** — manifest varsa uyumluluk kontrolu yap, `overwrite` / `merge` / `incremental` modlarini sun; `.claude/custom/` ve kurtarma kopyalariyla customization korumasi uygula

### Codebase Analiz Motoru

5 adimli tarama:
1. Proje tipi tespiti (package.json, composer.json, go.mod, vb.)
2. Dizin yapisi haritasi (derinlik 3)
3. Teknoloji yigini cikarimi (test, linter, ORM, DB, CI/CD, container)
4. Modul tespiti (kategori → aile → leaf recursive detect.md kurallari)
5. Mevcut komut/script tespiti (package.json scripts, Makefile)

### Fazli Roportaj

**Faz 1 — Proje Temelleri (3-5 soru)**
- Proje ne yapiyor, kim icin
- Hangi ortamlar (local/staging/production)
- Deploy nasil yapiliyor
- Subproject rolleri (monorepo ise)
- API prefix yapisi (API varsa)

**Faz 2 — Teknik Tercihler (3-5 soru)**
- Test stratejisi (TDD/varsa/minimal/yok)
- Branch modeli (direct push/feature PR/gitflow/trunk)
- Commit convention (conventional/serbest/ozel)
- Migration stratejisi (DB varsa)
- Auto-format isteniyor mu

**Faz 3 — Gelistirici Profili (2-3 soru)**
- Deneyim seviyesi (junior/mid/senior/stack-yeni)
- Calisma dili (TR/EN/diger)
- Otonomi seviyesi (her adim onay/plan sonra otonom/tam otonom)

**Faz 4 — Domain Kurallari (2-4 soru)**
- Yasak komutlar/pattern'ler
- Tasarim sistemi/component library
- Domain-spesifik kurallar
- Ek notlar

### Manifest Uretimi

Roportaj sonrasi `Docs/agentic/project-manifest.yaml` uretilir.
Kullaniciya gosterilir ve onay alinir.
Manifest icerigi: manifest metadata (`version`, `template_version`, `generation_mode`, `managed_files` checksum'lari), project, subprojects, stack, environments, developer, workflows, modules, rules.

### Re-bootstrap Modlari

- **Overwrite** — Bootstrap-yonetimli dosyalar sifirdan uretilir; `.claude/custom/` korunur; yerel degisiklik gorulen yonetilen dosyalar once rescue alanina kopyalanir.
- **Merge** — Mevcut manifest cevaplari korunur, yeni codebase tespitleri eklenir, artik aktif olmayan moduller pasife alinir; sadece etkilenen dosyalar guncellenir.
- **Incremental** — Sadece template'i veya manifest girdisi degisen dosyalar yeniden uretilir; customization gorulen yonetilen dosyalar yerinde ezilmez.

Uyumluluk kurali: `manifest.version` ayni major surumdeyse `merge` ve `incremental` desteklenir. Alan yoksa veya major farkliysa yalnizca `overwrite` veya iptal sunulur.

### Dosya Uretimi

1. templates/core/ iskeletlerini oku
2. Aktif templates/modules/ iskeletlerini oku
3. Sabit dosyalari dogrudan kopyala
4. Skeleton dosyalarindaki GENERATE bloklarini manifest verisiyle doldur
5. Modul etkilesim matrisine gore cross-module icerikleri birlestir (teammate mode: her skeleton icin bir teammate agent spawn edilerek paralel uretim yapilabilir)
6. Final dosyalari .claude/ altina yaz
7. Root dosyalari (PROJECT.md, STACK.md, vb.) uret
8. settings.json ve .mcp.json uret
9. backlog init + ilk task'lari olustur
10. Kurulum raporu

## Skeleton Formati

Skeleton dosyalari iki tur bolum icerir:
- **Sabit iskelet** — Her projede degismeden kalan yapisal bloklar
- **`<!-- GENERATE: BLOCK_NAME -->` bloklari** — Bootstrap'in manifest verisiyle dolduracagi bolumler

## Modul Etkilesim Matrisi

```
                    task-hunter  task-review  code-review  workflow   CLAUDE.md  settings
core                    ✓            ✓            ✓           ✓          ✓          ✓
orm/*                   +verify      —            —           +migrate   +rules     +hooks
deploy/*                —            —            —           +deploy    +deploy    —
backend/**              —            —            +framework  —          +rules     +hooks
mobile/*                +rules       —            +theme      —          +rules     —
frontend/*              +rules       —            +framework  —          +rules     —
monorepo                +paths       +cross       +cross      —          —          +format
security                —            +idor        +idor       —          —          —
```

Not: `backend/**` recursive yapidadir (kategori → aile → leaf). `orm/*`, `deploy/*`, `mobile/*`, `frontend/*` tek seviye alt varyant icerir.

## Moduller

### Core (her projede)
Commands: task-hunter, task-master, task-conductor, task-review, task-plan, bug-hunter, bug-review, memorize
Agents: code-review, regression-analyzer
Hooks: code-review-check.js, test-reminder.js
Rules: memory-protocol.md (sabit), workflow-lifecycle.md

### orm/* — ORM/Migration Kategorisi
**prisma** (schema.prisma + @prisma/client):
  Hooks: prisma-db-push-guard.js, prisma-migration-check.js, destructive-migration-check.js (hepsi sabit)
  Rules: prisma-rules.md
**eloquent** (composer.json + laravel/framework):
  Hooks: migration-guard.js
  Rules: eloquent-rules.md
**django-orm** (manage.py + django):
  Hooks: migration-guard.js
  Rules: django-orm-rules.md
**typeorm** (typeorm dependency + config):
  Hooks: schema-sync-guard.js
  Rules: typeorm-rules.md

### deploy/* — Deploy Kategorisi
**docker** (Dockerfile + docker-compose):
  Commands: pre-deploy, post-deploy
  Agents: devops
**coolify** (coolify config + docker):
  Commands: pre-deploy, post-deploy
  Agents: devops
**vercel** (vercel.json + next/static):
  Commands: pre-deploy

### backend/** — Backend Framework Kategorisi
**nodejs** aile seviyesi:
  Rules: nodejs-rules.md
  Leaf'ler: express, fastify, nestjs
**php** aile seviyesi:
  Rules: php-backend-rules.md
  Leaf'ler: laravel, codeigniter4
**python** aile seviyesi:
  Rules: python-backend-rules.md
  Leaf'ler: django, fastapi

### mobile/* — Mobil Kategorisi
**expo** (expo config + expo dependency):
  Rules: design-system.md
**react-native** (react-native dependency, expo degil):
  Rules: react-native-rules.md
**flutter** (pubspec.yaml + flutter SDK):
  Rules: flutter-rules.md

### frontend/* — Frontend Kategorisi
**nextjs** (next dependency + next.config.*):
  Rules: nextjs-rules.md
**react** (react dependency, next/expo/RN degil — SPA):
  Rules: react-rules.md
**html** (index.html + CSS/JS, framework yok):
  Rules: html-rules.md

### Bagimsiz Moduller

**monorepo** (workspaces/lerna/nx/turbo):
  Commands: review-module
  Hooks: auto-format.js

**security** (API endpoint'ler):
  Commands: idor-scan
