# Flutter/Dart Kurallari

> Bu kurallar Flutter projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyApp — Saglik takip mobil uygulamasi
- **Yapi:** Monorepo (`apps/mobile/` altinda Flutter projesi)
- **Flutter Versiyonu:** 3.x
- **Dart Versiyonu:** 3.x
- **State Management:** Riverpod
- **Navigation:** GoRouter
- **Deploy:** App Store + Google Play
Kutsal Kurallar:
- Config dosyalari SADECE Agentbase icinde yasar
- Codebase icinde `.claude/` OLUSTURULMAZ
- Git sadece Codebase de calisir
-->

---

## Proje Yapisi

### Dizin Organizasyonu

```
lib/
├── main.dart                  # Giris noktasi
├── app.dart                   # MaterialApp / CupertinoApp
├── features/                  # Feature-based modul organizasyonu
│   ├── auth/
│   │   ├── data/              # Repository, data source, model
│   │   ├── domain/            # Entity, use case, repository interface
│   │   └── presentation/     # Screen, widget, controller/cubit
│   ├── home/
│   └── settings/
├── core/                      # Paylasilan altyapi
│   ├── theme/                 # Tema tanimlari
│   ├── router/                # Route tanimlari
│   ├── network/               # HTTP client, interceptor
│   ├── constants/             # Sabitler
│   └── utils/                 # Yardimci fonksiyonlar
├── shared/                    # Paylasilan widget'lar
│   ├── widgets/               # Ortak UI component'leri
│   └── extensions/            # Dart extension method'lari
test/
├── unit/                      # Unit testler
├── widget/                    # Widget testler
└── integration/               # Integration testler
```

### Proje Yapisi Kurallari

| Kural | Aciklama |
|---|---|
| `lib/` altinda feature-based | Her feature kendi dizininde (auth, home, vb.) |
| `lib/main.dart` giris noktasi | `runApp()` burada cagrilir |
| `lib/src/` veya `lib/features/` | Modul bazli organizasyon — flat yapidan kacin |
| `core/` paylasilan altyapi | Tema, router, network, constants burada |
| `shared/widgets/` ortak widget'lar | Birden fazla feature'da kullanilan widget'lar |

---

<!-- GENERATE: STATE_MANAGEMENT
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.dependencies, project.state_management
Ornek cikti:
## State Yonetimi: Riverpod

- **Tespit:** `pubspec.yaml`'da `flutter_riverpod` dependency'si mevcut
- **Provider tipleri:** `StateNotifierProvider`, `FutureProvider`, `StreamProvider`
- **Overrides:** Test icin `ProviderScope` ile override
- **Kod uretimi:** `riverpod_generator` + `build_runner` kullaniliyor
-->

---

## State Yonetimi Kurallari

### Genel Prensipler

```dart
// DOGRU — State yonetimi proje genelinde TEK yaklasim
// Provider, Riverpod, Bloc veya GetX — KARISTIRMA

// DOGRU — StatelessWidget tercih et, state gerektirmeyen yerlerde
class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Text(product.name),
    );
  }
}

// YANLIS (YASAK) — State gerektirmeyen yerde StatefulWidget
class ProductCard extends StatefulWidget { // GEREKSIZ
  // setState bile cagrilmiyorsa StatelessWidget yap
}
```

### State Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| TEK yaklasim | Proje genelinde tek state yonetim paketi kullan |
| Global vs local ayirimi | Global state (auth, tema) vs local state (form, animasyon) net olmali |
| StatefulWidget sinirli | Sadece gercekten local state gerektiren yerlerde |
| Immutable state | State nesneleri immutable olmali (`copyWith` pattern) |
| State dispose | Stream, controller, subscription mutlaka dispose edilmeli |

---

## Widget Kurallari

### Widget Agaci ve Composition

```dart
// DOGRU — Widget agacini parcala (3+ seviye ic ice → ayri Widget)
class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ProfileAppBar(),
      body: const ProfileBody(),
    );
  }
}

class ProfileBody extends StatelessWidget {
  const ProfileBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        ProfileHeader(),
        ProfileStats(),
        ProfileActions(),
      ],
    );
  }
}

// YANLIS (YASAK) — Derin ic ice widget agaci
class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            child: Row(
              children: [
                Column(
                  children: [
                    // 5+ seviye derinlik — OKUNAMAZ
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

### Const Constructor ve Performans

```dart
// DOGRU — const constructor kullanilabilecek her yerde kullan
class AppLogo extends StatelessWidget {
  const AppLogo({super.key}); // const constructor

