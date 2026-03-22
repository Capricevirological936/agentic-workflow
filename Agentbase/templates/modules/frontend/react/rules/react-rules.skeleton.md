# React SPA Kurallari

> Bu kurallar standalone React SPA projeleri icin gecerlidir (Vite, CRA, custom bundler).
> Next.js projeleri icin `frontend/nextjs/` modulu kullanilir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyApp — Admin panel SPA
- **Yapi:** Monorepo (`apps/web/` altinda React projesi)
- **Bundler:** Vite
- **TypeScript:** Aktif
- **State:** Zustand
- **Router:** React Router v6
- **Styling:** Tailwind CSS
- **Test:** Vitest + React Testing Library
-->

---

## Component Yapisi

### Functional Component

```typescript
// DOGRU — Functional component + interface props
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button onClick={() => onAddToCart(product.id)}>
        Sepete Ekle
      </button>
    </article>
  );
}

// YANLIS (YASAK) — Class component
class ProductCard extends React.Component<ProductCardProps> {
  render() {
    // Class component kullanma — functional component tercih et
  }
}

// YANLIS (YASAK) — type yerine interface kullan
type ProductCardProps = { // extend edilemez — interface kullan
  product: Product;
};
```

### Dosya Yapisi

```
src/
├── components/
│   ├── ProductCard/
│   │   ├── ProductCard.tsx           # Component
│   │   ├── ProductCard.test.tsx      # Test
│   │   ├── ProductCard.module.css    # Stil (opsiyonel)
│   │   └── index.ts                 # Re-export
│   └── ui/                          # Temel UI component'leri
│       ├── Button/
│       ├── Input/
│       └── Modal/
├── features/                        # Feature bazli organizasyon
│   ├── auth/
│   ├── products/
│   └── cart/
├── hooks/                           # Custom hook'lar
├── services/                        # API servisleri
├── stores/                          # State yonetimi
├── types/                           # TypeScript tipleri
├── utils/                           # Yardimci fonksiyonlar
├── App.tsx
└── main.tsx
```

### Component Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Functional component | Class component YASAK (legacy haric) |
| Props icin `interface` | `type` degil `interface` — extend edilebilirlik |
| Tek export | Her dosyada TEK default export edilen component |
| Dosya yapisi | `Component.tsx` + `Component.test.tsx` + stil dosyasi |
| Yardimci component ayri | Ayni dosyada ikinci component tanimlamak YASAK |

---

## Hook Kurallari

### Hook Kullanim Kurallari

```typescript
// DOGRU — Hook'lar component'in en ustunde, kosullu bloklarin disinda
function UserProfile({ userId }: { userId: string }) {
  // Hook'lar en ustte
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setIsLoading(true);
      const data = await userService.getUser(userId);
      if (!cancelled) {
        setUser(data);
        setIsLoading(false);
      }
    };

    fetchUser();

    // ZORUNLU — Cleanup fonksiyonu
    return () => {
      cancelled = true;
    };
  }, [userId]); // Dependency dizisi tam olmali

  if (isLoading) return <Spinner />;
  if (!user) return <NotFound />;

  return <div>{user.name}</div>;
}

// YANLIS (YASAK) — Kosullu hook
function UserProfile({ userId }: { userId: string }) {
  if (!userId) return null; // Hook'tan ONCE return — YASAK

  const [user, setUser] = useState(null); // Hook sirasi bozulur
}
```

### Custom Hook

```typescript
// DOGRU — Custom hook `use` prefix'i ile, hooks/ dizininde
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup ZORUNLU
  }, [value, delay]);

  return debouncedValue;
}

// YANLIS (YASAK) — use prefix'siz custom hook
export function debounceValue<T>(value: T, delay: number): T {
  // `use` prefix'i EKSIK — React hook kurallarini ihlal eder
}
```

### Hook Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| En ustte, kosulsuz | Hook'lar component'in en ustunde, kosullu bloklarin disinda |
| `use` prefix'i | Custom hook'lar `use` ile baslar, `hooks/` dizininde |
| Dependency dizisi tam | ESLint `exhaustive-deps` kurali aktif olmali |
| Cleanup ZORUNLU | Subscription, timer, event listener icin cleanup fonksiyonu |
| `useCallback`/`useMemo` olcumlu | Premature optimization yapma, gercek sorun oldugunda kullan |

---

<!-- GENERATE: STATE_MANAGEMENT
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.dependencies, project.state_management
Ornek cikti:
## State Yonetimi: Zustand

- **Tespit:** `package.json`'da `zustand` dependency'si mevcut
- **Store dosyalari:** `src/stores/` altinda
- **Pattern:** Slice pattern ile modular store
- **DevTools:** `zustand/middleware` ile aktif
-->

---

## State Yonetimi Kurallari

### State Katmanlari

