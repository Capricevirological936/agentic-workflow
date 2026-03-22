---
id: TASK-23
title: Task-hunter otomatik metot yonlendirme tablosu
status: Done
assignee: []
created_date: '2026-03-22 13:47'
updated_date: '2026-03-22 14:09'
labels:
  - task-hunter
  - methodology
  - architecture
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Konsept
Farkli gorevler farkli yaklasim gerektirir. Su an task-hunter her gorevi ayni 7 adimli akisla isliyor. Bunun yerine gorev karakteristiklerine bakarak yaklasimini otomatik ayarlamali.

## Mevcut Durum
task-hunter.skeleton.md sabit 7 adim: oku → planla → implement et → dogrula → commit → kapat → raporla. Her gorev tipi icin ayni akis.

## Onerilen: Routing Tablosu
task-hunter Adim 2 (Analiz ve Plan) icinde gorev karakteristiklerini degerlendirir ve yaklasimini ayarlar:

### Karar Matrisi
```
Gorev Tipi Tespiti (AC ve description dan):
  Bug fix?                      → AECA modu: hipotez → test → maks 3 deneme
                                  (Zaten bug-hunter da var ama task-hunter da da tetiklenmeli)
  Basit feature (1-2 dosya)?    → RPI modu: research → plan → implement (tek agent, hizli)
  Karmasik feature (3+ dosya)?  → Orchestrator modu: teammate spawn, paralel calisma
  Refactoring (10+ dosya)?      → Context Cycling: her 5 dosyada ara commit + ozet
                                  Uzun refactoring de context kirlenmesini onler

Ek Modifierlar (gorev tipinin ustune eklenir):
  Guvenlik dokunuyor?           → + Adversarial Testing: implementation sonrasi
                                  "bu kodu kirmayi dene" perspektifli review
  UI degisikligi?               → + TDD adimi: once gorsel/davranis testi, sonra kod
  manifest.test_strategy=TDD?   → + Red-Green zorunlu: test ONCE yazilir
  manifest.security_level=high? → + Dual-Pass: ikinci agent temiz context ile review
```

### Implementasyon
task-hunter.skeleton.md Adim 2 ye eklenen bolum:
```markdown
### 2.1 Gorev Tipi Analizi

Gorev AC lerini ve description ini oku. Asagidaki routing tablosunu uygula:

1. AC lerdeki anahtar kelimeleri tara: "bug", "hata", "fix", "duzelt" → AECA modu
2. Etkilenen dosya sayisini tahmin et: 1-2 → RPI, 3-9 → standart, 10+ → Context Cycling
3. Dosya turlerini kontrol et: controller/middleware/auth → guvenlik modifier
4. UI component dosyalari varsa → TDD modifier
5. Manifest security_level ve test_strategy kontrol et → ek modifier lar

Secilen modu kullaniciya bildir:
"Gorev analizi: Karmasik feature (5 dosya tahmini) + guvenlik modifier.
 Yaklasim: Orchestrator modu + Adversarial Testing"
```

### Dikkat
- Bu bir MENU DEGIL — kullaniciya secim sunulmaz, task-hunter otomatik yonlendirir
- Routing hataliysa kullanici mudahale edebilir ("hayir bu basit, tek agent yeter")
- methods.md referans dokuman olarak Agentbase/templates/ icine alinir (Agentbase/templates/reference/methods.md)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 task-hunter.skeleton.md Adim 2 ye gorev tipi analizi bolumu eklendi
- [x] #2 4 ana mod tanimlandi: AECA, RPI, Orchestrator, Context Cycling
- [x] #3 4 ek modifier tanimlandi: Adversarial Testing, TDD, Red-Green, Dual-Pass
- [x] #4 Manifest ten security_level ve test_strategy otomatik okunuyor
- [x] #5 Secilen mod kullaniciya bildirilior (override imkani ile)
- [x] #6 methods.md referans dokuman olarak templates/reference/ altina eklendi
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### task-hunter.skeleton.md
- **Step 2.4 (YENi):** Gorev Tipi Analizi ve Yonlendirme
  - 4 ana mod: AECA (bug fix — hipotez dongusu, maks 3 deneme), RPI (basit feature — tek agent), Orchestrator (karmasik — paralel teammate), Context Cycling (buyuk refactoring — 5 dosyada ara commit)
  - 4 modifier: Adversarial Testing (guvenlik review), TDD (UI test-first), Red-Green (test ONCE), Dual-Pass (temiz context review)
  - Karar bildirimi + kullanici override mekanizmasi
  - GENERATE blogu: TASK_ROUTING_CONFIG (manifest.workflows.test_strategy + project.security_level)
- **Step 2.5:** Eski 2.4 yeniden numaralandirildi, mod-spesifik plan alanlari eklendi (AECA hipotez, Orchestrator teammate bolumu, Context Cycling iterasyon plani)
- **Step 3.0 (YENI):** Mod-Spesifik Uygulama Akisi
  - Her mod icin detayli akis talimatlari (AECA dongusu, RPI inline, Orchestrator delegasyon, Context Cycling iterasyon)
  - Step 3.0.1: Modifier uygulamasi (hangi modifier ne zaman, hangi sirada)
  - Step 3.1'e Orchestrator-only notu eklendi

### generate.js
- TASK_ROUTING_CONFIG generator eklendi (manifest.workflows.test_strategy + project.security_level → Red-Green/Dual-Pass modifier AKTIF/PASIF)

### bootstrap.md
- GENERATE blok tablosunda task-hunter satirina TASK_ROUTING_CONFIG eklendi
- Basit bloklar listesine TASK_ROUTING_CONFIG eklendi

### Onceden mevcut (AC#6)
- methods.md zaten templates/reference/methods.md altinda mevcut

### Test
- generate.js syntax OK, 37/37 test gecti
- TASK_ROUTING_CONFIG 3 senaryo ile dogrulandi (TDD+high, none+standard, empty)
<!-- SECTION:FINAL_SUMMARY:END -->
