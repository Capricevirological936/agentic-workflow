# Node.js Backend Ortak Kurallari

> Bu kurallar tum Node.js backend leaf'leri icin gecerlidir.
> Framework-spesifik kurallar bu dosyaya EK olarak uygulanir.

## Runtime ve Paketleme

- Calistirma, test ve kalite komutlari `package.json` `scripts` altinda acikca tanimlanmis olmali.
- Yeni bir kalite kapisi eklediginde script olarak expose et: `lint`, `test`, `typecheck`, `build`.
- Entry point tek ve belirgin olmali. Farkli bootstrap akislari varsa nedenleri yorumda veya README'de aciklanmali.

## Ortam Degiskenleri

- Secret degerleri kod icine hardcode etme.
- Ortam degiskenleri bir config katmaninda toplanmali; kodun her yerine dagitilmis `process.env` okumalarindan kacin.
- Kritik env degerleri uygulama acilisinda fail-fast dogrulanmali.

## Request Validation

- Handler'a giren her external veri bir validation katmanindan gecmeli.
- Dogrulama yoksa `req.body`, `req.query`, `req.params` degerlerini dogrudan domain logigine gecirme.
- Validation sonucu tiplenmis bir nesne olarak ilerlemeli.

## Hata Yonetimi

- Beklenen uygulama hatalari ile sistem hatalarini ayir.
- Async handler'larda unhandled rejection birakma; merkezi hata akisi kullan.
- 5xx durumlarinda kullaniciya stack trace veya secret iceren detay donme.

## Logging ve Gozlemlenebilirlik

- Production kodunda `console.log` yerine tutarli bir logger katmani tercih et.
- Hata log'larinda request baglami, correlation/request id ve kritik input ozeti bulunmali.
- Log'lara secret, token veya tam PII yazma.

## Verification Convention

- Son dogrulama akisi mumkunse su sirayi izlemeli: `lint` -> `typecheck` -> `test` -> `build`.
- Monorepo ise sadece etkilenen paketleri degil, paylasilan tip veya contract etkisi varsa bagimli paketleri de dogrula.

