# Ogrenim Kaydi Protokolu

> Bu dosya tum command'larin paylastigi ogrenim kaydi kurallarinin TEK KAYNAGIDIR.
> Tum agent'lar bu kurallara uyar. Proje-spesifik path veya convention yoktur — generic protokoldur.

---

## Ne Zaman Kaydet?

Is tamamlandiginda, asagidaki kosullardan **EN AZ BIRI** varsa auto-memory'ye kaydet:

| Kosul | Ornek |
|-------|-------|
| Beklenmedik tuzak/hata | Dependency uyumsuzlugu, gizli bagimlilik, edge case |
| Yeni pattern/yaklasim | Gelecekte referans olacak teknik kesif |
| Kullanici tercihi | Calisma tarzi, oncelik, red, stil tercihi |
| Surpriz kesif | Beklenmedik davranis, belgelenmemis ozellik |
| Mimari karar | A yerine B secildi ve sebebi var |
| Yeni tool/dependency | Versiyon, uyumluluk notu, kurulum detayi |

---

## Ne Zaman KAYDETME?

- Rutin task implementasyonu (standart CRUD, basit UI degisikligi)
- Standart bug fix (acik hata, net cozum)
- Zaten CLAUDE.md veya MEMORY.md'de olan bilgi
- Tek seferlik islem (bir kere yapildi, tekrar etmeyecek)
- Genel programlama bilgisi (herkesin bildigi seyler)

---

## Nasil Kaydet?

### 1. Dosya Adlandirma

Format: `{tur}_{konu}.md`

Ornekler:
- `project_prisma-migration-sirasi.md`
- `feedback_test-coverage-tercihi.md`
- `reference_expo-splash-screen-config.md`
- `user_commit-dili-tercihi.md`

### 2. Tur Secimi

| Tur | Ne Zaman | Ornek |
|-----|----------|-------|
| `project` | Projeye ozgu teknik bilgi | Migration sirasi, API contract, deploy adimi |
| `feedback` | Kullanicidan gelen geri bildirim | "Bunu yapma", "Soyle yap", red edilen oneri |
| `reference` | Gelecekte lazim olacak referans | Config ayari, workaround, versiyon notu |
| `user` | Kullanici tercihi/profili | Dil, stil, calisma saatleri, iletisim tercihi |

### 3. Dosya Formati

```markdown
---
name: kisa-baslik
description: Tek cumle aciklama
type: project | feedback | reference | user
---

**Kural/Bulgu:** Ogrenilenin ozeti.

**Why:** Neden onemli, hangi baglamda ortaya cikti.

**How to apply:** Gelecekte nasil uygulanacak, ne zaman hatirlanacak.
```

### 4. Zorunlu Alanlar

- Frontmatter: `name`, `description`, `type` — **ZORUNLU**
- Icerik: Kural/bulgu + `**Why:**` + `**How to apply:**` — **ZORUNLU**
- Eksik alan = gecersiz kayit

### 5. MEMORY.md Guncellemesi

Her yeni kayit sonrasi `MEMORY.md` index dosyasini guncelle:
- Yeni satir ekle veya mevcut satiri guncelle
- Tarih bilgisi dahil et

### 6. Duplicate Kontrolu

Ayni konu zaten mevcutsa:
- Yeni dosya olusturma
- Mevcut dosyayi **GUNCELLE**
- Icerik zenginlestir, tarih guncelle

### 7. Uzunluk Siniri

- **Maksimum 10-15 satir** (frontmatter haric)
- Kisa ve oz tut
- Gereksiz baglam veya ornek ekleme
- Bir kayit = bir ogrenim

---

## Anti-Pattern'ler

| Yapma | Yap |
|-------|-----|
| Her task icin kayit olustur | Sadece ogrenim varsa kaydet |
| Uzun hikaye yaz | Kisa ve oz: bulgu + neden + nasil |
| Ayni bilgiyi tekrar kaydet | Duplicate kontrolu yap, mevcudu guncelle |
| Genel bilgi kaydet | Sadece projeye/kullaniciya ozgu bilgi |
| Basliksiz/tursuz kayit | Frontmatter her zaman eksiksiz |
