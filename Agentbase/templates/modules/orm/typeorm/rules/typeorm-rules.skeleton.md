# TypeORM Migration Kurallari

> Bu kurallar TypeORM kullanan projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

## Yasaklar

### `synchronize: true` YASAK (Production)

TypeORM config dosyasinda `synchronize: true` ayari production ortaminda YASAKTIR.

**Neden:** Her uygulama baslangicinda entity degisikliklerini otomatik olarak DB'ye yansitir. Bu durum:
- Migration gecmisi olmadan sema degisikligi yapar
- Veri kaybina yol acabilir (kolon silme, tip degisikligi)
- Diger ortamlarla senkronizasyonu bozar

**Dogru ayar:**
```typescript
// data-source.ts
synchronize: false, // HER ZAMAN false
migrationsRun: true, // Otomatik migration calistirma (opsiyonel)
```

### `typeorm schema:sync` YASAK

Migration dosyasi olmadan DB semasini entity'lere gore gunceller.

**Neden:** `prisma db push` ile ayni tehlike — migration gecmisi olusturmaz.

**Dogru alternatif:** `npx typeorm migration:generate -- -n <MigrationAdi>`

### `typeorm schema:drop` YASAK

Veritabanindaki tum tablolari siler.

**Neden:** Geri donulemez veri kaybi.

---

## Yasak Komutlar Tablosu

| Komut | Neden | Alternatif |
|-------|-------|------------|
| `typeorm schema:sync` | Migration olmadan DB gunceller | `typeorm migration:generate` |
| `typeorm schema:drop` | Tum tablolari siler | Kullanma |
| `synchronize: true` | Otomatik sema senkronizasyonu | `synchronize: false` + migration |

---

## Migration Olusturma Akisi

```
Entity dosyasini duzenle
        |
npx typeorm migration:generate -- -n <MigrationAdi>
        |
Olusturulan migration dosyasini incele (up + down metotlari)
        |
npx typeorm migration:run
        |
Yikici degisiklik varsa:
        | (yikici degisiklik varsa)
Veri yedegi planla + kullaniciyla onayla
        |
Uygulama kodunu guncelle
        |
Testleri calistir
        |
Commit (entity + migration dosyasi BIRLIKTE)
```

**ASLA** entity dosyasini degistirip migration olusturmadan birakma.

---

## Migration Risk Tablosu

| Degisiklik | Risk | Aksiyon |
|-----------|------|---------|
| Yeni entity (tablo) | Dusuk | Normal akis |
| Yeni nullable kolon | Dusuk | Normal akis |
| Yeni NOT NULL kolon (default ile) | Orta | Mevcut veri kontrolu |
| `dropColumn` (migration icinde) | Kritik | Kullaniciya bildir |
| `dropTable` (migration icinde) | Kritik | ASLA otomatik yapma |
| `renameColumn` | Yuksek | Veri kaybi riski, tum referanslar guncellenmeli |
| `renameTable` | Yuksek | Tum referanslar guncellenmeli |
| Kolon tipi degisikligi | Orta | Veri truncation riski |
| `dropIndex` | Orta | Performans etkilenebilir |
| `dropForeignKey` | Orta | Referans butunlugu kaybolur |
| `addUniqueConstraint` | Orta | Mevcut verinin unique'ligini dogrula |

---

## Data Source Konfigurasyonu

```typescript
// data-source.ts — dogru konfigurasyon
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres', // veya mysql, sqlite vb.
  // ... baglanti ayarlari

  synchronize: false,     // YASAK: true yapmak
  migrationsRun: false,   // CI/CD pipeline'da true olabilir
  logging: true,          // Gelistirmede SQL loglarini goster

  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
});
```

---

## Migration Dosya Yapisi

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToUsers1234567890 implements MigrationInterface {
  name = 'AddEmailToUsers1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "email" varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
  }
}
```

**Kurallar:**
- `up()` ve `down()` metotlari HER ZAMAN implement edilir.
- `down()` metodu `up()` islemini tam olarak geri alabilmeli.
- Migration isimleri aciklayici olmali (sinif adi + timestamp).

---

## Zorunlu Kurallar

1. **`synchronize: false` ZORUNLU.** Production config'inde `synchronize: true` kesinlikle kullanilmaz.
2. **Entity + Migration BIRLIKTE commit edilir.** Entity degisikligi migration dosyasi olmadan commit'lenemez.
3. **Her migration'da `down()` metodu yazilir.** Geri alma senaryosu icin zorunludur.
4. **Migration SQL incelenir.** `migration:generate` ciktisini korukorune commit'leme.
5. **Yikici migration'larda veri yedegi ZORUNLU.** `dropColumn`, `dropTable` iceren migration'lardan once yedek plani olustur.
6. **Migration dosyalari elle duzenlenmez** (zorunlu durumlar haric). `migration:generate` yeniden calistirilir.
7. **`schema:sync` ASLA kullanilmaz.** Gelistirme ortaminda bile migration kullanin.

---

<!-- GENERATE: MIGRATION_COMMANDS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: subprojects[].path, project.package_manager
Ornek cikti:
## Migration Komutlari

Bu proje icin kullanilacak tam komutlar:

| Islem | Komut |
|---|---|
| Migration olustur | `cd ../Codebase && npx typeorm migration:generate -- -n <MigrationAdi>` |
| Migration calistir | `cd ../Codebase && npx typeorm migration:run` |
| Migration geri al | `cd ../Codebase && npx typeorm migration:revert` |
| Migration goster | `cd ../Codebase && npx typeorm migration:show` |
| Bos migration olustur | `cd ../Codebase && npx typeorm migration:create -- -n <MigrationAdi>` |

> **UYARI:** `schema:sync` ve `schema:drop` ASLA kullanilmaz. `synchronize: true` YASAKTIR.
-->

<!-- GENERATE: TYPEORM_PATHS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.structure, project.subprojects
Ornek cikti:
## TypeORM Dosya Konumlari

| Dosya | Yol |
|---|---|
| Data Source | `../Codebase/src/data-source.ts` |
| Entities | `../Codebase/src/entity/` |
| Migrations | `../Codebase/src/migrations/` |
| Subscribers | `../Codebase/src/subscriber/` |
-->
