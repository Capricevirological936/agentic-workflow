---
id: TASK-1
title: Bootstrap re-run davranisini tanimla
status: Done
assignee: []
created_date: '2026-03-22 10:47'
updated_date: '2026-03-22 10:56'
labels:
  - bootstrap
  - architecture
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Bootstrap ikinci kez calistirildiginda mevcut .claude/ dosyalarina ne olacagi tanimli degil. Uc senaryo belirlenmeli: (1) temiz ustune yazma (mevcut silinir, sifirdan uretilir), (2) merge (manifest farklari birlestirilir, yeni moduller eklenir, eskiler korunur), (3) incremental update (sadece degisen moduller guncellenir). Manifest versiyonlama mekanizmasi da gerekli — eski manifest ile yeni template arasindaki uyumluluk kontrolu. Re-bootstrap sirasinda kullanicinin elle yaptigi rule/hook degisikliklerinin kaybolmamasi icin bir koruma mekanizmasi (ornegin .claude/custom/ dizini veya git diff kontrolu) tanimlanmali.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Re-bootstrap modu secenekleri dokumante edildi (overwrite/merge/incremental)
- [x] #2 Manifest versiyon alani eklendi ve uyumluluk kontrolu tanimlandi
- [x] #3 Kullanici customization koruma mekanizmasi tanimlandi
- [x] #4 bootstrap.md Adim 1.3 guncellendi
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Bootstrap re-run davranisi README, bootstrap komutu ve tasarim spec'inde tanimlandi. Overwrite/merge/incremental modlari, manifest version uyumluluk kurali ve .claude/custom/ tabanli customization korumasi eklendi.
<!-- SECTION:FINAL_SUMMARY:END -->
