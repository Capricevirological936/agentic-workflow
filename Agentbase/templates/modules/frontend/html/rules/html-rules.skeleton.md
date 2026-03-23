# HTML/CSS/JS (Vanilla Web) Kurallari

> Bu kurallar framework kullanmayan vanilla web projeleri icin gecerlidir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
Ornek cikti:
## Proje Baglami

- **Proje:** MyWebsite — Kurumsal tanitim sitesi
- **Yapi:** Statik site, `src/` altinda organize
- **Build Tool:** Vite (veya hicbiri)
- **CSS Yaklasimi:** BEM + CSS custom properties
- **JS:** ES6+ modules
- **Deploy:** Netlify / GitHub Pages
Kutsal Kurallar:
- Config dosyalari SADECE Agentbase icinde yasar
- Codebase icinde `.claude/` OLUSTURULMAZ
- Git sadece Codebase de calisir
-->

---

## HTML Kurallari

### Semantik Yapi

```html
<!-- DOGRU — Semantik etiketler kullan -->
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sayfa aciklamasi">
  <title>Sayfa Basligi</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Ana Sayfa</a></li>
        <li><a href="/hakkimizda">Hakkimizda</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Baslik</h1>
      <section>
        <h2>Alt Baslik</h2>
        <p>Icerik metni...</p>
      </section>
    </article>
  </main>

  <footer>
    <p>&copy; 2024 Sirket Adi</p>
  </footer>

  <script src="js/app.js" defer></script>
</body>
</html>

<!-- YANLIS (YASAK) — Div-soup -->
<div class="header">
  <div class="nav">
    <div class="nav-item"><a href="/">Ana Sayfa</a></div>
  </div>
</div>
<div class="main">
  <div class="content">
    <div class="title">Baslik</div>
  </div>
</div>
```

### HTML Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| Semantik etiketler | `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` |
| `<div>` sadece stil amacli | Icerik icin semantik etiket tercih et |
| `<img alt="">` zorunlu | Her gorselde `alt` attribute olmali (erisilebirlik) |
| `<form>` attribute'leri | `action` ve `method` belirtilmeli |
| Meta etiketleri zorunlu | `charset`, `viewport`, `description` |
| Dil ozelligi | `<html lang="tr">` (veya uygun dil kodu) |
| Baslik hiyerarsisi | `h1` → `h2` → `h3` sirali, atlama YASAK |

---

<!-- GENERATE: CSS_METHODOLOGY
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.css_files, project.css_methodology
Ornek cikti:
## CSS Metodolojisi: BEM

- **Tespit:** Sinif isimleri `block__element--modifier` formatinda
- **Ornek:** `.card__title--highlighted`
- **Dosya yapisi:** Component bazli CSS dosyalari
-->

---

## CSS Kurallari

### CSS Custom Properties ve Organizasyon

```css
/* DOGRU — CSS custom properties (variables) */
:root {
  /* Renkler */
  --color-primary: #1e88e5;
  --color-secondary: #43a047;
  --color-text: #212121;
  --color-text-light: #757575;
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-error: #d32f2f;

  /* Tipografi */
  --font-family-base: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border */
  --border-radius: 0.5rem;
  --border-color: #e0e0e0;
}

/* DOGRU — Variable kullanimi */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

/* YANLIS (YASAK) — Hardcoded degerler */
.card {
  background-color: #f5f5f5;  /* Variable kullan */
  border: 1px solid #e0e0e0;  /* Variable kullan */
  padding: 16px;               /* Variable kullan */
}
```

### BEM Isimlendirme

```css
/* DOGRU — BEM convention */
.card { }                      /* Block */
.card__title { }               /* Element */
.card__title--highlighted { }  /* Modifier */
.card__image { }
.card__body { }
.card__footer { }
.card--featured { }            /* Block modifier */

/* YANLIS (YASAK) — Tutarsiz isimlendirme */
.cardTitle { }           /* camelCase — CSS'te kullanma */
.card-title-big { }      /* Belirsiz convention */
.card .title { }         /* Descendant selector — specificity sorunu */
```

### Layout

```css
/* DOGRU — Flexbox ile layout */
.nav-list {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* DOGRU — Grid ile layout */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

/* DOGRU — Mobile-first responsive */
.container {
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
  }
}

/* YANLIS (YASAK) — Float layout */
.col-left {
  float: left;
  width: 50%;
}
```

### CSS Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| CSS custom properties | Hardcoded renk/boyut YASAK, variable kullan |
| BEM veya tutarli convention | `block__element--modifier` formatinda isimlendir |
| Mobile-first | `min-width` media query'leri tercih et |
| `!important` YASAK | Specificity sorununu kaynak seviyesinde coz |
| Flexbox / Grid | Layout icin ZORUNLU, float layout YASAK |
| Dosya organizasyonu | reset, variables, base, components, utilities |

---

## JavaScript Kurallari

### Modern ES6+ Syntax

