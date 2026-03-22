![Agentic Workflow banner](Docs/assets/agentic-workflow-banner.png)

Mevcut bir yazilim projesine Claude Code odakli ve Backlog.md ile entegre calisan moduler bir ajan destekli gelistirme katmani kurmak icin hazirlanmis bir sablon deposudur.

Bu depo dogrudan bir uygulama degildir. Amac, hedef projeyi analiz edip ona uygun komutlari, ajanlari, hook'lari, kurallari ve yardimci dokumantasyonu uretmektir.

## Ne Saglar?

- Hedef projeyi otomatik analiz eder; proje tipi, alt projeler, teknoloji yigini ve aktif modul adaylarini cikarir.
- Eksik kalan bilgileri kisa ve fazli bir roportajla toplar.
- Projeye ozel bir manifest uretir ve bunu uretim icin tek kaynak olarak kullanir.
- Ihtiyaca gore `.claude/commands`, `.claude/agents`, `.claude/hooks`, `.claude/rules` ve destek dokumanlarini olusturur.
- Agentbase ve Codebase ayrimiyla yapilandirma katmanini uygulama kodundan izole eder.

## Temel Yaklasim

Bu repo uc ana calisma alani uzerine kuruludur:

| Yol | Amac |
| --- | --- |
| `Agentbase/` | Sablonlar, uretim mantigi, Claude komutlari ve yardimci araclar |
| `Codebase/` | Uzerinde calisilacak gercek proje kodu |
| `Docs/agentic/` | Bootstrap tarafindan uretilen manifest ve proje baglami |

Bu ayrimin iki onemli sonucu vardir:

- Git islemleri hedef proje tarafinda, yani `Codebase/` icinde yurur.
- Bootstrap sureci `Codebase/` dizinine yazmaz; uretimi `Agentbase/` ve `Docs/agentic/` altinda yapar.

### Worktree Avantaji

Agentbase/Codebase ayrimi git worktree ile paralel gelistirmeyi dogal olarak destekler:

```
Agentbase/                  ← SABIT — tum worktree'ler ayni config'i kullanir
│
├── .claude/commands/       ← Kurallar, hook'lar, agent'lar TEK yerde
├── .claude/hooks/
├── .claude/rules/
│
Codebase/ → proje (main)    ← Ana worktree
Codebase/ → wt-feat-auth    ← git worktree add (feature/auth branch)
Codebase/ → wt-feat-pay     ← git worktree add (feature/payment branch)
```

Geleneksel yapida `.claude/` proje kokunde yasadir — worktree olustururken her birinde ayri `.claude/` kopyasi olusur, config degisiklikleri senkronize olmaz. Agentbase ayrimi bu sorunu kokten cozer:

- **Tek config, cok worktree** — Hook'lar, kurallar, agent'lar hep ayni
- **Izole git tarihcesi** — Agentbase dosyalari proje commit'lerine karismaz
- **Paralel oturum** — 4 terminal, 4 worktree, 4 Claude Code oturumu, tek Agentbase

## Depoda Neler Var?

Bu repoda bulunan ana bilesenler:

- `Agentbase/.claude/commands/bootstrap.md` — Kurulum akisini baslatan ana komut
- `Agentbase/templates/` — Cekirdek sablonlar ve modul bazli iskelet dosyalari
- `Agentbase/generate.js` — Manifestten deterministik icerik ureten betik
- `Agentbase/bin/session-monitor.js` — Oturum izleme araci
- `Agentbase/tests/` — Uretim ve hook davranislarini dogrulayan testler

Not: Bu depodaki bazi komut dosyalari ornek veya cekirdek icerik olarak yer alir. Asil komut seti bootstrap sonrasinda hedef projenin yapisina gore uretilir.

## Gereksinimler

