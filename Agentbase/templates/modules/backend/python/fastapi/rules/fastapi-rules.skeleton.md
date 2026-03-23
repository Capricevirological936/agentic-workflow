# FastAPI Kodlama Kurallari

> Bu kurallar FastAPI framework'u kullanan projeler icin gecerlidir.
> `backend/python` aile kurallari bu dosyayla birlikte uygulanir.
> Tum gelistiriciler ve agent'lar bu kurallara uymak ZORUNDADIR.

---

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.description, stack.primary, project.structure
Ornek cikti:
## Proje Baglami
- **Proje:** Kullanici yonetim API'si (FastAPI + PostgreSQL)
- **Stack:** Python 3.12, FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **Yapi:**
  - `app/` — Ana uygulama kodu
  - `app/api/` — Endpoint tanimlari
  - `app/models/` — SQLAlchemy modelleri
  - `app/schemas/` — Pydantic semalari
  - `app/services/` — Is logigi
  - `tests/` — Test dosyalari
Kutsal Kurallar:
- Config dosyalari SADECE Agentbase icinde yasar
- Codebase icinde `.claude/` OLUSTURULMAZ
- Git sadece Codebase de calisir
-->

---

## Pydantic Modelleri

### Request/Response Validasyonu

- Tum request body'leri Pydantic model ile tanimlanmali.
- Response model'i de acikca belirtilmeli (`response_model` parametresi).
- Direkt dict donme — her zaman Pydantic model kullan.

```python
# ❌ YANLIS — dogrudan dict donme
@app.post("/users")
async def create_user(data: dict):
    return {"id": 1, "name": data["name"]}

# ✅ DOGRU — Pydantic model ile validasyon
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    # ...
    return created_user
```

### Model Ayirimi

- **Input model'leri:** `UserCreate`, `UserUpdate` — istemciden gelen veri
- **Output model'leri:** `UserResponse`, `UserListResponse` — istemciye donen veri
- **DB model'leri:** SQLAlchemy/ODM model'leri — veritabani tablosu
- Ayni model'i hem input hem output icin KULLANMA — hassas alanlar (password, internal_id) sizabilir.

```python
# ✅ DOGRU — ayri input/output model'leri
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str       # Sadece input'ta var

class UserResponse(BaseModel):
    id: int
    name: str
    email: str           # password YOK — output'a sizamaz

    model_config = ConfigDict(from_attributes=True)
```

### Validasyon Kurallari

- `Field()` ile constraint tanimla: `min_length`, `max_length`, `gt`, `lt`, `regex`.
- Custom validator icin `@field_validator` kullan.
- Karmasik cross-field validasyon icin `@model_validator` kullan.

---

## Dependency Injection

### Temel Kullanim

- Ortak logigi (DB session, auth, pagination) dependency olarak tanimla.
- `Depends()` ile endpoint'e enjekte et.
- Test'te dependency'leri override et — mock icin ideal.

```python
# ✅ DOGRU — dependency injection
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    user = await verify_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Gecersiz kimlik bilgisi")
    return user

@app.get("/me", response_model=UserResponse)
async def read_current_user(user: User = Depends(get_current_user)):
    return user
```

### Dependency Zincirleme

- Dependency'ler baska dependency'lere bagimli olabilir — FastAPI bunlari otomatik cozer.
- Tekrar eden dependency zincirlerini `yield` ile kaynak yonetimi icin kullan.

### Test'te Override

```python
# Test'te dependency override
from fastapi.testclient import TestClient

def override_get_db():
    return test_db_session

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)
```

---

## Async vs Sync Endpoint'ler

### Ne Zaman async Kullan

- I/O-bound islemler (DB sorgusu, HTTP istegi, dosya okuma) icin `async def` kullan.
- Async DB driver kullaniyorsan (asyncpg, aiosqlite) `async def` ZORUNLU.

```python
# ✅ DOGRU — async I/O islemleri
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()
```

### Ne Zaman sync Kullan

- CPU-bound islemler (hesaplama, goruntu isleme) icin `def` kullan.
- FastAPI sync fonksiyonlari otomatik olarak thread pool'da calistirir.
- async fonksiyon icinde bloklayici (sync) I/O YAPMA — event loop'u kitler.

```python
# ✅ DOGRU — CPU-bound islem icin sync
@app.post("/process-image")
def process_image(file: UploadFile):
    # PIL gibi sync kutuphane kullaniliyor
    image = Image.open(file.file)
    processed = heavy_processing(image)
    return {"result": "ok"}

# ❌ YANLIS — async icinde bloklayici islem
@app.get("/data")
async def get_data():
    result = requests.get("https://api.example.com")  # BLOKLAYICI!
    return result.json()

# ✅ DOGRU — async HTTP istegi
@app.get("/data")
async def get_data():
    async with httpx.AsyncClient() as client:
        result = await client.get("https://api.example.com")
    return result.json()
```

---

## Hata Yonetimi

### HTTPException

- Bilinen hata durumlarinda `HTTPException` kullan.
- Uygun HTTP status kodu sec (400, 401, 403, 404, 409, 422).
- `detail` alaninda kullaniciya yonelik aciklama ver.

