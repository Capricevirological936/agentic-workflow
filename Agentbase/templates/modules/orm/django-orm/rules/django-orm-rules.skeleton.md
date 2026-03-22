# Django ORM Migration Kurallari

> Bu kurallar Django ORM kullanan projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

## Yasaklar

### `manage.py flush` YASAK

Tum tablolardaki verileri siler (tablo yapilari korunur).

**Neden:** Geri donulemez veri kaybi. Tablo yapisi korunsa da icerik tamamen silinir.

**Dogru alternatif:** Belirli verileri silmek icin Django ORM veya shell kullanin.

### `manage.py reset_db` YASAK

Veritabanini tamamen silip yeniden olusturur (django-extensions).

**Neden:** Tum sema ve veri kaybolur.

**Dogru alternatif:** Belirli bir app'in migration'larini geri almak icin `python manage.py migrate <app> zero`

---

## Yasak Komutlar Tablosu

| Komut | Neden | Alternatif |
|-------|-------|------------|
| `manage.py flush` | Tum verileri siler | ORM ile belirli verileri sil |
| `manage.py reset_db` | DB'yi tamamen sifirlar | `migrate <app> zero` |
| `manage.py migrate --fake` | Migration'i sahte isaretler | Dikkatli kullan, DB durumunu dogrula |

---

## Migration Olusturma Akisi

```
Model degisikligi yap (models.py)
        |
python manage.py makemigrations
        |
Olusturulan migration dosyasini incele
        |
python manage.py migrate
        |
Yikici degisiklik varsa:
        | (yikici degisiklik varsa)
Veri yedegi planla + kullaniciyla onayla
        |
Uygulama kodunu guncelle (views, serializers, forms vb.)
        |
Testleri calistir: python manage.py test
        |
Commit (models.py + migration dosyasi BIRLIKTE)
```

**ASLA** model degisikligi yapip `makemigrations` calistirmadan birakma.

---

## Migration Tipleri

### Schema Migration (Otomatik)
`makemigrations` ile otomatik olusturulan migration'lar. Model degisikliklerini veritabanina yansitir.

### Data Migration (Manuel)
`python manage.py makemigrations --empty <app>` ile bos migration olusturup elle veri manipulasyonu yazilir.

```python
from django.db import migrations

def populate_data(apps, schema_editor):
    MyModel = apps.get_model('myapp', 'MyModel')
    # Veri manipulasyonu...

class Migration(migrations.Migration):
    dependencies = [('myapp', '0005_auto')]
    operations = [
        migrations.RunPython(populate_data, migrations.RunPython.noop),
    ]
```

**Kural:** Data migration'larda `RunPython.noop` ile geri alma fonksiyonu saglanmali (en azindan no-op).

---

## Migration Risk Tablosu

| Degisiklik | Risk | Aksiyon |
|-----------|------|---------|
| Yeni model (tablo) | Dusuk | Normal akis |
| Yeni nullable alan | Dusuk | Normal akis |
| Yeni NOT NULL alan (default ile) | Orta | Mevcut veri kontrolu |
| `RemoveField` | Kritik | Kullaniciya bildir |
| `DeleteModel` | Kritik | ASLA otomatik yapma |
| `RenameField` | Yuksek | Veri kaybi riski, tum referanslar guncellenmeli |
| `RenameModel` | Yuksek | Tum import ve referanslar guncellenmeli |
| `AlterField` (tip degisikligi) | Orta | Veri truncation/donusum hatasi |
| `AlterUniqueTogether` | Orta | Mevcut verinin unique'ligini dogrula |
| `AlterIndexTogether` | Dusuk | Performans etkilenebilir |
| `RunSQL` (ham SQL) | Yuksek | Icerik dikkatlice incelenmeli |
| `RunPython` (data migration) | Orta | Geri alma fonksiyonu saglanmali |

---

## Squash Migration

Uzun migration zincirlerinde performans icin squash yapilabilir:

```bash
python manage.py squashmigrations <app> <baslangic> <bitis>
```

**Kurallar:**
- Squash sonrasi eski migration dosyalari hemen silinmez — takimdaki herkes yeni migration'a gecene kadar bekle.
- `RunPython` ve `RunSQL` iceren migration'lar dikkatle squash edilmeli.
- Squash sonrasi `python manage.py migrate` ile dogrulanmali.

---

## Zorunlu Kurallar

1. **Model degisikligi + migration BIRLIKTE commit edilir.** `models.py` degisikligi migration dosyasi olmadan commit'lenemez.
2. **Her migration incelenir.** `makemigrations` ciktisini korukorune commit'leme.
3. **Yikici migration'larda veri yedegi ZORUNLU.** `RemoveField`, `DeleteModel` iceren migration'lardan once yedek plani olustur.
4. **Data migration'larda geri alma saglanir.** `RunPython(forward, reverse)` formatinda yazilir.
5. **Circular dependency'lerden kacinilir.** `ForeignKey` iliskilerinde `app_label.ModelName` string formatini kullan.
6. **Migration dosyalari elle duzenlenmez** (zorunlu durumlar haric). `makemigrations` yeniden calistirilir.
7. **`--fake` kullanilmadan once DB durumu dogrulanir.** Yanlis `--fake` kullanimi sema uyumsuzluguna yol acar.

---

<!-- GENERATE: MIGRATION_COMMANDS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: subprojects[].path, project.python_version
Ornek cikti:
## Migration Komutlari

Bu proje icin kullanilacak tam komutlar:

| Islem | Komut |
|---|---|
| Migration olustur | `cd ../Codebase && python manage.py makemigrations` |
| Migration calistir | `cd ../Codebase && python manage.py migrate` |
| Migration durumu | `cd ../Codebase && python manage.py showmigrations` |
| Bos migration olustur | `cd ../Codebase && python manage.py makemigrations --empty <app>` |
| SQL goruntule | `cd ../Codebase && python manage.py sqlmigrate <app> <migration>` |
| Migration squash | `cd ../Codebase && python manage.py squashmigrations <app> <migration>` |
| Test calistir | `cd ../Codebase && python manage.py test` |

> **UYARI:** `flush` ve `reset_db` ASLA kullanilmaz. `--fake` sadece DB durumu dogrulandiktan sonra kullanilir.
-->

<!-- GENERATE: DJANGO_PATHS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.structure, project.subprojects, project.apps
Ornek cikti:
## Django Dosya Konumlari

| Dosya | Yol |
|---|---|
| Models | `../Codebase/<app>/models.py` |
| Migrations | `../Codebase/<app>/migrations/` |
| Settings | `../Codebase/config/settings.py` |
| manage.py | `../Codebase/manage.py` |
-->
