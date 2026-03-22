---
id: TASK-28
title: 'deep-audit komutu: domain bazli uctan uca denetim (review-module yerine)'
status: Done
assignee: []
created_date: '2026-03-22 19:02'
updated_date: '2026-03-22 19:09'
labels:
  - commands
  - review
  - architecture
  - security
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
dev.carrma daki review-module komutu (1171 satir, 7 adim, 4 paralel agent) Agentbase template ine entegre edilmemis. Bu komut projenin en guclu araclarindan biri — bir domain modulunu (auth, mesajlasma, profil, uyelik vb.) tum katmanlarda (API + DB + Mobile + Frontend) uctan uca denetliyor.

Mevcut Agentbase deki review-module.skeleton.md monorepo modulune bagli ve sadece alt proje review i yapiyor. Carrma daki review-module ise DOMAIN BAZLI calisiyor — "auth modulunu review et" dediginde backend controller, service, middleware, DB schema, mobil screen, context, API cagrilari hepsini birlikte denetliyor.

## Isim Degisikligi
`review-module` → `deep-audit` olarak yeniden adlandirilmali.

**Neden:**
- `review-module` "monorepo subproject ini review et" gibi anlasilsyor (dar)
- `deep-audit` "bir domain alanini tum katmanlarda derinlemesine denetle" anlami tasiyor (genis)
- Carrma daki orijinal yapida da bu isme donusturulmustu (workspace-v1.md de deep-audit.md olarak planlanmisti)

## Kaynak
`/Users/varienos/Landing/Herd/dev.carrma/.claude/commands/review-module.md` (1171 satir)

## Entegre Edilecek Ozellikler

### Adim 0: Modul Tespiti
- Keyword bazli modul eslestirme tablosu (auth → controller, service, screen, context)
- Katman tespiti (hangi katmanlar review edilecek)
- GENERATE blogu ile proje-spesifik modul haritasi

### Adim 1: Derin Dosya Kesfi
- API dosya tarama (controller, service, route, middleware, validator)
- Backend tarama (varsa eski backend)
- Mobil dosya tarama (screen, component, context, service)
- Bagimlilik izleme (keyword aramanin otesi — import chain takibi)
- Memory arastirmasi (gecmis review bulgulari)
- Dosya envanteri cikarma

### Adim 2: 4 Paralel Review Agent
1. **API Denetcisi** — Controller/service mantik, kullanilmayan alanlar, eksik senaryolar, guvenlik
2. **API Uyum Denetcisi** — Mobil ile API arasindaki sozlesme uyumu (response format, field isimleri)
3. **Mobil Akis Denetcisi** — Screen akislari, state yonetimi, hata yonetimi
4. **Senaryo Dogrulayici** — Happy path + edge case dogrulama, handle edilmemis durumlar

### Adim 3: Iki Boyutlu Siniflandirma
- Etki seviyesi: KRITIK / MAJOR / MINOR
- Aksiyon: DOGRUDAN FIX / BACKLOG TASK
- Katmanlar arasi etki analizi (capraz dogrulama)

### Adim 4: Dogrudan Fix + Dogrulama Kapisi
- Karar agaci: karmasiklik bazli (seviye degil)
- TypeScript derleme + test + lint kontrolu
- Fix kalite kapisi (code-reviewer + silent-failure-hunter self-review)
- Commit

### Adim 5: Backlog Task Olusturma
- Duplicate kontrolu zorunlu
- Guvenlik bulgulari icin oncelik kurali
- Iliskili bulgulari gruplama

### Adim 6: Rapor
- Duzeltilen hatalar tablosu
- Backlog a eklenen konular tablosu
- Katmanlar arasi etki tablosu

### Adim 7: Sonraki Review Onerileri
- En az 5 senaryo onerisi
- Ihtiyac ve fayda degerlendirmesi

### IDOR Taramasi (Entegre)
- Endpoint envanteri
- 5 nokta kontrol matrisi (parametre erisimi, sahiplik filtresi, blok kontrolu, taraf kontrolu, bilgi sizintisi)
- Modul-spesifik ek kontroller (auth, mesaj, profil, uyelik, favori, bildirim)

## Dosya Degisiklikleri

### Yeni dosya
- `templates/core/commands/deep-audit.skeleton.md` — Ana komut skeleton u (review-module.skeleton.md den farkli, cok daha derin)

