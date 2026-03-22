---
id: TASK-14
title: 'Oturum izleme sistemi: session-tracker hook + state dosyasi'
status: Done
assignee:
  - '@claude'
created_date: '2026-03-22 11:17'
updated_date: '2026-03-22 11:47'
labels:
  - hooks
  - tracking
  - observability
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Her Claude Code oturumunun calisma durumunu .claude/tracking/sessions/ altinda JSON dosyasina yazan bir hook + tracking sistemi.

## Problem
Su an hangi oturumda ne calistigini, hangi task uzerinde olundugunu, kac dosya okundugunu/yazildigini, hata olup olmadigini bilmenin yolu yok. Oturum bittiginde ne yapildiginin ozeti sadece conversation tarihcesinde kaliyor.

## Cozum
PostToolUse hook ile her tool cagrisinda oturum state dosyasini guncelleyen bir sistem.

### Dosya Yapisi
```
.claude/tracking/sessions/
  session-{id}-{tarih}.json    # Her oturum icin ayri dosya
  current-session.json         # Aktif oturuma symlink/referans
```

### State Dosyasi Formati
```json
{
  "session_id": "terminal-pid veya uuid",
  "started_at": "2026-03-22T14:30:00Z",
  "last_activity": "2026-03-22T15:12:34Z",
  "status": "active",
  "duration_seconds": 2534,
  "current_task": {
    "backlog_id": "TASK-7",
    "title": "Deterministik skeleton isleme",
    "started_at": "2026-03-22T14:45:00Z"
  },
  "tools": {
    "total_calls": 47,
    "by_type": {
      "Read": 23,
      "Edit": 8,
      "Write": 4,
      "Bash": 9,
      "Grep": 3,
      "Agent": 2
    },
    "last_tool": "Edit",
    "last_tool_target": ".claude/commands/bootstrap.md"
  },
  "files": {
    "read": ["bootstrap.md", "task-hunter.skeleton.md", "..."],
    "written": ["settings.json", "code-review.md"],
    "read_count": 23,
    "written_count": 8
  },
  "errors": {
    "count": 0,
    "last_error": null,
    "history": []
  },
  "teammates": [
    {
      "name": "core-generator",
      "spawned_at": "2026-03-22T14:50:00Z",
      "status": "completed",
      "completed_at": "2026-03-22T14:55:30Z"
    }
  ],
  "backlog_activity": {
    "tasks_started": ["TASK-7"],
    "tasks_completed": [],
    "tasks_created": ["TASK-14"]
  },
  "git_activity": {
    "commits": 0,
    "files_staged": []
  }
}
```

### Hook Implementasyonu

**PostToolUse hook (session-tracker.js):**
- Her tool cagrisinda tetiklenir (Edit, Write, Read, Bash, Grep, Glob, Agent)
- stdin JSON ile tool bilgisini alir
- Mevcut session dosyasini okur (yoksa olusturur)
- Tool tipine gore ilgili sayaci arttirir
- Dosya yolunu files.read veya files.written dizisine ekler
- last_activity timestamp gunceller
- Bash komutunda backlog CLI tespit ederse backlog_activity gunceller
- Bash komutunda git commit tespit ederse git_activity gunceller
- Agent tool tespit ederse teammates dizisine ekler
- Tool sonucunda hata varsa errors.history dizisine ekler
- Dosyayi yazar ve cikar (non-blocking, sessiz hata)

**Oturum ID Belirleme:**
- `process.ppid` (parent process ID) kullanilabilir — ayni terminal oturumunda sabit kalir
- Veya `CLAUDE_SESSION_ID` env var (varsa) kullanilir
- Yoksa PID + tarih kombinasyonu ile benzersiz ID uretilir

**Performans Gereksinimleri:**
- Hook 50ms icinde tamamlanmali (timeout: 100ms)
- Dosya yazma async olabilir — tool cagrisini bloklamamali
- JSON dosyasi buyurse (100KB+) eski entries kirpilabilir

### settings.json Entegrasyonu
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Read|Edit|Write|Bash|Grep|Glob|Agent",
        "hooks": [{
          "type": "command",
          "command": "node .claude/hooks/session-tracker.js",
          "timeout": 100
        }]
      }
    ]
  }
}
```

### Ek: Oturum Ozeti Komutu (opsiyonel)
Bir slash command olarak /session-status eklenebilir: current-session.json okur ve kullaniciya ozet gosterir.

### Risk Degerlendirmesi
- DUSUK risk: Hook sadece OKUR ve kendi tracking dosyasina YAZAR
- Codebase ye DOKUNMAZ
- Tool cagrisini BLOKLAMAZ (non-blocking write)
- Hata durumunda sessiz gecer (hook fail = session tracking durur, is akisi etkilenmez)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 session-tracker.js hook dosyasi olusturuldu ve calisir durumda
- [x] #2 Her tool cagrisinda session JSON dosyasi dogru guncelleniyor
- [x] #3 Oturum ID terminal bazli benzersiz uretiliyor (restart sonrasi farkli ID)
- [x] #4 Backlog CLI komutlari otomatik tespit edilip backlog_activity guncelleniyor
- [x] #5 Agent/teammate spawn ve completion olaylari teammates dizisine kaydediliyor
- [x] #6 Hata durumunda errors.history dogru dolduruluyor
- [x] #7 Hook 100ms timeout icinde calisiyor ve tool akisini bloklamiyor
- [x] #8 settings.json skeleton a session-tracker hook tanimi eklendi
- [x] #9 Coklu oturum destegi: her oturum sadece kendi session dosyasina yazar, race condition yok
- [x] #10 current-session.json yerine /session-status komutu tum aktif oturumlari listeler (last_activity 30dk icindeyse aktif)
- [x] #11 Oturum kapanisinda (process.on SIGTERM/SIGINT) status: completed olarak isaretleniyor
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Coklu oturum destegi eklendi:
- current-session.json KALDIRILDI (race condition riski)
- Her oturum SADECE kendi session-{pid}-{tarih}.json dosyasina yazar
- /session-status slash command tum sessions/ dizinini tarar, last_activity son 30dk icinde olanlari aktif gosterir
- Oturum kapandiginda process.on(SIGTERM) ile status: completed yazilir
- 4 paralel CC oturumu guvenle calisabilir
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Session tracker hook + /session-status komutu olusturuldu.

Degisiklikler:
- templates/core/hooks/session-tracker.js: PostToolUse hook, her tool cagrisinda oturum durumunu .claude/tracking/sessions/session-{ppid}-{tarih}.json dosyasina yazar
- templates/core/commands/session-status.skeleton.md: Aktif oturumlari listeleyen slash command
- templates/core/settings.skeleton.json: Session-tracker hook kaydı eklendi (matcher: .*)
- .claude/tracking/sessions/.gitkeep: Dizin olusturuldu

Test:
- Read, Edit, Bash, Agent tool tipleri dogru tespit ediliyor
- backlog task edit In Progress → tasks_started dogru dolduruluyor
- git commit → commits dogru sayiliyor
- Agent spawn → teammates dizisine dogru ekleniyor
- Coklu oturum: farkli PID ler ayri dosyalara yaziyor, race condition yok
- Performans: < 50ms
<!-- SECTION:FINAL_SUMMARY:END -->
