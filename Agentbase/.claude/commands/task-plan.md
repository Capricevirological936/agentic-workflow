# Task Plan — Agentic Workflow Template Projesi

Bu proje icin ozellestirilmis yuksek baglamli task olusturucu. Istegi analiz eder, projeyi tarar, backlog task olusturur.

**KURAL: Derin analiz yap, yuzeysel task OLUSTURMA.**

---

## Proje Baglami

Agentic Workflow Template — herhangi bir projeye uygulanabilir AI-driven gelistirme workflow sistemi.

**Ana bilesenleri:**
- `bootstrap.md` — Orkestrator (1100+ satir)
- `generate.js` — Deterministik skeleton islemci (1000+ satir)
- `templates/core/` — 8 command + 2 agent + 2 hook + 2 rule skeleton
- `templates/modules/` — 7 kategori, 20+ alt varyant (detect.md + skeleton + hook)
- `templates/interview/` — 4 fazli roportaj sablonlari
- `bin/session-monitor.js` — Canli oturum dashboard
- `templates/core/hooks/session-tracker.js` — Oturum izleme hook'u

**Proje dosya tipleri:**
| Tip | Uzanti | Konum | Ozellik |
|-----|--------|-------|---------|
| Skeleton command | `.skeleton.md` | templates/core/commands/ | GENERATE bloklari var |
| Skeleton rule | `.skeleton.md` | templates/core/rules/ veya modules/*/rules/ | GENERATE bloklari var |
| Skeleton hook | `.skeleton.js` | templates/core/hooks/ veya modules/*/hooks/ | GENERATED marker'lar var |
| Sabit hook | `.js` | templates/modules/*/hooks/ | Degismez, dogrudan kopyalanir |
| Detect dosyasi | `detect.md` | templates/modules/*/ | Modul tespit kosullari |
| Config skeleton | `.skeleton.json` | templates/core/ | __GENERATE__ anahtarlar |
| Referans | `.md` | templates/reference/ | Sadece okunur, degistirilmez |

---

## ADIM 1 — Istegi Analiz Et

Kullanicinin istedigi seyi anla ve siniflandir:

### 1.1 Istek Tipi

| Tip | Ornek | Yaklasim |
|-----|-------|----------|
| Yeni modul | "Supabase modulu ekle" | Mevcut modulleri pattern olarak kullan |
| Yeni command | "deadcode komutu ekle" | Mevcut command skeleton'larini pattern olarak kullan |
| Mevcut dosya degisikligi | "Bootstrap'e X ekle" | Dosyayi oku, degisiklik noktasini belirle |
| Hook gelistirme | "Git pre-commit hook ekle" | Mevcut hook'lari pattern olarak kullan, test yaz |
| Bug fix | "generate.js X hatasi" | Root cause bul, generate.test.js'e regresyon testi ekle |
| Dokumantasyon | "README guncelle" | Tutarlilik kontrol et |
| Mimari degisiklik | "Modul yapisi degistir" | Etki analizi yap, cok sayida dosya etkilenebilir |

### 1.2 Karmasiklik Skoru

| Skor | Kriter | Model Onerisi |
|------|--------|---------------|
| 1-3 | Tek dosya, basit degisiklik | Sonnet yeterli |
| 4-6 | 2-5 dosya, mevcut pattern'i takip | Sonnet yeterli |
| 7-8 | 5-10 dosya, yeni pattern olusturma | Opus onerisi |
| 9-10 | 10+ dosya, mimari degisiklik | Opus zorunlu, kullanici onayi gerekli |

---

## ADIM 2 — Derin Analiz

### 2.1 Dosya Tespiti

Istege gore ilgili dosyalari tara:

```bash
# Modul ekleme istegi icin mevcut modul yapisini gor
find Agentbase/templates/modules -name "detect.md" | sort

# Hook istegi icin mevcut hook'lari gor
find Agentbase/templates -name "*.js" | sort

# Command istegi icin mevcut command'lari gor
ls Agentbase/templates/core/commands/

# Bootstrap degisikligi icin mevcut adim yapisini gor
grep "^## ADIM" Agentbase/.claude/commands/bootstrap.md
```

### 2.2 Pattern Analizi

Benzer bir sey daha once yapilmis mi? Mevcut dosyalari oku ve pattern'i cikar:

- Yeni modul → en yakin mevcut modulu oku (detect.md + hooks + rules)
- Yeni command → en yakin mevcut command skeleton'ini oku
- Yeni hook → en yakin mevcut hook'u oku (stdin/stdout protokolu)

### 2.3 Etki Analizi

Bu degisiklik baska dosyalari da etkiler mi?

| Degisiklik | Etkilenen Diger Dosyalar |
|------------|--------------------------|
| Yeni modul ekleme | bootstrap.md (modul tespiti), README.md (modul tablosu), spec |
| Yeni command ekleme | bootstrap.md (komut listesi), README.md (komut tablosu) |
| Hook ekleme | settings.skeleton.json (hook kaydi), generate.js (hook isleme) |
| GENERATE blok ekleme/degistirme | bootstrap.md (GENERATE blok haritasi), generate.js (SIMPLE_GENERATORS) |
| Skeleton format degisikligi | Tum skeleton dosyalari tutarli olmali |

