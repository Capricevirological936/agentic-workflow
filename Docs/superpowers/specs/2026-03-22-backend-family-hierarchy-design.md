# Backend Family Hierarchy Expansion — Design Spec

**Tarih:** 2026-03-22
**Durum:** Uygulandi

---

## Ozet

`Agentbase/templates/modules/backend/` kategorisi su anda tek seviyeli alt varyant mantigiyla calisiyor ve yalnizca `laravel`, `django`, `fastapi` varyantlarini iceriyor. Bu yapi `nodejs`, `codeigniter4` ve ileride eklenecek diger backend framework'leri icin iyi olceklenmiyor; ortak runtime kurallari tekrar etmeye zorluyor.

Bu tasarim, backend modullerini aile bazli hiyerarsik bir agaca tasir:

- `backend/nodejs/*`
- `backend/php/*`
- `backend/python/*`

Her aile altinda framework-leaf'ler yer alir. Bootstrap, iki seviyeli kategori tespiti yerine genel recursive tespit ve merge akisina gecerek kategori → aile → framework katkilarini birlestirir. Bu degisiklik backend ile baslar, ancak altyapi tum kategori yapilari icin yeniden kullanilabilir olacak sekilde tasarlanir.

---

## Hedefler

- `backend` kategorisini aile seviyesine genisletmek.
- `nodejs`, `php`, `python` ailelerini eklemek.
- Ilk surumde su framework leaf'lerini desteklemek:
  - `nodejs/express`
  - `nodejs/fastify`
  - `nodejs/nestjs`
  - `php/laravel`
  - `php/codeigniter4`
  - `python/django`
  - `python/fastapi`
- Ortak runtime kurallarini aile seviyesine tasimak; framework'e ozel davranislari leaf seviyede tutmak.
- Bootstrap tespit, manifest ve dosya uretim mantigini recursive hale getirmek.
- Kök [README.md](/Users/varienos/Landing/Repo/agentic-workflow/README.md) dahil dokumantasyonu yeni hiyerarsiyi dogru anlatacak sekilde guncellemek.

---

## Mevcut Sorun

Bugunku yapi su problemleri uretiyor:

