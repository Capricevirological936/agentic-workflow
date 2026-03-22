---
id: TASK-29
title: >-
  P1 KRITIK: generate.js backend modul secimi kirik — leaf varyant yerine aile
  adi kontrol ediliyor
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 19:18'
updated_date: '2026-03-22 19:30'
labels:
  - generate-js
  - bug
  - critical
  - backend
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Codex Bulgusu (P1 — En Kritik)

generate.js satir 1265 civarinda scanSkeletonFiles fonksiyonu modul secerken parts[2] degerini kontrol ediyor. Backend agaclarinda bu nodejs, php, python oluyor — express, laravel, django DEGIL.

Ornek: manifest te backend: ["nodejs/express"] yazsa bile scanner "express" aramak yerine "nodejs" u ariyor ve hicbir dosya secmiyor. Deploy modulu (deploy/vercel gibi) duz yapiyla calisiyor cunku parts[2] zaten "vercel" oluyor.

## Root Cause

Backend modullerinin recursive aile/leaf yapisi (backend/nodejs/express/) ile generate.js nin duz parts[2] kontrolu uyumsuz. Scanner sadece 2 seviyeli yapida (modules/{kategori}/{varyant}/) calisiyor, 3+ seviyeli yapida (modules/{kategori}/{aile}/{leaf}/) kirilior.

## Cozum

scanSkeletonFiles fonksiyonunda modul aktiflik kontrolu guncellenmeli:

1. Manifest teki aktif modul yolu: "nodejs/express"
2. Dosya relative yolu: "modules/backend/nodejs/express/rules/express-rules.skeleton.md"
3. Kontrol: parts[2] + "/" + parts[3] = "nodejs/express" → eslesiyor

Alternatif: aktif modul listesindeki her segmenti dosya yolunun herhangi bir yerinde ara.

## Etkilenen Dosyalar
- Agentbase/generate.js (scanSkeletonFiles fonksiyonu, satir ~1260)
- Agentbase/generate.test.js (yeni test: backend leaf varyant secimi)

## Dogrulama
```bash
# Bu test BASARISIZ olmali (su an):
node -e "const m = {modules:{active:{backend:["nodejs/express"]}}}; console.log(require("./generate.js").scanSkeletonFiles?.(m))"

# Duzeltme sonrasi express skeleton dosyalari secilmeli
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 scanSkeletonFiles 3+ seviyeli modul yollarini (backend/nodejs/express) dogru seciyor
- [x] #2 Mevcut 2 seviyeli moduller (deploy/vercel, orm/prisma) hala calisiyor
- [x] #3 generate.test.js ye backend leaf secimi icin regresyon testi eklendi
- [x] #4 Tum backend varyantlari test edildi: express, fastify, nestjs, laravel, codeigniter4, django, fastapi
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. generate.js — scanSkeletonFiles fonksiyonunu duzelt (parts[2] yerine tam modul yolu kontrolu)\n2. generate.test.js — test manifest backend formatini guncelle\n3. generate.test.js — getActiveModules test assertion guncelle\n4. generate.test.js — backend leaf variant regresyon testleri ekle\n5. Tum testleri calistir ve dogrula
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
scanSkeletonFiles fonksiyonundaki parts[2] tek seviye kontrol, tam modul yolu eslesmesiyle degistirildi. CONTENT_DIRS sentinel ile modul segmentleri content-type dizinlerinden ayristirildi. Family skeleton dosyalari parent esleme ile dahil ediliyor, sibling varyantlar haric tutuluyor. Test manifest backend formati 'express' → 'nodejs/express' olarak guncellendi. 4 yeni regresyon testi eklendi (3-seviyeli secim, family dahil etme, 2-seviyeli geriye uyumluluk, 7 backend varyant). 41/41 test gecti.
<!-- SECTION:FINAL_SUMMARY:END -->