  @override
  Widget build(BuildContext context) {
    return const FlutterLogo(size: 48); // const widget
  }
}

// DOGRU — const widget referansi
Widget build(BuildContext context) {
  return Column(
    children: const [
      AppLogo(),              // const — rebuild olmaz
      SizedBox(height: 16),   // const — rebuild olmaz
    ],
  );
}

// YANLIS (YASAK) — const kullanilabilecek yerde kullanmamak
Widget build(BuildContext context) {
  return Column(
    children: [
      AppLogo(),              // const EKSIK — her build'de yeniden olusturulur
      SizedBox(height: 16),   // const EKSIK
    ],
  );
}
```

### Build Method Kurallari

```dart
// DOGRU — Build method'da hesaplama yapma
class UserScreen extends StatefulWidget {
  @override
  State<UserScreen> createState() => _UserScreenState();
}

class _UserScreenState extends State<UserScreen> {
  late final UserService _userService;

  @override
  void initState() {
    super.initState();
    _userService = UserService(); // initState'te baslat
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context); // Theme erisimi OK
    return Container(color: theme.primaryColor);
  }
}

// YANLIS (YASAK) — Build method'da agir islem
Widget build(BuildContext context) {
  final filtered = items.where((i) => i.isActive).toList(); // AGIR HESAPLAMA
  filtered.sort((a, b) => a.name.compareTo(b.name));        // HER BUILD'DE TEKRAR
  return ListView.builder(...);
}
```

### Widget Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| 3+ seviye derinlik → ayir | Derin widget agacini ayri Widget sinifina cikar |
| `const` constructor | Her mumkun yerde `const` kullan (performans) |
| Build method temiz | Hesaplama, filtreleme build method'da YASAK |
| `initState` / `didChangeDependencies` | Baslatma ve bagimlilik degisiklikleri burada |
| Hardcoded deger YASAK | Renk/boyut icin Theme veya design token kullan |

---

## Navigasyon Kurallari

### Route Tanimlari

```dart
// DOGRU — Route isimleri sabit olarak tanimla (magic string YASAK)
abstract class AppRoutes {
  static const home = '/';
  static const profile = '/profile';
  static const settings = '/settings';
  static const productDetail = '/products/:id';
}

// DOGRU — GoRouter ile type-safe routing
final router = GoRouter(
  routes: [
    GoRoute(
      path: AppRoutes.home,
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: AppRoutes.productDetail,
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ProductDetailScreen(productId: id);
      },
    ),
  ],
);

// YANLIS (YASAK) — Magic string ile navigasyon
Navigator.pushNamed(context, '/profile'); // Sabit kullan
context.go('/products/123');              // AppRoutes.productDetail kullan
```

### Navigasyon Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| GoRouter veya Navigator 2.0 | Modern routing yaklasimi tercih edilir |
| Deep linking destegi | Route'lar deep link uyumlu olmali |
| Route isimleri sabit | `AppRoutes` sinifinda tanimla, magic string YASAK |
| Redirect/guard | Auth kontrolu route seviyesinde (`redirect` callback) |
| Nested navigation | Shell route ile tab bazli navigasyon |

---

<!-- GENERATE: DESIGN_SYSTEM
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.theme_config, project.design_system
Ornek cikti:
## Tasarim Sistemi

### Tema Yapisi

- **Tema dosyasi:** `lib/core/theme/app_theme.dart`
- **Light tema:** `AppTheme.light()`
- **Dark tema:** `AppTheme.dark()`
- **Erisim:** `Theme.of(context)` veya `context.theme` extension

### Renk Tokenlari

| Token | Light | Dark | Kullanim |
|---|---|---|---|
| `colorScheme.primary` | `#1E88E5` | `#42A5F5` | Ana aksiyonlar |
| `colorScheme.surface` | `#FFFFFF` | `#121212` | Kart arka plani |
| `colorScheme.error` | `#D32F2F` | `#EF5350` | Hata mesajlari |

### Spacing

