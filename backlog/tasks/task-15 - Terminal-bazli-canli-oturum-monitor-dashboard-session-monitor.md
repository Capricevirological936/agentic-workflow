---
id: TASK-15
title: Terminal bazli canli oturum monitor dashboard (session-monitor)
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 12:00'
updated_date: '2026-03-22 12:06'
labels:
  - ui
  - monitoring
  - hooks
  - tracking
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Session-tracker hook un urettigi JSON dosyalarini canli izleyen, terminal icinde gorsellestiren bir TUI dashboard.

## Problem
Session-tracker hook oturum durumunu JSON dosyalarina yaziyor ama bunu gormek icin elle dosya okumak veya /session-status komutunu calistirmak gerekiyor. Canli bir dashboard ile tum oturumlarin durumu anlik olarak takip edilebilir.

## Cozum
Saf Node.js + ANSI escape kodlari ile SIFIR DEPENDENCY terminal dashboard. fs.watch ile session dosyalarini izler, her degisiklikte ekrani gunceller.

### Dosya
`Agentbase/bin/session-monitor.js` — tek dosya, dogrudan calistirilir.

### Calistirma
```bash
# Ayri bir terminal penceresinde:
node bin/session-monitor.js
# veya
npm run monitor  (package.json scripts icine eklenecek)
```

### Dashboard Tasarimi
```
┌─────────────────────────────────────────────────────────────┐
│  AGENTIC WORKFLOW — Oturum Izleme          [3 aktif] 14:32 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ● 45012  TASK-7 Deterministik generate script   42dk       │
│  │ Tool: Edit → controllers/auth.ts                         │
│  │ R:23 W:8 │ Err:0 │ Teammate: core-gen [done]             │
│  │ ████████████████████░░░░ 47 tool calls                   │
│                                                             │
│  ● 45078  TASK-3 Hook format duzeltmesi          18dk       │
│  │ Tool: Bash → npm test                                    │
│  │ R:5 W:2 │ Err:0                                          │
│  │ ████░░░░░░░░░░░░░░░░░░░ 12 tool calls                   │
│                                                             │
│  ○ 45123  Bosta (12dk once)                                 │
│  │ Son: Read → session-tracker.js                           │
│  │ R:3 W:0 │ Err:0                                          │
│                                                             │
│  ─ 44890  Kapali (3sa once)  156 tool │ 45/22 R/W           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Git: 2 commit │ Backlog: 3 started, 1 done, 2 created       │
│ Toplam: 215 tool call │ 76 read │ 32 write │ 1 error        │
├─────────────────────────────────────────────────────────────┤
│ q:Cikis  1-4:Detay  r:Yenile  c:Kapali gizle               │
└─────────────────────────────────────────────────────────────┘
```

### Teknik Detaylar

**Rendering:**
- ANSI escape kodlari ile cursor kontrolu (\x1b[H ekranin basi, \x1b[2J temizle)
- Renkler: \x1b[32m yesil (aktif), \x1b[33m sari (bosta), \x1b[90m gri (kapali), \x1b[31m kirmizi (hata)
- Box-drawing karakterleri ile cerceve (─ │ ┌ ┐ └ ┘ ├ ┤)
- Terminal genisligine uyum (process.stdout.columns)
- Alternatif screen buffer (\x1b[?1049h) ile cikista temiz terminal

**Dosya Izleme:**
- `fs.watch` ile `.claude/tracking/sessions/` dizinini izle
- Degisiklik oldugunda tum session-*.json dosyalarini oku
- Throttle: en fazla 500ms araliklarla render et (cok sik guncellemeyi onle)
- Dosya okuma hatasi → o oturumu atla

**Oturum Siniflandirmasi:**
- last_activity < 5dk → ● aktif (yesil)
- last_activity 5-30dk → ○ bosta (sari)
- last_activity > 30dk → ─ kapali (gri)

**Detay Modu:**
- Kullanici 1-9 tusuna bastiginda o oturumun detayini gosterir
- Detayda: tum tool dagilimi, dosya listesi, backlog aktivitesi, teammate durumu, hata gecmisi
- ESC veya q ile ozet gorunumune don

**Progress Bar:**
- Tool call sayisini gorsel bar olarak goster
- Barin max degeri o oturumdaki en yuksek tool call sayisina gore otomatik olceklenir

**Keyboard Input:**
- process.stdin raw mode (readline yerine tus tus okuma)
- q: cikis (alternatif buffer restore + cursor goster)
- 1-9: oturum detayi
- r: manual yenile
- c: kapali oturumlari gizle/goster
- h: yardim goster/gizle

**Footer Istatistikleri:**
- Tum oturumlarin toplu istatistikleri: toplam tool call, read, write, error
- Git ve backlog toplu aktivite

### Risk Degerlendirmesi
- DUSUK risk: Sadece OKUR, hicbir dosyaya YAZMAZ
- fs.watch bazen coklu event atar — throttle ile handle edilir
- Alternatif screen buffer ile terminal kirlenmesi yok
- SIGINT/SIGTERM ile temiz cikis (buffer restore, cursor goster)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 bin/session-monitor.js dosyasi olusturuldu, sifir dependency
- [x] #2 fs.watch ile session dosyalari canli izleniyor
- [x] #3 ANSI renkli ve box-drawing karakterli dashboard render ediliyor
- [x] #4 Oturum siniflandirmasi dogru calisiyor (aktif/bosta/kapali)
- [x] #5 Keyboard input destegi: q (cikis), 1-9 (detay), r (yenile), c (gizle)
- [x] #6 Detay modunda tek oturumun tam bilgisi gorunuyor
- [x] #7 Progress bar tool call sayisini gorsellestiriyor
- [x] #8 Footer toplu istatistikleri dogru gosteriyor
- [x] #9 Alternatif screen buffer ile temiz terminal
- [x] #10 500ms throttle ile performans sorunu yok
- [x] #11 Terminal genisligine responsive uyum
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Terminal bazli canli oturum monitor dashboard olusturuldu.

Degisiklikler:
- bin/session-monitor.js: Sifir dependency TUI dashboard. ANSI renkler, box-drawing, progress bar, keyboard input, alternatif screen buffer.

Ozellikler:
- fs.watch ile session dosyalarini canli izler
- 3 durum: aktif (yesil), bosta (sari), kapali (gri)
- Her oturum: PID, aktif task, tool dagilimi, dosya R/W, hata sayisi, teammate durumu
- Progress bar tool call sayisini gorsellestirir
- Footer toplu istatistikler (git, backlog, tool, error)
- Keyboard: q cikis, 1-9 detay, r yenile, c kapali gizle, h yardim, ESC geri
- Detay modunda tam oturum bilgisi
- 500ms throttle ile performans
- Alternatif screen buffer ile temiz terminal
- Terminal genisligine responsive

Test:
- 3 sahte session ile dashboard dogru render edildi
- Footer string interpolation bug duzeltildi
<!-- SECTION:FINAL_SUMMARY:END -->
