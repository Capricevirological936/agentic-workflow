# Django Kodlama Kurallari

> Bu kurallar Django framework'u kullanan projeler icin gecerlidir.
> `backend/python` aile kurallari bu dosyayla birlikte uygulanir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.description, stack.primary, project.structure
Ornek cikti:
## Proje Baglami
- **Proje:** Blog platformu (Django + PostgreSQL)
- **Stack:** Python 3.12, Django 5.0, PostgreSQL 16, Celery
- **Yapi:**
  - `myproject/` — Django proje konfigurasyonu
  - `apps/` — Django uygulamalari
  - `templates/` — Sablonlar
  - `static/` — Statik dosyalar
-->

---

<!-- GENERATE: DJANGO_VERSION
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: stack.framework_version, stack.python_version
Ornek cikti:
## Versiyon Bilgisi
- **Django:** 5.0.x
- **Python:** 3.12+
- **Minimum uyumluluk:** Python 3.10
-->

---

## Ayarlar (Settings) Yonetimi

### Hassas Bilgiler

- `SECRET_KEY`, veritabani sifresi, API anahtarlari ASLA kod icinde hardcode edilmez.
- Ortam degiskenleri uzerinden okunur: `django-environ`, `python-decouple` veya `os.environ` kullan.
- `.env` dosyasi ASLA commit edilmez. `.gitignore`'da olmali.

```python
# ❌ YANLIS — hardcode secret
SECRET_KEY = 'django-insecure-xyz123456789'

# ✅ DOGRU — ortam degiskeninden oku
import environ
env = environ.Env()
SECRET_KEY = env('SECRET_KEY')
```

### Ayar Dosyasi Yapisi

- Tekil `settings.py` kucuk projeler icin kabul edilebilir.
- Buyuk projelerde `settings/` dizini kullan:

```
settings/
├── __init__.py      # from .base import *; try: from .local import * ...
├── base.py          # Ortak ayarlar
├── local.py         # Gelistirme ortami (.gitignore'da)
├── production.py    # Production ortami
└── test.py          # Test ortami
```

### DEBUG Ayari

- `DEBUG = True` SADECE gelistirme ortaminda.
- Production'da `DEBUG = False` ZORUNLU.
- `ALLOWED_HOSTS` production'da acikca tanimlanmali (asla `['*']` degil).

---

## URL Patterns

### path() vs url()

- Django 2.0+ itibariyle `path()` kullan, `url()` (re_path) kullanma.
- `re_path()` sadece regex gerektiren karmasik pattern'ler icin kabul edilebilir.

```python
# ❌ YANLIS — eski usul url()
from django.conf.urls import url
url(r'^posts/(?P<pk>\d+)/$', views.post_detail)

# ✅ DOGRU — path() ile type-safe
from django.urls import path
path('posts/<int:pk>/', views.post_detail, name='post-detail')
```

### Namespace Kullanimi

- Her app kendi `urls.py` dosyasina sahip olmali.
- `app_name` tanimla ve URL'leri namespace ile refere et.
- Template ve kodda URL'leri asla hardcode etme.

```python
# apps/blog/urls.py
app_name = 'blog'
urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
]

# Template'de kullanim
# ❌ YANLIS — hardcode URL
# <a href="/blog/42/">

# ✅ DOGRU — namespace ile reverse
# <a href="{% url 'blog:post-detail' post.pk %}">
```

### API URL'leri

- REST API icin DRF (Django REST Framework) router kullan.
- Versiyon prefix'i ekle: `/api/v1/...`

---

## View Conventions

### Class-Based vs Function-Based

- CRUD islemleri icin CBV (Class-Based View) tercih et — kod tekrarini azaltir.
- Ozel/karmasik mantik icin FBV (Function-Based View) kabul edilebilir.
- Generic view'lari kullan: `ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`.

```python
# ✅ DOGRU — generic CBV
from django.views.generic import ListView, DetailView

class PostListView(ListView):
    model = Post
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    paginate_by = 20

class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'
```

### API View'lari (DRF)

- `APIView` veya `ViewSet` kullan.
- Serializer ile validasyon ve serialization yap.
- Permission class'lari ile yetkilendirme kontrol et.

```python
# ✅ DOGRU — DRF ViewSet
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class PostViewSet(ModelViewSet):
    queryset = Post.objects.select_related('author').all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
```

---

## Template Guvenlik Kurallari

### Auto-Escaping

- Django template'leri varsayilan olarak auto-escape uygular — bunu kapatma.
- `{{ variable }}` guvenlidir — HTML otomatik escape edilir.
- `{{ variable|safe }}` veya `{% autoescape off %}` SADECE guvenilir ve sanitize edilmis icerik icin.

```html
{# ✅ DOGRU — otomatik XSS korumasi #}
<p>{{ user.bio }}</p>

{# ❌ TEHLIKELI — XSS acigi #}
<p>{{ user.bio|safe }}</p>

{# ✅ KABUL EDILEBILIR — bilinen guvenli kaynak, yorum ile #}
{# Bleach ile sanitize edilmis HTML #}
<div>{{ article.sanitized_body|safe }}</div>
```

