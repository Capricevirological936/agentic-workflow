---
id: TASK-6
title: Teammate kismi basarisizlik recovery mekanizmasi
status: Done
assignee: []
created_date: '2026-03-22 10:48'
updated_date: '2026-03-22 11:57'
labels:
  - bootstrap
  - reliability
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Bootstrap Adim 5'te 5 teammate paralel calisiyor. Birinin fail olmasi durumunda ne olacagi tanimli degil. Olasiliklar: (1) Teammate timeout — uzun surerse Lead ne yapar? (2) Teammate hatali dosya uretir — sanity check yakalar mi? (3) Teammate hic dosya uretmez — Lead eksik dosyalari tespit edip tekrar mi dener? Recovery stratejisi: fail eden teammate'in gorevi Lead tarafindan tekrar denenebilmeli (retry 1 kez). 2. basarisizlikta kullaniciya bildirilmeli ve manuel mudahale istenmeli. Kısmi basari durumunda uretilen dosyalar korunmali, sadece eksikler raporlanmali.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Teammate timeout limiti tanimlandi
- [x] #2 Fail durumunda retry mekanizmasi (1 kez) eklendi
- [x] #3 Kismi basari durumunda uretilen dosyalar korunuyor, eksikler raporlaniyor
- [x] #4 Kullaniciya bildirim formati tanimlandi
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 2 — Guvenilirlik. TASK-4 tamamlandiktan sonra yapilmali. Sahiplik belli olmadan recovery tanimlanamaz.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Teammate Kısmi Başarısızlık Recovery Mekanizması

### Yapılan Değişiklikler

**Dosya:** `Agentbase/.claude/commands/bootstrap.md`

#### 1. Yeni Bölüm: 5.2.3 Teammate Recovery Mekanizması (satır 1133)
- **Timeout limitleri:** Her teammate için 5dk (300s) timeout tanımlandı. Monorepo'larda 450s'ye yükseltilebilir.
- **Başarısızlık tespiti:** 4 fail senaryosu tanımlandı (timeout, hata, boş çıktı, eksik çıktı).
- **Retry stratejisi:** İlk başarısızlıkta aynı prompt ile 1 kez retry. 2. başarısızlıkta kullanıcıya 3 seçenek sunulur (manuel müdahale / atla / iptal).
- **Kısmi başarı yönetimi:** Üretilen dosyalar her durumda korunur. Retry sadece eksik dosyalar için yapılır (`[KISMI RETRY]` prefix'i ile).
- **Kullanıcı bildirim formatı:** Detaylı tablo formatında rapor — başarısız teammate, sebep, üretilemeyen/üretilen dosya listeleri, seçenekler.

#### 2. Güncelleme: 5.4 Dosya Oluşturma Raporu (satır 1268)
- 4 durum gösterimi eklendi: ✅ (başarılı), 🔄✅ (retry sonrası başarılı), ⚠️ (kısmi başarılı), ❌ (başarısız)
- Retry/kısmi başarı durumlarında ek detay bloğu eklendi.

#### 3. Güncelleme: HATA YÖNETİMİ bölümü (satır 1632)
- 6. madde olarak teammate failure kuralı eklendi (referansla 5.2.3'e yönlendiriyor).
<!-- SECTION:FINAL_SUMMARY:END -->
