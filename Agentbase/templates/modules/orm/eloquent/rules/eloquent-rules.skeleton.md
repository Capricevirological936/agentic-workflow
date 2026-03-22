# Eloquent Migration Kurallari

> Bu kurallar Laravel Eloquent ORM kullanan projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

## Yasaklar

### `artisan migrate:fresh` YASAK

Tum tablolari silip migration'lari sifirdan calistirir.

**Neden:** Production veritabanindaki tum verileri geri donulemez sekilde siler.

**Dogru alternatif:** `php artisan migrate`

### `artisan migrate:reset` YASAK

Tum migration'lari geri alir.

**Neden:** Tum tablolar silinir, veri kaybi olusur.

**Dogru alternatif:** `php artisan migrate:rollback` (tek batch geri alir)

### `artisan db:wipe` YASAK

Tum tablo, view ve type'lari siler.

**Neden:** Veritabanindaki her seyi geri donulemez sekilde yok eder.

---

## Yasak Komutlar Tablosu

| Komut | Neden | Alternatif |
|-------|-------|------------|
| `artisan migrate:fresh` | Tum tablolari silip sifirdan olusturur | `artisan migrate` |
| `artisan migrate:reset` | Tum migration'lari geri alir | `artisan migrate:rollback` |
| `artisan db:wipe` | Tum DB nesnelerini siler | Kullanma |

---

## Migration Olusturma Akisi

```
Schema degisikligi planla
        |
php artisan make:migration {aciklayici_isim}
        |
Migration dosyasini duzenle (up + down metotlari)
        |
php artisan migrate
        |
Migration dosyasini incele (yikici degisiklik varsa)
        | (yikici degisiklik varsa)
Veri yedegi planla + kullaniciyla onayla
        |
Uygulama kodunu guncelle (Model, Controller, vb.)
        |
Testleri calistir
        |
Commit (migration dosyasi + model degisiklikleri BIRLIKTE)
```

**ASLA** model dosyasini degistirip migration olusturmadan birakma.

---

## Migration Risk Tablosu

| Degisiklik | Risk | Aksiyon |
|-----------|------|---------|
| Yeni tablo (`Schema::create`) | Dusuk | Normal akis |
| Yeni nullable kolon (`$table->string()->nullable()`) | Dusuk | Normal akis |
| Yeni NOT NULL kolon (default ile) | Orta | Mevcut veri kontrolu |
| `$table->dropColumn()` | Kritik | Kullaniciya bildir |
| `Schema::drop()` / `Schema::dropIfExists()` | Kritik | ASLA otomatik yapma |
| `$table->renameColumn()` | Yuksek | Veri kaybi riski, model ve controller guncelle |
| `Schema::rename()` (tablo adi) | Yuksek | Tum referanslar guncellenmeli |
| `$table->dropForeign()` | Orta | Referans butunlugu kaybolur |
| `$table->dropIndex()` | Orta | Performans etkilenebilir |
| `$table->dropPrimary()` | Yuksek | Tablo yapisini temelden etkiler |
| Kolon tipi degisikligi (`$table->string()->change()`) | Orta | Veri truncation riski |

---

## Zorunlu Kurallar

1. **Migration isimleri aciklayici olmalidir.** `create_users_table`, `add_email_to_orders_table` gibi. `migration_1` gibi DEGIL.
2. **Her migration'da `down()` metodu yazilir.** Geri alma senaryosu icin her zaman `down()` metodu implement edilir.
3. **Migration dosyasi commit'lenmeden once incelenir.** Otomatik olusturulan migration'lari bile oku ve dogrula.
4. **Yikici migration'larda veri yedegi ZORUNLU.** `dropColumn`, `dropTable` iceren migration'lardan once yedek plani olustur.
5. **Model degisiklikleri migration ile BIRLIKTE commit edilir.** `$fillable`, `$casts`, iliskiler migration'la uyumlu olmali.
6. **Seeder data guncel tutulur.** Yeni tablo eklendiyse `DatabaseSeeder` guncellenir.
7. **Foreign key constraint'leri dogru sirada olusturulur.** Referans verilen tablo once olusturulmalidir.

---

## Migration Isimlendirme Kurallari

| Islem | Ornek Isim |
|-------|-----------|
| Tablo olusturma | `create_users_table` |
| Kolon ekleme | `add_email_to_users_table` |
| Kolon silme | `drop_phone_from_users_table` |
| Index ekleme | `add_index_to_users_email` |
| Tablo iliskisi | `create_order_items_table` |
| Kolon degistirme | `change_status_type_in_orders_table` |

---

<!-- GENERATE: MIGRATION_COMMANDS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: subprojects[].path
Ornek cikti:
## Migration Komutlari

Bu proje icin kullanilacak tam komutlar:

| Islem | Komut |
|---|---|
| Migration olustur | `cd ../Codebase && php artisan make:migration {aciklama}` |
| Migration calistir | `cd ../Codebase && php artisan migrate` |
| Migration durumu | `cd ../Codebase && php artisan migrate:status` |
| Tek batch geri al | `cd ../Codebase && php artisan migrate:rollback` |
| Seed calistir | `cd ../Codebase && php artisan db:seed` |
| Model olustur | `cd ../Codebase && php artisan make:model {Model} -m` |

> **UYARI:** `migrate:fresh` ve `migrate:reset` SADECE gecici test veritabaninda kullanilir. Production'da ASLA.
-->

<!-- GENERATE: LARAVEL_PATHS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.structure, project.subprojects
Ornek cikti:
## Laravel Dosya Konumlari

| Dosya | Yol |
|---|---|
| Migrations | `../Codebase/database/migrations/` |
| Models | `../Codebase/app/Models/` |
| Seeders | `../Codebase/database/seeders/` |
| Factories | `../Codebase/database/factories/` |
| Config | `../Codebase/config/database.php` |
-->
