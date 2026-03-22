# Task Hunter — Agentic Workflow Template Projesi

Bu proje icin ozellestirilmis otonom task implementer. Backlog'dan gorev alir, uygular, commit eder, kapatir.

**KURAL: Adim adim sirayla uygula. Hicbir adimi atlama.**

---

## Proje Baglami

Agentic Workflow Template — herhangi bir projeye uygulanabilir AI-driven gelistirme workflow sistemi.

**Dizin yapisi:**
- `Agentbase/` — Agent config, command, hook, rule, template dosyalari (BURADASIN)
- `Agentbase/templates/` — Bootstrap kaynak sablonlari (skeleton dosyalar)
- `Agentbase/templates/core/` — Her projede uretilen iskeletler
- `Agentbase/templates/modules/` — Kategori bazli moduller (orm/, deploy/, backend/, mobile/, frontend/, monorepo/, security/)
- `Agentbase/templates/interview/` — Bootstrap roportaj sablonlari
- `Agentbase/templates/reference/` — Referans dokumanlar (methods.md, notes.md, workflow.md)
- `Agentbase/bin/` — Yardimci script'ler (session-monitor.js)
- `Agentbase/.claude/` — Claude Code konfigurasyonu
- `Docs/` — Proje dokumanlari (spec, plan, manifest)
- `Codebase/` — Test icin symlink edilen proje (DOKUNMA)
- `test/` — Test ortami

**Stack:** Node.js, Markdown skeleton templates, YAML manifest, Backlog.md CLI

**Kutsal kurallar:**
1. Git sadece Codebase'de calisir — Agentbase'de .git YOK
2. Bootstrap Codebase'e ASLA yazmaz
3. Moduller kategori/alt-varyant yapisiinda (orm/prisma, deploy/coolify, vb.)
4. Skeleton dosyalari sabit iskelet + GENERATE bloklari

---

## Arguman Ayristirma

```
/task-hunter 18           → Tek task modu: TASK-18'i implement et
/task-hunter 18 24        → Coklu task modu: sirayla implement et
/task-hunter rollback     → Keyword modu: "rollback" iceren task'i bul
```

---

## ADIM 1 — Gorevi Oku ve Anla

1. `backlog task <id> --plain` ile gorevi oku
2. Hemen In Progress yap: `backlog task edit <id> -s "In Progress" -a @claude`
3. Acceptance criteria'yi cikar — bunlar basari olcutlerin
4. Implementation notes varsa oku — onceki calisma bilgisi olabilir

---

## ADIM 2 — Analiz ve Plan

### 2.1 Gorev Tipi Analizi (Metot Yonlendirme)

Gorevin AC'lerini ve description'ini oku. Yaklasimi sec:

| Sinyal | Mod | Yaklasim |
|--------|-----|----------|
| Skeleton dosyasi degisikligi | Template edit | Mevcut skeleton'i oku, GENERATE blok yapisini koru |
| Hook JS dosyasi | Node.js gelistirme | Test yaz (node:test), stdin/stdout protokolunu takip et |
| Bootstrap.md degisikligi | Orkestrator edit | Adim numaralarini koru, yeni adim ekliyorsan sirayi guncelle |
| Yeni modul ekleme | Modul olusturma | detect.md + skeleton + hook pattern'ini takip et |
| generate.js degisikligi | Script gelistirme | Mevcut test'leri calistir (node --test generate.test.js) |
| Dokumantasyon (README, spec) | Doc guncelleme | Tutarlilik kontrol et — diger doc'larla celisiyor mu? |

### 2.2 Etkilenen Dosyalari Kesfet

Proje yapisini tara:
```bash
# Template dosyalari
find Agentbase/templates -type f -name "*.md" -o -name "*.js" -o -name "*.json" | sort

# Mevcut hook'lar
ls Agentbase/templates/core/hooks/ Agentbase/templates/modules/*/hooks/ Agentbase/templates/modules/*/*/hooks/ 2>/dev/null

# Modul yapisi
find Agentbase/templates/modules -name "detect.md" | sort
```

### 2.3 Plan Olustur ve Kaydet

```bash
backlog task edit <id> --plan "1. ...\n2. ...\n3. ..."
```

**Otonomi seviyesi: plan goster, onayladiktan sonra otonom calis.**
Plani kullaniciya goster ve onay bekle. Onay gelince otonom devam et.

---

## ADIM 3 — Implementasyon

### Proje-Spesifik Kurallar

1. **Skeleton GENERATE bloklarini koru** — Sabit icerige dokunma, sadece GENERATE bloklarini duzenliyorsan blok formatini koru:
   ```markdown
   <!-- GENERATE: BLOCK_NAME
   Aciklama: ...
   Gerekli manifest alanlari: ...
   Ornek cikti:
   ...
   -->
   ```

2. **Hook protokolu** — Tum hook'lar ayni stdin/stdout JSON protokolunu kullanir:
   - PreToolUse: `{"decision":"block","reason":"..."}` veya sessiz gecis
   - PostToolUse: `{"systemMessage":"..."}` veya sessiz gecis
   - Hata durumunda ASLA exception firlatma — sessiz gec

3. **detect.md formati** — Her modul detect.md'si ayni yapida:
   ```markdown
   # Modul Tespit Kurallari
   Minimum X/Y kosul saglanmalidir:
   - [ ] Kosul 1
   - [ ] Kosul 2
   ```

4. **Dosya isimlendirme** — Skeleton: `*.skeleton.md` veya `*.skeleton.js`. Sabit: uzantisiz.

5. **Test** — JS dosyalari icin `node:test` + `node:assert/strict`. Harici dependency YOK.

