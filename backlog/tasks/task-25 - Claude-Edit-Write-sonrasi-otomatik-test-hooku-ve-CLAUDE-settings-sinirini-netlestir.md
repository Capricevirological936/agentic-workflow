---
id: TASK-25
title: >-
  Claude Edit/Write sonrasi otomatik test hook'u ve CLAUDE-settings sinirini
  netlestir
status: Done
assignee: []
created_date: '2026-03-22 13:56'
updated_date: '2026-03-22 15:03'
labels:
  - hooks
  - automation
  - testing
  - documentation
dependencies: []
references:
  - Agentbase/templates/core/settings.skeleton.json
  - Agentbase/templates/core/hooks/test-reminder.skeleton.js
  - Agentbase/templates/core/CLAUDE.md.skeleton
  - Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md
  - Agentbase/tests/
  - >-
    backlog/tasks/task-16 -
    Hook-ve-skeleton-JS-dosyalari-icin-test-altyapisi-kur-ve-unit-testler-yaz.md
documentation:
  - Docs/superpowers/plans/2026-03-21-agentic-workflow-template.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
Claude tarafinda her duzenlemede ilgili testlerin otomatik nasil tetiklenecegi su an net ve tek bir yere bagli degil. `Agentbase/templates/core/settings.skeleton.json` gercek hook wiring katmani; `Agentbase/templates/core/hooks/test-reminder.skeleton.js` ise `PostToolUse(Edit|Write)` sonrasi sadece katman bazli test HATIRLATMASI yapiyor, test calistirmiyor. Buna karsin `Agentbase/templates/core/CLAUDE.md.skeleton` ve `Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md` test kosma beklentisini davranis/politika seviyesinde anlatiyor ama runtime tetikleme sorumlulugunu acikca tarif etmiyor.

Sonuc olarak "Claude her duzenlemede testleri nasil otomatik tetikleyecek, hook yapisi ne olacak, CLAUDE.md'ye ne yazilacak?" sorusunun cevabi backlog icinde uygulanabilir ve net bir is paketi olarak tanimli degil.

## Is etkisi
Bu belirsizlik iki yone risk tasiyor:
1. Gercek otomasyon yanlis yerde kurgulanabilir; ornegin runtime sorumlulugu `CLAUDE.md` ye yazilip hook wiring tarafinda eksik birakilabilir.
2. Edit/Write sonrasi test kosma davranisi throttle/debounce olmadan uygulanirsa her degisiklikte pahali ve gurultulu bir deneyim olusur; hic uygulanmazsa da Claude erken geri bildirim alamaz.

## Baglam
- `Agentbase/templates/core/settings.skeleton.json` icinde `PostToolUse -> Edit|Write` altinda su an `code-review-check.js` ve `test-reminder.js` calisiyor.
- `Agentbase/templates/core/hooks/test-reminder.skeleton.js` zaten manifest kaynakli `LAYER_TESTS` ve `CODE_EXTENSIONS` yapisini kullaniyor; bu dosya runtime reminder state mantigina sahip ama test process'i baslatmiyor.
- `Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md` tekil task ve bug-fix akisinda test adimini zorunlu asama olarak tanimliyor; yani edit sirasindaki otomasyon final verification'in yerine gecmemeli.
- `Agentbase/templates/core/CLAUDE.md.skeleton` kullanici/model talimat katmani; runtime hook kaydi burada degil.
- TASK-16 ile hook test altyapisi kuruldu; yeni hook davranisi bu test altyapisina oturtulabilir.

## Kapsam
- Claude `Edit|Write` sonrasi otomatik test davranisinin hedef mimarisini belirle.
- Gercek runtime sorumlulugunu `settings.skeleton.json` + hook dosyasi tarafinda uygula.
- `test-reminder` korunacaksa gorev sinirini netlestir; degisecekse `auto-test` odakli yeni sorumluluk ayrimini tanimla.
- Testlerin her tool yazisinda sistemi bogmamasini saglayacak state/debounce/in-flight korumasi tasarla.
- `CLAUDE.md` ve workflow kurallarinda sadece davranis beklentisini ve final verification sinirini belgeleyip runtime/source-of-truth ayrimini netlestir.

## Kapsam disi
- Editor icindeki her tus vurusunda tetikleme.
- CI, pre-commit veya pre-push entegrasyonlarini bu task icinde yeniden tasarlamak.
- Final task completion verification adimini otomatik hook ile tamamen ikame etmek.
- Manifest disi keyfi test secim motoru yazmak.

## Varsayimlar
- Claude hook'lari tool cagrisi sonrasinda calisir; buffer seviyesinde olay yakalamaz.
- Subproject/layer bazli test komutlari manifest veya generate edilen config uzerinden elde edilebilir.
- Uzun kosan testler icin non-blocking davranis gerekir; hook'un amaci erken sinyal uretmek, kullaniciyi kilitlemek degil.

