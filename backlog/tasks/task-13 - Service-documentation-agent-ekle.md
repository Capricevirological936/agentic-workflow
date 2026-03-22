---
id: TASK-13
title: Service documentation agent ekle
status: Done
assignee: []
created_date: '2026-03-22 10:50'
updated_date: '2026-03-22 11:04'
labels:
  - agents
  - documentation
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Carrma'da service-documentation agent'i vardi — kod degisikligi sonrasi ilgili dokumanlari otomatik guncelliyordu. Template'de karsiligi yok. Core agent olarak eklenmeli (skeleton). Gorev: kod degisikligi yapildiktan sonra PROJECT.md, ARCHITECTURE.md, STACK.md gibi dokumanlari guncelleme onerisi sunar. task-hunter workflow'una entegre edilmeli — implementation sonrasi opsiyonel dokumantasyon guncelleme adimi.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 templates/core/agents/service-documentation.skeleton.md olusturuldu
- [x] #2 Agent frontmatter tutarli (name, tools, model, color)
- [x] #3 task-hunter skeleton'a opsiyonel dokumantasyon adimi eklendi
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Faz 3 — Genisleme. Bagimsiz, herhangi bir zamanda yapilabilir.

[ILERLEME] Task analizi tamamlandi; service-documentation agent skeleton ve task-hunter entegrasyon noktasi netlestirildi.

[TAMAMLANDI] service-documentation core agent skeleton eklendi; task-hunter workflow'una implementasyon sonrasi kosullu dokumantasyon senkronizasyon adimi eklendi. Dogrulama sed/rg ile yapildi. Otomatik test yok; degisiklikler markdown skeleton seviyesinde. Commit hash: yok.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
service-documentation agent skeleton eklendi ve task-hunter akisina opsiyonel dokumantasyon senkronizasyon adimi entegre edildi.
<!-- SECTION:FINAL_SUMMARY:END -->
