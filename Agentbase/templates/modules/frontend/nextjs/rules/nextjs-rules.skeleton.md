# Next.js Kurallari

> Bu kurallar Next.js projeler icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyApp — E-ticaret platformu
- **Yapi:** Monorepo (`apps/web/` altinda Next.js projesi)
- **Next.js Versiyonu:** 14.x (App Router)
- **Deploy:** Vercel
- **Styling:** Tailwind CSS
-->

---

<!-- GENERATE: ROUTER_TYPE
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.structure, project.framework_config
Ornek cikti:
## Router Tipi: App Router

- **Tespit:** `app/` dizini mevcut, `next.config.js`'de `appDir` aktif
- **Layout sistemi:** `layout.tsx` dosyalari ile nested layout
- **Data fetching:** Server Components + async/await
- **API:** Route Handlers (`app/api/`)
-->

---

## Rendering Stratejisi

### Server Components (Varsayilan)

```typescript
// DOGRU — Server Component (varsayilan, directive gerekmez)
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts(); // Dogrudan async/await

  return (
    <div>
      <h1>Urunler</h1>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// YANLIS (YASAK) — Server component'te gereksiz 'use client'
'use client'; // GEREKSIZ — interaktivite yoksa kaldır
export default function AboutPage() {
  return <div>Hakkimizda</div>;
}
```

### Client Components

```typescript
// DOGRU — Sadece interaktivite gerektiginde 'use client'
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Sayi: {count}
    </button>
  );
}

// YANLIS (YASAK) — Client component'te data fetching
'use client';
export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);
  // Server'da yapilabilecek isi client'ta yapma
}
```

