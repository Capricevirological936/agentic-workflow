---
id: TASK-11
title: auto-review loop komutu ekle
status: Done
assignee:
  - '@codex'
created_date: '2026-03-22 10:50'
updated_date: '2026-03-22 11:07'
labels:
  - commands
  - review
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Carrma'da /auto-review komutu vardi — loop uyumlu diff review. Template'de karsiligi yok. task-review tek seferlik calisir, otomatik tekrar mekanizmasi yok. Eklenmesi gereken: /auto-review komutu core commands'a skeleton olarak eklenmeli. Akis: (1) son review hash'ini kontrol et, (2) yeni degisiklik varsa shallow review yap, (3) MINOR bulgulari dogrudan duzelt + commit, (4) MAJOR bulgulari backlog task olarak ac, (5) hash guncelle — sonraki loop'ta tekrar etme. /loop skill'i ile uyumlu olmali.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 templates/core/commands/auto-review.skeleton.md olusturuldu
- [ ] #2 Diff hash kontrolu ve tekrar onleme mekanizmasi tanimlandi
- [ ] #3 MINOR dogrudan fix + MAJOR backlog task akisi tanimlandi
- [ ] #4 /loop skill uyumlulugu sagandi
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Uygulama Plani — Task #11

### Degisiklik Listesi
1. Agentbase/templates/core/commands/auto-review.skeleton.md — loop uyumlu auto-review skeleton'unu ekle
2. Agentbase/templates/core/rules/workflow-lifecycle.skeleton.md — auto-review yasam dongusunu dokumante et
3. README.md ve Agentbase/README.md — komut listelerine /auto-review ekle
4. Docs/superpowers/plans/2026-03-22-auto-review-command.md — ayrintili uygulama planini kaydet

### Bagimliliklar
- Mevcut task-review ve bug-review skeleton'larindaki review dili/pattern'i korunacak

### Risk Alanlari
- Loop uyumlulugu icin state dosyasi ve tek-iterasyon kurallari net tanimlanmali
- MINOR/MAJOR ayrimi diff review akisini belirsiz birakmamali

### Tahmini Karmasiklik
- [ ] Basit (tek dosya, net degisiklik)
- [x] Orta (2-4 dosya, mevcut pattern'i takip)
- [ ] Karmasik (5+ dosya, yeni pattern veya entegrasyon)
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 3 — Genisleme. Bagimsiz, herhangi bir zamanda yapilabilir.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Auto-review core command skeletonu eklendi. Komut icinde diff hash kontrolu, tekrar-onleme state sozlesmesi, MINOR dogrudan fix + MAJOR backlog task akisi ve /loop icin idempotent tek-pas kurallari tanimlandi. README ile workflow belgeleri yeni komutu gosterecek sekilde guncellendi. Dogrulama; skeleton dosyasi ve plan dosyasi varligi ile ilgili anahtar ifadeler rg komutlariyla teyit edildi.
<!-- SECTION:FINAL_SUMMARY:END -->
