---
id: TASK-24
title: 'Merge conflict yonetimi: 3 katmanli savunma'
status: Done
assignee: []
created_date: '2026-03-22 13:51'
updated_date: '2026-03-22 14:21'
labels:
  - git
  - conflict
  - monorepo
  - architecture
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Problem
Agentbase de merge conflict yonetimi yok. task-conductor paralel teammate ler spawn ettiginde ayni dosyaya dokunan task lar cakisabilir. Worktree kullaniminda da branch lar arasinda conflict olusabilir.

## Cozum: 3 Katmanli Savunma

### Katman 1: Onleme (task-plan seviyesi)
task-plan task olustururken affected_files alani ekler. task-conductor bu alani okuyarak ayni dosyaya dokunan task lari ayni faza koymaz.

```yaml
# Backlog task metadata
affected_files:
  - api/src/controllers/auth.controller.ts
  - api/src/middleware/auth.ts
  - api/src/routes/auth.routes.ts
```

task-conductor faz planlama sirasinda:
```
Task A: affected_files = [auth.controller.ts, auth.routes.ts]
Task B: affected_files = [auth.controller.ts, user.service.ts]
→ CAKISMA: auth.controller.ts — ayni faza koyma, sirali isle
```

### Katman 2: Tespit (pre-push hook seviyesi)
Push oncesi main ile trial merge yapilir:
```bash
git fetch origin main
git merge-tree $(git merge-base HEAD origin/main) HEAD origin/main
# Conflict varsa → push engellenir
```

### Katman 3: Cozum (agent davranisi)
Conflict tespit edildiginde 3 secenek:
- Basit conflict (farkli bolumler) → Agent otomatik resolve + test
- Karmasik conflict (ayni satirlar) → Agent durur, kullaniciya bildirir, backlog task acar
- Kendi degisikligi onemsiz → Agent kendi degisikligini geri alir, main den gunceller, task i yeniden uygular

## Uygulanacak Dosyalar
- task-plan.skeleton.md: affected_files alani AC/metadata ya eklenir
- task-conductor.skeleton.md: faz planlamada conflict graph kontrolu
- git-hooks/pre-push (TASK-17): trial merge adimi
- workflow-lifecycle.skeleton.md: conflict yonetim protokolu
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 task-plan skeleton a affected_files cikti alani eklendi
- [x] #2 task-conductor skeleton da faz planlama conflict graph kontrolu var
- [x] #3 pre-push hook a trial merge adimi eklendi (TASK-17 ile koordineli)
- [x] #4 workflow-lifecycle a 3 katmanli conflict yonetim protokolu eklendi
- [x] #5 Agent davranis kurallari: basit=auto resolve, karmasik=dur+bildir, onemsiz=geri al
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Katman 1 — Onleme
- **task-plan.skeleton.md:** Step 2.3 etki analizine affected_files zorunlulugu eklendi. Step 5.2 gorev aciklamasina `## Affected Files` bolumu eklendi. task-conductor bu listeyi conflict tespiti icin kullanir.
- **task-conductor.skeleton.md:** Step 2.2 tamamen yeniden yazildi — "Cakisma Kontrolu (Overlap Check)" yerine "Conflict Graph" mekanizmasi. Affected files'dan conflict graph olusturma, conflict zincirleri tespiti, karar matrisi (ortak dosya yok=paralel, var=sirayla, zincir=sirayla+geri kalan paralel).

### Katman 2 — Tespit
- **pre-push.skeleton:** Trial merge adimi eklendi — `git merge-tree` ile push oncesi main ile conflict kontrolu. Conflict varsa push engellenir ve rebase talimatı verilir.

### Katman 3 — Cozum
- **workflow-lifecycle.skeleton.md:** 3 Katmanli Savunma protokolu eklendi:
  - Agent karar agaci: basit conflict=otomatik resolve+test, karmasik=dur+kullaniciya bildir+backlog task ac, kendi degisikligi onemsiz=geri al+main'den guncelle+sifirdan uygula
  - Conflict karar kriterleri tablosu (farkli fonksiyonlar, ayni satirlar, import/dependency, migration, config)
  - Migration ve config conflict'leri ASLA otomatik resolve edilmez kurali

### Test
- generate.js syntax OK, 37/37 test gecti
<!-- SECTION:FINAL_SUMMARY:END -->
