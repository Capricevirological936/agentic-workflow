# Fastify Kodlama Kurallari

> Bu kurallar Fastify kullanan projeler icin gecerlidir.
> `backend/nodejs` aile kurallari bu dosyayla birlikte uygulanir.

## Schema-First API

- Route tanimlari request/response schema ile birlikte yazilmali.
- Validation ve serialization Fastify schema katmani uzerinden yapilmali; handler icinde manuel sekil kontrolu minimumda tutulmali.
- OpenAPI/Swagger uretimi varsa schema ile ayni kaynaktan beslenmeli.

## Plugin Mimarisi

- Buyuk uygulamalarda route, auth, db ve external client kurulumlari plugin bazli ayrilmali.
- `decorate`/`decorateRequest` kullanimlari kontrollu olmali; gizli global bagimlilik olusturma.
- Encapsulation sinirlarini bilerek ihlal et; gerekiyorsa nedenini yorumla.

## Handler Disiplini

- Handler'lar yalnizca validated input ile calismali.
- `reply.code(...).send(...)` veya return edilen degerler tutarli bir desen izlemeli.
- Fastify instance uzerinden rastgele global state tasima.

