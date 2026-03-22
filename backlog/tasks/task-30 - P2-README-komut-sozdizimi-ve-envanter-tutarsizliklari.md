---
id: TASK-30
title: 'P2: README komut sozdizimi ve envanter tutarsizliklari'
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 19:18'
updated_date: '2026-03-22 19:47'
labels:
  - readme
  - documentation
  - consistency
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Codex Bulgulari (P2)

### Bulgu 1: /task-conductor sozdizimi yanlis
README satirr 129: `/task-conductor` → "en yuksek oncelikli 5 gorev"
README satir 131: `/task-conductor 42 43 44` (boslukla ayrilmis)

Gercek skeleton: `top 5`, `all`, `3,5,8` (virgullu), `keyword auth`, `resume` bekliyor.

Duzeltme: README deki ornekleri skeleton ile eslestir:
```
/task-conductor              # top 5 (varsayilan)
/task-conductor all          # Tum acik gorevler
/task-conductor 3,5,8        # Virgullu ID listesi
/task-conductor auth         # Keyword arama
/task-conductor resume       # Kaldigi yerden devam
```

### Bulgu 2: /deep-audit README de yok
deep-audit.skeleton.md mevcut ama README komut listesinde gecmiyor.

Duzeltme: Komutlar bolumune /deep-audit aciklamasi ekle.

### Bulgu 3: /task-hunter coklu gorev sozdizimi
README: `/task-hunter 42 43 44` (boslukla)
Skeleton: `/task-hunter 42,43,44` (virgullu)

Duzeltme: README yi skeleton ile eslestir.

## Etkilenen Dosyalar
- README.md (komut ornekleri ve envanter)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 task-conductor ornekleri skeleton ile tutarli (top 5, all, virgullu ID, keyword, resume)
- [x] #2 deep-audit komutu README komut listesine eklendi
- [x] #3 task-hunter coklu gorev sozdizimi skeleton ile tutarli
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
README komut ornekleri skeleton dosyalariyla eslesitirildi: task-conductor (top 5 varsayilan, virgullu ID, keyword modu eklendi), task-hunter (virgullu coklu gorev), deep-audit komutu README ye eklendi.
<!-- SECTION:FINAL_SUMMARY:END -->