1. `backend/` kategorisinde yeni framework eklemek icin her seyi ayni seviyeye koymak gerekiyor.
2. `nodejs` gibi bir runtime ailesinde ortak kurallar (`.env`, logging, async hata, validation, test/lint/typecheck`) her framework icin kopyalanmak zorunda kaliyor.
3. `php` ailesinde `laravel` ile `codeigniter4` gibi framework'ler arasinda ortak davranislar ayri bir yerde temsil edilmiyor.
4. Bootstrap, yalnizca kategori → alt varyant iki seviyeli tespit mantigina gore yazilmis; bu da aile seviyesi genislemeyi zorlastiriyor.
5. README ve design spec halen backend varyantlarini tek seviyeli listelemekte.

---

## Onerilen Mimari

### Dizin Yapisi

Hedef backend agaci:

```text
Agentbase/templates/modules/backend/
├── detect.md
├── nodejs/
│   ├── detect.md
│   ├── rules/
│   │   └── nodejs-rules.skeleton.md
│   ├── express/
│   │   ├── detect.md
│   │   └── rules/
│   │       └── express-rules.skeleton.md
│   ├── fastify/
│   │   ├── detect.md
│   │   └── rules/
│   │       └── fastify-rules.skeleton.md
│   └── nestjs/
│       ├── detect.md
│       └── rules/
│           └── nestjs-rules.skeleton.md
├── php/
│   ├── detect.md
│   ├── rules/
│   │   └── php-backend-rules.skeleton.md
│   ├── laravel/
│   │   ├── detect.md
│   │   ├── hooks/
│   │   │   └── artisan-guard.js
│   │   └── rules/
│   │       └── laravel-rules.skeleton.md
│   └── codeigniter4/
│       ├── detect.md
│       ├── hooks/
│       │   └── spark-guard.js
│       └── rules/
│           └── codeigniter4-rules.skeleton.md
└── python/
    ├── detect.md
    ├── rules/
    │   └── python-backend-rules.skeleton.md
    ├── django/
    │   ├── detect.md
    │   ├── hooks/
    │   │   └── django-guard.js
    │   └── rules/
    │       └── django-rules.skeleton.md
    └── fastapi/
        ├── detect.md
        └── rules/
            └── fastapi-rules.skeleton.md
```

### Seviye Anlamlari

- `backend/detect.md`
  - Kategori seviyesi.
  - Backend ailesi tespitine girilip girilmeyecegini belirler.
- `backend/<family>/detect.md`
  - Aile seviyesi.
  - `nodejs`, `php`, `python` gibi runtime/backend ailesini belirler.
- `backend/<family>/<framework>/detect.md`
  - Framework leaf seviyesi.
  - Nihai aktif varyanti belirler.

### Merge Davranisi

Aktif backend yolu `backend/nodejs/express` ise dosya uretim katkilari su sirayla merge edilir:

1. `backend/` kategori seviyesi ortak katkilar
2. `backend/nodejs/` aile seviyesi katkilar
3. `backend/nodejs/express/` framework seviyesi katkilar

Bu davranis kurallar, hook referanslari, verification komutlari ve CLAUDE bolumleri icin ayni mantikla isler.

---

## Tespit Mantigi

### Genel Kural

Bootstrap kategori tespitini recursive hale getirir:

- Bir modulin altinda `detect.md` ve alt dizinler varsa, bu dugum "secilebilir" kabul edilir.
- Dugum aktifse alt dugumleri sirayla kontrol edilir.
- Alt dugumlerden biri eslesirse daha derine inilir.
- Leaf dugume ulasildiginda tam varyant yolu aktif kabul edilir.

### Backend Tespit Sirasi

Onerilen sira:

- `nodejs`
  - `nestjs`
  - `fastify`
  - `express`
- `php`
  - `laravel`
  - `codeigniter4`
- `python`
  - `django`
  - `fastapi`

Bu siralama daha spesifik framework'leri once denetler.

### Ornek Tespit Sonuclari

- Express API projesi:
  - `backend: nodejs/express`
- NestJS monorepo:
  - `backend: nodejs/nestjs`
- CodeIgniter 4 projesi:
  - `backend: php/codeigniter4`
- Django REST uygulamasi:
  - `backend: python/django`

---

## Kural ve Hook Dagilimi

### Aile Seviyesi Kurallar

`nodejs`:

- `.env` ve secret yonetimi
- request validation zorunlulugu
- async hata yakalama ve process crash davranisi
- logging ve hata kaydi beklentileri
- `lint`, `test`, `typecheck` dogrulama convention'lari

`php`:

- `env()` / config kullanimi
- public giris noktasi, config ve secret yonetimi
- request validation ve response standardi
- test ve artisan/spark komut convention'lari

`python`:

- `venv` / dependency ve settings yonetimi
- tip kontrolu, test convention'i, package yapi beklentileri
- environment ve config kurallari

### Framework Seviyesi Kurallar

- `express`: middleware zinciri, hata middleware'i, route-controller-service ayrimi
- `fastify`: schema-first validation, plugin mimarisi, decorator kurallari
- `nestjs`: module/provider/controller ayrimi, DTO/pipe/guard/interceptor kurallari
- `codeigniter4`: filter, validation, service, model ve response pattern'leri
- `laravel`: mevcut artisian guard + Eloquent/Blade/Resource convention'lari
- `django`: mevcut manage.py guard + settings/URL/view/ORM convention'lari
- `fastapi`: mevcut Pydantic/dependency/async convention'lari

### Hook Stratejisi

- Hook dosyalari sadece gercekten framework-spesifik oldugunda leaf seviyede tutulur.
- Aile seviyesinde ortak hook ihtiyaci bu turda zorunlu degil; sadece gerekirse eklenir.
- Mevcut `artisan-guard.js` ve `django-guard.js` korunur, yeni `spark-guard.js` eklenir.

---

## Bootstrap ve Manifest Degisiklikleri

### Bootstrap

Guncellenecek alanlar:

- Modul tespit aciklamasi iki seviyeden recursive seviyeye cekilecek.
- `backend` alt varyant listeleri aile + framework seklinde anlatilacak.
- Sonuc raporu tam yolu gosterecek:
  - `backend: nodejs/express`

### Manifest

Backend alani leaf path olarak tutulacak:

```yaml
modules:
  categories:
    backend: "nodejs/express"
```

Ek alan zorunlu degil. Leaf path tek kaynak olarak yeterli.

### Dosya Uretimi

Uretim motoru path segment'lerine gore yukaridan asagiya merge eder:

- `backend`
- `backend/nodejs`
- `backend/nodejs/express`

Bu mekanik backend ile sinirli kalmayacak; diger kategoriler isterse daha derin yapilar da ayni motorla desteklenecek.

---

## Dokumantasyon Degisiklikleri

Guncellenecek dokumanlar:

- [README.md](/Users/varienos/Landing/Repo/agentic-workflow/README.md)
- [Docs/superpowers/specs/2026-03-21-agentic-workflow-template-design.md](/Users/varienos/Landing/Repo/agentic-workflow/Docs/superpowers/specs/2026-03-21-agentic-workflow-template-design.md)
- [Agentbase/templates/modules/backend/detect.md](/Users/varienos/Landing/Repo/agentic-workflow/Agentbase/templates/modules/backend/detect.md)
- [Agentbase/.claude/commands/bootstrap.md](/Users/varienos/Landing/Repo/agentic-workflow/Agentbase/.claude/commands/bootstrap.md)

README'de ozellikle su kisimlar guncellenecek:

- Backend framework tablosu
- Dizin yapisi agaci
- Modul etkilesim matrisi gerekiyorsa daha genel ifadeye cekilecek
- "Mevcut kategoriye yeni alt varyant ekleme" bolumu aile + framework hiyerarsisini anlatacak

Kullanici istegi geregi kok `README.md` guncellemesi bu isin zorunlu parcasi kabul edilir.

---

## Kapsam Disi

- `frontend`, `mobile`, `deploy`, `orm` kategorilerini hemen aile agacina tasimak
- CI veya otomatik smoke test eklemek
- Tum olasi backend framework'lerini ilk turda desteklemek (`koa`, `hono`, `symfony`, `adonis`, vb.)
- Leaf seviyede fazla detayli framework komut otomasyonu eklemek

---

## Kabul Kriterleri

- `backend` kategorisi aile bazli dizin yapisina gecmis olmali.
- Mevcut `laravel`, `django`, `fastapi` varyantlari yeni yollarina tasinmis olmali.
- `express`, `fastify`, `nestjs`, `codeigniter4` varyantlari eklenmis olmali.
- Bootstrap aciklamalari recursive tespit mantigini dogru anlatmali.
- Manifest/backend sonucu tam yol seklinde temsil edilmeli.
- Root [README.md](/Users/varienos/Landing/Repo/agentic-workflow/README.md) yeni backend hiyerarsisini dogru anlatmali.
- Eski tek seviyeli backend referanslari temizlenmis olmali.

---

## Varsayimlar

- Recursive tespit mekanigi genel altyapi olarak yazilacak, fakat ilk kullanan kategori `backend` olacak.
- Mevcut hook/rule naming desenleri korunacak; yalnizca yol yapisi degisecek.
- Aile seviyesi ortak kurallar tek bir skeleton dosyasi ile temsil edilecek; framework leaf dosyalari bunu tamamlayacak.
- Bu asamada runtime-level hook zorunlulugu yok; sadece leaf seviyede gerekli guard'lar eklenecek.
