---
id: TASK-5
title: BACKLOG.md ve CLAUDE.md icerik tekrarini gider
status: Done
assignee: []
created_date: '2026-03-22 10:48'
updated_date: '2026-03-22 11:04'
labels:
  - optimization
  - claude-md
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
BACKLOG.md sabit dosya olarak Backlog CLI kilavuzunun tamamini iceriyor (~500 satir). CLAUDE.md.skeleton da ayni kilavuzu FIXED bolum olarak iceriyor. Bootstrap her ikisini de urettiginde Claude Code context'ine ~1000 satir tekrarli icerik girer. Bu context israfdir. Cozum: CLAUDE.md.skeleton'dan Backlog CLI kilavuzunu cikar, yerine BACKLOG.md'ye referans koy: '> Backlog CLI kullanim kurallari icin BACKLOG.md dosyasina bakin.' CLAUDE.md'de sadece proje-spesifik kurallar ve komut listesi kalmali.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CLAUDE.md.skeleton'dan Backlog CLI kilavuzu cikarildi
- [x] #2 CLAUDE.md'de BACKLOG.md referansi eklendi
- [x] #3 Context token tasarrufu olculdu (yaklasik 500 satir azalma)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 2 — Guvenilirlik. Bagimsiz, herhangi bir zamanda yapilabilir.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
CLAUDE.md.skeleton icindeki tekrar eden Backlog rehberi kaldirildi ve yerine BACKLOG.md referansi eklendi. Skeleton 720 satirdan 218 satira indi; yaklasik 502 satir context tasarrufu saglandi.
<!-- SECTION:FINAL_SUMMARY:END -->
