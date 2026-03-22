# Prisma Kurallari

> Bu kurallar Prisma ORM kullanan projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

## Yasaklar

### 🚫 `prisma db push` YASAK

`prisma db push` komutu HER KOSULDA YASAKTIR.

**Neden:** Migration dosyasi olusturmadan veritabani semasini degistirir. Bu durum:
- Migration gecmisini bozar
- Takim uyelerinin senkronizasyonunu kaybettirir
- Production deploy'larda geri donulemez sorunlara yol acar

**Dogru alternatif:** `npx prisma migrate dev --name <degisiklik_aciklamasi>`

---

## Schema Degisiklik Akisi

```
schema.prisma duzenle
        ↓
npx prisma validate
        ↓ (basarili)
npx prisma migrate dev --name <aciklama>
        ↓
migration.sql dosyasini incele
        ↓ (yikici degisiklik varsa)
Veri yedegi planla + kullaniciyla onayla
        ↓
npx prisma generate
        ↓
Uygulama kodunu guncelle
        ↓
Testleri calistir
        ↓
Commit (schema.prisma + migration dosyasi BIRLIKTE)
```

---

## Migration Risk Tablosu

| Islem | Risk | Dikkat Edilmesi Gerekenler |
|---|---|---|
| ADD COLUMN (nullable) | 🟢 Dusuk | Guvenli, mevcut verileri etkilemez |
| ADD COLUMN (required + default) | 🟢 Dusuk | Default deger tum satirlara uygulanir |
| ADD COLUMN (required, no default) | 🔴 Kritik | Mevcut satirlar hata verir, YAPMA |
| CREATE TABLE | 🟢 Dusuk | Guvenli, yeni tablo olusturur |
| DROP TABLE | 🔴 Kritik | VERI KAYBI — yedek olmadan YAPMA |
| DROP COLUMN | 🟠 Yuksek | Kolon verisi kaybolur |
| ALTER COLUMN (tip degisikligi) | 🟡 Orta | Veri truncation/donusum hatasi olabilir |
| RENAME COLUMN | 🟡 Orta | Uygulama kodu guncellenmeli |
| ADD INDEX | 🟢 Dusuk | Guvenli, performans iyilestirme |
| DROP INDEX | 🟡 Orta | Performans etkilenebilir |
| ADD RELATION | 🟢 Dusuk | Foreign key constraint eklenir |
| REMOVE RELATION | 🟠 Yuksek | Referans butunlugu kaybolur |

---

## Zorunlu Kurallar

1. **Schema + Migration BIRLIKTE commit edilir.** `schema.prisma` degisikligi migration dosyasi olmadan commit'lenemez.
2. **Her migration anlamli isimlendirilir.** `--name add_user_email_column` gibi, `--name migration1` gibi DEGIL.
3. **Migration SQL incelenir.** Otomatik olusturulan SQL dosyasini commit'lemeden once oku ve dogrula.
4. **Yikici migration'larda veri yedegi ZORUNLU.** DROP TABLE/COLUMN iceren migration'lardan once yedek plani olustur.
5. **`prisma generate` unutulmaz.** Migration sonrasi client'i yeniden olustur.
6. **Seed data guncel tutulur.** Yeni model eklendiyse `prisma/seed.ts` guncellenir.
7. **Enum degisiklikleri dikkatle yapilir.** Enum'dan deger silmek mevcut veritabani kayitlarini bozar.

---

<!-- GENERATE: PRISMA_PATH
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.structure, project.subprojects
Ornek cikti:
## Prisma Dosya Konumlari

| Dosya | Yol |
|---|---|
| Schema | `../Codebase/apps/api/prisma/schema.prisma` |
| Migrations | `../Codebase/apps/api/prisma/migrations/` |
| Seed | `../Codebase/apps/api/prisma/seed.ts` |
| Client import | `import { PrismaClient } from '@prisma/client'` |
| Service | `../Codebase/apps/api/src/prisma/prisma.service.ts` |
-->

<!-- GENERATE: MIGRATION_COMMANDS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.structure, project.scripts, project.subprojects
Ornek cikti:
## Migration Komutlari

Bu proje icin kullanilacak tam komutlar:

| Islem | Komut |
|---|---|
| Schema dogrulama | `cd ../Codebase/apps/api && npx prisma validate` |
| Migration olustur | `cd ../Codebase/apps/api && npx prisma migrate dev --name <aciklama>` |
| Migration durumu | `cd ../Codebase/apps/api && npx prisma migrate status` |
| Client olustur | `cd ../Codebase/apps/api && npx prisma generate` |
| DB sifirla (DEV) | `cd ../Codebase/apps/api && npx prisma migrate reset` |
| Seed calistir | `cd ../Codebase/apps/api && npx prisma db seed` |
| Studio ac | `cd ../Codebase/apps/api && npx prisma studio` |

> **UYARI:** `migrate reset` SADECE gelistirme ortaminda kullanilir. Production'da ASLA.
-->
