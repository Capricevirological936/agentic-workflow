---
id: TASK-19
title: Bootstrap stack-bazli uzman agent uretimi
status: Done
assignee: []
created_date: '2026-03-22 13:36'
updated_date: '2026-03-22 14:02'
labels:
  - agents
  - bootstrap
  - architecture
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
Agentbase sadece 4 genel agent uretiyor (code-review, regression-analyzer, devops, service-documentation). dev.aps de 11 uzman agent var (ci4-backend, metronic-frontend, kurye-ui, musteri-ui, vb.). Uzman agent lar proje baglamini derin biliyor ve daha isabetli sonuc uretiyor.

## Cozum
Bootstrap tespit ettigi stack ve subproject lere gore ek uzman agent skeleton lari uretmeli:

### Stack-bazli agent sablonlari
- backend/{framework}-expert.skeleton.md — Framework uzmani (CI4, Laravel, Django, Express, vb.)
- mobile/{platform}-ui.skeleton.md — Mobil UI uzmani (Expo/RN component pattern leri, navigation)
- frontend/{framework}-expert.skeleton.md — Frontend uzmani (Next.js SSR, React SPA, vb.)

### Subproject-bazli agent uretimi
Monorepo tespit edildiginde her subproject icin bir uzman agent olustur:
- {subproject-name}-expert agent — o subproject in dosya yapisi, pattern leri, bagimliliklari

### Ornek: dev.aps icin uretilecek agent lar
- ci4-backend-expert (PHP + CI4 + PostgreSQL uzmanı)
- kurye-expo-expert (Expo + RN + Maps API uzmani)
- musteri-expo-expert (Expo + RN uzmani)
- web-nextjs-expert (Next.js + Tailwind uzmani)

Bu agent lar task-hunter in teammate olarak spawn edebilecegi uzmanlardir.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Stack-bazli agent skeleton sablonlari olusturuldu (backend, mobile, frontend)
- [x] #2 Bootstrap monorepo tespit edince subproject-bazli agent uretiyor
- [x] #3 Agent frontmatter tutarli (name, tools, model, color)
- [x] #4 task-hunter teammate delegation matrisi yeni agent lari taniyor
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosyalar (3 uzman agent skeleton)
- `templates/core/agents/backend-expert.skeleton.md` — Backend framework uzmani (Express, NestJS, Laravel, Django, FastAPI, Go/Gin destegi). GENERATE bloklari: CODEBASE_CONTEXT, BACKEND_FRAMEWORK_RULES. color=cyan.
- `templates/core/agents/mobile-expert.skeleton.md` — Mobil platform uzmani (Expo/RN, React Native bare, Flutter destegi). GENERATE bloklari: CODEBASE_CONTEXT, MOBILE_PLATFORM_RULES. color=magenta.
- `templates/core/agents/frontend-expert.skeleton.md` — Frontend framework uzmani (Next.js App/Pages Router, React SPA, Vue, Angular + Tailwind destegi). GENERATE bloklari: CODEBASE_CONTEXT, FRONTEND_FRAMEWORK_RULES. color=purple.

### Degistirilen Dosyalar
- `bootstrap.md` Step 5:
  - Teammate 1 (core-generator) gorevine uzman agent uretimi eklendi
  - Yeni bolum 5.1.2: Uzman Agent Uretimi — stack-bazli + monorepo subproject-bazli agent uretim kurallari
  - GENERATE blok tablosuna 3 yeni agent skeleton eklendi
- `task-hunter.skeleton.md` Step 3.2:
  - Uzman Agent Yonlendirme Tablosu eklendi (dosya tipine gore agent secimi)
  - Monorepo subproject-bazli agent tercih kurali eklendi
  - Spawn formatina Agent alani eklendi

### Frontmatter Tutarliligi
Tum 6 agent skeleton tutarli format: name, tools (Read/Grep/Glob/Bash), model (sonnet veya opus), color (unique).

### Test
- generate.js syntax OK
- 37/37 mevcut test gecti (regresyon yok)
<!-- SECTION:FINAL_SUMMARY:END -->
