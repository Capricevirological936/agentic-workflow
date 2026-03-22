# Design System Kurallari

> Bu kurallar UI gelistirmede tutarlilik ve tasarim sistemi uyumunu saglar.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: DESIGN_SYSTEM_NAME
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.design_system, project.theme_config
Ornek cikti:
## Tasarim Sistemi: AppTheme

- **Tema dosyasi:** `apps/mobile/src/theme/index.ts`
- **Hook:** `useTheme()` — tum renk, spacing, typography degerlerine erisim
- **Provider:** `<ThemeProvider>` — `App.tsx` icinde sarmalayici
- **Dark mode:** Destekleniyor (`useColorScheme()` ile)
-->

---

## Renk Tokenlari

<!-- GENERATE: COLOR_TOKENS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.theme_config, project.color_tokens
Ornek cikti:
### Renk Kullanim Tablosu

| Token | Light | Dark | Kullanim |
|---|---|---|---|
| `colors.primary` | `#007AFF` | `#0A84FF` | Ana aksiyonlar, butonlar, linkler |
| `colors.secondary` | `#5856D6` | `#5E5CE6` | Ikincil aksiyonlar |
| `colors.background` | `#FFFFFF` | `#000000` | Sayfa arka plani |
| `colors.surface` | `#F2F2F7` | `#1C1C1E` | Kart ve alan arka plani |
| `colors.text` | `#000000` | `#FFFFFF` | Ana metin |
| `colors.textSecondary` | `#8E8E93` | `#8E8E93` | Ikincil metin |
| `colors.border` | `#C6C6C8` | `#38383A` | Cizgi ve kenarliklar |
| `colors.error` | `#FF3B30` | `#FF453A` | Hata mesajlari |
| `colors.success` | `#34C759` | `#30D158` | Basari mesajlari |
| `colors.warning` | `#FF9500` | `#FF9F0A` | Uyari mesajlari |

### Renk Erisimi
```typescript
const { colors } = useTheme();

// DOGRU:
<View style={{ backgroundColor: colors.background }}>
<Text style={{ color: colors.text }}>Merhaba</Text>

// YANLIS (YASAK):
<View style={{ backgroundColor: '#FFFFFF' }}>
<Text style={{ color: 'black' }}>Merhaba</Text>
```
-->

---

## Component Pattern'leri

<!-- GENERATE: COMPONENT_PATTERNS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.component_library, project.ui_patterns
Ornek cikti:
### UI Component Kullanim Kurallari

| Ihtiyac | Dogru Component | Yanlis (YASAK) | Notlar |
|---|---|---|---|
| Buton | `<Button>` | `<TouchableOpacity><Text>` | Tum butonlar Button component'i |
| Metin | `<Typography>` | `<Text>` | Ham Text YASAK |
| Input | `<TextInput>` (themed) | RN `<TextInput>` | Tema uyumlu versiyonu kullan |
| Kart | `<Card>` | `<View style={...}>` | Golge, kenarlik, padding dahil |
| Liste | `<FlashList>` | `<FlatList>` | Performans icin FlashList |
| Ikon | `<Icon name="..." />` | Inline SVG | Ikon kutuphanesi uzerinden |
| Modal | `<BottomSheet>` | RN `<Modal>` | Platform tutarliligi icin |
| Loading | `<Skeleton>` | `<ActivityIndicator>` | Skeleton loading UX icin |

### Component Ornekleri

```typescript
// DOGRU — Button component'i kullan
<Button
  variant="primary"
  size="md"
  onPress={handleSubmit}
  loading={isLoading}
>
  Kaydet
</Button>

// YANLIS — Kendi butonunu yapma
<TouchableOpacity
  style={{ backgroundColor: '#007AFF', padding: 12 }}
  onPress={handleSubmit}
>
  <Text style={{ color: 'white' }}>Kaydet</Text>
</TouchableOpacity>
```
-->

---

## Tipografi

<!-- GENERATE: TYPOGRAPHY
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.theme_config, project.typography
Ornek cikti:
### Font Ailesi

| Token | Font | Weight | Kullanim |
|---|---|---|---|
| `fonts.regular` | Inter-Regular | 400 | Normal metin |
| `fonts.medium` | Inter-Medium | 500 | Vurgulu metin |
| `fonts.semibold` | Inter-SemiBold | 600 | Basliklar |
| `fonts.bold` | Inter-Bold | 700 | Ana basliklar |

### Font Boyutlari