| Token | Deger | Kullanim |
|---|---|---|
| `AppSpacing.xs` | 4 | Minimum bosluk |
| `AppSpacing.sm` | 8 | Kucuk bosluk |
| `AppSpacing.md` | 16 | Standart bosluk |
| `AppSpacing.lg` | 24 | Buyuk bosluk |
| `AppSpacing.xl` | 32 | Cok buyuk bosluk |
-->

---

## Performans Kurallari

### Liste Performansi

```dart
// DOGRU — ListView.builder (buyuk listeler icin)
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ProductCard(product: items[index]);
  },
)

// DOGRU — Cok buyuk listeler icin itemExtent belirt
ListView.builder(
  itemCount: items.length,
  itemExtent: 80.0, // Sabit yukseklik — scroll performansi artar
  itemBuilder: (context, index) => ProductTile(product: items[index]),
)

// YANLIS (YASAK) — ListView ile children (tum ogeleri bir anda olusturur)
ListView(
  children: items.map((item) => ProductCard(product: item)).toList(),
)
```

### Gereksiz Rebuild Onleme

```dart
// DOGRU — RepaintBoundary ile gereksiz repaint onleme
RepaintBoundary(
  child: ComplexAnimatedWidget(),
)

// DOGRU — Selector/Consumer ile parcali dinleme (Provider ornegi)
Consumer<CartModel>(
  builder: (context, cart, child) {
    return Text('${cart.itemCount} urun');
  },
)

// DOGRU — Image caching
CachedNetworkImage(
  imageUrl: product.imageUrl,
  placeholder: (context, url) => const CircularProgressIndicator(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
)
```

### Performans Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `ListView.builder` | Buyuk listeler icin ZORUNLU — `ListView(children:)` YASAK |
| `const` widget | Rebuild olmasin diye `const` kullan |
| `Selector` / `Consumer` | Parcali state dinleme — gereksiz rebuild onleme |
| `RepaintBoundary` | Animasyonlu widget'lari izole et |
| `cached_network_image` | Network gorselleri icin disk/memory cache |
| `itemExtent` | Sabit boyutlu liste ogeleri icin scroll performansi |

---

## Platform-Spesifik Kod Kurallari

```dart
import 'dart:io' show Platform;

// DOGRU — Platform kontrolu
if (Platform.isIOS) {
  // iOS-spesifik kod
} else if (Platform.isAndroid) {
  // Android-spesifik kod
}

// DOGRU — Platform channel icin ayri sinif
class NativeBridge {
  static const _channel = MethodChannel('com.example.app/native');

  static Future<String> getBatteryLevel() async {
    final level = await _channel.invokeMethod<int>('getBatteryLevel');
    return '$level%';
  }
}

// DOGRU — Tutarli widget secimi
// Proje genelinde Material VEYA Cupertino — karistirma
Widget build(BuildContext context) {
  return Platform.isIOS
      ? CupertinoButton(child: Text('Tamam'), onPressed: onTap)
      : ElevatedButton(child: Text('Tamam'), onPressed: onTap);
}
```

| Kural | Aciklama |
|---|---|
| `Platform.isIOS` / `Platform.isAndroid` | Platform kontrolu icin |
| Platform channel ayri dosya | Native kod iletisimi izole edilmeli |
| Cupertino vs Material | Proje genelinde tutarli secim |
| `kIsWeb` kontrolu | Web platformu icin `import 'package:flutter/foundation.dart'` |

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.conventions, project.rules, project.folder_structure
Ornek cikti:
## Proje Konvansiyonlari

### Dosya Isimlendirme
- Dart dosyalari: `snake_case.dart` (ornek: `product_card.dart`)
- Test dosyalari: `*_test.dart` (ornek: `product_card_test.dart`)
- Barrel dosyalari: Feature dizininde `index.dart` (opsiyonel)

### Import Sirasi
1. Dart SDK (`dart:async`, `dart:io`)
2. Flutter SDK (`package:flutter/material.dart`)
3. Ucuncu parti paketler (`package:provider/provider.dart`)
4. Proje iceri (`package:myapp/features/...`)
5. Relative import (ayni feature icinde `./`, `../`)

