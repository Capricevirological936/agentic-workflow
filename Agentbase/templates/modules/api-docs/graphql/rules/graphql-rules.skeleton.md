# GraphQL Kurallari

<!-- GENERATE: CODEBASE_CONTEXT
Aciklama: Bu bolum Bootstrap tarafindan manifest verileriyle doldurulur.
Gerekli manifest alanlari: project.name, project.description, project.structure
-->

---

## Schema Standartlari

### Yaklasim Secimi
- Proje basinda **schema-first** veya **code-first** yaklasimdan biri secilmeli ve tutarli uygulanmalidir.
- Schema-first: `.graphql` dosyalari tek kaynak (source of truth) olarak kabul edilir.
- Code-first: Decorator/annotation tabanli schema uretimi kullanilir (ornegin `type-graphql`, `@nestjs/graphql`).

### Naming Convention
| Oge | Kural | Ornek |
|-----|-------|-------|
| Type | PascalCase | `User`, `OrderItem` |
| Field | camelCase | `firstName`, `createdAt` |
| Enum | PascalCase (deger UPPER_SNAKE_CASE) | `OrderStatus { PENDING, COMPLETED }` |
| Query | camelCase, fiil ile baslama | `users`, `orderById` |
| Mutation | camelCase, fiil ile basla | `createUser`, `updateOrder` |
| Input | PascalCase + `Input` suffix | `CreateUserInput` |

### Description Zorunlulugu
- Her **type**, **query**, **mutation** ve **enum** icin `description` alani **zorunludur**.
- Aciklama, alanin amacini ve kullanimini kisa sekilde belirtmelidir.

---

## Resolver Kurallari

### N+1 Query Onleme
- Iliskili verileri ceken resolver'larda **DataLoader** kullanimi **zorunludur**.
- Her request icin yeni DataLoader instance'i olusturulmalidir (request-scoped).
- DataLoader olmadan iliskili veri ceken resolver tespit edildiginde code-review'da **bloklayici** olarak isaretlenir.

### Error Handling
- Resolver'larda try-catch blogu ile hata yakalanmalidir.
- Kullaniciya donulen hatalar anlamli mesajlar icermelidir.
- Dahili hata detaylari (stack trace, SQL hatalari) **production'da** kullaniciya gosterilmemelidir.
- GraphQL error'lari `extensions` alani ile hata kodu icermelidir:
  ```graphql
  {
    "message": "Kullanici bulunamadi",
    "extensions": { "code": "USER_NOT_FOUND" }
  }
  ```

### Authorization Kontrolu
- Her mutation ve hassas query'de **authorization kontrolu** yapilmalidir.
- Authorization mantigi resolver'in basinda, is mantigi oncesinde calistirilmalidir.
- Guard/middleware/directive tabanli merkezi authorization tercih edilmelidir.

---

## Type Safety

### Input Validation
- Mutation input'lari icin **ayri Input type** tanimlanmalidir (`CreateUserInput`, `UpdateOrderInput`).
- Input field'larinda gerekli validasyon kurallari uygulanmalidir (min/max length, format, vb.).
- Validation hatalarinda anlamli hata mesajlari dondurulmelidir.

### Nullable Field Politikasi
- Field'lar varsayilan olarak **non-nullable** (`!`) tanimlanmalidir.
- Nullable field yalnizca verinin gercekten opsiyonel oldugu durumlarda kullanilmalidir.
- Liste field'lari `[Type!]!` seklinde tanimlanmalidir (liste de elemanlar da non-nullable).

### Custom Scalar Kullanimi
- `DateTime`, `JSON`, `URL` gibi ozel tipler icin **custom scalar** tanimlanmalidir.
- Custom scalar'lar merkezi bir dosyada tanimlanip tum schema'dan referans verilmelidir.
- Serialization/parsing mantigi dokumante edilmelidir.

---

## Anti-Pattern'ler

| Anti-Pattern | Dogru Yaklasim |
|-------------|----------------|
| Resolver icinde dogrudan SQL/ORM sorgusu (N+1) | DataLoader kullanin |
| Tum field'larin nullable olmasi | Varsayilan non-nullable, sadece gerektiginde nullable |
| Tek buyuk `Query` type'i | Mantiksal gruplara bolerek modularize edin |
| Error'larin string olarak dondurulmesi | GraphQL error format'i + `extensions.code` kullanin |
| Authorization kontrolunun is mantigi icinde yapilmasi | Guard/middleware/directive ile merkezi kontrol |
| Input type yerine scalar argumanlar | Birden fazla arguman varsa Input type tanimlayin |
| Schema'da description olmamasi | Her type, field ve enum'a description ekleyin |
| Pagination olmadan liste dondurme | Cursor-based veya offset-based pagination uygulyin |
