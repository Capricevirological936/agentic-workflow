---
id: TASK-27
title: 'Devils advocate agent: plan ve kodu kirma perspektifi'
status: Done
assignee: []
created_date: '2026-03-22 13:57'
updated_date: '2026-03-22 15:04'
labels:
  - agents
  - review
  - quality
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Kaynak
Orijinal workspace tasarimindaki shared/agents/devils-advocate.md konsepti.

## Problem
Mevcut review agent lari "bu kod dogru mu?" sorar. Ama kimse "bu kod NEREDE kirilir?" sorusunu sistematik olarak sormuyor. Adversarial perspektif eksik.

## Cozum
templates/core/agents/devils-advocate.skeleton.md

Agent in rolu:
- Plan review da: "Bu plan hangi edge case i kacirir? Hangi varsayim yanlis olabilir? Hangi bagimlilik kirildginda tum sistem coker?"
- Kod review da: "Bu fonksiyonu NULL input ile, cok buyuk veri ile, paralel cagri ile, timeout ile, yetkisiz kullanici ile cagirsan ne olur?"
- Mimari review da: "Bu tasarim 10x kullanici ile olceklenir mi? Bir servis cokerse domino etkisi nereye kadar yayilir?"

Kullanim:
- task-review un 4. agent i olarak spawn edilebilir (mevcut 3 agent + devils-advocate)
- task-plan da plan olusturulduktan sonra "Devil s Advocate check" adimi
- Bagimsiz olarak da cagrilabilir: /task-review icinde veya task-hunter Adversarial Testing modifier i ile (TASK-23)

Frontmatter:
```yaml
---
name: devils-advocate
tools: Read, Grep, Glob, Bash
model: opus
color: red
---
```

Agent opus modelde calismali — derin dusunme ve sorgulama kapasitesi gerektirir.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 templates/core/agents/devils-advocate.skeleton.md olusturuldu
- [x] #2 Agent 5 sorgulama kategorisi kapsiyor: edge case, input fuzzing, olceklenebilirlik, bagimlilik kirılganligi, guvenlik
- [x] #3 task-review skeleton a opsiyonel 4. agent olarak entegre edildi
- [x] #4 TASK-23 Adversarial Testing modifier i bu agent i kullaniyor
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosya
- **templates/core/agents/devils-advocate.skeleton.md** — Adversarial analiz agent'i:
  - Frontmatter: name=devils-advocate, model=opus, color=red
  - 5 sorgulama kategorisi: edge case, input fuzzing, olceklenebilirlik, bagimlilık kirilganligi, guvenlik
  - Severity siniflandirmasi: CRITICAL/HIGH/MEDIUM/LOW
  - GENERATE blogu: CODEBASE_CONTEXT

### Degistirilen Dosyalar
- **task-review.skeleton.md:** Opsiyonel 4. agent olarak devils-advocate eklendi (guvenlik/auth/odeme/API/migration degisikliklerinde tetiklenir)
- **task-hunter.skeleton.md:** Step 3.0.1 Adversarial Testing modifier'i devils-advocate agent'ini acikca referans ediyor
<!-- SECTION:FINAL_SUMMARY:END -->