### Sinif Isimlendirme
- Widget: PascalCase (`ProductCard`, `LoginScreen`)
- State sinifi: `_WidgetNameState` (`_LoginScreenState`)
- Model: PascalCase (`UserModel`, `Product`)
- Enum: PascalCase, degerleri camelCase (`enum Status { active, inactive }`)
-->

---

## Test Kurallari

### Unit Test

```dart
// DOGRU — Is mantigi ve utility fonksiyonlari icin unit test
import 'package:test/test.dart';

void main() {
  group('PriceCalculator', () {
    test('should apply discount correctly', () {
      final calculator = PriceCalculator();
      final result = calculator.applyDiscount(100.0, 0.2);
      expect(result, 80.0);
    });

    test('should throw for negative discount', () {
      final calculator = PriceCalculator();
      expect(
        () => calculator.applyDiscount(100.0, -0.1),
        throwsA(isA<ArgumentError>()),
      );
    });
  });
}
```

### Widget Test

```dart
// DOGRU — Widget test ile UI kontrolu
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Counter increments', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: CounterScreen()));

    expect(find.text('0'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    expect(find.text('1'), findsOneWidget);
  });
}
```

### Test Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Unit test | Is mantigi, utility fonksiyonlari icin |
| Widget test | UI bilesenleri, kullanici etkilesimi icin |
| Integration test | Uctan uca akislar icin |
| `flutter test` | Test calistirma komutu |
| Golden test | Gorsel regresyon kontrolu icin `matchesGoldenFile` |
| Mock/Fake | Dependency'ler icin `mockito` veya `mocktail` |

---

## Yasak Pratikler

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | `print()` | Production'da log kirliligi | `debugPrint()` veya `logger` paketi |
| 2 | `dynamic` tip | Tip guvenligi kaybi, runtime hatalari | Her zaman acik tip belirt |
| 3 | `setState()` icinde async | Race condition ve memory leak riski | Async islemi disarida yap, sonucu setState'e ver |
| 4 | Build method'da `MediaQuery.of(context)` tekrari | Her cagri widget agacini yurur | Degiskene ata: `final size = MediaQuery.sizeOf(context)` |
| 5 | Hardcoded string | i18n destegsiz, bakim zor | `intl` veya `easy_localization` kullan |
| 6 | `ListView(children:)` buyuk liste | Tum ogeleri bir anda olusturur, bellek sorunu | `ListView.builder` kullan |
| 7 | `const` olmayan sabit widget | Gereksiz rebuild | `const` constructor ekle |
| 8 | Widget agaci 5+ seviye | Okunamaz, bakim zor | Ayri Widget sinifina cikar |

---

<!-- GENERATE: FORBIDDEN_PRACTICES
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.rules, project.conventions, project.forbidden_patterns
Ornek cikti:
### Projeye Ozel Yasaklar

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | `GetX` kullanimi | Proje Riverpod kullaniyor | `ref.watch`, `ref.read` kullan |
| 2 | `Navigator.push` | GoRouter kullaniliyor | `context.go()`, `context.push()` |
| 3 | Hardcoded renk | Tema sistemi var | `Theme.of(context).colorScheme` |
| 4 | `http` paketi | `dio` kullaniliyor | `DioClient` sinifini kullan |
-->

---

## Zorunlu Kurallar

1. **`const` constructor ZORUNLU** — Kullanilabilecek her yerde `const` kullan, performans icin kritik.
2. **`ListView.builder` ZORUNLU** — Buyuk listelerde `ListView(children:)` YASAK.
3. **Widget agaci derinligi** — 3+ seviye ic ice → ayri Widget sinifina cikar.
4. **Tek state yaklasimi** — Proje genelinde Provider/Riverpod/Bloc/GetX — KARISTIRMA.
5. **Build method temiz** — Hesaplama, filtreleme, async islem build method'da YASAK.
6. **Route isimleri sabit** — Magic string ile navigasyon YASAK, `AppRoutes` sinifi kullan.
7. **Tip guvenligi** — `dynamic` tip YASAK, her zaman acik tip belirt.
8. **`debugPrint()` kullan** — `print()` YASAK, logger paketi tercih edilir.
9. **Platform-spesifik kod izole** — Platform channel ve native kod ayri sinif/dosyada.
10. **Test** — Unit + Widget + Integration test katmanlari, `flutter test` ile calistirilir.