```javascript
// DOGRU — const/let, arrow functions, template literals
const API_URL = 'https://api.example.com';

const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
};

// DOGRU — Destructuring
const { name, email, role } = user;
const [first, ...rest] = items;

// DOGRU — ES Modules
// utils.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('tr-TR').format(date);
};

// app.js
import { formatDate } from './utils.js';

// YANLIS (YASAK) — var kullanma
var userName = 'Ali';  // const veya let kullan

// YANLIS (YASAK) — string concatenation
const greeting = 'Merhaba ' + userName + '!';  // Template literal kullan
```

### DOM Manipulasyonu

```javascript
// DOGRU — querySelector kullan
const button = document.querySelector('.submit-btn');
const items = document.querySelectorAll('.list-item');

// DOGRU — Event delegation
document.querySelector('.todo-list').addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (!item) return;

  if (e.target.matches('.delete-btn')) {
    item.remove();
  } else if (e.target.matches('.toggle-btn')) {
    item.classList.toggle('completed');
  }
});

// YANLIS (YASAK) — Her elemana ayri listener
items.forEach((item) => {
  item.querySelector('.delete-btn').addEventListener('click', () => {
    item.remove();
  });
  item.querySelector('.toggle-btn').addEventListener('click', () => {
    item.classList.toggle('completed');
  });
});
```

### Async Islemler

```javascript
// DOGRU — async/await
const loadData = async () => {
  try {
    const [users, products] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
    ]);
    renderUsers(users);
    renderProducts(products);
  } catch (error) {
    showError(error.message);
  }
};

// YANLIS (YASAK) — Callback hell
fetchUsers((users) => {
  fetchProducts((products) => {
    fetchOrders((orders) => {
      // Callback hell — async/await kullan
    });
  });
});
```

### JavaScript Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| `const` tercih | Degiskenlik gerekiyorsa `let`, `var` YASAK |
| Arrow functions | Kisa fonksiyonlar icin, `this` binding gerekmedikce |
| Template literals | String birlestirme yerine backtick kullan |
| Destructuring | Nesne ve dizi ogelerine erisimde tercih et |
| ES Modules | `import`/`export` kullan, global degiskenlerden kacin |
| `querySelector` | DOM erisimi icin `getElementById` yerine |
| Event delegation | Ortak parent'a tek listener, her ogeye ayri YASAK |
| `async/await` | Callback ve `.then()` zinciri yerine |

---

## Erisilebirlik (a11y) Kurallari

```html
<!-- DOGRU — ARIA ve erisilebirlik -->
<button aria-label="Menu'yu ac" aria-expanded="false">
  <svg><!-- hamburger icon --></svg>
</button>

<nav aria-label="Ana navigasyon">
  <ul role="menubar">
    <li role="none"><a role="menuitem" href="/">Ana Sayfa</a></li>
  </ul>
</nav>

<!-- DOGRU — Form label'lari -->
<label for="email">E-posta</label>
<input type="email" id="email" name="email" required
       aria-describedby="email-help">
<span id="email-help">Is e-posta adresinizi girin</span>

<!-- DOGRU — Skip navigation -->
<a href="#main-content" class="skip-link">Iceriye atla</a>

<!-- YANLIS (YASAK) — Label'siz form -->
<input type="email" placeholder="E-posta"> <!-- label EKSIK -->
```

| Kural | Aciklama |
|---|---|
| ARIA rolleri | Uygun yerlerde `role`, `aria-label`, `aria-expanded` |
| Klavye navigasyonu | Tab order, focus yonetimi, `tabindex` |
| Renk kontrast | En az 4.5:1 orani (WCAG AA) |
| Form label'lari | `<label for="...">` ile baglanmali |
| Skip link | Uzun navigasyonlarda "iceriye atla" linki |
| `alt` attribute | Her `<img>` etiketinde zorunlu |

---

<!-- GENERATE: BUILD_TOOL
Aciklama: Bu bolum Bootstrap tarafindan otomatik tespit edilir.
Gerekli manifest alanlari: project.build_tool, project.scripts
Ornek cikti:
## Build Tool: Vite

- **Tespit:** `vite.config.js` mevcut
- **Dev server:** `npm run dev` → `vite`
- **Build:** `npm run build` → `vite build`
- **Output:** `dist/` dizini
- **Eklentiler:** `vite-plugin-html`
-->

---

## Performans Kurallari

### Kaynak Yukleme Sirasi

```html
<!-- DOGRU — CSS head'de, JS defer ile -->
<head>
  <!-- Critical CSS inline -->
  <style>
    /* Above-the-fold stiller */
    body { margin: 0; font-family: var(--font-family-base); }
  </style>

  <!-- Ana CSS dosyasi -->
  <link rel="stylesheet" href="css/styles.css">

  <!-- Preconnect — ucuncu parti kaynaklar icin -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
<body>
  <!-- Icerik -->

  <!-- JS — body sonunda veya defer ile -->
  <script src="js/app.js" defer></script>
</body>

<!-- YANLIS (YASAK) — JS head'de bloklayici -->
<head>
  <script src="js/heavy-lib.js"></script> <!-- Render'i bloklar -->
</head>
```