### CSRF Korumasi

- Tum POST formlarinda `{% csrf_token %}` ZORUNLU.
- AJAX POST isteklerinde CSRF token header'da gonderilmeli.
- `@csrf_exempt` SADECE webhook gibi dis kaynak istekleri icin, yorum ile aciklanmali.

```html
{# ✅ DOGRU — CSRF token #}
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Gonder</button>
</form>
```

---

## Model Best Practices

### Meta Sinifi

- Her model'de `verbose_name` ve `verbose_name_plural` tanimla.
- `ordering` tanimla — siralamasiz sorgular tutarsiz sonuc verir.
- `__str__` metodu tanimla — admin paneli ve debug icin onemli.

```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Yazi'
        verbose_name_plural = 'Yazilar'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
```

### Manager ve QuerySet

- Tekrar eden sorgular icin custom manager veya QuerySet kullan.
- `objects` manager'ini override etmek yerine ek manager ekle.

```python
class PublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='published')

class Post(models.Model):
    # ...
    objects = models.Manager()  # Varsayilan manager
    published = PublishedManager()  # Ozel manager

# Kullanim
Post.published.all()  # Sadece yayinlanmis yazilar
```

### select_related / prefetch_related

- ForeignKey ve OneToOne icin `select_related()` kullan (JOIN yapar).
- ManyToMany ve reverse FK icin `prefetch_related()` kullan (ayri sorgu, Python'da birlestir).

```python
# ❌ YANLIS — N+1 sorgu
posts = Post.objects.all()
for post in posts:
    print(post.author.name)  # Her iterasyonda sorgu

# ✅ DOGRU
posts = Post.objects.select_related('author').all()
```

---

## Test Conventions

### Test Sinif Secimi

| Sinif | Kullanim | Veritabani | Hiz |
|---|---|---|---|
| `SimpleTestCase` | Veritabani gerektirmeyen testler | Hayir | Hizli |
| `TestCase` | Veritabani gerektiren testler | Evet (transaction rollback) | Orta |
| `TransactionTestCase` | Transaction davranisi testi | Evet (truncate) | Yavas |
| `LiveServerTestCase` | Selenium / browser testleri | Evet | En yavas |

### Dizin Yapisi

```
apps/blog/
├── tests/
│   ├── __init__.py
│   ├── test_models.py       # Model testleri
│   ├── test_views.py        # View testleri
│   ├── test_serializers.py  # DRF serializer testleri
│   ├── test_forms.py        # Form testleri
│   └── factories.py         # Factory Boy tanimlari
└── ...
```

### Kurallar

- Test metod isimleri `test_` ile baslar ve ne test ettigini aciklar.
- Factory kullan (`factory_boy`) — elle model olusturma yerine.
- Her test kendi verisini olusturur — testler arasi bagimlilik olMAMALI.
- `setUp` / `setUpTestData` ile ortak test verisini hazirla.

```python
# ✅ DOGRU — factory kullanimi
from django.test import TestCase
from apps.blog.tests.factories import PostFactory, UserFactory

class PostModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = UserFactory()
        cls.post = PostFactory(author=cls.user)

    def test_str_returns_title(self):
        self.assertEqual(str(self.post), self.post.title)

    def test_published_manager_filters_correctly(self):
        PostFactory(status='draft')
        PostFactory(status='published')
        self.assertEqual(Post.published.count(), 1)
```

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan interview cevaplariyla doldurulur.
Gerekli manifest alanlari: conventions.naming, conventions.patterns, conventions.project_specific
Ornek cikti:
## Proje Ozel Kurallari

- **API Framework:** Django REST Framework kullaniliyor
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Asenkron gorevler:** Celery + Redis
- **Cache stratejisi:** Redis, django-redis
- **Dosya depolama:** AWS S3 (django-storages)
- **Admin paneli:** Ozellesmis admin siniflar kullaniliyor
-->

---

## Zorunlu Kurallar Ozeti

1. **Secret'lari hardcode etme.** Ortam degiskeni veya secret manager kullan.
2. **`DEBUG = True` production'da YASAK.** `ALLOWED_HOSTS` acikca tanimla.
3. **`path()` kullan.** `url()` (eski usul regex) kullanma.
4. **Namespace kullan.** URL'leri hardcode etme, `{% url %}` veya `reverse()` kullan.
5. **CSRF token her formda.** `{% csrf_token %}` atlanmaz.
6. **Auto-escape kapatma.** `|safe` sadece sanitize edilmis icerik icin.
7. **`__str__` ve Meta tanimla.** Her model'de verbose_name, ordering, __str__ olmali.
8. **`select_related` / `prefetch_related` kullan.** N+1 sorgu probleminden kacin.
9. **Dogru test sinifini sec.** DB gerekmeyen testler icin `SimpleTestCase`.
10. **Factory kullan.** Testlerde elle model olusturma yerine factory_boy.
