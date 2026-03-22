---
id: TASK-34
title: >-
  P2: generate.js conditional block regex 3-seviyeli modul isimlerini
  desteklemiyor
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 19:23'
updated_date: '2026-03-22 19:34'
labels:
  - bug
  - generate-js
  - backend
dependencies:
  - TASK-29
references:
  - 'Agentbase/generate.js:188'
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem

`generate.js` satir 188'deki conditional block regex'i:

```javascript
const modulMatch = condKey.match(/^(\w+)_active$/);
```

`\w+` pattern'i sadece `[a-zA-Z0-9_]` ile eslesiyor. Slash (`/`) karakteri desteklenmiyor.

Bu, 3-seviyeli modul isimlerinin (`nodejs/express`, `python/django`, `php/laravel`) conditional GENERATE bloklarinda kullanilamamasi anlamina geliyor.

## Senaryo

Bir settings.skeleton.json'da su conditional blok varsa:
```json
{
  "__GENERATE__HOOKS__": {
    "nodejs/express_active": {
      "__doc__": "Express-specific hook",
      "command": "..."
    }
  }
}
```

Regex `nodejs/express_active` ile eslesmiyor → kosul sessizce atlanniyor → hook eklenmyor.

## TASK-29 ile Iliski

Bu bug, TASK-29'daki `scanSkeletonFiles` bugunden FARKLI bir kod yolunda. TASK-29 dosya secimini (satir ~1265), bu task GENERATE blok islemini (satir 188) etkiliyor. Her ikisi de ayni root cause'un (3-seviyeli hiyerarsi destegi eksik) farkli tezahurleri.

## Cozum

Regex'i slash destekleyecek sekilde guncelle:
```javascript
const modulMatch = condKey.match(/^([\w\/]+)_active$/);
```

## Etkilenen Dosyalar
- `Agentbase/generate.js` (satir 188, processConditionalEntry fonksiyonu)
- `Agentbase/generate.test.js` (yeni test: nested modul isimli conditional blok)

## Dogrulama
```javascript
// Bu test BASARISIZ olmali (su an):
const re = /^(\w+)_active$/;
console.log(re.test("nodejs/express_active")); // false

// Duzeltme sonrasi:
const re2 = /^([\w\/]+)_active$/;
console.log(re2.test("nodejs/express_active")); // true
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Conditional block regex slash icereen modul isimleriyle eslesiyor (nodejs/express_active)
- [x] #2 Mevcut duz modul isimleri (prisma_active vb.) hala calisiyor
- [x] #3 generate.test.js de 3-seviyeli conditional blok icin regresyon testi eklendi
- [x] #4 processConditionalEntry fonksiyonu nodejs/express_active sartini dogru degerlendiriyor
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
generate.js satir 188'deki conditional block regex'i `\\w+` → `[\\w/]+` olarak guncellendi. Bu sayede `nodejs/express_active`, `python/django_active` gibi 3-seviyeli modul isimleri artik conditional GENERATE bloklarinda kullanilabiliyor.\n\nRegresyon testi eklendi: 3-seviyeli (nodejs/express_active), aktif olmayan (python/django_active) ve duz isim (prisma_active) senaryolari test ediliyor.\n\nTum 89 test basariyla geciyor.
<!-- SECTION:FINAL_SUMMARY:END -->