### Gorsel Optimizasyonu

```html
<!-- DOGRU — Lazy loading ve modern format -->
<img
  src="images/hero.webp"
  alt="Hero gorsel"
  width="1200"
  height="600"
  loading="lazy"
  decoding="async"
>

<!-- DOGRU — Responsive gorsel -->
<picture>
  <source media="(min-width: 1024px)" srcset="images/hero-lg.webp" type="image/webp">
  <source media="(min-width: 768px)" srcset="images/hero-md.webp" type="image/webp">
  <img src="images/hero-sm.jpg" alt="Hero gorsel" width="400" height="200" loading="lazy">
</picture>
```

### Performans Kurallar Tablosu

| Kural | Aciklama |
|---|---|
| CSS `<head>`'de | Render-blocking CSS minimize edilmeli |
| JS `defer` veya body sonunda | Render'i bloklama |
| Lazy loading | `loading="lazy"` ile gorunur alandaki olmayan gorseller |
| WebP format | Modern gorsel formati tercih et |
| `width` + `height` | Layout shift (CLS) onleme |
| Critical CSS inline | Above-the-fold icin inline stil |
| Preconnect | Ucuncu parti domain'ler icin `<link rel="preconnect">` |

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.conventions, project.rules, project.folder_structure
Ornek cikti:
## Proje Konvansiyonlari

### Dosya Yapisi
```
src/
├── index.html          # Ana sayfa
├── pages/              # Diger sayfalar
│   ├── about.html
│   └── contact.html
├── css/
│   ├── reset.css       # CSS reset/normalize
│   ├── variables.css   # CSS custom properties
│   ├── base.css        # Temel stiller
│   ├── components/     # Component stilleri
│   │   ├── card.css
│   │   └── button.css
│   └── utilities.css   # Yardimci siniflar
├── js/
│   ├── app.js          # Ana giris noktasi
│   ├── modules/        # JS modulleri
│   │   ├── nav.js
│   │   └── form.js
│   └── utils/          # Yardimci fonksiyonlar
├── images/             # Gorseller
└── fonts/              # Fontlar
```

### Isimlendirme
- HTML dosyalari: `kebab-case.html`
- CSS dosyalari: `kebab-case.css`
- JS dosyalari: `camelCase.js` veya `kebab-case.js`
- CSS siniflar: BEM (`block__element--modifier`)
- JS degiskenler: camelCase
- JS sabitler: UPPER_SNAKE_CASE
-->

---

## Yasak Pratikler

| # | Yasak | Neden | Dogru Alternatif |
|---|---|---|---|
| 1 | Inline `style=""` attribute | CSS dosyasinda yonetilmeli | CSS sinifi kullan |
| 2 | Inline `onclick=""` handler | JS dosyasinda yonetilmeli | `addEventListener` kullan |
| 3 | `document.write()` | Render'i bloklar, guvenlik riski | DOM API kullan |
| 4 | jQuery | Modern vanilla JS yeterli | Native DOM API, fetch, ES6+ |
| 5 | Table-based layout | Semantik degil, responsive degil | Flexbox veya Grid kullan |
| 6 | `var` kullanimi | Scope sorunlari, hoisting | `const` veya `let` kullan |
| 7 | Hardcoded renk/boyut | Bakim zor, tutarsizlik | CSS custom properties kullan |
| 8 | `!important` | Specificity sorunlarini gizler | Specificity'yi kaynak seviyesinde coz |
| 9 | Float layout | Karmasik, kirilgan | Flexbox veya Grid kullan |
| 10 | Global JS degiskenler | Namespace kirliligi, catisma | ES Modules veya IIFE kullan |

---

## Zorunlu Kurallar

1. **Semantik HTML** — `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` kullan, div-soup YASAK.
2. **CSS custom properties** — Hardcoded renk/boyut YASAK, variable tanimla ve kullan.
3. **BEM veya tutarli convention** — CSS sinif isimlendirmesi proje genelinde tutarli olmali.
4. **Mobile-first** — `min-width` media query'leri ile responsive tasarim.
5. **ES6+ syntax** — `const`/`let` kullan, `var` YASAK. Arrow function, template literal, destructuring.
6. **Event delegation** — Ortak parent'a tek listener, her ogeye ayri listener YASAK.
7. **Erisilebirlik** — `alt` attribute, form label'lari, ARIA rolleri, klavye navigasyonu.
8. **Performans** — CSS head'de, JS defer ile. Lazy loading, WebP format.
9. **Inline stil/handler YASAK** — Tum stil CSS dosyasinda, tum JS event'ler addEventListener ile.
10. **Global degisken YASAK** — ES Modules veya modul pattern kullan.