6. **bootstrap.md degisikligi** — Adim numaralari (ADIM 1, ADIM 2, ...) tutarli olmali. Yeni adim ekliyorsan sonrakileri kaydirma — alt adim olarak ekle (orn: 5.2.1).

### Teammate Delegation

| Karmasiklik | Dosya Sayisi | Yaklasim |
|------------|-------------|----------|
| Basit | 1-3 | Direkt uygula |
| Orta | 4-6 | Direkt uygula |
| Karmasik | 7+ | Teammate spawn (Agent tool) |

---

## ADIM 4 — Dogrulama Kapisi

### 4.1 JS dosyasi degistiyse:
```bash
node -c <dosya.js>                    # Syntax kontrolu
node --test <dosya.test.js>           # Varsa testleri calistir
node --test Agentbase/generate.test.js  # generate.js degistiyse
```

### 4.2 Skeleton dosyasi degistiyse:
- GENERATE bloklari dogru formatda mi? (<!-- GENERATE: NAME ... -->)
- Sabit icerik bozulmamis mi?
- Diger skeleton'larla tutarli mi? (ayni GENERATE blok isimleri)

### 4.3 README veya spec degistiyse:
- Dizin yapisi guncelse mi?
- Modul listesi guncelse mi?
- Komut tablosu guncelse mi?

### 4.4 Bootstrap.md degistiyse:
- Adim numaralari sirali mi?
- Referans edilen dosya yollari dogru mu?
- GENERATE blok haritasi guncelse mi?

---

## ADIM 5 — Commit

```bash
git add <degisen_dosyalar>
git commit -m "$(cat <<'EOF'
<prefix>: <kisa aciklama>
EOF
)"
```

**Commit convention:** Conventional Commits, Turkce
- `feat:` — yeni ozellik/modul/komut
- `fix:` — bug duzeltme
- `refactor:` — yeniden duzenleme
- `docs:` — dokumantasyon
- `test:` — test ekleme/duzeltme

**KURAL:** Sadece gorevle ilgili dosyalari stage'le. `git add .` YASAK.

---

## ADIM 6 — Gorevi Kapat

1. Tum AC'leri isaretle:
```bash
backlog task edit <id> --check-ac 1 --check-ac 2 --check-ac 3
```

2. Final summary yaz:
```bash
backlog task edit <id> --final-summary "Yapilan degisiklikler ve etkileri"
```

3. Done yap:
```bash
backlog task edit <id> -s Done
```

---

## ADIM 7 — Kullanici Raporu

```markdown
## ✅ TASK-<id> — <baslik>

### Yapilan Isler
- [degisiklik 1]
- [degisiklik 2]

### Degistirilen Dosyalar
| Dosya | Degisiklik |
|---|---|
| `<yol>` | <aciklama> |

### Dogrulama
- [x] JS syntax kontrolu
- [x] Testler gecti
- [x] Skeleton GENERATE bloklari tutarli

### Commit
`<hash>` — `<mesaj>`
```

---

## ADIM 8 — Sonraki Task Onerisi

### 8.1 Acik task'lari tara
```bash
backlog task list -s "To Do" --plain
```

### 8.2 Sicak baglam analizi

| Bilgi | Kullanim |
|-------|----------|
| Degistirilen dosyalar | Ayni dosya/dizine dokunan task'lara bonus |
| Etkilenen kategori | templates/core vs modules vs bootstrap vs bin |
| Etiketler | Ayni etiketli task'lara bonus |

### 8.3 Hizli skorlama

```
Etki (0-10):         Guvenlik/tutarlilik=10, dokumantasyon=3
Risk (0-10):         Bootstrap bozulur=10, sadece doc=2
Bagimlilik (0-10):   Blocker=10, izole=2
Karmasiklik (0-10):  TERS — tek dosya=10, 10+ dosya=2
Sicak Baglam (0-10): Ayni dosya=10, ayni dizin=8, ayni kategori=6, ayni etiket=4, ilgisiz=0

Skor = (Etki x 2.5) + (Risk x 2) + (Bagimlilik x 1.5) + (Karmasiklik x 1) + (Sicak Baglam x 2)
```

### 8.4 Top 3 oner

```markdown
## Sonraki Task Onerisi

| Sira | Task | Baslik | Skor | Neden Simdi? |
|------|------|--------|------|-------------|
| 1 | #id | baslik | skor | gerekce |
| 2 | #id | baslik | skor | gerekce |
| 3 | #id | baslik | skor | gerekce |

> Devam etmek icin: `/task-hunter {id}`
```

---

## Zorunlu Kurallar

1. **Otonom calis** — Plan onayi sonrasi soru sorma, karar al ve uygula.
2. **Once oku, sonra yaz** — Dosyayi degistirmeden once MUTLAKA oku.
3. **Pattern takip et** — Mevcut skeleton/hook yapisini boz, yeni convention icat etme.
4. **Minimal degisiklik** — Sadece gorev icin gerekli degisiklikleri yap.
5. **Test yaz** — JS dosyasi degistiyse test yaz veya mevcut testleri guncelle.
6. **Backlog CLI kullan** — Gorev durumunu SADECE `backlog` CLI ile degistir.
7. **Skeleton GENERATE bloklarini koru** — Blok formatini bozma, icerigini guncelle.
8. **Hata dongusune girme** — 3 denemede cozulmediyse kullaniciya bildir.
9. **Codebase'e dokunma** — Test icin symlink edilen proje dosyalarina YAZMA.
10. **Tutarlilik** — Bir dosyayi degistirirsen, ayni bilgiyi iceren diger dosyalari da guncelle (README, spec, plan).
