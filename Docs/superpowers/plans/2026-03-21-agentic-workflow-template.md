# Agentic Workflow Template System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kaynak projede basariyla kullanilan agentic workflow sistemini, herhangi bir projeye uygulanabilir bir template haline getirmek.

**Architecture:** Agentbase/Codebase ayrimi korunur. Bootstrap komutu Agentbase icerisinden calisir, Codebase'i analiz eder, templates/ altindaki skeleton dosyalarini manifest verisiyle birlestirerek .claude/ altina proje-spesifik dosyalar uretir. Moduler yapi ile sadece projeye uyan bilesenleri aktive eder.

**Tech Stack:** Claude Code CLI, Backlog.md CLI, Markdown skeleton templates, Node.js hooks

**Spec:** `Docs/superpowers/specs/2026-03-21-agentic-workflow-template-design.md`

---

## Dosya Haritasi

### Silinecek (proje-spesifik)
- `Agentbase/AGENTS.md`
- `Agentbase/GEMINI.md`
- `Agentbase/.claude/CLAUDE.md` (ic CLAUDE.md — proje-spesifik)
- `Agentbase/.claude/agents/*` (tumu — skeleton'larla degistirilecek)
- `Agentbase/.claude/commands/*` (bootstrap haric tumu — skeleton'larla degistirilecek)
- `Agentbase/.claude/hooks/*` (tumu — skeleton/sabit ile degistirilecek)
- `Agentbase/.claude/rules/frost-design-system.md`
- `Agentbase/.claude/rules/error-tracking.md`
- `Agentbase/.claude/rules/workflow-lifecycle.md`
- `Agentbase/.claude/rules/memory-protocol.md`
- `Agentbase/.claude/tracking/*`
- `Agentbase/.claude/reports/simple.md`
- `Agentbase/.claude/settings.json` (yeniden uretilecek)
- `Agentbase/.mcp.json` (yeniden uretilecek)
- `Agentbase/CLAUDE.md` (root — yeniden uretilecek)
- `Docs/sozlesmeler/` (proje-spesifik)
- `Docs/plans/` (proje-spesifik)
- `Docs/mock/` (proje-spesifik)
- `Docs/prompts/` (proje-spesifik)
- `Docs/postman/` (proje-spesifik)
- `Docs/api/` (proje-spesifik)
- `Docs/data/` (proje-spesifik)
- `Docs/domain/` (proje-spesifik)
- `Docs/architecture/` (proje-spesifik)
- `Docs/decisions/` (proje-spesifik — template'de backlog decisions kullanilir)
- Proje-spesifik docs dosyalari (PUSH_NOTIFICATION_SETUP.md, TURKIYE_PLAKA_SISTEMI.md, vb.)

### Olusturulacak
- `Agentbase/templates/` (tum alt dizinler ve dosyalar)
- `Agentbase/.claude/commands/bootstrap.md`
- `Agentbase/README.md` (yeniden yazilacak)

### Korunacak (yapisal)
- `Agentbase/PROJECT.md` (TODO stub — Bootstrap dolduracak)
- `Agentbase/STACK.md` (TODO stub)
- `Agentbase/DEVELOPER.md` (TODO stub)
- `Agentbase/ARCHITECTURE.md` (TODO stub)
- `Agentbase/WORKFLOWS.md` (TODO stub)
- `Agentbase/BACKLOG.md` (sabit — Backlog CLI kilavuzu)
- `Codebase/` (bos dizin)
- `Docs/superpowers/` (spec ve plan dosyalari)

---

## Task 1: Dizin Yapisi ve Temizlik

**Files:**
- Remove: Tum proje-spesifik dosyalar (yukaridaki liste)
- Create: `Agentbase/templates/core/agents/`, `templates/core/commands/`, `templates/core/hooks/`, `templates/core/rules/`
- Create: `Agentbase/templates/modules/prisma/hooks/`, `modules/prisma/rules/`
- Create: `Agentbase/templates/modules/docker/commands/`, `modules/docker/agents/`
- Create: `Agentbase/templates/modules/monorepo/commands/`, `modules/monorepo/hooks/`
- Create: `Agentbase/templates/modules/security/commands/`
- Create: `Agentbase/templates/modules/expo/rules/`
- Create: `Agentbase/templates/interview/`
- Create: `Docs/agentic/`

- [ ] **Step 1: proje-spesifik dosyalari sil**

```bash
# Agentbase icerisindeki proje-spesifik dosyalar
rm -f Agentbase/AGENTS.md Agentbase/GEMINI.md
rm -f Agentbase/.claude/CLAUDE.md
rm -rf Agentbase/.claude/agents/*
rm -f Agentbase/.claude/commands/bug-hunter.md Agentbase/.claude/commands/bug-review.md
rm -f Agentbase/.claude/commands/idor-scan.md Agentbase/.claude/commands/memorize.md
rm -f Agentbase/.claude/commands/post-deploy.md Agentbase/.claude/commands/pre-deploy.md
rm -f Agentbase/.claude/commands/review-module.md Agentbase/.claude/commands/task-conductor.md
rm -f Agentbase/.claude/commands/task-hunter.md Agentbase/.claude/commands/task-master.md
rm -f Agentbase/.claude/commands/task-plan.md Agentbase/.claude/commands/task-review.md
rm -f Agentbase/.claude/commands/varien.md
rm -rf Agentbase/.claude/hooks/*
rm -f Agentbase/.claude/rules/frost-design-system.md
rm -f Agentbase/.claude/rules/error-tracking.md
rm -f Agentbase/.claude/rules/workflow-lifecycle.md
rm -f Agentbase/.claude/rules/memory-protocol.md
rm -rf Agentbase/.claude/tracking/*
rm -f Agentbase/.claude/reports/simple.md
rm -f Agentbase/.claude/settings.json
rm -f Agentbase/.mcp.json
rm -f Agentbase/CLAUDE.md
rm -f Agentbase/bootstrap.md

# Docs icerisindeki proje-spesifik dosyalar
rm -rf Docs/sozlesmeler Docs/plans Docs/mock Docs/prompts Docs/postman
rm -rf Docs/api Docs/data Docs/domain Docs/architecture Docs/decisions
rm -f Docs/PUSH_NOTIFICATION_SETUP.md Docs/TURKIYE_PLAKA_SISTEMI.md
rm -f Docs/KKTC_PLAKA_SISTEMI.md Docs/3RD_PARTY_INTEGRATION.md
rm -f Docs/TEST_DOCUMENTATION.md Docs/TEST_SETUP_GUIDE.md
rm -f Docs/standards.md Docs/paket.md Docs/paket.xlsx
rm -f Docs/ENGINEERING_STANDARDS.md Docs/NOTIFICATION_SYSTEM.md
rm -f Docs/task-conductor-kullanim.md
```

- [ ] **Step 2: Template dizin yapisini olustur**

```bash
mkdir -p Agentbase/templates/core/{agents,commands,hooks,rules}
mkdir -p Agentbase/templates/modules/prisma/{hooks,rules}
mkdir -p Agentbase/templates/modules/docker/{commands,agents}
mkdir -p Agentbase/templates/modules/monorepo/{commands,hooks}
mkdir -p Agentbase/templates/modules/security/commands
mkdir -p Agentbase/templates/modules/expo/rules
mkdir -p Agentbase/templates/interview
mkdir -p Agentbase/.claude/{agents,commands,hooks,rules,reports,reports/deploys,tracking,tracking/errors}
mkdir -p Docs/agentic
```

- [ ] **Step 3: Placeholder dosyalari olustur**

Bos .gitkeep dosyalari:
```bash
touch Agentbase/.claude/reports/.gitkeep
touch Agentbase/.claude/reports/deploys/.gitkeep
touch Agentbase/.claude/tracking/.gitkeep
touch Agentbase/.claude/tracking/errors/.gitkeep
```

Minimal settings dosyalari:
```json
// Agentbase/.claude/settings.local.json
{
  "permissions": {
    "allow": [],
    "deny": [],
    "ask": []
  }
}
```

- [ ] **Step 4: TODO stub dosyalarini guncelle**

Mevcut PROJECT.md, STACK.md, DEVELOPER.md, ARCHITECTURE.md, WORKFLOWS.md dosyalarinin TODO yorumlarini koru — bunlar zaten Bootstrap'in dolduracagi stub'lar.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: proje-spesifik dosyalari temizle, template dizin yapisini olustur"
```

---

## Task 2: Bootstrap Komutu

**Files:**
- Create: `Agentbase/.claude/commands/bootstrap.md`

Bu dosya tum sistemin kalbi — orkestrator. Codebase analizi, fazli roportaj, manifest uretimi ve dosya olusturma mantigi burada.

- [ ] **Step 1: bootstrap.md dosyasini yaz**

Dosya icerigi asagidaki bolumlerden olusur:

1. On kosul kontrolleri (Backlog CLI, Codebase dizini, onceki Bootstrap)
2. Codebase analiz motoru (5 adimli tarama)
3. Otomatik modul tespiti (detect.md dosyalarini oku)
4. Fazli roportaj sistemi (4 faz — interview/ dosyalarini referans alir)
5. Manifest uretimi (project-manifest.yaml)
6. Manifest onay adimi
7. Dosya uretim motoru (skeleton okuma + GENERATE bloklari doldurma)
8. settings.json uretimi
9. .mcp.json uretimi
10. backlog init + ilk task'lar
11. Kurulum raporu

- [ ] **Step 2: Dosyayi dogrula — syntax ve referans tutarliligi**

Tum referans edilen dosya yollarinin templates/ altinda mevcut olacagindan emin ol.

- [ ] **Step 3: Commit**

```bash
git add Agentbase/.claude/commands/bootstrap.md
git commit -m "feat: Bootstrap orkestrator komutunu olustur"
```

---

## Task 3: Roportaj Sistemi

**Files:**
- Create: `Agentbase/templates/interview/phase-1-project.md`
- Create: `Agentbase/templates/interview/phase-2-technical.md`
- Create: `Agentbase/templates/interview/phase-3-developer.md`
- Create: `Agentbase/templates/interview/phase-4-rules.md`

Her faz dosyasi su formati izler:
- Faz aciklamasi ve hedef dosyalar
- Codebase'den otomatik doldurulan alanlar
- Soru listesi (numara, soru metni, secenekler, atlama kosullari, etkiledigi manifest alani)

- [ ] **Step 1: phase-1-project.md yaz**

Proje temelleri: ne yapiyor, ortamlar, deploy, subproject rolleri, API prefix.

- [ ] **Step 2: phase-2-technical.md yaz**

Teknik tercihler: test stratejisi, branch modeli, commit convention, migration, formatter.

- [ ] **Step 3: phase-3-developer.md yaz**

Gelistirici profili: deneyim, dil, otonomi seviyesi.

- [ ] **Step 4: phase-4-rules.md yaz**

Domain kurallari: yasak komutlar, tasarim sistemi, domain kuralları.

- [ ] **Step 5: Commit**

```bash
git add Agentbase/templates/interview/
git commit -m "feat: Fazli roportaj soru sablonlarini olustur"
```

---

## Task 4: Core Command Skeleton'lari

**Files:**
- Create: `Agentbase/templates/core/commands/task-hunter.skeleton.md`
- Create: `Agentbase/templates/core/commands/task-master.skeleton.md`
- Create: `Agentbase/templates/core/commands/task-conductor.skeleton.md`
- Create: `Agentbase/templates/core/commands/task-review.skeleton.md`
- Create: `Agentbase/templates/core/commands/task-plan.skeleton.md`
- Create: `Agentbase/templates/core/commands/bug-hunter.skeleton.md`
- Create: `Agentbase/templates/core/commands/bug-review.skeleton.md`
- Create: `Agentbase/templates/core/commands/memorize.skeleton.md`

Her skeleton mevcut kaynak command'dan turetilir:
- Proje-spesifik referanslar (dosya yollari, proje tanimlari, stack-spesifik kurallar) `<!-- GENERATE: BLOCK_NAME -->` bloklarina donusturulur
- Is akisi yapisi, karar agaclari, zorunlu kurallar SABIT kalir

- [ ] **Step 1: task-hunter.skeleton.md yaz**

Kaynak: mevcut task-hunter.md (707 satir)
Templatize edilecek bolumler:
- CODEBASE_CONTEXT (proje tanimi, stack)
- FILE_DISCOVERY_HINTS (dizin yollari, dosya pattern'leri)
- IMPLEMENTATION_RULES (tema hook, API format, stack kuralları)
- VERIFICATION_COMMANDS (test, tsc, lint, migration komutlari)
- COMMIT_CONVENTION (prefix haritasi, dil)
- PROJECT_SPECIFIC_RULES (domain kuralları)

Sabit kalan bolumler:
- Arguman ayristirma
- 7 adimli is akisi yapisi
- Teammate delegation matrisi
- Verification gate karar agaci
- Backlog task lifecycle
- 15 zorunlu kural (proje-bagimsiz olanlar)

- [ ] **Step 2: task-master.skeleton.md yaz**

Kaynak: mevcut task-master.md (282 satir)
Templatize: CODEBASE_CONTEXT
Sabit: 4D skorlama algoritmasi, faz atama kurallari, rapor formati
(Bu command zaten buyuk olcude jenerik)

- [ ] **Step 3: task-conductor.skeleton.md yaz**

Kaynak: mevcut task-conductor.md (660 satir)
Templatize: CODEBASE_CONTEXT, VERIFICATION_COMMANDS, COMMIT_CONVENTION
Sabit: 5 mod, 4D skorlama, faz dongusu, paralel mod, state yonetimi, 18 zorunlu kural

- [ ] **Step 4: task-review.skeleton.md yaz**

Kaynak: mevcut task-review.md (321 satir)
Templatize: CODEBASE_CONTEXT, REVIEW_CHECKLIST (stack-spesifik maddeler)
Sabit: 3-agent paralel yapi, karar agaci, sonsuz dongu koruması, rapor formati

- [ ] **Step 5: task-plan.skeleton.md yaz**

Kaynak: mevcut task-plan.md (522 satir)
Templatize: CODEBASE_CONTEXT, FILE_DETECTION_PATTERNS, AC_TEMPLATES
Sabit: 6 adimli akis, model oneri matrisi, kapsam bolme stratejisi

- [ ] **Step 6: bug-hunter.skeleton.md yaz**

Kaynak: mevcut bug-hunter.md (417 satir)
Templatize: CODEBASE_CONTEXT, VERIFICATION_COMMANDS, COMMIT_CONVENTION
Sabit: 8 adimli akis, 3-hipotez siniri, verification gate, zorunlu kurallar

- [ ] **Step 7: bug-review.skeleton.md yaz**

Kaynak: mevcut bug-review.md (360 satir)
Templatize: CODEBASE_CONTEXT, REVIEW_CHECKLIST
Sabit: 3-agent paralel yapi, karar agaci, rapor formati

- [ ] **Step 8: memorize.skeleton.md yaz**

Kaynak: mevcut memorize.md (131 satir)
Templatize: MEMORY_PATH (memory dizin yolu)
Sabit: Felsefe, 4 adimli akis, kayit kriterleri, zorunlu kurallar
(Bu command zaten buyuk olcude jenerik)

- [ ] **Step 9: Commit**

```bash
git add Agentbase/templates/core/commands/
git commit -m "feat: Core command skeleton'larini olustur"
```

---

## Task 5: Core Agent Skeleton'lari

**Files:**
- Create: `Agentbase/templates/core/agents/code-review.skeleton.md`
- Create: `Agentbase/templates/core/agents/regression-analyzer.skeleton.md`

- [ ] **Step 1: code-review.skeleton.md yaz**

Kaynak: mevcut code-review.md
Templatize:
- CODEBASE_CONTEXT (proje tanimi)
- PROJECT_CHECKLIST (stack-spesifik review maddeleri — JWT, Prisma, IDOR, UI kurallari vb.)
Sabit:
- Review hedefleri, surec adimlari
- Bulgu kategorileri (Critical, Warning, Suggestion)
- Cikti formati, temel ilkeler

Frontmatter: `name: code-review, tools: Read, Grep, Glob, Bash`

- [ ] **Step 2: regression-analyzer.skeleton.md yaz**

Kaynak: mevcut regression-analyzer.md
Templatize:
- CODEBASE_CONTEXT
- PROJECT_PATHS (proje dizin yollari — API, Mobile vb.)
Sabit:
- 4 adimli surec (diff, consumer, risk, rapor)
- Risk seviyeleri (HIGH/MEDIUM/LOW)
- Raporlama kurallari

Frontmatter: `name: regression-analyzer, model: opus, color: yellow`

- [ ] **Step 3: Commit**

```bash
git add Agentbase/templates/core/agents/
git commit -m "feat: Core agent skeleton'larini olustur"
```

---

## Task 6: Core Hook Skeleton'lari

**Files:**
- Create: `Agentbase/templates/core/hooks/code-review-check.skeleton.js`
- Create: `Agentbase/templates/core/hooks/test-reminder.skeleton.js`

- [ ] **Step 1: code-review-check.skeleton.js yaz**

Kaynak: mevcut code-review-check.js
Templatize:
- SECURITY_PATTERNS dizisi — genel guvenlik pattern'leri sabit, stack-spesifik olanlar (PHP superglobals vb.) modulden eklenir
- FILE_EXTENSIONS dizisi — projedeki dil uzantilari
Sabit: Hook yapisi (stdin okuma, pattern tarama, cikti formati)

- [ ] **Step 2: test-reminder.skeleton.js yaz**

Kaynak: mevcut test-reminder.js
Templatize:
- LAYER_TESTS dizisi — manifest'teki subproject'lere gore uretilir
- CODE_EXTENSIONS dizisi
Sabit: Hook yapisi, state dosyasi mantigi, cikti formati

- [ ] **Step 3: Commit**

```bash
git add Agentbase/templates/core/hooks/
git commit -m "feat: Core hook skeleton'larini olustur"
```

---

## Task 7: Core Rule Dosyalari

**Files:**
- Create: `Agentbase/templates/core/rules/memory-protocol.md` (sabit kopya)
- Create: `Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md`

- [ ] **Step 1: memory-protocol.md yaz (sabit)**

Mevcut memory-protocol.md'den proje-spesifik dizin yolunu cikar, jenerik hale getir.
Icerik: ne zaman kaydet, ne zaman kaydetme, nasil kaydet, format kurallari.

- [ ] **Step 2: workflow-lifecycle.skeleton.md yaz**

Kaynak: mevcut workflow-lifecycle.md (cok buyuk dosya)
Templatize:
- COMMIT_CONVENTION (prefix haritasi, dil)
- DEPLOY_WORKFLOW (deploy akisi — docker modulu aktifse doldurulur)
- ENVIRONMENT_DIFFERENCES (dev vs production farklari)
- RECOVERY_PROCEDURES (rollback proseduru — docker modulu aktifse)
- HOOK_BEHAVIORS (pre-commit, pre-push kontrolleri)
Sabit:
- Tek task akisi
- Coklu task akisi
- Bug fix akisi
- Modul review akisi
- Otonom review akisi
- Conductor akisi
- Failure cascade onleme tablosu
- Genel kritik kurallar

- [ ] **Step 3: Commit**

```bash
git add Agentbase/templates/core/rules/
git commit -m "feat: Core rule dosyalarini olustur"
```

---

## Task 8: CLAUDE.md ve Config Skeleton'lari

**Files:**
- Create: `Agentbase/templates/core/CLAUDE.md.skeleton`
- Create: `Agentbase/templates/core/settings.skeleton.json`
- Create: `Agentbase/templates/core/claude-ignore.skeleton`

- [ ] **Step 1: CLAUDE.md.skeleton yaz**

Bu dosya Bootstrap sonrasi hem Agentbase/CLAUDE.md hem de Agentbase/.claude/CLAUDE.md'yi uretmek icin kullanilir.

Sabit bolumler:
- Backlog.md CLI kilavuzu (mevcut CLAUDE.md'nin buyuk kismi — zaten jenerik)
- Task lifecycle kurallari
- DO vs DON'T tablolari
- CLI command reference

Templatize bolumler:
- PROFESSIONAL_STANCE (gelistirici deneyimine gore ayarlanan davranis)
- PROJECT_DEFINITION (proje tanimi)
- TECH_STACK (teknoloji tablosu)
- ENVIRONMENTS (ortam bilgileri)
- COMMANDS (test/build/dev komutlari)
- ARCHITECTURE (mimari aciklama)
- CONVENTIONS (kurallar ve konvansiyonlar)
- AVAILABLE_COMMANDS (aktif slash command listesi)

- [ ] **Step 2: settings.skeleton.json yaz**

Templatize:
- hooks.PreToolUse — lock dosyasi koruma (sabit) + modul hook'lari
- hooks.PostToolUse — core hook'lar + modul hook'lari
- env — gerekli env vars
- enabledPlugins — aktif plugin'ler

- [ ] **Step 3: claude-ignore.skeleton yaz**

Templatize:
- Temel ignore pattern'leri (node_modules, .git, dist, build)
- Stack-spesifik pattern'ler (vendor/, __pycache__, vb.)
- Agentbase/templates/ (uretim sonrasi gereksiz)

- [ ] **Step 4: Commit**

```bash
git add Agentbase/templates/core/CLAUDE.md.skeleton
git add Agentbase/templates/core/settings.skeleton.json
git add Agentbase/templates/core/claude-ignore.skeleton
git commit -m "feat: CLAUDE.md ve config skeleton'larini olustur"
```

---

## Task 9: Prisma Modulu

**Files:**
- Create: `Agentbase/templates/modules/prisma/detect.md`
- Create: `Agentbase/templates/modules/prisma/hooks/prisma-db-push-guard.js`
- Create: `Agentbase/templates/modules/prisma/hooks/prisma-migration-check.js`
- Create: `Agentbase/templates/modules/prisma/hooks/destructive-migration-check.js`
- Create: `Agentbase/templates/modules/prisma/rules/prisma-rules.skeleton.md`

- [ ] **Step 1: detect.md yaz**

Tespit kosullari: schema.prisma, @prisma/client dependency, DATABASE_URL

- [ ] **Step 2: 3 hook dosyasini kopyala (sabit)**

Mevcut hook'lardan proje-spesifik path'leri cikar, goreceli path kullan.
`../../api/prisma/migrations` → manifest'ten okunan ORM dizinine gore ayarlanmali.
Ancak bu hook'lar Agentbase'den calisacagi icin `../../Codebase/` prefix'i kullanilmali.

Aslinda bu hook'lar tam sabit degil — Codebase icindeki Prisma dizin yolunu bilmeleri gerekiyor. Bu yuzden hook'larin basinda bir config bölümü olacak:

```javascript
// Bootstrap tarafindan ayarlanan path
const CODEBASE_ROOT = path.resolve(__dirname, '../../../Codebase');
const PRISMA_DIR = path.join(CODEBASE_ROOT, '/* GENERATE: PRISMA_PATH */');
```

- [ ] **Step 3: prisma-rules.skeleton.md yaz**

Kaynak: mevcut workflow-lifecycle.md'nin Prisma bolumleri + CLAUDE.md Prisma kurallari
Templatize: PRISMA_PATH, MIGRATION_COMMAND
Sabit: Yasak komut, risk tablosu, schema degisikligi akisi, zorunlu kurallar

- [ ] **Step 4: Commit**

```bash
git add Agentbase/templates/modules/prisma/
git commit -m "feat: Prisma modul template'ini olustur"
```

---

## Task 10: Docker Modulu

**Files:**
- Create: `Agentbase/templates/modules/docker/detect.md`
- Create: `Agentbase/templates/modules/docker/commands/pre-deploy.skeleton.md`
- Create: `Agentbase/templates/modules/docker/commands/post-deploy.skeleton.md`
- Create: `Agentbase/templates/modules/docker/agents/devops.skeleton.md`

- [ ] **Step 1: detect.md yaz**

Tespit kosullari: Dockerfile, docker-compose.yml, .dockerignore

- [ ] **Step 2: pre-deploy.skeleton.md yaz**

Kaynak: mevcut pre-deploy.md (496 satir)
Templatize: CODEBASE_CONTEXT, BUILD_COMMANDS, TEST_COMMANDS, ENV_CHECKS, DOCKER_CONFIG
Sabit: 7 adimli kontrol akisi, karar matrisi, rapor formati, zorunlu kurallar

- [ ] **Step 3: post-deploy.skeleton.md yaz**

Kaynak: mevcut post-deploy.md (486 satir)
Templatize: CODEBASE_CONTEXT, HEALTH_CHECK_URL, SMOKE_TEST_ENDPOINTS, DEPLOY_PLATFORM
Sabit: 8 adimli dogrulama akisi, DEPLOY_OK/WARN/FAIL karar matrisi, rollback rehberi, rapor formati

- [ ] **Step 4: devops.skeleton.md yaz**

Kaynak: mevcut devops.md (347 satir)
Templatize: SERVER_INFO, DEPLOY_PLATFORM_CONFIG, DOCKER_ARCHITECTURE, COMMON_OPERATIONS
Sabit: Frontmatter (name, tools, color), troubleshooting yaklasimi
(Bu agent'in buyuk kismi proje-spesifik — skeleton cogunlukla GENERATE bloklarindan olusur)

- [ ] **Step 5: Commit**

```bash
git add Agentbase/templates/modules/docker/
git commit -m "feat: Docker modul template'ini olustur"
```

---

## Task 11: Monorepo Modulu

**Files:**
- Create: `Agentbase/templates/modules/monorepo/detect.md`
- Create: `Agentbase/templates/modules/monorepo/commands/review-module.skeleton.md`
- Create: `Agentbase/templates/modules/monorepo/hooks/auto-format.skeleton.js`

- [ ] **Step 1: detect.md yaz**

Tespit kosullari: workspaces, lerna.json, nx.json, turbo.json, pnpm-workspace.yaml, coklu package.json

- [ ] **Step 2: review-module.skeleton.md yaz**

Kaynak: mevcut review-module.md (1172 satir — en buyuk command)
Templatize: CODEBASE_CONTEXT, MODULE_MAPPING, SUBPROJECT_LAYERS, REVIEW_AGENTS, IDOR_CHECKLIST
Sabit: Buyuk resim analizi, 4 paralel agent yapisi, iki boyutlu siniflandirma, karar agaci, verification gate, rapor formati

- [ ] **Step 3: auto-format.skeleton.js yaz**

Kaynak: mevcut auto-format.js
Templatize: SUBPROJECT_DIRS (hangi alt dizinler formatlanacak), FORMATTER_CONFIG (prettier/biome/ruff config yollari)
Sabit: Smart quote duzeltme, stdin okuma, dosya uzanti kontrolu

- [ ] **Step 4: Commit**

```bash
git add Agentbase/templates/modules/monorepo/
git commit -m "feat: Monorepo modul template'ini olustur"
```

---

## Task 12: Security ve Expo Modulleri

**Files:**
- Create: `Agentbase/templates/modules/security/detect.md`
- Create: `Agentbase/templates/modules/security/commands/idor-scan.skeleton.md`
- Create: `Agentbase/templates/modules/expo/detect.md`
- Create: `Agentbase/templates/modules/expo/rules/design-system.skeleton.md`

- [ ] **Step 1: security/detect.md yaz**

Tespit kosullari: API route/controller dosyalari, auth middleware/guard

- [ ] **Step 2: idor-scan.skeleton.md yaz**

Kaynak: mevcut idor-scan.md (274 satir)
Templatize: CODEBASE_CONTEXT, CONTROLLER_TABLE, MODULE_MAPPING, KNOWN_PATTERNS
Sabit: 5 nokta kontrol matrisi, karar tablosu, bulgu siniflandirmasi, rapor formati

- [ ] **Step 3: expo/detect.md yaz**

Tespit kosullari: app.json/app.config.js, expo dependency, eas.json

- [ ] **Step 4: design-system.skeleton.md yaz**

Kaynak: mevcut frost-design-system.md (kaynak projenin UI standartlari)
Tamamen templatize — Bootstrap roportajinda tasarim sistemi bilgisi alinir ve bu dosya buna gore uretilir. Iskelette sadece bolum basliklari sabit:
- Renk token'lari
- Bilesen pattern'leri
- Tipografi
- Spacing/layout kurallari
- Yasak pratikler

- [ ] **Step 5: Commit**

```bash
git add Agentbase/templates/modules/security/ Agentbase/templates/modules/expo/
git commit -m "feat: Security ve Expo modul template'lerini olustur"
```

---

## Task 13: Root Dosyalar ve README

**Files:**
- Modify: `Agentbase/README.md`
- Modify: `Agentbase/PROJECT.md`
- Modify: `Agentbase/STACK.md`
- Modify: `Agentbase/DEVELOPER.md`
- Modify: `Agentbase/ARCHITECTURE.md`
- Modify: `Agentbase/WORKFLOWS.md`
- Keep: `Agentbase/BACKLOG.md` (degismez)

- [ ] **Step 1: README.md yeniden yaz**

Template aciklamasi, kurulum adimlari, dizin yapisi, Bootstrap kullanim kilavuzu.

- [ ] **Step 2: TODO stub dosyalarini guncelle**

Her dosyanin TODO yorumunu daha aciklayici yap — Bootstrap'in hangi bilgileri dolduracagini belirt.

- [ ] **Step 3: Commit**

```bash
git add Agentbase/README.md Agentbase/PROJECT.md Agentbase/STACK.md
git add Agentbase/DEVELOPER.md Agentbase/ARCHITECTURE.md Agentbase/WORKFLOWS.md
git commit -m "feat: Root dosyalari template icin guncelle"
```

---

## Uygulama Sirasi ve Bagimliliklar

```
Task 1 (dizin yapisi) ─────────────────────────────────┐
                                                        │
Task 2 (bootstrap.md) ─────────────────────────────────┤
                                                        │ Bagimsiz — paralel calisabilir
Task 3 (interview) ────────────────────────────────────┤
                                                        │
Task 4 (core commands) ────────────────────────────────┤
Task 5 (core agents) ─────────────────────────────────┤
Task 6 (core hooks) ──────────────────────────────────┤
Task 7 (core rules) ──────────────────────────────────┤
Task 8 (CLAUDE.md + config) ───────────────────────────┤
                                                        │
Task 9 (prisma modulu) ────────────────────────────────┤
Task 10 (docker modulu) ───────────────────────────────┤
Task 11 (monorepo modulu) ─────────────────────────────┤
Task 12 (security + expo) ─────────────────────────────┤
                                                        │
Task 13 (root dosyalar) ───────────────────────────────┘
```

**Tek bagimlilik:** Task 1 (dizin yapisi) diger tum task'lardan once tamamlanmali. Geri kalanlar bagimsiz — paralel calisabilir.

---

## Post-Implementation Updates (2026-03-22)

Uygulama surecinde orijinal plandan onemli sapmalar ve genislemeler oldu:

### 1. Ek Moduller
Orijinal planda bulunmayan asagidaki moduller eklendi:
- **deploy/coolify** — Coolify deploy platformu (commands: pre-deploy, post-deploy + agents: devops)
- **mobile/flutter** — Flutter mobil framework (rules: flutter-rules)
- **frontend/react** — React SPA (rules: react-rules)
- **frontend/html** — Statik HTML/CSS/JS projeleri (rules: html-rules)
- **backend/nodejs/nestjs** — NestJS framework (rules: nestjs-rules)
- **backend/nodejs/fastify** — Fastify framework (rules: fastify-rules)
- **backend/php/codeigniter4** — CodeIgniter 4 framework (rules: codeigniter4-rules + hooks: spark-guard)

### 2. Backend Kategori Yapisal Degisiklik
Backend kategorisi recursive family/leaf pattern'ine donusturuldu:
- `backend/` → `backend/nodejs/express/`, `backend/nodejs/fastify/`, `backend/nodejs/nestjs/`
- `backend/` → `backend/php/laravel/`, `backend/php/codeigniter4/`
- `backend/` → `backend/python/django/`, `backend/python/fastapi/`
Her seviyede (kategori, aile, leaf) kendi `detect.md` ve `rules/` dizini bulunur.

### 3. Bootstrap Adim 5 — Teammate Mode
Dosya uretim adimininda (Adim 5) teammate mode destegi eklendi. Her skeleton icin bir teammate agent spawn edilerek paralel dosya uretimi yapilabilir hale getirildi.

### 4. Kutsal Kurallar
Spec'e iki kutsal kural eklendi:
1. **Git sadece Codebase'de calisir** — Agentbase'de git komutu calistirilmaz
2. **Bootstrap Codebase'e ASLA yazmaz** — Codebase salt okunur, Bootstrap sadece Agentbase/ ve Docs/ altina yazar

### 5. Dosya Sayisi
Toplam template dosya sayisi orijinal plandaki ~47'den ~90'a yukseldi. Bu artis ek modullerin ve recursive backend yapisindan kaynaklanmaktadir.
