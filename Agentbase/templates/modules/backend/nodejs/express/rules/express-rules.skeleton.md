# Express Kodlama Kurallari

> Bu kurallar Express kullanan projeler icin gecerlidir.
> `backend/nodejs` aile kurallari bu dosyayla birlikte uygulanir.

## Yapi ve Sorumluluklar

- Route dosyalari routing ve middleware baglama isiyle sinirli kalmali.
- Controller/handler katmani request'i normalize eder, service katmani is logigini tasir.
- Veri erisim ve dis servis cagrilarini handler icine gomerek buyuk fonksiyonlar olusturma.

## Middleware Zinciri

- Kimlik dogrulama, yetki, rate-limit ve validation middleware'leri acik sirayla baglanmali.
- Global error middleware zincirin sonunda tek yerde tanimlanmali.
- Middleware icinde response gonderildiyse `next()` cagrilmaz.

## Async Hata Akisi

- `async` handler'lari merkezi hata middleware'ine dusurecek bir wrapper veya utility kullan.
- Promise rejection'larini yutarak sessiz basari gorunumu olusturma.

```ts
// Tercih edilen desen
router.post('/users', validate(createUserSchema), asyncHandler(userController.create));
```

## Validation ve Response

- `req.body`, `req.query` ve `req.params` validation olmadan kullanilmaz.
- Basarili ve hatali response formatlari tutarli olmali; ozellikle API'lerde ortak response contract tercih edilir.

