# Test Zorlama Kurallari

Bu kurallar tum komutlar ve agent'lar tarafindan referans alinir. test-enforcer hook'u bu kurallara gore systemMessage uretir.

---

## Kaynak → Test Dosyasi Eslestirme

<!-- GENERATE: TEST_FILE_TABLE
Aciklama: Bootstrap manifest'teki stack bilgisine gore kaynak-test eslestirme tablosu uretir.
Gerekli manifest alanlari: stack.primary, stack.test_framework
Ornek cikti:
| Kaynak Pattern | Test Dosyasi | Framework |
|---|---|---|
| `controllers/{name}.ts` | `__tests__/controllers/{name}.test.ts` | jest |
| `services/{name}.ts` | `__tests__/services/{name}.test.ts` | jest |
| `screens/{name}.tsx` | `__tests__/screens/{name}.test.tsx` | jest |
| `components/{name}.tsx` | `__tests__/components/{name}.test.tsx` | jest |
| `utils/{name}.ts` | `__tests__/utils/{name}.test.ts` | jest |
-->

---

## Test Yazma Karar Matrisi

| Degisiklik Tipi | Test Yaz? | Aciklama |
|---|---|---|
| Yeni fonksiyon/metot | EVET | Happy path + en az 1 edge case |
| Davranis degisikligi | EVET | Mevcut testi guncelle veya yeni case ekle |
| Bug fix | EVET | Regresyon testi: bug'in tekrar olusmadigini dogrula |
| Refactoring (davranis ayni) | HAYIR | Mevcut testlerin hala gectigini dogrula yeterli |
| Tip degisikligi (type-only) | HAYIR | Derleme kontrolu yeterli |
| Config/env degisikligi | HAYIR | Manuel dogrulama yeterli |
| Dokumantasyon | HAYIR | Test gerektirmez |
| Import/export yeniden duzenleme | HAYIR | Mevcut testler yeterli |

---

## Minimum Senaryo Kapsamasi

Her test dosyasi en az su senaryolari kapsamali:

1. **Happy path** — Normal kullanim senaryosu
2. **Bos/null girdi** — Edge case: undefined, null, bos string
3. **Hata durumu** — Beklenen hata: yanlis tip, gecersiz deger, timeout

Karmasik is mantigi icin ek senaryolar:
- Sinir degerleri (boundary)
- Eslesen/eslesmeyen kosullar
- Concurrent/async davranis

---

## 4 Katmanli Zorlama Mimarisi

```
Katman 1: test-enforcer.js hook     → Claude'a systemMessage ile talimat
Katman 2: task-hunter verification   → Gorev kapatmada test kontrolu
Katman 3: pre-commit git hook        → npm test fail = commit ENGEL
Katman 4: CI (GitHub Actions)        → npm test fail = merge ENGEL
```

Her katman bir oncekinin kaciracagini yakalar. Tek katmana guvenme.