```typescript
// LOCAL STATE — Basit component state
const [isOpen, setIsOpen] = useState(false);

// LOCAL STATE — Karmasik component state
const [formState, dispatch] = useReducer(formReducer, initialState);

// GLOBAL STATE — Uygulama geneli (Zustand ornegi)
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));

// SERVER STATE — API verileri (TanStack Query ornegi)
const { data: products, isLoading } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => productService.getAll(filters),
});
```

### State Kurallar Tablosu

| Katman | Arac | Kullanim |
|---|---|---|
| Local state (basit) | `useState` | Toggle, form input, UI state |
| Local state (karmasik) | `useReducer` | Coklu alan, karmasik gecisler |
| Global state | Zustand / Jotai / Redux | Auth, tema, kullanici tercihleri |
| Server state | TanStack Query / SWR | API verileri, cache, refetch |
| Form state | React Hook Form / Formik | Form validasyonu, submission |
| URL state | `useSearchParams` | Filtre, sayfalama, siralama |

| Kural | Aciklama |
|---|---|
| En dusuk seviyede tut | State'i mumkun olan en yakın component'te |
| Lifting state up | Ortak parent'a tasimak gerekirse prop ile gec |
| Prop drilling siniri | 3+ seviye prop geciyor → Context veya global state |
| Server state ayri | API verileri icin TanStack Query veya SWR kullan |

---

## Rendering Kurallari

### Liste Rendering

```typescript
// DOGRU — Benzersiz ve stabil key
{products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}

// YANLIS (YASAK) — Index key (siralama/filtreleme varsa)
{products.map((product, index) => (
  <ProductCard key={index} product={product} /> // Siralama degisince bozulur
))}
```

### Conditional Rendering

```typescript
// DOGRU — Early return
if (!user) return <LoginPrompt />;
if (isLoading) return <Spinner />;
return <Dashboard user={user} />;

// DOGRU — Ternary (kisa kosullar)
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// DIKKAT — && operatoru (falsy deger tuzagi)
{items.length > 0 && <ItemList items={items} />} // DOGRU — boolean sonuc
{items.length && <ItemList items={items} />}      // YANLIS — 0 render eder

// DOGRU — Fragment (gereksiz div wrapper yerine)
<>
  <Header />
  <Main />
  <Footer />
</>
```

### Portal

```typescript
// DOGRU — Modal, tooltip icin Portal
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root')!
  );
}
```

---

<!-- GENERATE: ROUTER
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.dependencies, project.router_config
Ornek cikti:
## Router: React Router v6

- **Tespit:** `package.json`'da `react-router-dom` v6 dependency'si
- **Yapi:** `createBrowserRouter` ile route tanimlari
- **Lazy loading:** `React.lazy()` ile route-based code splitting
- **Auth:** `ProtectedRoute` component'i ile korumali route'lar
-->

---

## Routing Kurallari

### Route Tanimlari ve Lazy Loading

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// DOGRU — Lazy loading ile route-based code splitting
const Dashboard = lazy(() => import('./features/dashboard/DashboardPage'));
const Products = lazy(() => import('./features/products/ProductsPage'));
const Settings = lazy(() => import('./features/settings/SettingsPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ProductDetail />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

### Protected Route

```typescript
// DOGRU — Auth kontrolu route seviyesinde
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Kullanim
{
  path: 'dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
}
```

### Routing Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `React.lazy()` + `Suspense` | Route-based code splitting ZORUNLU |
| Protected route pattern | Auth kontrolu route seviyesinde |
| `useParams` / `useSearchParams` | URL parametreleri icin hook kullan |
| Error boundary | Her route segment'te `errorElement` |
| `Navigate` component | Programmatic redirect icin |

---

<!-- GENERATE: STYLING_APPROACH
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.styling, project.css_framework
Ornek cikti:
## Stil Yaklasimi: Tailwind CSS

- **Tespit:** `tailwind.config.js` mevcut, `package.json`'da `tailwindcss`
- **Utility-first:** Inline class'lar tercih edilir
- **cn() helper:** `clsx` + `tailwind-merge` ile kosullu class
- **Theme:** `tailwind.config.js`'de custom tema tanimlari
-->

---

## Stil Kurallari

### Genel Prensipler

```typescript
// DOGRU — Proje genelinde TEK stil yaklasimi
// CSS Modules, Tailwind veya styled-components — KARISTIRMA

// DOGRU — Design token / tema degiskeni kullan
<button className={styles.primaryButton}>Kaydet</button>

// YANLIS (YASAK) — Hardcoded renk/boyut
<button style={{ backgroundColor: '#1e88e5', padding: '8px 16px' }}>
  Kaydet
</button>
```

| Kural | Aciklama |
|---|---|
| TEK yaklasim | CSS Modules / Tailwind / styled-components — karistirma |
| Design token | Hardcoded renk/boyut YASAK, tema degiskeni kullan |
| Responsive | Mobile-first media query'ler |
| Inline style sinirli | Sadece dinamik degerler icin (JS hesaplama sonucu) |

---

## Test Kurallari

### React Testing Library

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// DOGRU — Davranis bazli test
describe('LoginForm', () => {
  it('should show error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByRole('textbox', { name: /e-posta/i });
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /giris/i });
    await user.click(submitButton);

    expect(screen.getByText(/gecerli bir e-posta girin/i)).toBeInTheDocument();
  });

  it('should call onSubmit with valid data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByRole('textbox', { name: /e-posta/i }), 'ali@test.com');
    await user.type(screen.getByLabelText(/sifre/i), 'password123');
    await user.click(screen.getByRole('button', { name: /giris/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'ali@test.com',
      password: 'password123',
    });
  });
});