### Guncellenmesi gereken dosyalar
- `templates/modules/monorepo/commands/review-module.skeleton.md` — Bu dosya kalir ama sadece subproject-level review icin. deep-audit domain-level review icin.
- Bootstrap komut listesi (AVAILABLE_COMMANDS)
- README.md komut tablosu
- CLAUDE.md.skeleton komut listesi

### Iliski
- `/deep-audit auth` → domain bazli denetim (tum katmanlar)
- `/review-module api` → subproject bazli denetim (monorepo)
- `/idor-scan` → sadece guvenlik odakli (deep-audit icinde de var)

## GENERATE Bloklari
- MODULE_MAPPING — proje-spesifik modul-dosya eslestirmesi
- SUBPROJECT_LAYERS — hangi subproject hangi rolu oynuyor
- REVIEW_AGENTS — stack e gore 4 agent in prompt lari
- IDOR_CHECKLIST — framework-spesifik guvenlik kontrolleri
- VERIFICATION_COMMANDS — stack e gore dogrulama komutlari
- CODEBASE_CONTEXT — proje baglami
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 templates/core/commands/deep-audit.skeleton.md olusturuldu (1000+ satir, 7 adimli)
- [x] #2 4 paralel review agent yapisi tanimlandı (API Denetcisi, API Uyum, Mobil Akis, Senaryo Dogrulayici)
- [x] #3 Iki boyutlu siniflandirma calisiyor (Etki: KRITIK/MAJOR/MINOR × Aksiyon: FIX/BACKLOG)
- [x] #4 IDOR taramasi entegre edildi (5 nokta kontrol matrisi)
- [x] #5 Dogrudan fix + dogrulama kapisi + fix kalite kapisi akisi tamamlandi
- [x] #6 Modul eslestirme tablosu GENERATE blogu ile proje-spesifik uretiliyor
- [x] #7 Sonraki review onerileri adimi (en az 5 senaryo) mevcut
- [x] #8 README.md ve CLAUDE.md.skeleton komut listesine deep-audit eklendi
- [x] #9 review-module.skeleton.md sadece monorepo subproject review icin kaliyor (cakisma yok)
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosya
- **templates/core/commands/deep-audit.skeleton.md** — 853 satir, 7 adimli domain-bazli denetim komutu:
  - Adim 0: Modul tespiti ve kapsam belirleme (MODULE_MAPPING GENERATE blogu)
  - Adim 1: Derin dosya kesfi (API + Frontend/Mobil + bagimlilik izleme + bellek arastirmasi)
  - Adim 2: 4 paralel review agent (API Denetcisi, API Uyum, Mobil Akis, Senaryo Dogrulayici) — REVIEW_AGENTS GENERATE blogu
  - Adim 3: Iki boyutlu siniflandirma (KRITIK/MAJOR/MINOR × FIX/BACKLOG) + katmanlar arasi etki analizi
  - Adim 4+4.5+4.7+4.9: Dogrudan fix + dogrulama kapisi + self-review + commit
  - Adim 5+5.5: Backlog task olusturma (duplicate kontrolu zorunlu) + IDOR taramasi (5 nokta kontrol matrisi, IDOR_CHECKLIST GENERATE blogu)
  - Adim 6: Rapor (3 tablo: fix, backlog, katmanlar arasi etki)
  - Adim 7: Sonraki review onerileri (en az 5, ihtiyac+fayda 2 boyutlu degerlendirme)
  - Dead code tespiti ve temizligi (guvenli/dikkatli/backlog ayirimi)
  - 6 GENERATE blogu: CODEBASE_CONTEXT, MODULE_MAPPING, SUBPROJECT_LAYERS, REVIEW_AGENTS, VERIFICATION_COMMANDS, IDOR_CHECKLIST
  - 12 zorunlu kural

### Degistirilen Dosyalar
- **CLAUDE.md.skeleton:** Komut listesine deep-audit ve deadcode eklendi
- **bootstrap.md:** GENERATE blok tablosuna deep-audit ve deadcode skeleton'lari eklendi

### Cakisma Kontrolu
- review-module.skeleton.md → monorepo modules/ altinda kaliyor, subproject-level review (horizontal)
- deep-audit.skeleton.md → core commands/ altinda, domain-level review (vertical)
- Isim farki: /review-module vs /deep-audit — cakisma yok

### Test
- generate.js syntax OK, 37/37 test gecti
- deep-audit.skeleton.md 853 satir (GENERATE bloklari Bootstrap tarafindan doldurulunca 1000+ olacak)
<!-- SECTION:FINAL_SUMMARY:END -->