### Rendering Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Server Component varsayilan | `'use client'` sadece gerektiginde ekle |
| Data → Server'da al | Client component'te `fetch` + `useEffect` YASAK (server'dan prop gec) |
| `loading.tsx` her route'ta | Streaming icin loading state dosyasi olustur |
| `error.tsx` her route'ta | Hata siniri (error boundary) dosyasi olustur |
| `not-found.tsx` | 404 sayfasi icin olustur |
| Streaming | Buyuk sayfa yuklemelerini `<Suspense>` ile parcala |

---

## Routing Kurallari

### App Router Yapisi

```
app/
├── layout.tsx              # Kok layout
├── page.tsx                # Ana sayfa (/)
├── loading.tsx             # Genel loading
├── error.tsx               # Genel hata
├── not-found.tsx           # 404
├── (auth)/                 # Route group — layout paylasimi
│   ├── layout.tsx
│   ├── login/page.tsx      # /login
│   └── register/page.tsx   # /register
├── (dashboard)/            # Route group
│   ├── layout.tsx
│   ├── page.tsx            # /
│   └── settings/page.tsx   # /settings
├── products/
│   ├── page.tsx            # /products
│   └── [id]/               # Dinamik route
│       ├── page.tsx        # /products/123
│       └── loading.tsx
├── blog/
│   └── [...slug]/          # Catch-all route
│       └── page.tsx        # /blog/2024/post-title
└── api/
    └── webhook/
        └── route.ts        # API Route Handler
```

### Routing Best Practices

| Kural | Aciklama |
|---|---|
| App Router tercih | `pages/` dizini legacy, yeni route'lar `app/` altinda |
| Route groups | `(auth)`, `(dashboard)` ile layout paylasimi |
| Dinamik route | `[id]` ile parametreli sayfalar |
| Catch-all | `[...slug]` ile esnek URL yapisi |
| Parallel routes | `@modal`, `@sidebar` ile paralel icerik |
| Intercepting routes | `(.)photo/[id]` ile modal pattern |

---

## Data Fetching Kurallari

### Server Component Data Fetching

```typescript
// DOGRU — Server component'te dogrudan async/await
// app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 }, // 1 saat cache
  });
  if (!res.ok) throw new Error('Kullanicilar alinamadi');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />;
}
```

### Server Actions

```typescript
// DOGRU — Server Action ile form mutation
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const validated = createUserSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  await db.user.create({ data: validated });
  revalidatePath('/users');
}
```

### Cache Kontrolu

| Yontem | Kullanim | Ornek |
|---|---|---|
| `revalidate` | Zaman bazli cache | `fetch(url, { next: { revalidate: 60 } })` |
| `revalidatePath` | Path bazli invalidasyon | `revalidatePath('/products')` |
| `revalidateTag` | Tag bazli invalidasyon | `revalidateTag('products')` |
| `no-store` | Cache'leme | `fetch(url, { cache: 'no-store' })` |
| `unstable_cache` | Fonksiyon bazli cache | DB sorgusu sonuclarini cache'le |

---

## Performans Kurallari

### Image Optimizasyonu

```typescript
import Image from 'next/image';

// DOGRU — next/image ile otomatik optimizasyon
<Image
  src="/hero.jpg"
  alt="Hero gorsel"
  width={1200}
  height={600}
  priority // Above the fold gorseller icin
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// DOGRU — Responsive gorsel
<Image
  src="/product.jpg"
  alt="Urun gorseli"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>

// YANLIS (YASAK) — Ham img tagi
<img src="/hero.jpg" alt="Hero" />
```

### Font Optimizasyonu

```typescript
// DOGRU — next/font ile self-hosted
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

// YANLIS (YASAK) — CDN'den font yukleme
// <link href="https://fonts.googleapis.com/..." rel="stylesheet" />
```

### Bundle Optimizasyonu

```typescript
import dynamic from 'next/dynamic';

// DOGRU — Agir component'ler icin dynamic import
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Client-only component
});

// DOGRU — Metadata ile SEO
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}
```

### Performans Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `next/image` ZORUNLU | `<img>` tagi YASAK, otomatik optimizasyon kaybi |
| `width` + `height` zorunlu | Layout shift onleme (CLS) |
| `priority` above-the-fold | LCP iyilestirme icin ilk gorunen gorsellere ekle |
| `next/font` ZORUNLU | CDN font yukleme YASAK, layout shift onleme |
| `next/dynamic` agir component'ler | Code splitting ile bundle boyutunu dusur |
| `generateMetadata` | Hardcoded `<title>` yerine dinamik metadata |

---

## API Route Kurallari

### Route Handlers

```typescript
// DOGRU — app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ?? '1';

  const users = await getUsers(Number(page));
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Input validasyonu
  const validated = createUserSchema.parse(body);
  const user = await createUser(validated);
  return NextResponse.json(user, { status: 201 });
}
```

### Middleware

```typescript
// DOGRU — middleware.ts (proje kokunde)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth kontrolu
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### API Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Route Handlers | `app/api/` altinda `route.ts` dosyalari |
| Edge Runtime | Hafif islemler icin `export const runtime = 'edge'` |
| Input validasyonu | Zod ile ZORUNLU, dogrudan `body` kullanma |
| Error handling | try/catch ile hata yakala, anlamli HTTP status dondur |
| Middleware | Auth, redirect, rewrite icin `middleware.ts` |
| Rate limiting | API route'larda rate limit ZORUNLU |

---

## Guvenlik Kurallari

### Server Actions Guvenligi

```typescript
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

// DOGRU — Input validasyonu + yetki kontrolu
export async function deleteUser(userId: string) {
  // 1. Yetki kontrolu
  const session = await getSession(cookies());
  if (!session?.isAdmin) {
    throw new Error('Yetkisiz islem');
  }

  // 2. Input validasyonu
  const id = z.string().uuid().parse(userId);

  // 3. Islem
  await db.user.delete({ where: { id } });
  revalidatePath('/users');
}
```

### Guvenlik Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Server Actions input validasyonu | Zod ile ZORUNLU |
| CSRF koruması | Server Actions otomatik koruma saglar |
| Env variable guvenlik | `NEXT_PUBLIC_` prefix'i olmadan client'a sizmaz |
| `headers()`, `cookies()` | Sadece server tarafinda kullanilir |
| Auth middleware | Korunmasi gereken route'larda ZORUNLU |
| SQL injection | ORM veya parametreli sorgu kullan, string concat YASAK |

### Env Variable Kurallari

```typescript
// DOGRU — Server-only env variable
// .env
DATABASE_URL="postgresql://..." // Client'a SIZMAZ

// DOGRU — Client'ta kullanilacak env
// .env
NEXT_PUBLIC_API_URL="https://api.example.com" // Client'ta erisilebilir

// YANLIS (YASAK) — Hardcoded URL
const API_URL = 'https://api.example.com'; // Env variable kullan
```

---

## Yasak Pratikler

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | `getServerSideProps` / `getStaticProps` | App Router'da gereksiz (legacy Pages Router) | Server Component + async/await |
| 2 | Client component'te `fetch` + `useEffect` | Gereksiz client-side data loading | Server component'ten prop gec |
| 3 | `'use client'` olmadan interaktif component | onClick, useState calisma hatasi verir | `'use client'` directive'i ekle |
| 4 | `<img>` tagi | next/image optimizasyonu kaybi | `next/image` kullan |
| 5 | CDN font yukleme | Layout shift, performans kaybi | `next/font` kullan |
| 6 | Hardcoded env URL'ler | Ortam degistiginde bozulur | Env variable kullan |
| 7 | `pages/` ve `app/` karisik kullanim | Routing catismasi | Tek router tipi sec |
| 8 | Server component'te `useState`/`useEffect` | Server'da hook calisma hatasi | Client component yap veya kaldir |
| 9 | `export default` olmayan page/layout | Next.js dosyayi taniyamaz | Default export ZORUNLU |
| 10 | `fetch` icin hardcoded `revalidate` | Cache stratejisi tutarsiz olur | Merkezi cache config kullan |

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.conventions, project.rules, project.folder_structure
Ornek cikti:
## Proje Konvansiyonlari

### Dosya Isimlendirme
- Component: `kebab-case.tsx` (ornek: `product-card.tsx`)
- Page: `page.tsx` (App Router convension)
- Layout: `layout.tsx`
- API: `route.ts`

### Klasor Yapisi
```
src/
├── app/           # Next.js App Router sayfalari
├── components/    # Paylasilan component'ler
│   ├── ui/        # Temel UI component'leri
│   └── features/  # Ozellik-spesifik component'ler
├── lib/           # Utility fonksiyonlar
├── actions/       # Server Actions
├── types/         # TypeScript tipleri
└── styles/        # Global stiller
```

### Import Sirasi
1. React / Next.js
2. Ucuncu parti kutuphaneler
3. Proje component'leri (`@/components/`)
4. Utility / lib (`@/lib/`)
5. Tipler (`@/types/`)
6. Stiller
-->

---

<!-- GENERATE: STYLING_APPROACH
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.styling, project.css_framework
Ornek cikti:
## Stil Yaklasimi: Tailwind CSS

### Tailwind Kullanim Kurallari

| Kural | Aciklama |
|---|---|
| Utility-first | Inline Tailwind class'lari tercih edilir |
| `cn()` helper | Kosullu class birlestirme icin `clsx` + `tailwind-merge` |
| Component abstraction | Tekrarlanan pattern'ler component'e cekilir |
| `@apply` sinirli kullan | Sadece cok tekrarlanan pattern'ler icin |
| Dark mode | `dark:` prefix'i ile tema destegi |
| Responsive | `sm:`, `md:`, `lg:` ile mobile-first |

```typescript
import { cn } from '@/lib/utils';

// DOGRU — cn() ile kosullu class
<button className={cn(
  'px-4 py-2 rounded-md font-medium',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed',
)}>

// YANLIS (YASAK) — Inline style
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
```
-->

---

## Zorunlu Kurallar

1. **Server Component varsayilan** — `'use client'` sadece interaktivite gerektiginde ekle.
2. **Data fetching server'da** — Client component'te `fetch` + `useEffect` YASAK, server'dan prop gec.
3. **`next/image` ZORUNLU** — `<img>` tagi YASAK, `width` + `height` belirt.
4. **`next/font` ZORUNLU** — CDN font yukleme YASAK.
5. **`loading.tsx` + `error.tsx`** — Her route segment'te olustur.
6. **Server Actions'da validasyon** — Zod ile input validasyonu ZORUNLU.
7. **Env variable** — Hardcoded URL YASAK, `process.env` kullan.
8. **Metadata** — `generateMetadata` ile dinamik SEO, hardcoded `<title>` YASAK.
9. **`next/dynamic`** — Agir component'ler icin dynamic import kullan.
10. **Default export** — Page, layout, error, loading dosyalarinda default export ZORUNLU.
