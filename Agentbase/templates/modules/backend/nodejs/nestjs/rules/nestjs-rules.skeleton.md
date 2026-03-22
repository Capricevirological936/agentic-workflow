# NestJS Kodlama Kurallari

> Bu kurallar NestJS kullanan projeler icin gecerlidir.
> `backend/nodejs` aile kurallari bu dosyayla birlikte uygulanir.

## Modul Sinirlari

- Her feature kendi module siniri icinde controller, service ve gerekiyorsa repository/provider yapisina sahip olmali.
- Baska feature'in internal provider'ina dogrudan baglanmak yerine acik export/import iliskisi kullan.
- `AppModule` icine her seyi yigma; domain modullerine bol.

## DTO, Pipe ve Validation

- External input icin DTO kullan; `class-validator` ve `class-transformer` tabanli validation pipe'lari tercih et.
- Global `ValidationPipe` varsa whitelist/forbidNonWhitelisted gibi kritik ayarlari kapatma.
- Entity/model nesnelerini request DTO'su olarak yeniden kullanma.

## Controller ve Service Ayrimi

- Controller HTTP/transport katmani icin ince kalmali.
- Is logigi `@Injectable()` service'lerde toplanmali.
- Cross-cutting concerns icin guard, interceptor ve filter kullan; controller icine tekrarlayan altyapi kodu koyma.

## Test Convention

- Unit testler provider seviyesinde, e2e testler module/HTTP giris seviyesinde yazilmali.
- Mock'lar module graph gercegini bozmayacak sekilde, sadece ihtiyac kadar override edilmeli.