// YANLIS (YASAK) — Implementation detail testi
it('should set state', () => {
  const { result } = renderHook(() => useState(false));
  // State'e dogrudan erisim YASAK — davranis test et
});
```

### Test Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| RTL (React Testing Library) | Implementation degil davranis test et |
| `screen.getByRole`, `getByText` | Erisilebilirlik query'leri tercih et |
| `getByTestId` son care | Diger query'ler islemiyorsa |
| `userEvent` | `fireEvent` yerine `@testing-library/user-event` |
| API mock | MSW tercih edilir, component mock'lama YASAK |
| Snapshot test sinirli | Anlamli olan yerlerde, az kullan |

---

## Performans Kurallari

### Memo ve Optimization

```typescript
// DOGRU — React.memo sadece gercek performans sorunu oldugunda
const ExpensiveList = React.memo(function ExpensiveList({ items }: Props) {
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

// DOGRU — Buyuk listeler icin virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div ref={parentRef} style={{ overflow: 'auto', height: '400px' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
              width: '100%',
            }}
          >
            <ItemRow item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// DOGRU — Agir kutuphane icin dynamic import
const HeavyEditor = lazy(() => import('./HeavyEditor'));
```

### Performans Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `React.memo()` olcumlu | Sadece sik re-render olan ve pahali component'lerde |
| `useMemo`/`useCallback` olcumlu | Premature optimization YASAK, olculmus sorunlarda |
| Virtualization | Buyuk listeler icin `react-window` veya `react-virtuoso` |
| Bundle analizi | `source-map-explorer` veya `rollup-plugin-visualizer` |
| Lazy import | Agir kutuphaneleri `React.lazy()` ile yukle |
| Code splitting | Route bazli splitting ZORUNLU |

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.conventions, project.rules, project.folder_structure
Ornek cikti:
## Proje Konvansiyonlari

### Dosya Isimlendirme
- Component: PascalCase (`ProductCard.tsx`)
- Hook: camelCase + use prefix (`useAuth.ts`)
- Util: camelCase (`formatDate.ts`)
- Test: `*.test.tsx` veya `*.spec.tsx`
- Stil: `*.module.css` veya component ismi ile

### Import Sirasi
1. React
2. Ucuncu parti kutuphaneler
3. Proje component'leri (`@/components/`)
4. Hook'lar (`@/hooks/`)
5. Servisler (`@/services/`)
6. Tipler (`@/types/`)
7. Stiller
-->

---

## Yasak Pratikler

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | `dangerouslySetInnerHTML` | XSS riski | Sadece sanitize edilmis icerikle, yoksa kullanma |
| 2 | `findDOMNode` | Deprecated | `useRef` kullan |
| 3 | String ref (`ref="myRef"`) | Legacy API | `useRef` hook kullan |
| 4 | Component icinde component | Her render'da yeniden olusturulur | Ayri dosyada tanimla |
| 5 | `any` tipi | TypeScript tip guvenligini kirar | Doğru tip tanimla |
| 6 | Index key (dinamik liste) | Siralama/filtreleme degisince bozulur | Benzersiz `id` kullan |
| 7 | Class component | Legacy, hook kullanilamaz | Functional component |
| 8 | `useEffect` icinde dogrudan async | Race condition | Cleanup + cancelled flag |
| 9 | `// eslint-disable` gereksiz | Lint kurallarini devre disi birakma | Sorunu duzelt |
| 10 | Barrel export (buyuk projelerde) | Tree-shaking bozulur | Dogrudan import |

---

## Zorunlu Kurallar

1. **Functional component** — Class component YASAK (legacy haric).
2. **Props icin `interface`** — `type` degil `interface` kullan, extend edilebilirlik icin.
3. **Hook kurallari** — En ustte, kosulsuz. Dependency dizisi tam. Cleanup ZORUNLU.
4. **State en dusuk seviyede** — Mumkun olan en yakin component'te tut.
5. **Benzersiz key** — Liste render'da stabil, benzersiz key kullan. Index key YASAK.
6. **Lazy loading** — Route bazli code splitting `React.lazy()` + `Suspense` ile.
7. **Protected route** — Auth kontrolu route seviyesinde.
8. **Test** — RTL ile davranis test et, `userEvent` kullan, implementation detail YASAK.
9. **Tek stil yaklasimi** — CSS Modules / Tailwind / styled-components — proje genelinde TEK.
10. **`any` YASAK** — TypeScript'te tip guvenligi koru, `any` yerine dogru tip tanimla.
