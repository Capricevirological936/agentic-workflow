# Datadog Kurallari

> Bu kurallar Datadog entegrasyonu kullanan projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyApp — E-ticaret platformu
- **Yapi:** Monorepo (`apps/web/` + `apps/api/`)
- **Datadog SDK:** dd-trace + @datadog/browser-rum
- **DD_ENV:** development | staging | production
- **DD_SERVICE:** myapp-api, myapp-web
-->

---

## APM ve Tracing Kurallari

Datadog APM ile distributed tracing ZORUNLUDUR. Tum servisler arasi iletisimde trace propagation saglanmalidir.

### Tracer Baslatma

```typescript
// DOGRU — dd-trace ilk import olmali (instrument.ts veya tracer.ts)
import tracer from 'dd-trace';

tracer.init({
  service: process.env.DD_SERVICE,
  env: process.env.DD_ENV,
  version: process.env.DD_VERSION,
  logInjection: true, // Log'lara trace ID enjekte et
  runtimeMetrics: true,
  profiling: true,
});

export default tracer;
```

```typescript
// DOGRU — Custom span olusturma
import tracer from './tracer';

async function processOrder(orderId: string) {
  return tracer.trace('order.process', {
    resource: orderId,
    tags: {
      'order.id': orderId,
      'order.type': 'standard',
    },
  }, async (span) => {
    try {
      const order = await getOrder(orderId);
      span.setTag('order.total', order.total);

      await validateInventory(order);
      await chargePayment(order);
      await sendConfirmation(order);

      return order;
    } catch (error) {
      span.setTag('error', true);
      span.setTag('error.message', error.message);
      throw error;
    }
  });
}
```

### Trace Propagation

```typescript
// DOGRU — Servisler arasi HTTP isteklerinde trace propagation
import tracer from 'dd-trace';

// dd-trace otomatik olarak HTTP client'lari instrument eder (axios, fetch, http)
// Ek konfigurasyon gerekmez, ancak kontrol et:
tracer.use('http', { enabled: true });
tracer.use('express', { enabled: true });
```

### APM Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `dd-trace` ilk import | Diger modulleri instrument edebilmesi icin en uste import et |
| Custom span olustur | Kritik is mantiginda (`tracer.trace`) ile olcum yap |
| Span tag ekle | Islem detaylari icin anlamli tag'ler kullan |
| Hata durumunda `error: true` | Span'e hata bilgisi set et |
| Trace propagation aktif | Servisler arasi isteklerde trace context tasinmali |

---

## RUM (Real User Monitoring) Kurallari

Browser tarafinda kullanici deneyimini olcmek icin Datadog RUM SDK kullanilir.

```typescript
// DOGRU — RUM SDK baslatma
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DD_APPLICATION_ID,
  clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
  site: 'datadoghq.eu', // Veya datadoghq.com
  service: process.env.NEXT_PUBLIC_DD_SERVICE,
  env: process.env.NEXT_PUBLIC_DD_ENV,
  version: process.env.NEXT_PUBLIC_DD_VERSION,

  // Session replay
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20, // Production'da dusuk tut
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,

  // PII korumasi
  defaultPrivacyLevel: 'mask-user-input',
});

// Session replay baslatma
datadogRum.startSessionReplayRecording();
```

```typescript
// DOGRU — Custom action tracking
datadogRum.addAction('checkout_started', {
  cartTotal: cart.total,
  itemCount: cart.items.length,
  currency: 'TRY',
});

// DOGRU — User bilgisi set etme
datadogRum.setUser({
  id: user.id,
  name: user.name,
  plan: user.subscriptionPlan,
});

// DOGRU — Logout'ta temizle
datadogRum.clearUser();
```

### RUM Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `applicationId` ve `clientToken` env'den | Hardcoded deger YASAK |
| `sessionReplaySampleRate` production'da dusuk | Maliyet kontrolu icin `10`-`20` arasi |
| `defaultPrivacyLevel: 'mask-user-input'` | Kullanici girdilerini maskele (KVKK/GDPR) |
| Custom action tracking | Kritik kullanici aksiyonlarini olc |
| User context set et | Hatalari ve performansi kullaniciya bagla |

---

## Log Yonetimi

Structured logging ile Datadog Log Management entegrasyonu saglanir.

```typescript
// DOGRU — Structured logging (JSON format)
import pino from 'pino'; // veya winston

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  // dd-trace logInjection: true ile otomatik trace ID enjekte edilir
});

// DOGRU — Anlamli log mesajlari
logger.info({ orderId: order.id, userId: user.id }, 'Siparis olusturuldu');
logger.error({ err, orderId }, 'Odeme islemi basarisiz');
logger.warn({ userId, attemptCount }, 'Basarisiz giris denemesi');

// YANLIS — Unstructured log
console.log('Order created: ' + orderId); // YASAK
console.log(`User ${userId} failed login`); // YASAK
```

```typescript
// DOGRU — Correlation ID ile istek takibi
import { v4 as uuidv4 } from 'uuid';

function correlationMiddleware(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  // Logger'a correlation ID ekle
  req.log = logger.child({ correlationId });
  next();
}
```

