# Sentry Kurallari

> Bu kurallar Sentry entegrasyonu kullanan projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyApp — E-ticaret platformu
- **Yapi:** Monorepo (`apps/web/` + `apps/api/`)
- **Sentry SDK:** @sentry/react + @sentry/node
- **DSN:** Env variable uzerinden (`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`)
- **Environment:** development | staging | production
-->

---

## Error Boundary Kurallari

React ve React Native projelerinde her sayfa/screen icin error boundary ZORUNLUDUR.

```typescript
// DOGRU — Sentry Error Boundary ile sarmalama
import * as Sentry from '@sentry/react';

function FallbackUI({ error, resetError }) {
  return (
    <div role="alert">
      <h2>Bir hata olustu</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Tekrar Dene</button>
    </div>
  );
}

// Her sayfa/screen'de Error Boundary kullan
export default Sentry.withErrorBoundary(MyPageComponent, {
  fallback: FallbackUI,
  showDialog: false, // Production'da kullaniciya dialog gosterme
});
```

```typescript
// DOGRU — React Native icin screen-level error boundary
import * as Sentry from '@sentry/react-native';

const WrappedScreen = Sentry.wrap(MyScreen);
```

### Error Boundary Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Her sayfa/screen'de error boundary | Yakalanmayan hatalar Sentry'ye otomatik raporlanir |
| Fallback UI ZORUNLU | Kullaniciya anlamli hata mesaji goster |
| Nested boundary | Kritik component'ler (form, odeme) icin ayri boundary ekle |
| `componentDidCatch` YASAK | Sentry.ErrorBoundary veya `withErrorBoundary` kullan |

---

## Sentry Konfigurasyonu

```typescript
// DOGRU — sentry.config.ts
import * as Sentry from '@sentry/react'; // veya @sentry/node, @sentry/react-native

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // DSN her zaman env'den alinir
  environment: process.env.NODE_ENV,        // Environment dogru ayarlanmali
  release: process.env.SENTRY_RELEASE,      // Release versiyonu deploy'dan gelir

  // Production'da dusuk sample rate
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Development'ta Sentry'yi devre disi birakabilirsin
  enabled: process.env.NODE_ENV !== 'development',

  // PII verisi GONDERME
  sendDefaultPii: false,

  // Hassas URL'leri filtrele
  beforeSend(event) {
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### Konfigurasyon Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| DSN env variable'dan alinir | Hardcoded DSN YASAK |
| `environment` dogru ayarlanir | `development`, `staging`, `production` ayrimini yap |
| `tracesSampleRate` production'da dusuk | Production'da `0.1`-`0.2`, development'ta `1.0` |
| `sendDefaultPii: false` | Kisisel veri gondermeme varsayilan |
| `enabled` ortama gore | Development'ta opsiyonel devre disi |

---

## Source Map Yonetimi

Deploy sirasinda source map'ler Sentry'ye upload edilmelidir.

```bash
# DOGRU — sentry-cli ile source map upload
npx @sentry/cli sourcemaps upload \
  --release=$SENTRY_RELEASE \
  --org=$SENTRY_ORG \
  --project=$SENTRY_PROJECT \
  ./dist
```

```javascript
// DOGRU — Webpack/Vite plugin ile otomatik upload
// next.config.js (Next.js ornegi)
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  hideSourceMaps: true, // Production'da source map'leri gizle
});
```

### Source Map Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Her deploy'da source map upload | Hata stack trace'leri okunabilir olmali |
| `sentry-cli` veya framework plugin | Manuel upload yerine CI/CD entegrasyonu tercih et |
| `hideSourceMaps: true` | Production build'de source map'leri public'e acma |
| Release ile eslestir | Source map'ler dogru release versiyonuyla iliskilendirilmeli |

---

## Breadcrumb ve Context

Onemli kullanici aksiyonlarinda breadcrumb eklenmeli ve user context set edilmelidir.

```typescript
// DOGRU — Kullanici aksiyonunda breadcrumb ekle
Sentry.addBreadcrumb({
  category: 'user.action',
  message: 'Sepete urun ekledi',
  level: 'info',
  data: {
    productId: product.id,
    quantity: 1,
  },
});

