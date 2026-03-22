# Phase 4 — Domain Rules

> **Feeds:** `rules/`, hooks (forbidden commands)
> **Goal:** Projeye ozel kurallar, yasaklar ve domain bilgisi toplamak. Bu phase'in ciktilari koruma hook'larina ve agent kurallarina donusur.

---

## Auto-Detection

Bu phase'de otomatik tespit sinirlidir. Asagidaki ipuclari sorulara eklenir:

| Field                    | Detection Source                                      | Usage                              |
|--------------------------|-------------------------------------------------------|------------------------------------|
| UI framework             | React/Vue/Svelte/Expo imports, component directories  | Q2 skip condition                  |
| Design system hints      | Tailwind config, MUI theme, styled-components usage   | Q2 follow-up context               |
| Existing lint rules      | Custom ESLint/Biome rules that imply domain rules     | Q3 pre-fill suggestions            |

---

## Questions

### Q1 — Yasakli Komutlar / Islemler
- **Text:** `"Projede kesinlikle YAPILMAMASI gereken seyler var mi? (Ornek: 'prisma db push YASAK' — bir hata sonucu bu kural dogdu) Varsa listele. Her biri bir koruma hook'una donusturulecek."`
- **Type:** open-ended, multi-value
- **Format:** Her kural ayri satirda. Ornek:
  ```
  prisma db push — production'da schema bozuldu
  rm -rf / — acik sebep
  git push --force main — history kaybolur
  ```
- **Skip condition:** never — always ask
- **Maps to:** `manifest.rules.forbidden[]`
  - Each entry: `{ command: string, reason: string, hook_type: "block" | "warn" }`
- **Downstream:**
  - `rules/forbidden-commands.md` generation
  - Pre-exec hook: block or warn when forbidden command detected
  - Agent instructions: never suggest or execute these commands
  - **block** → komut calistirilmaz, hata mesaji gosterilir
  - **warn** → uyari gosterilir, onay istenir

### Q2 — Tasarim Sistemi / Component Library
- **Text:** `"Bir tasarim sistemi/component library kullaniyor musunuz? (Orn: Material UI, Tailwind, ozel design system)"`
- **Type:** yes/no + follow-up
- **Skip condition:** No UI framework detected (react/vue/svelte/expo)
- **Follow-up (if yes):** `"Temel kurallarini kisa acikla (renk kullanimi, component pattern, vb.)"`
- **Maps to:** `manifest.rules.domain[]` (category: design-system)
- **Downstream:**
  - `rules/design-system.md` generation
  - Agent UI component generation rules
  - Style/theme consistency enforcement
  - Example generated rules:
    - "Sadece Tailwind utility class'lari kullan, inline style yazma"
    - "Renk degerleri theme config'den alinir, hardcoded hex kullanilmaz"
    - "Her yeni component Storybook story'si ile birlikte olusturulur"

### Q3 — Domain-Spesifik Kurallar
- **Text:** `"Projede agent'larin bilmesi gereken domain-spesifik kurallar var mi? (Orn: 'API response formati her zaman {status, data, message}', 'Kullanici verisi log'a yazilmaz') Serbest format."`
- **Type:** open-ended, multi-value
- **Format:** Her kural ayri satirda. Serbest format kabul edilir.
- **Skip condition:** never — always ask
- **Maps to:** `manifest.rules.domain[]` (category: domain)
- **Downstream:**
  - `rules/domain-rules.md` generation
  - Agent instructions per rule
  - Validation hooks where applicable
  - Example categories that may emerge:
    - **API contract:** response format, error handling, status codes
    - **Security:** data logging restrictions, auth patterns
    - **Code patterns:** naming conventions, file organization
    - **Business logic:** calculation rules, state machine constraints

### Q4 — Guvenlik Oncelik Seviyesi
- **Text:** `"Projenin guvenlik oncelik seviyesi nedir?"`
- **Options:**
  - `a)` Standart — genel web uygulamasi
  - `b)` Yuksek — finans, saglik, kisisel veri (KVKK/GDPR)
  - `c)` Kritik — odeme isleme, devlet sistemleri
- **Skip condition:** never — always ask
- **Maps to:** `manifest.project.security_level`
- **Downstream:**
  - **a → standard:**
    - Mevcut security modulu yeterli
    - task-hunter Dual-Pass modifier PASIF
  - **b → high:**
    - IDOR scan zorunlu (opsiyonel degil)
    - Ek guvenlik hook'lari aktif
    - Security review her PR'da
    - task-hunter Dual-Pass modifier AKTIF
    - pre-commit hook'ta secret scanning siki mod
  - **c → critical:**
    - Tum guvenlik kontrolleri maksimum
    - pre-commit'te guvenlik taramasi genisletilmis
    - git hook'lara ek secret scanning
    - task-hunter Dual-Pass modifier AKTIF
    - Adversarial Testing her guvenlik-iliskili gorevde ZORUNLU

### Q5 — Son Eklemeler
- **Text:** `"Baska eklemek istedigin bir sey var mi? Bu son soru."`
- **Type:** open-ended, optional
- **Skip condition:** never — always ask
- **Maps to:** `manifest.rules.domain[]` (if applicable), or `manifest.notes`
- **Downstream:**
  - Routed to appropriate manifest field based on content analysis
  - May generate additional rules, workflow notes, or project documentation
  - If empty/skipped: no action taken

---

## Phase Completion

When all applicable questions are answered, Bootstrap:

1. Populates `manifest.rules.forbidden[]` and `manifest.rules.domain[]`
2. Generates `rules/` directory with categorized rule files:
   - `rules/forbidden-commands.md` — yasakli komutlar ve hook tanimlari
   - `rules/design-system.md` — UI/tasarim kurallari (if applicable)
   - `rules/domain-rules.md` — domain-spesifik kurallar
3. Configures pre-exec hooks for forbidden commands
4. Completes the interview — proceeds to **manifest compilation and file generation**

---

## Post-Interview: Manifest Compilation

After all 4 phases, Bootstrap:

1. Compiles the full `manifest.json` from all collected answers
2. Generates all target files (`PROJECT.md`, `ARCHITECTURE.md`, `STACK.md`, `WORKFLOWS.md`, `DEVELOPER.md`, `README.md`)
3. Generates `rules/` directory with all rule files
4. Configures hooks based on manifest
5. Presents summary to developer for final review