```python
from fastapi import HTTPException

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanici bulunamadi")
    return user
```

### Custom Exception Handler

- Uygulama genelinde tutarli hata formati icin custom handler tanimla.
- Beklenmeyen hatalari yakala ve logla — 500 hatasinda detay verme.

```python
from fastapi import Request
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, status_code: int, detail: str, error_code: str):
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.error_code,
            "detail": exc.detail,
        }
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Logla ama detay verme
    logger.error(f"Beklenmeyen hata: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": "Sunucu hatasi"}
    )
```

### Validation Error Formati

- FastAPI 422 Validation Error'u otomatik dondurur — bu formati degistirme (API tuketicileri buna guvenebilir).
- Custom validation hatalari icin `@field_validator`'da `ValueError` firlat.

---

## Guvenlik

### Authentication

- OAuth2 veya API key tabanli kimlik dogrulama kullan.
- Hassas endpoint'lerde her zaman auth dependency tanimla.
- Token'lari guvenli sakla — cookie'de `httponly`, `secure`, `samesite` flag'leri.

```python
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# API Key
api_key_header = APIKeyHeader(name="X-API-Key")

@app.get("/protected")
async def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"Merhaba {user.name}"}
```

### CORS

- Production'da `allow_origins` icin `["*"]` KULLANMA.
- Sadece guvenilen domain'leri tanimla.
- Credentials ile calisan isteklerde `allow_credentials=True` ve spesifik origin ZORUNLU.

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend.example.com"],  # ❌ ["*"] degil
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### Rate Limiting

- Halka acik endpoint'lerde rate limiting uygula.
- `slowapi` veya benzeri middleware kullan.

### Input Sanitization

- Pydantic validasyonu ilk katman savunmadir.
- SQL injection'a karsi ORM kullan — raw SQL'den kacin.
- Path traversal'a karsi dosya yollarini dogrula.

---

## Test Conventions

### Test Arac Secimi

| Aralik | Kullanim |
|---|---|
| `TestClient` | Senkron endpoint testleri |
| `httpx.AsyncClient` | Async endpoint testleri |
| `pytest` | Test framework |
| `pytest-asyncio` | Async test destegi |
| `factory_boy` veya `polyfactory` | Test verisi olusturma |

### Dizin Yapisi

```
tests/
├── conftest.py           # Fixture tanimlari (app, client, db)
├── test_auth.py          # Authentication testleri
├── test_users.py         # User endpoint testleri
├── test_services/        # Service birim testleri
│   └── test_user_service.py
└── factories.py          # Test verisi factory'leri
```

### Test Ornegi

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post("/users", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "securepass123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert "password" not in data  # Sifre response'da olmamali

@pytest.mark.asyncio
async def test_get_nonexistent_user(client: AsyncClient):
    response = await client.get("/users/99999")
    assert response.status_code == 404
```

### Kurallar

- Her endpoint icin en az bir basarili ve bir basarisiz test yaz.
- Dependency override ile izole test yap — gercek DB/servis kullanma (birim testlerde).
- Integration testlerinde test DB kullan — production DB'ye baglaNMA.
- `conftest.py`'de ortak fixture'lari tanimla.
- Test fonksiyonlari `test_` ile baslar ve ne test ettigini aciklar.

---

<!-- GENERATE: PROJECT_CONVENTIONS
Aciklama: Bu bolum Bootstrap tarafindan interview cevaplariyla doldurulur.
Gerekli manifest alanlari: conventions.naming, conventions.patterns, conventions.project_specific
Ornek cikti:
## Proje Ozel Kurallari

- **ORM:** SQLAlchemy 2.0 async kullaniliyor
- **Migration:** Alembic ile yonetiliyor
- **Authentication:** JWT (python-jose + passlib)
- **Cache:** Redis (aioredis)
- **Background tasks:** Celery veya FastAPI BackgroundTasks
- **API dokumantasyonu:** Swagger UI + ReDoc (FastAPI varsayilan)
- **Loglama:** structlog ile yapilandirilmis loglama
-->

---

## Zorunlu Kurallar Ozeti

1. **Pydantic model kullan.** Request/response icin dogrudan dict donme.
2. **Input/Output model'lerini ayir.** Ayni model'i hem girdi hem cikti olarak kullanma.
3. **Dependency injection kullan.** Ortak logigi (DB, auth) Depends() ile enjekte et.
4. **Async/sync dogru sec.** I/O-bound icin async, CPU-bound icin sync. Async icinde bloklayici islem yapma.
5. **HTTPException kullan.** Dogru status kodu sec, detail alaninda aciklama ver.
6. **CORS'u kisitla.** `allow_origins=["*"]` kullanma, spesifik domain tanimla.
7. **Pydantic ile dogrula.** Field constraint'leri ve custom validator kullan.
8. **Dependency override ile test yap.** Test'te gercek servis yerine mock kullan.
9. **Async test icin pytest-asyncio kullan.** `@pytest.mark.asyncio` ile isaretle.
10. **Hata formatini tutarli tut.** Custom exception handler ile standart hata response'u.