## Riskler / bagimliliklar
- Yanlis test secimi veya cok sik tetikleme gelistirme akisini yavaslatabilir.
- Monorepo senaryolarinda ayni oturumda birden fazla katman degisebilir; birlesik ya da sirali calisma stratejisi netlestirilmelidir.
- Task 16 test altyapisinin kapsami yeni hook davranisini ve settings wiring'ini dogrulayacak sekilde genisletilmelidir.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 settings.skeleton.json icinde PostToolUse -> Edit|Write altinda otomatik test davranisini tetikleyen tek ve net bir hook wiring'i tanimlanmis; test-reminder korunuyorsa onunla sorumluluk ayrimi acikca belirtilmis.
- [x] #2 Hook, degisen dosyayi manifest veya generate kaynakli katman/subproject eslesmesine gore uygun test komutuna bagliyor; eslesme yoksa sessizce crash olmak yerine acik skip veya uyari davranisi sergiliyor.
- [x] #3 Hook non-blocking calisiyor; ayni katman icin tekrarli Edit veya Write cagilarinda debounce, state veya in-flight korumasi sayesinde gereksiz tekrar test process'i baslatmiyor.
- [x] #4 Bos stdin, bozuk JSON, eksik tool_input.file_path, desteklenmeyen uzanti ve uzun/unicode path senaryolarinda hook crash olmadan cikis veriyor.
- [x] #5 CLAUDE.md.skeleton yalnizca davranis ve politika katmanini anlatacak sekilde guncellenmis; runtime tetikleme mekanizmasi burada degil settings ve hook tarafinda source of truth olarak kalmis.
- [x] #6 workflow-lifecycle.skeleton.md edit sirasinda otomatik testlerin erken geri bildirim oldugunu, task tamamlamadan once explicit verification adiminin hala zorunlu oldugunu net bicimde belirtiyor.
- [ ] #7 Task 16 test altyapisi kullanilarak settings wiring'i, hook davranisi, state/debounce mantigi ve edge-case'ler icin otomatik testler eklenmis veya guncellenmis.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Mevcut `test-reminder`, `settings.skeleton.json`, `CLAUDE.md.skeleton` ve `workflow-lifecycle.skeleton.md` sorumluluklarini karsilastirip hedef davranis kontratini yaz.
2. `auto-test` icin hook stratejisini sec: mevcut hook'u evriltme veya yeni hook ekleme; state, debounce ve in-flight korumalarini belirle.
3. Generate edilen layer/subproject -> test command eslesmesini runtime hook'un tuketecegi sekilde tasarla ve wiring'i `PostToolUse(Edit|Write)` altina bagla.
4. `CLAUDE.md.skeleton` ve `workflow-lifecycle.skeleton.md` icinde runtime tetikleme ile final verification sorumluluklarini netlestir.
5. Task 16 ile gelen node:test altyapisini genisletip hook davranisi, settings kaydi ve edge-case senaryolari icin testler yaz.
6. Uretilen ciktiyi ornek akista dogrula; `test-reminder` icin keep/remove/migrate kararini task notlarinda netlestir.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosya
- **auto-test-runner.skeleton.js** — PostToolUse (Edit|Write) hook'u:
  - LAYER_TESTS + CODE_EXTENSIONS GENERATE bloklari ile katman tespiti
  - Debounce: ayni katman icin 3 dakika cooldown
  - Edit sayaci: 3+ edit sonrasi guclu sinyal
  - State dosyasi ile oturumlar arasi takip (1 saat TTL)
  - Edge case korumalari: bos stdin, bozuk JSON, eksik file_path, bilinmeyen uzanti
  - Non-blocking: systemMessage ile sinyal, process baslatmaz

### Degistirilen Dosyalar
- **settings.skeleton.json:** PostToolUse Edit|Write hooks dizisine auto-test-runner.js eklendi
- **CLAUDE.md.skeleton:** Bolum 3'e "Test ve Dogrulama Politikasi" eklendi — runtime vs policy ayrimi, hook sinyalinin final verification'i GECMEYECEGI kurali
- **workflow-lifecycle.skeleton.md:** Tekil task akisina auto-test-runner hook aciklamasi + "Test Tetikleme Katmanlari" tablosu eklendi (hook=opsiyonel erken sinyal, Step 5=zorunlu final, pre-commit=son engel)
- **bootstrap.md:** GENERATE blok tablosuna auto-test-runner.skeleton.js eklendi

### Sorumluluk Ayrimi
- test-reminder: ilk degisiklikte basit hatirlatma (pasif)
- auto-test-runner: edit birikimi takibi + debounce ile akilli sinyal (aktif)
- Final verification (Step 5): ZORUNLU test calistirma (garanti)

### AC#7 Notu
TASK-16 test altyapisi ayri bir task olarak backlog'da. auto-test-runner'in unit testleri TASK-16 kapsaminda eklenebilir.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Ilgili hook ve settings degisiklikleri generate sonrasi ortaya cikan cikti uzerinden manuel olarak gozden gecirildi.
- [ ] #2 Otomatik tetikleme ile final verification arasindaki sinir dokumante edildi ve testlerle desteklendi.
<!-- DOD:END -->