// DOGRU — User context set et (login sonrasi)
Sentry.setUser({
  id: user.id,
  email: user.email, // Sadece gerekiyorsa, PII kurallarina dikkat
  username: user.username,
});

// DOGRU — Logout'ta user context temizle
Sentry.setUser(null);

// DOGRU — Ek context bilgisi
Sentry.setContext('order', {
  orderId: order.id,
  total: order.total,
  currency: order.currency,
});
```

### Breadcrumb Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Kritik aksiyonlarda breadcrumb | Odeme, form submit, navigasyon gibi islemlerde ekle |
| User context login sonrasi set | Hatalari kullaniciya bagla |
| Logout'ta `setUser(null)` | Kullanici context'ini temizle |
| PII kurallarina uy | Hassas veri breadcrumb'a ekleme |

---

## Release Tracking

Her deploy'da Sentry release olusturulmali ve commit bilgisi eklenmelidir.

```bash
# DOGRU — CI/CD pipeline'da release olustur
export SENTRY_RELEASE=$(git rev-parse --short HEAD)

# Release olustur
npx @sentry/cli releases new $SENTRY_RELEASE \
  --org=$SENTRY_ORG \
  --project=$SENTRY_PROJECT

# Commit bilgisi ekle
npx @sentry/cli releases set-commits $SENTRY_RELEASE \
  --auto --org=$SENTRY_ORG

# Deploy bilgisi ekle
npx @sentry/cli releases deploys $SENTRY_RELEASE new \
  --env=production --org=$SENTRY_ORG

# Release'i sonlandir
npx @sentry/cli releases finalize $SENTRY_RELEASE \
  --org=$SENTRY_ORG
```

### Release Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Her deploy'da release olustur | Hatalari deploy versiyonuyla iliskilendir |
| Commit bilgisi ekle | `set-commits --auto` ile suspect commit tespiti |
| Deploy environment belirt | `production`, `staging` ayrimini yap |
| Release finalize | Deploy tamamlandiktan sonra release'i kapat |

---

## Yasak Pratikler (Anti-pattern)

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | `console.error(err)` ile hata loglama | Sentry'ye raporlanmaz, hata kaybolur | `Sentry.captureException(err)` kullan |
| 2 | `try-catch` icinde sessiz yutma | Hata gizlenir, debug imkansizlasir | Catch blogu icinde `Sentry.captureException` cagir |
| 3 | PII veri gonderme | KVKK/GDPR ihlali riski | `beforeSend` ile filtrele, `sendDefaultPii: false` |
| 4 | Hardcoded DSN | Farkli ortamlarda yanlis DSN kullanilir | Env variable kullan (`SENTRY_DSN`) |
| 5 | Production'da yuksek `tracesSampleRate` | Gereksiz maliyet ve performans etkisi | Production'da `0.1`-`0.2` kullan |
| 6 | Source map upload'suz deploy | Stack trace okunamaz, debug imkansiz | CI/CD'de source map upload ekle |
| 7 | `Sentry.captureMessage` hata icin | Hata context'i kaybolur (stack trace yok) | `Sentry.captureException` kullan |
| 8 | Her hatada `Sentry.captureException` + `throw` | Ayni hata iki kez raporlanir | Ya yakala ya firsat, ikisini birden yapma |

---

## Zorunlu Kurallar

1. **DSN env variable'dan** — Hardcoded DSN YASAK, ortam bazli env variable kullan.
2. **Error boundary her sayfada** — React/RN projelerinde her sayfa/screen `Sentry.ErrorBoundary` ile sarmalanir.
3. **Source map her deploy'da** — Source map upload olmadan deploy YASAK.
4. **Release tracking** — Her deploy'da Sentry release olusturulur ve commit bilgisi eklenir.
5. **PII gonderme** — `sendDefaultPii: false`, hassas verileri `beforeSend` ile filtrele.
6. **`captureException` kullan** — `console.error` yerine `Sentry.captureException` ile raporla.
7. **Breadcrumb ekle** — Kritik kullanici aksiyonlarinda breadcrumb ile context zenginlestir.
8. **`tracesSampleRate` ayarla** — Production'da `0.1`-`0.2`, development'ta `1.0`.
