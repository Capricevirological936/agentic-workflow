---
id: TASK-21
title: Bootstrap eklenti havuzu taramasi ve oneri sistemi
status: Done
assignee: []
created_date: '2026-03-22 13:40'
updated_date: '2026-03-22 14:56'
labels:
  - bootstrap
  - extensions
  - discovery
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Fikir
Bootstrap proje analizinden sonra onceden hazirlanmis bir eklenti havuzunu (extensions registry) tarar ve projeye uygun eklentileri onerir. Kurulum yapmaz — sadece onerir.

## Nasil Calisir
1. Bootstrap Adim 2 (Codebase analizi) tamamlandiktan sonra
2. Eklenti havuzu dosyasini oku (Agentbase/templates/extensions-registry.yaml)
3. Aktif moduller ve stack bilgisini eklenti kategorileriyle esle
4. Adim 7 (tamamlanma raporu) icinde "Onerilen Eklentiler" bolumu goster

## Eklenti Havuzu Formati
extensions.md den donusturulecek yapisal format:
```yaml
extensions:
  - name: "Trail of Bits Security"
    repo: "trailofbits/skills"
    agent: claude
    category: security
    triggers:  # Bu eklentiyi hangi kosullarda oner
      - module: security
      - stack: [express, django, laravel, fastapi]
    description: "Guvenlik arastirmasi ve zafiyet tespiti"
    conflicts: []  # Agentbase ozelliklerinden hangisiyle cakisir

  - name: "Claude Squad"
    repo: "smtg-ai/claude-squad"
    agent: claude
    category: multi-agent
    triggers:
      - module: monorepo
      - condition: "subprojects.length >= 3"
    description: "Birden fazla Claude Code orneğini yonetme"
    conflicts: []

  - name: "Context Mode"
    repo: "mksglu/context-mode"
    agent: claude
    category: memory
    triggers:
      - condition: "total_files > 500"  # buyuk projelerde onerilis
    description: "98 percent context tasarrufu"
    conflicts: []
```

## Rapor Ciktisi
```
Onerilen Eklentiler (projenize uygun):

  Guvenlik:
    Trail of Bits Security — zafiyet tespiti
      npm i -g @trailofbits/skills

  Multi-Agent:
    Claude Squad — paralel oturum yonetimi (4 subproject)
      npm i -g claude-squad

  Not: Bu oneriler opsiyoneldir. Hicbiri Bootstrap icin zorunlu degildir.
```

## Uyari ve Kisitlamalar
- Eklenti havuzu Agentbase/templates/ icinde yasar (extensions-registry.yaml)
- Bootstrap KURMAZ — sadece onerir
- Cakisma kontrolu: Agentbase in kendi ozellikleriyle cakisan eklentiler isaretlenir
- Havuz kullanici tarafindan genisletilebilir
- Mevcut extensions.md (markdown) YAML a donusturulur (parse guvenilirligi)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 extensions-registry.yaml dosyasi olusturuldu (extensions.md den donusturulmus)
- [x] #2 Bootstrap Adim 2 sonrasi eklenti eslesme mantigi calisiyor
- [x] #3 Adim 7 raporunda Onerilen Eklentiler bolumu gosteriliyor
- [x] #4 Cakisma kontrolu: Agentbase ozellikleriyle cakisan eklentiler uyari ile isaretleniyor
- [x] #5 Eklenti havuzu kullanici tarafindan genisletilebilir (YAML format dokumante)
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Yapilan Degisiklikler

### Yeni Dosya
- **templates/extensions-registry.yaml** — 13 eklenti, 7 kategori (security, multi-agent, memory, workflow, quality, devops, management). Her eklenti:
  - name, repo, url, agent, category, install, description
  - triggers: module/stack/condition eslesmesi
  - conflicts: Agentbase ozellikleriyle cakisma notu
  - YAML format dokumante edildi (basinda sema aciklamasi)

### Eklentiler
- Security: Trail of Bits, Security Scanner, Parry
- Multi-agent: Claude Squad, Parallel Code, ccswarm
- Memory: Context Mode, Memorix
- Workflow: Claude CodePro (TDD cakisma notu ile)
- Quality: cc-tools, Claude Code Action
- DevOps: Container Use
- Management: CCPM (Backlog.md cakisma notu ile)

### bootstrap.md
- **Adim 7.1 (YENI):** Eklenti Oneri Sistemi
  - Eslesme mantigi: module, stack, condition trigger tipleri
  - Cakisma kontrolu: conflicts alanindaki uyarilari gosterme
  - Rapor ciktisi: kategori bazli oneri listesi + cakisma notlari
  - Eslesen eklenti yoksa bolumu atlama kurali

### Test
- extensions-registry.yaml valid YAML (js-yaml ile parse edildi)
- 13 eklenti, 7 kategori dogrulandi
- generate.js 37/37 test gecti
<!-- SECTION:FINAL_SUMMARY:END -->