| Token | Boyut | Satir Yuksekligi | Kullanim |
|---|---|---|---|
| `fontSize.xs` | 10 | 14 | Etiket, badge |
| `fontSize.sm` | 12 | 16 | Yardimci metin |
| `fontSize.md` | 14 | 20 | Normal metin |
| `fontSize.lg` | 16 | 22 | Vurgulu metin |
| `fontSize.xl` | 20 | 28 | Alt baslik |
| `fontSize.2xl` | 24 | 32 | Sayfa basligi |
| `fontSize.3xl` | 30 | 38 | Ana baslik |

### Tipografi Kullanimi

```typescript
const { fonts, fontSize } = useTheme();

// DOGRU:
<Typography variant="h1">Baslik</Typography>
<Typography variant="body">Icerik metni</Typography>

// YANLIS (YASAK):
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Baslik</Text>
```
-->

---

## Spacing ve Layout

### Spacing Skalasi

| Token | Deger | Kullanim |
|---|---|---|
| `spacing.xs` | 4 | Minimum bosluk, ikon + metin arasi |
| `spacing.sm` | 8 | Kucuk bosluk, liste elemanları arasi |
| `spacing.md` | 16 | Standard bosluk, section padding |
| `spacing.lg` | 24 | Buyuk bosluk, section arasi |
| `spacing.xl` | 32 | Ekstra bosluk, sayfa padding |
| `spacing.2xl` | 48 | Maximum bosluk |

### Layout Kurallari

```typescript
const { spacing } = useTheme();

// DOGRU — Tema spacing kullan
<View style={{ padding: spacing.md, gap: spacing.sm }}>

// YANLIS (YASAK) — Hardcoded deger
<View style={{ padding: 16, gap: 8 }}>
```

### Border Radius

| Token | Deger | Kullanim |
|---|---|---|
| `borderRadius.sm` | 4 | Kucuk elemanlar (chip, badge) |
| `borderRadius.md` | 8 | Kartlar, inputlar |
| `borderRadius.lg` | 12 | Buyuk kartlar, modal |
| `borderRadius.xl` | 16 | Bottom sheet |
| `borderRadius.full` | 9999 | Daire (avatar, FAB) |

---

## Yasaklar

<!-- GENERATE: FORBIDDEN_PRACTICES
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.rules, project.conventions, project.forbidden_patterns
Ornek cikti:
### Kesinlikle YASAK Olan Uygulamalar

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | Hardcoded renk (`#FF0000`, `red`) | Dark mode'da bozulur, tutarsizlik | `colors.error` token kullan |
| 2 | Hardcoded font boyutu (`fontSize: 16`) | Tipografi tutarsizligi | `fontSize.lg` token kullan |
| 3 | Hardcoded spacing (`padding: 16`) | Layout tutarsizligi | `spacing.md` token kullan |
| 4 | Ham `<Text>` component'i | Stil tutarsizligi | `<Typography>` kullan |
| 5 | Ham `<TextInput>` component'i | Tema uyumsuzlugu | Themed `<TextInput>` kullan |
| 6 | `<FlatList>` kullanimi | Performans sorunu | `<FlashList>` kullan |
| 7 | Inline `style` nesnesi render icinde | Her render'da yeni referans | `StyleSheet.create` veya tema kullan |
| 8 | `Platform.OS === 'ios' ?` icin style | Bakimi zor | `Platform.select()` kullan |
| 9 | Pixel deger (`width: 375`) | Farkli ekran boyutlarinda bozulur | Responsive deger kullan |
| 10 | `opacity: 0` ile gizleme | Eleman DOM'da kalir | Conditional render kullan |
-->

---

## Zorunlu Kurallar

1. **Renk → Token** — Hicbir yerde hardcoded renk degeri KULLANMA. Her zaman `colors.*` tokeni kullan.
2. **Font → Tema** — Font ailesi, boyutu ve agirligini her zaman temadan al.
3. **Spacing → Token** — Padding, margin, gap degerlerini her zaman `spacing.*` tokenlerinden al.
4. **Component → Kütüphane** — Temel UI elemanlari icin her zaman proje component'lerini kullan.
5. **Dark mode → Otomatik** — `useTheme()` hook'u dark mode desteğini otomatik saglar, manuel kontrol YAPMA.
6. **StyleSheet.create** — Render disinda stil tanimla veya tema tokenlerini kullan.
7. **Responsive** — Sabit piksel degerleri yerine esnek layout kullan (flex, percentage).
8. **Platform.select** — Platform-spesifik stil icin ternary yerine `Platform.select()` kullan.