### Log Level Standartlari

| Level | Kullanim | Ornek |
|---|---|---|
| `fatal` | Uygulama capamaz | Veritabani baglantisi tamamen kayboldu |
| `error` | Islem basarisiz, mudahale gerekli | Odeme islemi basarisiz |
| `warn` | Potansiyel sorun, dikkat gerekli | Rate limit'e yaklasiliyor |
| `info` | Normal is akisi olaylari | Siparis olusturuldu, kullanici giris yapti |
| `debug` | Gelistirme/debug icin detay | SQL sorgusu, request/response detayi |
| `trace` | En detayli seviye | Fonksiyon giris/cikis |

### Log Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| JSON format ZORUNLU | Structured logging kullan, plain text YASAK |
| Trace ID enjeksiyonu | `logInjection: true` ile log-trace korelasyonu |
| Correlation ID | Servisler arasi istek takibi icin `x-correlation-id` header |
| Log level dogru kullan | `error` != `warn`, severity'yi dogru belirle |
| `console.log` YASAK | Logger kutuphanesi kullan (pino, winston) |
| PII loglama YASAK | Sifre, kredi karti, TC kimlik gibi verileri loglama |

---

## Environment Ayarlari

Tum Datadog entegrasyonlarinda standart environment variable'lar kullanilmalidir.

### Zorunlu Environment Variable'lar

| Variable | Aciklama | Ornek |
|---|---|---|
| `DD_ENV` | Ortam ismi | `production`, `staging`, `development` |
| `DD_SERVICE` | Servis ismi | `myapp-api`, `myapp-web`, `myapp-worker` |
| `DD_VERSION` | Uygulama versiyonu | `1.2.3`, git short hash |
| `DD_API_KEY` | Datadog API anahtari | Agent veya CI/CD icin |
| `DD_TRACE_AGENT_URL` | Trace agent URL | `http://localhost:8126` (varsayilan) |

### Unified Service Tagging

```yaml
# DOGRU — docker-compose.yml icinde unified service tagging
services:
  api:
    environment:
      - DD_ENV=production
      - DD_SERVICE=myapp-api
      - DD_VERSION=${APP_VERSION}
    labels:
      com.datadoghq.tags.env: production
      com.datadoghq.tags.service: myapp-api
      com.datadoghq.tags.version: ${APP_VERSION}
```

### Environment Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `DD_ENV` her ortamda set | Metric, trace, log'lar ortama gore filtrelenebilmeli |
| `DD_SERVICE` her serviste set | Servis bazli dashboard ve alert olustur |
| `DD_VERSION` her deploy'da guncelle | Version bazli regresyon tespiti |
| Unified service tagging | Ayni tag'ler metric, trace ve log'larda tutarli olmali |
| API key GIZLI | `DD_API_KEY` asla koda veya log'a yazilmaz |

---

## Yasak Pratikler (Anti-pattern)

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | `console.log` ile loglama | Structured logging kaybi, Datadog'a akmaz | Pino/Winston ile JSON log |
| 2 | Trace olmadan servisler arasi istek | Distributed tracing zinciri kirilir | `dd-trace` ile otomatik propagation |
| 3 | Hardcoded `DD_API_KEY` | Guvenlik riski, key ifsa olur | Env variable veya secret manager kullan |
| 4 | `DD_ENV` set etmeden deploy | Metric ve log'lar ortama gore ayrilamaz | Her ortamda `DD_ENV` ZORUNLU |
| 5 | Yuksek `sessionReplaySampleRate` | Maliyet patlamasi | Production'da `10`-`20` kullan |
| 6 | PII loglama | KVKK/GDPR ihlali riski | Hassas verileri filtrele veya maskele |
| 7 | Custom metric'lerde yuksek cardinality tag | Metric patlamasi ve maliyet | Tag degerlerini sinirli tut (< 1000 unique) |
| 8 | Her fonksiyona custom span | Performans etkisi, gereksiz veri | Sadece kritik is mantigi icin span olustur |

---

## Zorunlu Kurallar

1. **`dd-trace` ilk import** — Tracer diger tum modullerin oncesinde baslatilir.
2. **Unified service tagging** — `DD_ENV`, `DD_SERVICE`, `DD_VERSION` her ortamda set edilir.
3. **Structured logging** — JSON format ZORUNLU, `console.log` YASAK.
4. **Trace propagation** — Servisler arasi iletisimde trace context ZORUNLU tasinir.
5. **Log-trace korelasyonu** — `logInjection: true` ile log'lara trace ID eklenir.
6. **Correlation ID** — Servisler arasi isteklerde `x-correlation-id` header kullanilir.
7. **RUM privacy** — `defaultPrivacyLevel: 'mask-user-input'` ile kullanici girdileri maskelenir.
8. **API key guvenligi** — `DD_API_KEY` asla koda, log'a veya client bundle'a yazilmaz.
9. **Custom span dikkatli** — Sadece kritik is mantigi icin span olustur, her fonksiyona ekleme.
10. **Log level dogru** — `error` != `warn`, severity'yi dogru belirle ve tutarli kullan.
