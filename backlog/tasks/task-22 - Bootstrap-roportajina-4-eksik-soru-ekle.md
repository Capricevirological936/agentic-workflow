---
id: TASK-22
title: Bootstrap roportajina 4 eksik soru ekle
status: Done
assignee: []
created_date: '2026-03-22 13:44'
updated_date: '2026-03-22 14:16'
labels:
  - bootstrap
  - interview
  - security
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Eski bootstrap-questions.md den tespit edilen, mevcut roportajda eksik olan 4 soru.

## 1. --bypass-permissions onerisi (On Kosul)
Bootstrap baslamadan once kullaniciya bypass-permissions ile calismayi oner. Bootstrap sureci cok sayida dosya olusturma, dizin olusturma, backlog init gibi islem yapiyor. Her biri icin izin sormak sureci yavaslatir.

Eklenmesi gereken yer: bootstrap.md Adim 1 (On Kosul Kontrolleri) basina:
```
Oneri: Bootstrap cok sayida dosya islemii yapacak. Izin dongusunu onlemek icin
--bypass-permissions ile calistirmanizi oneriyoruz.
```

## 2. Authentication tipi (Faz 2 ye eklenecek yeni soru)
"Projede authentication var mi? Hangi yontem?"
  a) JWT (token-based)
  b) OAuth2 (Google, GitHub, vb.)
  c) Session-based
  d) API key
  e) Yok / henuz planlanmadi

Etkileri:
- code-review agent checklist ine auth-spesifik kontroller eklenir (JWT: token expiry, refresh token. OAuth: scope validation. Session: CSRF)
- security modulu daha hedefli IDOR kontrolleri yapar
- Manifest: stack.auth_method alani

## 3. Guvenlik oncelik seviyesi (Faz 4 e eklenecek yeni soru)
"Projenin guvenlik oncelik seviyesi nedir?"
  a) Standart (genel web uygulamasi)
  b) Yuksek (finans, saglik, kisisel veri — KVKK/GDPR)
  c) Kritik (odeme isleme, devlet sistemleri)

Etkileri:
- Standart: mevcut security modulu yeterli
- Yuksek: IDOR scan zorunlu (opsiyonel degil), ek guvenlik hook lari, security review her PR da
- Kritik: tum guvenlik kontrolleri maksimum, pre-commit te guvenlik taramasi, git hook lara secret scanning
- Manifest: project.security_level alani

## 4. Calisma modu: solo vs ekip (Faz 3 e eklenecek yeni soru)
"Projede tek mi calisiyorsun, ekip mi?"
  a) Solo — tek gelistirici
  b) Kucuk ekip (2-4 kisi)
  c) Buyuk ekip (5+ kisi)

Etkileri:
- Solo: self-review yeterli, PR zorunlulugu yok, task-review onerir ama zorlamaz
- Kucuk ekip: PR onerisi, review-module her sprint sonunda
- Buyuk ekip: PR zorunlu, branch protection kurallari, code ownership dosyasi
- Manifest: project.team_size alani
- WORKFLOWS.md de review sureci buna gore ayarlanir
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bootstrap Adim 1 e bypass-permissions onerisi eklendi
- [x] #2 Faz 2 ye authentication tipi sorusu eklendi ve manifest.stack.auth_method e yaziliyor
- [x] #3 Faz 4 e guvenlik oncelik seviyesi sorusu eklendi ve manifest.project.security_level e yaziliyor
- [x] #4 Faz 3 e solo/ekip sorusu eklendi ve manifest.project.team_size e yaziliyor
- [x] #5 code-review agent skeleton auth-spesifik checklist maddelerini destekliyor
- [x] #6 WORKFLOWS.md skeleton team_size e gore review sureci ayarliyor
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### bootstrap.md
- **Adim 1.0 (YENI):** bypass-permissions onerisi eklendi (dosya islemi yogun sureci hizlandirmak icin)
- **Faz 2 S6 (YENI):** Authentication tipi sorusu (JWT/OAuth2/Session/API key/none) → manifest.stack.auth_method
- **Faz 3 S4 (YENI):** Solo/ekip sorusu (solo/kucuk ekip/buyuk ekip) → manifest.project.team_size
- **Faz 4 S4 (YENI):** Guvenlik oncelik seviyesi sorusu (standard/high/critical) → manifest.project.security_level (eski S4 → S5 olarak kaydiraldi)
- **Manifest yapisi:** project.team_size, project.security_level, stack.auth_method alanlari eklendi
- **GENERATE blok tablosu:** workflow-lifecycle'a TEAM_REVIEW_POLICY eklendi

### Interview phase dosyalari
- **phase-2-technical.md:** Q6 Authentication Tipi — downstream: code-review checklist auth-spesifik maddeler
- **phase-3-developer.md:** Q4 Calisma Modu — downstream: WORKFLOWS.md review sureci
- **phase-4-rules.md:** Q4 Guvenlik Oncelik Seviyesi — downstream: task-hunter Dual-Pass modifier, hook seviyesi

### Agent skeletonlari
- **code-review.skeleton.md:** PROJECT_CHECKLIST GENERATE blogu genisletildi — auth-spesifik kontroller (JWT token expiry, OAuth scope validation, Session CSRF, API key rotation) + guvenlik seviyesi ek kontrolleri (high: IDOR zorunlu, critical: encryption/PII masking)

### Rule skeletonlari
- **workflow-lifecycle.skeleton.md:** TEAM_REVIEW_POLICY GENERATE blogu eklendi — solo/small-team/large-team icin review zorunlulugu, PR politikasi, CODEOWNERS onerisi

### Test
- generate.js syntax OK, 37/37 test gecti
<!-- SECTION:FINAL_SUMMARY:END -->
