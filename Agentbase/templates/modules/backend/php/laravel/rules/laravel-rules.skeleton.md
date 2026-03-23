# Laravel Kodlama Kurallari

> Bu kurallar Laravel framework'u kullanan projeler icin gecerlidir.
> `backend/php` aile kurallari bu dosyayla birlikte uygulanir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.description, stack.primary, project.structure
Ornek cikti:
## Proje Baglami
- **Proje:** E-ticaret API (Laravel + MySQL)
- **Stack:** PHP 8.2, Laravel 11, MySQL 8, Redis
- **Yapi:**
  - `app/` — Uygulama kodu
  - `routes/` — Rota tanimlari
  - `database/` — Migration ve seeder
  - `tests/` — Test dosyalari
Kutsal Kurallar:
- Config dosyalari SADECE Agentbase icinde yasar
- Codebase icinde `.claude/` OLUSTURULMAZ
- Git sadece Codebase de calisir
-->

---

<!-- GENERATE: LARAVEL_VERSION
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: stack.framework_version, stack.php_version
Ornek cikti:
## Versiyon Bilgisi
- **Laravel:** 11.x
- **PHP:** 8.2+
- **Minimum uyumluluk:** PHP 8.1
-->

---

## Ortam Degiskeni Yonetimi

### .env Dosyasi

- `.env` dosyasi ASLA commit edilmez. `.gitignore`'da olmali.
- `.env.example` dosyasi tum gerekli degiskenleri icerir ve her zaman guncel tutulur.
- Yeni bir ortam degiskeni eklediginde `.env.example`'a da ekle.

### config() vs env()

- Uygulama kodunda `env()` KULLANMA. Sadece `config/` dosyalarinda `env()` cagirilir.
- Uygulama kodunda her zaman `config('services.stripe.key')` gibi `config()` kullan.
- Neden: `config:cache` sonrasi `env()` null doner; `config()` her zaman calisir.

```php
// ❌ YANLIS — uygulama kodunda env() kullanimi
$key = env('STRIPE_KEY');

// ✅ DOGRU — config uzerinden erisim
// config/services.php: 'stripe' => ['key' => env('STRIPE_KEY')]
$key = config('services.stripe.key');
```

---

## Rota Conventions

### Resource Controller

- CRUD operasyonlari icin her zaman resource controller kullan.
- Gereksiz rota tanimlamaktan kacin — `Route::resource()` 7 rotayi otomatik olusturur.

```php
// ✅ DOGRU — resource controller
Route::resource('posts', PostController::class);

// Sadece belirli aksiyonlar gerekiyorsa:
Route::resource('posts', PostController::class)->only(['index', 'show']);

// ❌ YANLIS — tek tek tanimlama
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::post('/posts', [PostController::class, 'store']);
```

### Route Model Binding

- URL parametrelerini elle sorgulamak yerine Route Model Binding kullan.
- Implicit binding varsayilan olarak `id` kolonu kullanir; farkli kolon icin `getRouteKeyName()` override et.

```php
// ❌ YANLIS — elle sorgulama
public function show($id) {
    $post = Post::findOrFail($id);
}

// ✅ DOGRU — route model binding
public function show(Post $post) {
    return $post;
}
```

### API Rotalari

- API rotalari `routes/api.php` icinde tanimlanir.
- Versiyon prefix'i kullan: `/api/v1/...`
- API rotalarinda `Route::apiResource()` kullan (create/edit formlarini haric tutar).

---

## Eloquent Best Practices

### Eager Loading

- N+1 sorgularindan kacinmak icin her zaman eager loading kullan.
- Iliskili verilere eriseceksen `with()` kullan.

```php
// ❌ YANLIS — N+1 sorgu problemi
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Her iterasyonda ayri sorgu
}

// ✅ DOGRU — eager loading
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name; // Tek sorgu
}
```

### Mass Assignment Koruması

- Model'de `$fillable` veya `$guarded` tanimla.
- `$guarded = []` (bos guarded) kullanMAKTAN KACIN — tum alanlari acik birakir.
- Hassas alanlari (role, is_admin, balance) `$fillable`'a ekleME.

```php
// ✅ DOGRU — acikca izin verilen alanlar
class Post extends Model {
    protected $fillable = ['title', 'body', 'slug'];
}

// ❌ YANLIS — tum alanlar acik
class Post extends Model {
    protected $guarded = [];
}
```

### Scope Kullanimi

- Tekrar eden sorgu kosullari icin scope kullan.
- Global scope'lar dikkatli kullanilmali — beklenmedik filtrelemeye yol acebilir.

```php
// Model'de scope tanimla
public function scopePublished(Builder $query): Builder {
    return $query->where('status', 'published');
}

// Kullanim
$posts = Post::published()->latest()->get();
```

---

## Blade Guvenlik Kurallari

### Output Escaping

- Kullanici girdisini gosterirken HER ZAMAN `{{ }}` kullan (otomatik escape eder).
- `{!! !!}` (raw output) SADECE guvenilir ve sanitize edilmis HTML icin kullan.
- `{!! !!}` kullanmadan once neden gerektigini yorum olarak belirt.