### 2.4 Backlog Duplicate Kontrolu

```bash
backlog search "<anahtar kelime>" --plain
```

Ayni veya benzer task zaten varsa, yeni task OLUSTURMA — mevcut task'i guncelle.

---

## ADIM 3 — Task Olustur

### 3.1 Kabul Kriterleri Sablonlari

**Yeni modul icin:**
- `templates/modules/{kategori}/{varyant}/detect.md` olusturuldu
- Hook dosyalari mevcut hook protokolunu takip ediyor (stdin JSON, stdout decision/systemMessage)
- Rules skeleton GENERATE bloklari dogru formatda
- Mevcut en yakin modul ile tutarli (ayni detect.md formati, ayni risk tablosu yapisi)
- README.md modul tablosu guncellendi
- bootstrap.md modul tespiti bu modulu kapsiyor

**Yeni command icin:**
- `templates/core/commands/{isim}.skeleton.md` olusturuldu
- GENERATE bloklari diger command'larla tutarli (CODEBASE_CONTEXT, VERIFICATION_COMMANDS vb.)
- Sabit is akisi adimlari (okuma → analiz → implementasyon → dogrulama → commit → kapatma) mevcut
- Zorunlu kurallar bolumu var
- README.md komut tablosu guncellendi

**Hook gelistirme icin:**
- Hook dosyasi olusturuldu ve Node.js syntax'i gecerli
- stdin/stdout protokolu mevcut hook'larla tutarli
- Test dosyasi yazildi (node:test + node:assert/strict)
- settings.skeleton.json'a hook kaydi eklendi
- Hata durumunda sessiz gecis — ASLA bloklama (PostToolUse hook'lari icin)

**generate.js degisikligi icin:**
- Degisiklik yapildi
- Mevcut testler geciyor: `node --test generate.test.js`
- Yeni ozellik icin test eklendi
- SIMPLE_GENERATORS'a eklenen generator dogru manifest alanlarina erisor

### 3.2 Task Olustur

```bash
backlog task create "<baslik>" \
  -d "<detayli aciklama — problem, cozum, etkilenen dosyalar>" \
  --priority <high|medium|low> \
  --ac "<kriter 1>" \
  --ac "<kriter 2>" \
  --ac "<kriter 3>" \
  -l <etiket1>,<etiket2>
```

### 3.3 Zorunlu Alanlar

- **Baslik:** Imperative mood, net ("X ekle", "Y duzelt", "Z guncelle")
- **Description:** Problem + Cozum + Etkilenen dosyalar. Codex'e verilebilecek netlikte.
- **Priority:** high = Bootstrap/generate.js bozulursa hicbir sey calismaz. medium = iyilestirme. low = genisleme.
- **AC:** Her biri test edilebilir, olcuelebilir. "X yap" degil, "X dosyasi olusturuldu ve Y kontrolu geciyor."
- **Labels:** `bootstrap`, `hooks`, `modules`, `commands`, `testing`, `architecture`, `reliability`, `security`, `ui`

---

## ADIM 4 — Kullanici Raporu

```markdown
## 📋 Task Olusturuldu

**TASK-{id}:** {baslik}
**Oncelik:** {priority}
**Etiketler:** {labels}
**Karmasiklik:** {skor}/10
**Model Onerisi:** {Sonnet|Opus}

### Etkilenen Dosyalar (tahmini)
| Dosya | Degisiklik |
|---|---|
| `{yol}` | {aciklama} |

### Kabul Kriterleri
1. {AC 1}
2. {AC 2}
3. {AC 3}

### Bagimliliklar
- {varsa bagimli task'lar}

> Uygulamak icin: `/task-hunter {id}`
```

---

## Zorunlu Kurallar

1. **Kod duzenleme YAPMA** — Bu komut sadece analiz eder ve task olusturur. Dosya degistirmez.
2. **Derin analiz ZORUNLU** — Yuzeysel "X yap" task'i olusturma. Dosyalari oku, pattern'i anla, etki analizini yap.
3. **Duplicate kontrol ZORUNLU** — `backlog search` ile mevcut task'lari kontrol et.
4. **AC spesifik olmali** — "Duzgn calisiyor" degil, "X dosyasi olusturuldu ve Y testi geciyor" formatinda.
5. **Codex uyumlu olsun** — Task description Codex'e verildiginde bile yeterince baglam ve talimat icermeli.
6. **Etki analizi** — Degisikligin baska dosyalari da etkileyip etkilemeyecegini belirle ve AC'lere ekle.
7. **Oncelik dogru olmali** — Bootstrap/generate.js kiran = HIGH. Yeni modul = LOW. Hook iyilestirme = MEDIUM.
8. **Tek sorumluluk** — Her task tek bir is yapsin. "X ekle ve Y duzelt ve Z guncelle" degil, ayri task'lar.
