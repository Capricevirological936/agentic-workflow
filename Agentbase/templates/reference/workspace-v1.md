# Workspace Yapısı

## Dizin Ağacı

- Docs
- Scripts
- Agents _(Ajanslar burada init olacak)_
  - backlog _(proje planlamasının omurgası - https://github.com/MrLesk/Backlog.md)_
  - shared
    - memory → Memorix MCP ile agent'lar arası paylaşımlı hafıza _(https://github.com/AVIDS2/memorix)_
    - errors.md → Agent hata takibi _(sadece tekrarlama riski olan yapısal hatalar — her küçük typo değil)_
    - skills _(Claude → command olarak, diğer agent'lar → skill olarak kullanır)_
      - task _(Backlog tasklarına odaklanmış)_
        - master.md _(backlog öncelik sıralayıcı — skorlama, bağımlılık analizi, quick win)_
        - planner.md _(yüksek bağlamlı task oluşturucu — derin analiz, model önerisi, kapsam bölme)_
        - hunter.md _(otonom task uygulayıcı — çoklu task, doğrulama kapısı, pre-existing protokolü)_
        - review.md _(paralel agent review — code-reviewer + silent-failure-hunter)_
      - bug _(Anlık oluşan buglara odaklanmış)_
        - hunter.md _(otonom bug avcısı — root cause, hipotez, minimal fix, regression test)_
        - review.md _(3 paralel agent: kalite + sessiz hata + regresyon analizi)_
      - quality.md _(standartlara uygunluk kontrolü — CONVENTIONS.md, naming, docblock, lint, mimari kurallar)_
      - deep-audit.md _(modülü uçtan uca tüm katmanlarda denetler — paralel uzman agent'lar, iki boyutlu değerlendirme, basitse fix karmaşıksa backlog)_
      - maintenance
        - deadcode.md _(kullanılmayan kod tespiti, doğrulama ve temizleme)_
      - bootstrap.md _(yeni proje başlatma: röportaj → workspace oluştur → backlog init → ilk task'ları üret → templates'den uygun template'i seç)_
    - agents
      - devils-advocate.md _(plan, mimari ve kodu "nerede kırılır?" bakış açısıyla sorgular)_
      - devops.md _(CI/CD pipeline, Docker, deploy, env yönetimi, altyapı görevleri)_
    - protocols _(Bu tamamen benim fantezim. Ajansların belli protokollere bağlı kalmasının başarının anahtarı olacağına inanıyorum fakat bunu nasıl yaptırabileceğimi bilmiyorum.)_
  - .claude
  - .gemini
  - .codex
  - .copilot
  - **Not:** Tüm context'leri tek bir dosyaya yazdırmak yerine modüler `.md` dosyalarına bölüp, ajansların ana context dosyalarına `@` ile enjekte etmek. Çünkü farklı eklentiler ve ajanın kendi notları iç içe girerek anlaşılmaz, bakımı zor kaotik bir dosya ortaya çıkıyor.
  - AGENTS.md
  - CLAUDE.md
  - GEMINI.md
  - DEVELOPER.md → Sen kimsin, deneyim, tercihler, çalışma tarzı _(@ ile tüm agent context'lerine)_
  - PROJECT.md → Proje brifi, stack, path'ler, uyarılar, credentials _(@ ile tüm agent context'lerine)_
  - CONVENTIONS.md → Naming, dosya yapısı, commit mesaj formatı, branch kuralları _(@ ile CLAUDE.md / GEMINI.md'ye)_
  - STACK.md → Kullanılan teknolojiler, versiyonlar, paket yöneticisi, runtime _(@ ile PROJECT.md'den veya doğrudan)_
  - ARCHITECTURE.md → Katman yapısı, dizin haritası, veri akışı, bağımlılık kuralları _(@ ile gerektiğinde — feature-dev, planlama)_
  - WORKFLOWS.md → Git flow, PR süreci, deploy adımları, review checklist _(@ ile gerektiğinde)_
  - .mcp.json
    - https://github.com/MrLesk/Backlog.md
    - https://github.com/modelcontextprotocol/servers/tree/main/src/memory _(Memorix tercih edildi, bu yedek/alternatif olarak kalsın)_
    - https://github.com/modelcontextprotocol/servers/tree/main/src/fetch
    - https://github.com/modelcontextprotocol/servers/tree/main/src/time

- templates/ _(Hazır UI template'leri ve iskelet kaynaklar)_
  - admin-panels/ _(Metronic, Vuexy, AdminLTE vb.)_
  - web-templates/ _(HTML/React/Vue site template'leri)_
  - **Not:** Bootstrap skill'i, proje tipine göre templates'den uygun template'i seçip repo'ya kaynak olarak alır

- Repo _(Asıl proje dosyaları burada)_
  - .github
  - .gitignore

---

## Test Araçları

- https://github.com/keploy/keploy
