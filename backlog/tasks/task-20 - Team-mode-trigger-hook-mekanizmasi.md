---
id: TASK-20
title: Team mode trigger hook mekanizmasi
status: Done
assignee: []
created_date: '2026-03-22 13:37'
updated_date: '2026-03-22 14:36'
labels:
  - hooks
  - teams
  - automation
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
dev.aps de "lead et" Claude hook u var — belirli kosullarda otomatik teammate spawn tetikliyor. Agentbase de teammate desteji task-conductor icinde var ama otomatik trigger mekanizmasi yok.

## Cozum
Bir PostToolUse hook olarak team-trigger.js olustur. Hook su kosullarda teammate spawn onerir (systemMessage ile):

### Trigger Kosullari
1. **Dosya sayisi esigi:** Tek oturumda 5+ farkli dosya duzenlendiginde → "Cok sayida dosya degistirdiniz. Teammate spawn etmek ister misiniz?"
2. **Cross-layer degisiklik:** Monorepo da birden fazla subproject te degisiklik yapildiginda → cross-layer review onerisi
3. **Uzun oturum:** 30+ dakika ve 50+ tool call oldugunda → "Oturum uzadi. Review yapmak ister misiniz?"

Hook sadece ONERIR — bloklamaz. systemMessage ile kullaniciya bilgi verir.

## Dosyalar
- templates/core/hooks/team-trigger.skeleton.js
- settings.json a PostToolUse hook kaydi
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 team-trigger.skeleton.js hook olusturuldu
- [x] #2 3 trigger kosulu implement edildi (dosya sayisi, cross-layer, uzun oturum)
- [x] #3 Hook sadece oneriyor, bloklamiyor (systemMessage)
- [x] #4 settings.json skeleton a hook kaydi eklendi
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosya
- **templates/core/hooks/team-trigger.skeleton.js** — PostToolUse (Edit|Write) hook'u, 3 trigger kosulu:
  1. **Dosya sayisi esigi:** 5+ farkli dosya duzenlendiyse teammate spawn onerisi
  2. **Cross-layer degisiklik:** 2+ katmanda degisiklik varsa cross-layer review onerisi (LAYER_TESTS GENERATE blogu ile subproject pattern'leri)
  3. **Uzun oturum:** 30+ dakika VE 50+ tool call ise context kirlenmesi uyarisi + review onerisi
  - systemMessage ile oneri — BLOKLAMAZ
  - 10 dakika cooldown mekanizmasi (ayni tip oneri tekrar verilmez)
  - Session-tracker state dosyasindan veri okur (files.written, tools.total_calls, started_at)

### Degistirilen Dosyalar
- **settings.skeleton.json:** PostToolUse Edit|Write hooks dizisine team-trigger.js kaydi eklendi (timeout: 100)
- **bootstrap.md:** GENERATE blok tablosuna team-trigger.skeleton.js (LAYER_TESTS) eklendi

### Test
- team-trigger.skeleton.js syntax OK
- settings.skeleton.json valid JSON
- generate.js 37/37 test gecti
<!-- SECTION:FINAL_SUMMARY:END -->