- [Claude Code CLI](https://docs.anthropic.com/claude-code)
- [Backlog.md CLI](https://github.com/MrLesk/Backlog.md) — `npm i -g backlog.md`
- Node.js ve npm

## Hizli Baslangic

```bash
git clone https://github.com/varienos/agentic-workflow
cd agentic-workflow

# Yer tutucu Codebase klasorunu hedef proje ile degistirin
rm -rf Codebase
ln -s /path/to/your/project Codebase

cd Agentbase
npm install
claude
```

Claude Code icinde:

```
/bootstrap
```

## Bootstrap Akisi

`/bootstrap` komutu yuksek seviyede su adimlarla calisir:

1. On kosullari dogrular. Backlog CLI, `Codebase/` erisimi ve varsa onceki manifest kontrol edilir.
2. Hedef projeyi analiz eder. Proje tipi, dizin yapisi, alt projeler, paket yoneticisi, test araclari ve modul adaylari cikarilir.
3. Eksik bilgileri fazli roportajla toplar. Proje, teknik tercih, gelistirici profili ve domain kurallari netlestirilir.
4. `Docs/agentic/project-manifest.yaml` dosyasini uretir.
5. Manifeste gore ilgili komutlari, ajanlari, hook'lari, kurallari ve yardimci dokumanlari olusturur.
6. Yeniden calistirmalarda `overwrite`, `merge` ve `incremental` senaryolarini destekler.

## Komutlar

Bootstrap tamamlandiktan sonra kullanilabilir hale gelen komutlar:

### /task-hunter

Backlog'daki bir gorevi otonom olarak implement eder. Gorev dosyasini okur, etkilenen dosyalari kesfeder, implementation plani hazirlar, kodu yazar, testleri calistirir, commit eder ve gorevi kapatir. Karmasik gorevlerde teammate spawn ederek paralel calisma baslatabilir. Is bittiginde sicak baglam skorlamasiyla sonraki en uygun gorevi onerir — vibecode akisi icin context degisimini minimize eder.

```
/task-hunter 42          # Tek gorev
/task-hunter 42 43 44    # Sirayla birden fazla gorev
/task-hunter auth        # Keyword ile gorev arama
```

### /task-master

Backlog'daki tum acik gorevleri 4 boyutlu skorlama ile onceliklendirir. Her gorev icin Impact (etki), Risk (risk), Dependency (bagimlilik) ve Complexity (karmasiklik — ters orantili) skorlari hesaplanir. Sonuc olarak faz bazli bir calisma plani cikarir: Faz 1 kritik gorevler, Faz 2 onemli gorevler, Faz 3 planlanmis gorevler, MANUEL fazda insan mudahalesi gereken gorevler.

```
/task-master
```

### /task-conductor

Birden fazla gorevi faz bazli otonom olarak isler. task-master'in onceliklendirmesini kullanarak gorevleri fazlara atar, her fazda sirayla veya paralel olarak implement eder, faz sonunda otomatik code review yapar. Manuel faz destegi vardir — bazi gorevler insan mudahalesi gerektiginde conductor durur ve bekler. State dosyasi ile kesintiye ugradiginda kaldigindan devam eder.

```
/task-conductor            # En yuksek oncelikli 5 gorev
/task-conductor all        # Tum acik gorevler
/task-conductor 42 43 44   # Belirli gorevler
/task-conductor resume     # Kaldigi yerden devam et
```

### /task-plan

Bir istegi derinlemesine analiz ederek backlog gorevi olusturur. Codebase'i tarar, etkilenen dosyalari tespit eder, karmasiklik skoru hesaplar, model onerisi yapar ve kabul kriterleriyle birlikte gorevi backlog'a yazar. Scope buyukse gorevi birden fazla task'a boler. Gorev olusturur ama kod YAZMAZ — implementasyon task-hunter'a birakilir.

```
/task-plan "Kullanici profil sayfasina avatar yukleme ozelligi ekle"
/task-plan "API rate limiting implement et"
```

### /task-review

Son degisiklikleri 3 paralel agent ile review eder. Code Reviewer genel kod kalitesini, Silent Failure Hunter sessiz hatalari ve hatali hata yonetimini, Regression Analyzer degisikligin mevcut islevselligi kirma riskini degerlendirir. Bulgular MINOR (dogrudan duzelt) ve MAJOR (backlog task ac) olarak siniflandirilir. Pre-existing hatalar asla "scope disi" olarak atlanmaz — backlog'a kaydedilir.

```
/task-review
```

### /auto-review

Diff-based, loop uyumlu ve idempotent review. Son commit'ten bu yana yapilan degisiklikleri hash kontroluyle inceler — ayni diff'i iki kez review etmez. MINOR bulgulari dogrudan duzeltir ve commit eder, MAJOR bulgular icin backlog task acar. `/loop` skill'i ile periyodik calistirmaya uygundur. Kendi fix commit'lerini sonraki calistirmada tekrar review etmez.

```
/auto-review
```

### /bug-hunter

Bug'in root cause'unu bulur ve duzeltir. Hata taanimini alir, codebase'de ilgili dosyalari bulur, maks 3 hipotez uretir ve her birini test eder. Root cause bulundugunda minimal fix uygular, regresyon testi yazar, commit eder ve backlog gorevi olusturup kapatir. 3 hipotez siniri sonsuz derinlige dalmayi onler — 3 denemede bulunamazsa bulgulari raporlar ve durur.

```
/bug-hunter "Kullanici giris yaptiktan sonra profil sayfasi 500 hatasi veriyor"
/bug-hunter "Bildirimler sayfasi sonsuz donguye giriyor"
```

### /bug-review

Bug fix'ini 3 farkli perspektiften inceler. Code Reviewer fix'in kalitesini ve dogru root cause'u hedef alip almadigini, Silent Failure Hunter fix'in yeni sessiz hatalar olusturup olusturamadigini, Regression Analyzer fix'in baska yerleri kirma riskini degerlendirir. Sonsuz dongu korumaasi vardir — maks 1 iterasyon.

```
/bug-review
```

### /memorize

Oturum icerisinde ogreniilen bilgileri kalici hafizaya kaydeder. Rutin islemleri degil, sadece tekrarlama riski olan yapisal bilgileri kaydeder: beklenmedik tuzaklar, kullanici tercihleri, mimari kararlar, surpriz kesfler, yeni tool/dependency notlari. Her kayit `Why` (neden onemli) ve `How to apply` (nasil uygulanacak) alanlariyla yapilir.

```
/memorize
```

### /session-status

Tum aktif, bosta ve kapali Claude Code oturumlarini tablo formatinda gosterir. Her oturumun PID'i, uzerinde calistigi gorev, tool kullanim istatistikleri, hata sayisi ve teammate durumu gorunur. Canli dashboard icin `node bin/session-monitor.js` kullanilir.

```
/session-status
```

### /deadcode

Projede kullanilmayan kodu tespit eder ve temizlik onerir. Cagrilmayan fonksiyonlar, import edilmeyen moduller, unreachable branch'ler taranir. Her bulgu confidence seviyesiyle siniflandirilir: HIGH (hicbir yerden referans yok), MEDIUM (sadece test'lerden referans), LOW (dinamik import/reflection ile kullaniyor olabilir). Yuksek confidence bulgulari icin otomatik temizlik onerilir.

```
/deadcode
/deadcode api/src/services/    # Belirli dizin
```

### Moduler Komutlar

Bu komutlar Bootstrap'in tespit ettigi modullere gore uretilir — her projede bulunmaz:

| Komut | Modul | Ne Yapar |
|-------|-------|----------|
| `/pre-deploy` | Deploy | Production push oncesi kontrol: derleme, test, migration, env sync, Docker build. PASS/FAIL/WARN raporu. |
| `/post-deploy` | Deploy | Deploy sonrasi dogrulama: health check, smoke test, rollback rehberi. |
| `/idor-scan` | Security | API endpoint'lerinde IDOR guvenlik acigi taramasi — 5 nokta kontrol matrisi. |
| `/review-module <ad>` | Monorepo | Bir modulu uctan uca denetler — 4 paralel agent, cross-layer analiz. |

## Canli Oturum Izleme

Birden fazla Claude Code oturumu paralel calisirken terminal dashboard ile takip edin:

```bash
cd Agentbase && node bin/session-monitor.js
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ AGENTIC WORKFLOW Timeline  [Timeline] [Agent Radar]  2 aktif 1 bosta 17:05 │
├──────────────────────────────────────────────────────────────────────────────┤
│ › ● 45012  TASK-24 Merge conflict yonetimi  [implement]  42dk               │
│   Aksiyon: Edited workflow-lifecycle.skeleton.md                            │
│   Backlog: In Progress · high · AC 1/2  |  wait none  |  err 0  | mates 1  │
│                                                                              │
│   ○ 45078  TASK-11 Auto-review loop  [waiting]  18dk                        │
│   Aksiyon: Test failed: npm test                                            │
│   Backlog: In Progress · medium · AC 2/5  |  wait test  |  err 1           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tab:Sekme  j/k:Sec  Enter:Detay  c:Kapali gizle  h:Yardim  q:Cikis         │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Varsayilan `Timeline` gorunumu agent-first calisir: hangi agent hangi backlog task'inda, hangi fazda, neden bekliyor gorulur.
- `Tab` ile `Agent Radar` gorunumune gecilir: yogun tablo + event stream.
- Session state'i yerel `backlog/` dosyalariyla zenginlestirilir; task status, priority, dependency ve acceptance ilerlemesi gorunur.
- Sifir dependency — saf Node.js + ANSI escape kodlari.

## Desteklenen Modul Aileleri

Sablon sistemi modulerdir ve yalnizca tespit edilen aileler icin icerik uretir:

- **ORM:** Prisma, Eloquent, Django ORM, TypeORM
- **Deploy:** Docker, Coolify, Vercel
- **Backend:** Express, Fastify, NestJS, Laravel, CodeIgniter 4, Django, FastAPI
- **Frontend:** Next.js, React SPA, yalin HTML/CSS/JS
- **Mobile:** Expo, React Native, Flutter
- **Ek alanlar:** Monorepo, guvenlik taramalari, CI/CD, izleme, API dokumantasyonu

## Uretimde Kanitlanmis Desenler

Bu template'deki her kural bir production deneyiminden dogmustur:

| Desen | Hikaye |
|-------|--------|
| `prisma db push` yasagi | 7 tablo + 3 sutun production'da kayboldu |
| 3 hipotez siniri | Sonsuz root cause aramasinin onlenmesi |
| 4D skorlama | Tutarli, tekrarlanabilir onceliklendirme |
| 3-agent paralel review | Tek agent'in kacirdigi sessiz hatalarin yakalanmasi |
| Faz bazli orkestrasyon | Kaotik paralel calisma yerine kontrollu islem |
| Failure cascade tablosu | Ayni hatada 10+ retry dongusunun onlenmesi |
| Destructive migration tespiti | DROP TABLE'in production'a fark edilmeden gitmesi |
| Pre-existing bulgu kurali | "Scope disi" diyerek guvenlik aciginin atlanmasi |

## Gelistirme ve Dogrulama

```bash
cd Agentbase && npm test                                                    # Test suite
cd Agentbase && node generate.js ../Docs/agentic/project-manifest.yaml --dry-run  # Kuru calistirma
cd Agentbase && node bin/session-monitor.js                                 # Oturum izleme
```

## Lisans

Bu proje [MIT](LICENSE) lisansi ile sunulmaktadir.