```blade
{{-- ✅ DOGRU — otomatik XSS koruması --}}
<p>{{ $user->name }}</p>

{{-- ❌ TEHLIKELI — XSS acigi --}}
<p>{!! $user->bio !!}</p>

{{-- ✅ KABUL EDILEBILIR — bilinen guvenli kaynak, yorum ile --}}
{{-- Sanitize edilmis HTML: Purifier middleware'den gecmis --}}
<div>{!! $article->sanitized_body !!}</div>
```

### CSRF Koruması

- Tum POST/PUT/PATCH/DELETE formlarinda `@csrf` direktifini kullan.
- API rotalari token-based authentication kullaniyorsa CSRF harici tutulabilir.

---

## Servis Pattern'i

### Fat Model → Service

- Is logigini controller'da veya model'de toplama. Service class'larina tasi.
- Controller: request validation + service cagirma + response donme.
- Service: is logigi, dis servis cagrilari, karmasik islemler.
- Model: iliskiler, scope'lar, accessor/mutator, veri odakli islemler.

```
app/
├── Http/Controllers/     # Ince controller'lar
│   └── OrderController.php
├── Services/              # Is logigi
│   └── OrderService.php
├── Models/                # Eloquent model'ler
│   └── Order.php
├── Actions/               # Tek sorumluluk siniflar (opsiyonel)
│   └── CreateOrderAction.php
└── Repositories/          # Veri erisim katmani (opsiyonel)
    └── OrderRepository.php
```

```php
// ✅ DOGRU — ince controller
class OrderController extends Controller {
    public function store(StoreOrderRequest $request, OrderService $service) {
        $order = $service->createOrder($request->validated());
        return new OrderResource($order);
    }
}

// ❌ YANLIS — sisman controller
class OrderController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([...]);
        $order = Order::create($validated);
        $order->items()->createMany($validated['items']);
        Mail::to($order->user)->send(new OrderConfirmation($order));
        Cache::forget('user_orders_' . $order->user_id);
        return response()->json($order);
    }
}
```

---

## Test Conventions

### Dizin Yapisi

```
tests/
├── Feature/    # Endpoint ve entegrasyon testleri (HTTP istekleri yapar)
│   ├── Auth/
│   │   └── LoginTest.php
│   └── Api/
│       └── PostTest.php
├── Unit/       # Izole birim testleri (HTTP istegi yapmaz)
│   ├── Services/
│   │   └── OrderServiceTest.php
│   └── Models/
│       └── PostTest.php
└── TestCase.php
```

### Kurallar

- Feature testleri: `$this->get()`, `$this->post()` gibi HTTP yardimcilari kullanir. Veritabani ile calisir.
- Unit testleri: Tek bir sinif veya metodu izole olarak test eder. Mock/stub kullanir.
- Test metodlari `test_` prefix'i veya `#[Test]` attribute'u kullanir.
- Factory kullan — `Model::create()` yerine `Model::factory()->create()`.
- Her test kendi verisini olusturur — baska testlerin verisine bagimsiz olmali.

```php
// Feature test ornegi
class PostTest extends TestCase {
    use RefreshDatabase;

    public function test_user_can_create_post(): void {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'title' => 'Test Post',
                'body' => 'Icerik',
            ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Test Post');

        $this->assertDatabaseHas('posts', ['title' => 'Test Post']);
    }
}
```

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan interview cevaplariyla doldurulur.
Gerekli manifest alanlari: conventions.naming, conventions.patterns, conventions.project_specific
Ornek cikti:
## Proje Ozel Kurallari

- **API Response formati:** Her zaman `ApiResponse::success($data)` wrapper kullan
- **Authentication:** Sanctum token-based auth kullaniliyor
- **Loglama:** `Log::channel('slack')` kritik hatalar icin
- **Cache stratejisi:** Redis, 1 saat TTL varsayilan
- **Kuyruk:** Laravel Horizon ile Redis queue kullaniliyor
-->

---

## Zorunlu Kurallar Ozeti

1. **`.env` commit edilmez.** `.env.example` guncel tutulur.
2. **Kodda `env()` kullanma.** `config()` uzerinden eris.
3. **Resource controller kullan.** CRUD icin tek tek rota tanimlama.
4. **Route model binding kullan.** `findOrFail()` yerine type-hint.
5. **Eager loading kullan.** N+1 sorgu probleminden kacin.
6. **Mass assignment'a dikkat.** Hassas alanlari `$fillable`'a koyma.
7. **Blade'de `{{ }}` kullan.** `{!! !!}` sadece sanitize edilmis icerik icin.
8. **Is logigini service'e tasi.** Controller ince, model veri odakli olmali.
9. **Factory kullan.** Testlerde `Model::create()` yerine factory.
10. **Feature vs Unit ayirt et.** HTTP testleri Feature, izole testler Unit dizininde.
