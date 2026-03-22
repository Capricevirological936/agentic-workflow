---
id: TASK-16
title: Hook ve skeleton JS dosyalari icin test altyapisi kur ve unit testler yaz
status: Done
assignee: []
created_date: '2026-03-22 12:41'
updated_date: '2026-03-22 13:00'
labels:
  - testing
  - reliability
  - hooks
  - architecture
dependencies:
  - TASK-7
references:
  - Agentbase/generate.test.js
  - Agentbase/package.json
  - Agentbase/templates/core/hooks/
  - Agentbase/templates/modules/orm/prisma/hooks/
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem

generate.js icin kapsamli test suite mevcut (generate.test.js, 30+ test, node:test ile). Ancak projede 13 JS dosya daha var ve HICBIRININ testi yok. Bu dosyalar guvenlik taramasi, migration korumasi, format kontrolu gibi kritik isler yapiyor — test edilmeden uretim ortamina giden her hook sessiz hata riski tasiyor.

## Mevcut Durum

| Dosya | Satir | Test | Risk |
|-------|-------|------|------|
| generate.js | 1100+ | 30+ test ✅ | Dusuk |
| **Core Hook Skeleton'lari** | | | |
| code-review-check.skeleton.js | 150+ | YOK | **Yuksek** — guvenlik pattern tespiti yapamaz/yanlis yaparsa vulnerability kacabilir |
| test-reminder.skeleton.js | 150+ | YOK | Orta — yanlis katman tespiti gereksiz/eksik uyari uretir |
| auto-format.skeleton.js (monorepo) | 150+ | YOK | Orta — yanlis subproject tespiti dosyayi bozabilir |
| openapi-sync-check.skeleton.js (api-docs) | 100+ | YOK | Orta — route degisikligini kacirirsa spec senkrondan cikar |
| **ORM Guard Hook'lari** | | | |
| prisma-db-push-guard.js | ~50 | YOK | **Yuksek** — guard calismaz ise db push uretimde calisir |
| prisma-migration-check.js | ~80 | YOK | Yuksek — destructive migration kacabilir |
| destructive-migration-check.js | ~80 | YOK | Yuksek — DROP TABLE/COLUMN tespiti basarisiz olabilir |
| Diger ORM guard'lari (4 adet) | ~40-60 | YOK | Orta |
| **Backend Guard Hook'lari** (3 adet) | ~40 | YOK | Orta |
| **Utility** | | | |
| session-tracker.js | 200+ | YOK | Dusuk |
| session-monitor.js | 632 | YOK | Dusuk — TUI, test edilmesi zor |

## Cozum

Mevcut altyapiyi kullan: node:test + node:assert/strict (harici bagimllik yok). Oncelik sirasi:

**P1 — Guvenlik kritik:** code-review-check (pattern match, severity, extension filter), prisma-db-push-guard (block/pass), prisma-migration-check (destructive SQL), destructive-migration-check (DROP/ALTER)

**P2 — Islevsel kritik:** test-reminder (detectLayer, state), auto-format (fixSmartQuotes, detectSubproject, findFormatterConfig), openapi-sync-check (route pattern match)

**P3 — Guard hook'lari:** Ortak test helper + her guard icin block/pass senaryolari

**P4 — Opsiyonel:** session-tracker (dusuk risk), session-monitor (TUI — skip edilebilir)

## Test Stratejisi

1. Pure function testleri: fixSmartQuotes, detectSubproject, detectLayer gibi yan etkisiz fonksiyonlar
2. stdin/stdout hook testleri: JSON input → beklenen stdout/stderr. child_process.exec ile calistir
3. Guard karar testleri: komut girdisi → block veya pass karari
4. Ortak test helper modulu: createHookTestRunner, mockStdin, assertBlocked, assertPassed

## Not
Faz 2 — Guvenilirlik. TASK-7 (generate.js script) ile paralel baslanabilir — P1 guard testleri TASK-7'den bagimsiz.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 P1 guvenlik kritik hook'lar test edildi: code-review-check (pattern match, severity, extension filter), prisma-db-push-guard (block/pass), prisma-migration-check (destructive SQL), destructive-migration-check (DROP/ALTER)
- [x] #2 P2 islevsel kritik hook'lar test edildi: test-reminder (detectLayer, state), auto-format (fixSmartQuotes, detectSubproject, findFormatterConfig), openapi-sync-check (route pattern match)
- [x] #3 P3 guard hook'lari icin ortak test helper + her guard icin en az 2 test (block senaryosu + pass senaryosu)
- [x] #4 package.json test script'i tum test dosyalarini calistiriyor (node --test **/*.test.js)
- [x] #5 Tum testler CI ortaminda da calisabilir (harici bagimllik yok, node:test + node:assert)
- [x] #6 generate.js processSkeletonFile fonksiyonu icin field adı uyumluluk testi (content vs outputContent — bu bug'in regresyon testi)
- [x] #7 Hook stdin/stdout entegrasyon testleri: gercek child_process.execSync ile hook'u calistir, stdin'den JSON ver, stdout/stderr'i kontrol et
- [x] #8 Edge case: bos stdin, bozuk JSON, eksik alanlar, undefined tool_input — tum hook'lar sessiz gecmeli
- [x] #9 Edge case: cok buyuk dosya yolu (1000+ karakter), unicode icerikli dosya adi — crash olmamali
- [x] #10 Regex guvenlik testi: ReDoS (catastrophic backtracking) riski olan pattern'ler icin timeout testi — 100ms icinde tamamlanmali
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Codex icin ek notlar:

1. generate.js de tam olarak bu bug vardi: fillBlocks() { content, filled, marked } donuyordu ama processSkeletonFile outputContent bekliyordu. Bu regresyon testi MUTLAKA yazilmali.

2. Hook testlerinde child_process.execSync kullan:
   const result = execSync("echo 'JSON_INPUT' | node hook.js", { encoding: "utf8" });\n   assert.strictEqual(JSON.parse(result).decision, "block");\n\n3. Tum hook lar sessiz hata prensibini takip eder — bozuk girdi ASLA process.exit(1) yapmamali, ASLA exception firlatmamali.\n\n4. session-monitor.js TUI testi zor ama renderSummary/renderDetail gibi pure fonksiyonlar test edilebilir — string output dondururler.\n\n5. Test dosya isimlendirmesi: hook-adi.test.js (ornek: prisma-db-push-guard.test.js, generate.test.js zaten var)\n\n6. Ortak test helper: tests/helpers/hook-runner.js — createHookTestRunner(hookPath) fonksiyonu stdin gonderip stdout/stderr yakalayan wrapper.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Hook ve skeleton JS dosyalari icin node:test tabanli test altyapisi eklendi.
Ortak helper modulleri ile gercek child process entegrasyon testleri, edge case senaryolari ve generate.js regresyon testleri yazildi.
package.json test scripti tum suite'i calistiracak sekilde guncellendi ve auto-format icin configFile ureten generator eksigi giderildi.
<!-- SECTION:FINAL_SUMMARY:END -->
