# React Native Kurallari

> Bu kurallar plain React Native (Expo'suz) projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyApp — Finansal takip mobil uygulamasi
- **Yapi:** Monorepo (`apps/mobile/` altinda RN projesi)
- **RN Versiyonu:** 0.73.x (New Architecture aktif)
- **State Management:** Zustand
- **Navigation:** React Navigation v6
-->

---

## Platform-Spesifik Kod Kurallari

### Platform Ayirimi

```typescript
import { Platform } from 'react-native';

// DOGRU — Platform.select kullan
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },
});

// DOGRU — Platform-spesifik dosya uzantisi
// Button.ios.tsx / Button.android.tsx
// RN bundler otomatik olarak dogru dosyayi secer

// YANLIS (YASAK) — Ternary ile platform kontrolu
const shadow = Platform.OS === 'ios'
  ? { shadowColor: '#000' }
  : { elevation: 4 };
```

### Platform-Spesifik Dosya Yapisi

| Durum | Yaklasim | Ornek |
|---|---|---|
| Kucuk fark (1-2 satir) | `Platform.select()` | Golge stili |
| Orta fark (component logic) | `Platform.OS` kontrolu | Izin isteme akisi |
| Buyuk fark (farkli UI) | `.ios.tsx` / `.android.tsx` dosyalari | Tarih secici |

---

## Performans Kurallari

### Liste Performansi

```typescript
// DOGRU — FlatList kullan (uzun listeler icin)
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// DOGRU — Liste ogesi memo'lanmali
const ListItem = React.memo(({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

// YANLIS (YASAK) — ScrollView ile uzun liste
<ScrollView>
  {items.map((item) => (
    <View key={item.id}><Text>{item.title}</Text></View>
  ))}
</ScrollView>
```

### Genel Performans

| Kural | Aciklama |
|---|---|
| `React.memo` | Liste ogesi component'lerinde ZORUNLU |
| `useCallback` | Event handler'lari memo'la (ozellikle FlatList renderItem) |
| `useMemo` | Agir hesaplamalar icin kullan |
| Inline style YASAK | Her render'da yeni nesne olusturur, `StyleSheet.create` kullan |
| Inline function YASAK (liste icinde) | `renderItem` disarida tanimla |
| Image boyutu | Gosterim boyutuna uygun kaynak kullan, buyuk gorselleri kucult |
| Console.log | Production build'de kaldirilmali (`babel-plugin-transform-remove-console`) |

---

## Navigation Kurallari (React Navigation)

### Yapi

```typescript
// DOGRU — Type-safe navigation
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// DOGRU — Navigation hook
const navigation = useNavigation<NavigationProp<RootStackParamList>>();
navigation.navigate('Profile', { userId: '123' });

// YANLIS (YASAK) — Type'siz navigation
navigation.navigate('Profile'); // parametre eksik
```

### Navigation Best Practices

| Kural | Aciklama |
|---|---|
| Type-safe parametre | `ParamList` type'i ZORUNLU |
| Deep linking | `linking` config her zaman tanimlanmali |
| Tab navigator | 5'ten fazla tab YASAK |
| Nested navigator | Maximum 3 seviye ic ice |
| Screen options | `screenOptions` navigator seviyesinde, `options` screen seviyesinde |
| Header | Custom header component tercih edilir |

---

## Native Modul Kurallari

### Native Linking

```typescript
// DOGRU — Auto-linking (RN 0.60+)
// 1. npm install react-native-camera
// 2. cd ios && pod install
// Artik otomatik link'lenir

// YANLIS (YASAK) — Manuel linking
// react-native link react-native-camera
```

### Izin Yonetimi

```typescript
import { PermissionsAndroid, Platform } from 'react-native';

// DOGRU — Platform'a gore izin iste
const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Kamera Izni',
        message: 'Uygulama kameraniza erismek istiyor',
        buttonPositive: 'Izin Ver',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // iOS: Info.plist'te NSCameraUsageDescription tanimlanmali
  return true;
};
```

---

## Gorsel Yonetimi

### Image Kurallari

```typescript
import { Image } from 'react-native';

// DOGRU — Boyut ve resizeMode belirt
<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 150 }}
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
/>

// DOGRU — Buyuk listeler icin FastImage kullan
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  style={{ width: 200, height: 150 }}
  resizeMode={FastImage.resizeMode.cover}
/>

// YANLIS (YASAK) — Boyutsuz gorsel
<Image source={{ uri: imageUrl }} />
```

| Kural | Aciklama |
|---|---|
| `width` + `height` zorunlu | Boyutsuz Image layout bozar |
| `resizeMode` zorunlu | Varsayilan davranis platforma gore degisir |
| Buyuk listede `FastImage` | Disk cache + bellek optimizasyonu |
| Lokal gorsel `require()` | Bundler optimizasyonu icin |
| Placeholder | `defaultSource` ile bos alan gosterme |

---

## Stil Kurallari

### StyleSheet Kullanimi

```typescript
// DOGRU — StyleSheet.create kullan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// YANLIS (YASAK) — Inline style
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Baslik</Text>
</View>

// YANLIS (YASAK) — Render icinde style nesnesi
const MyComponent = () => {
  const myStyle = { padding: 16 }; // Her render'da yeni referans
  return <View style={myStyle} />;
};
```

---

<!-- GENERATE: DESIGN_SYSTEM_NAME
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.design_system, project.theme_config
Ornek cikti:
## Tasarim Sistemi: AppTheme

- **Tema dosyasi:** `src/theme/index.ts`
- **Hook:** `useTheme()` — tum renk, spacing, typography degerlerine erisim
- **Provider:** `<ThemeProvider>` — `App.tsx` icinde sarmalayici
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
| `colors.primary` | `#007AFF` | `#0A84FF` | Ana aksiyonlar, butonlar |
| `colors.background` | `#FFFFFF` | `#000000` | Sayfa arka plani |
| `colors.text` | `#000000` | `#FFFFFF` | Ana metin |
| `colors.error` | `#FF3B30` | `#FF453A` | Hata mesajlari |

### Renk Erisimi

```typescript
const { colors } = useTheme();

// DOGRU:
<View style={{ backgroundColor: colors.background }}>

// YANLIS (YASAK):
<View style={{ backgroundColor: '#FFFFFF' }}>
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
| Liste | `<FlatList>` | `<ScrollView>` map | Performans icin FlatList |
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
| `fonts.bold` | Inter-Bold | 700 | Basliklar |

### Font Boyutlari

| Token | Boyut | Satir Yuksekligi | Kullanim |
|---|---|---|---|
| `fontSize.sm` | 12 | 16 | Yardimci metin |
| `fontSize.md` | 14 | 20 | Normal metin |
| `fontSize.lg` | 16 | 22 | Vurgulu metin |
| `fontSize.xl` | 20 | 28 | Alt baslik |
| `fontSize.2xl` | 24 | 32 | Sayfa basligi |
-->

---

## Test Kurallari

### React Native Testing Library

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// DOGRU — Kullanici perspektifinden test
it('should show error when form is invalid', async () => {
  const { getByText, getByPlaceholderText } = render(<LoginScreen />);

  fireEvent.changeText(getByPlaceholderText('E-posta'), '');
  fireEvent.press(getByText('Giris Yap'));

  await waitFor(() => {
    expect(getByText('E-posta zorunludur')).toBeTruthy();
  });
});

// YANLIS (YASAK) — Implementation detail testi
it('should set state', () => {
  const { UNSAFE_getByType } = render(<LoginScreen />);
  // State'e dogrudan erisim YASAK
});
```

| Kural | Aciklama |
|---|---|
| `@testing-library/react-native` | Test kutuphanesi olarak ZORUNLU |
| `getByText`, `getByPlaceholderText` | Erisilebilirlik query'leri tercih edilir |
| `UNSAFE_*` query'ler YASAK | Implementation detail'a bagimlilik olusturur |
| Snapshot test sinirli kullan | Kucuk, izole component'ler icin uygun |
| Mock native moduller | `jest.mock('react-native-camera')` seklinde |

---

## Sik Yapilan Hatalar

| # | Hata | Aciklama | Cozum |
|---|---|---|---|
| 1 | `<Text>` icinde `<View>` | Gecersiz ic ice yerlestirme | `<View>` icerigini `<Text>` disina cikar |
| 2 | Keyboard gizleme unutma | Input alanlarinda klavye ust uste biner | `KeyboardAvoidingView` veya `react-native-keyboard-aware-scroll-view` kullan |
| 3 | `SafeAreaView` eksik | Notch/status bar altinda icerik kalir | Kok component'te `SafeAreaView` kullan |
| 4 | Hardcoded boyut | Farkli ekranlarda bozulur | `Dimensions`, `useWindowDimensions` veya flex kullan |
| 5 | `TouchableOpacity` ic ice | Touch event'ler catisir | Dis container'a tek touchable koy |
| 6 | `console.log` production'da | Performans etkisi | `babel-plugin-transform-remove-console` kullan |
| 7 | Animated API yanlis kullanim | JS thread'i bloklar | `useNativeDriver: true` kullan |
| 8 | StatusBar kontrolsuz | Farkli ekranlarda farkli gorunur | `<StatusBar>` component'i her ekranda kontrol et |

---

## Yasaklar

<!-- GENERATE: FORBIDDEN_PRACTICES
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.rules, project.conventions, project.forbidden_patterns
Ornek cikti:
### Kesinlikle YASAK Olan Uygulamalar

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | Inline style nesnesi | Her render'da yeni referans, performans etkisi | `StyleSheet.create` kullan |
| 2 | `ScrollView` ile uzun liste | Tum ogeleri render eder, bellek sorunu | `FlatList` kullan |
| 3 | Hardcoded renk degeri | Tema tutarsizligi, dark mode bozulur | Renk tokeni kullan |
| 4 | `react-native link` (manuel) | Auto-linking var (RN 0.60+) | `pod install` yeterli |
| 5 | `useNativeDriver: false` (gereksiz) | JS thread'i bloklar, animasyon kasma | `useNativeDriver: true` kullan |
| 6 | `Dimensions.get` render icinde | Boyut degistiginde guncellenmez | `useWindowDimensions` hook kullan |
| 7 | `AsyncStorage` icin buyuk veri | 6MB limit, yavas | MMKV veya SQLite kullan |
-->

---

## Zorunlu Kurallar

1. **StyleSheet.create ZORUNLU** — Render disinda stil tanimla, inline style nesnesi YASAK.
2. **FlatList > ScrollView** — Uzun listelerde FlatList ZORUNLU, ScrollView ile map YASAK.
3. **Platform.select > Ternary** — Platform-spesifik stil icin `Platform.select()` kullan.
4. **React.memo liste ogesi** — FlatList renderItem component'i memo'lanmali.
5. **SafeAreaView** — Kok component'te SafeAreaView kullanilmali.
6. **KeyboardAvoidingView** — Form iceren ekranlarda klavye yonetimi ZORUNLU.
7. **Type-safe navigation** — ParamList type'i olmadan navigate YASAK.
8. **Image boyutu** — `width`, `height` ve `resizeMode` olmadan Image YASAK.
9. **Native driver** — Animasyonlarda mumkun olan her yerde `useNativeDriver: true`.
10. **Test** — `@testing-library/react-native` ile erisilebilirlik query'leri kullan.
