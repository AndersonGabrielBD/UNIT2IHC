# 🌌 Cosmoria — Explorador Interativo do Sistema Solar

> Uma jornada visual e acessível pelos 8 planetas do nosso sistema solar.

![Cosmoria Banner](https://img.shields.io/badge/IHC-Projeto%20Final-f0c040?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Concluído-4ade80?style=for-the-badge)
![Acessibilidade](https://img.shields.io/badge/WCAG-2.1%20AA-7b61ff?style=for-the-badge)

---

## 📖 Descrição do Projeto

**Cosmoria** é um site interativo que permite explorar os 8 planetas do Sistema Solar de forma visual, animada e acessível. O projeto foi desenvolvido como trabalho da disciplina de **Interface Humano-Computador (IHC)**, com foco em usabilidade, acessibilidade e experiência do usuário.

A aplicação conta com uma cena 3D gerada em tempo real com **Three.js**, animações de scroll e de entrada com **GSAP**, rolagem suavizada com **Lenis**, integração de **VLibras** para usuários surdos e suporte a **Alto Contraste** para usuários com baixa visão.

---

## ✨ Funcionalidades

- 🪐 **Cena 3D interativa** — Sol e planetas orbitando em tempo real com Three.js, responsiva ao movimento do mouse
- 🎞️ **Animações fluidas** — Entradas com GSAP (ScrollTrigger), ticker animado, flutuação dos cards
- 🌀 **Scroll suavizado** — Experiência de navegação com Lenis
- ♿ **VLibras integrado** — Tradução em Libras para toda a interface
- 🔲 **Alto Contraste** — Modo acessível ativado com um clique, salvo em localStorage
- 📱 **Responsivo** — Adaptado para mobile e desktop
- ⌨️ **Acessibilidade por teclado** — Focus trap no modal, ARIA labels, navegação completa via Tab
- 🔍 **Dados detalhados** — Modal com informações completas de cada planeta

---

## 🛠️ Bibliotecas Utilizadas

| Biblioteca | Versão | Finalidade |
|-----------|--------|-----------|
| **Three.js** | r128 | Renderização 3D da cena do sistema solar com WebGL |
| **GSAP** | 3.12.2 | Animações de entrada, ScrollTrigger para efeitos no scroll |
| **Lenis** | 1.0.42 | Scroll suavizado com easing customizado |
| **VLibras** | latest | Acessibilidade — tradução automática em Língua Brasileira de Sinais |

### Por que essas bibliotecas?

- **Three.js** — Padrão da indústria para WebGL. Permite criar a cena 3D animada do sistema solar diretamente no navegador, sem plugins externos.
- **GSAP** — A biblioteca de animação mais robusta para a web. O ScrollTrigger permite sincronizar animações com a posição do scroll de forma precisa e performática.
- **Lenis** — Biblioteca leve (< 3kb) que substitui o scroll nativo com uma versão suavizada. Integra nativamente com GSAP para manter a sincronização de animações.
- **VLibras** — Plugin oficial do governo brasileiro que adiciona um intérprete de Libras em qualquer site, tornando o conteúdo acessível para pessoas surdas.

---

## ♿ Implementações de Acessibilidade

### 1. VLibras (Libras)
Integração com o plugin oficial **VLibras** do governo federal, que adiciona um widget flutuante capaz de traduzir automaticamente todo o conteúdo textual da página para a Língua Brasileira de Sinais (Libras). O widget é visível em todas as páginas e pode ser ativado a qualquer momento.

### 2. Alto Contraste
Modo de alto contraste ativado por botão fixo na interface. Ao ser ativado:
- Fundo passa para preto puro (`#000`)
- Textos ficam em branco puro (`#fff`)
- Bordas ganham maior visibilidade
- Acentos passam para amarelo (`#ffff00`) e ciano (`#00ffff`) de alta legibilidade
- Preferência salva em `localStorage` entre sessões

### 3. Bônus — Acessibilidade por Teclado e ARIA
- Todos os cards de planetas são acessíveis via `Tab` e ativáveis com `Enter`/`Space`
- Modal com **focus trap** — o foco fica preso dentro enquanto aberto
- `aria-label`, `aria-modal`, `aria-hidden`, `aria-pressed` e `aria-live` em toda a interface
- Suporte a `prefers-reduced-motion` — animações desabilitadas automaticamente para usuários que preferem menos movimento

---

## 🚀 Como Executar

### Deploy (produção)

Acesse a versão publicada em: **[unit-2-ihc.vercel.app](https://unit-2-ihc.vercel.app/)**

### Localmente

O projeto é estático (HTML, CSS e JS). É preciso usar um servidor local — abrir o `index.html` direto no navegador (`file://`) pode causar erros de CORS com as bibliotecas CDN.

```bash
# Clone o repositório
git clone https://github.com/AndersonGabrielBD/UNIT2IHC.git

# Entre na pasta
cd UNIT2IHC

# Inicie um servidor local (escolha uma opção)
npx serve .
# ou
python -m http.server 8000
```

Depois abra no navegador:

- `http://localhost:3000` — se usou `npx serve .`
- `http://localhost:8000` — se usou `python -m http.server 8000`

---

## 📁 Estrutura do Projeto

```
cosmoria/
├── index.html          # Estrutura HTML com semântica e ARIA
├── style.css           # Estilos, variáveis CSS, responsividade
├── main.js             # Three.js, GSAP, Lenis, modal, acessibilidade
└── README.md           # Documentação do projeto
```

---

## 🐛 Issues a serem Resolvidas

| # | Título | Label |
|---|--------|-------|
| 1 | Estrutura base HTML + cena 3D com Three.js | `enhancement` |
| 2 | Navegação entre planetas + animações com GSAP | `enhancement` |
| 3 | Scroll suave com Lenis + responsividade mobile | `enhancement` |
| 4 | Acessibilidade: VLibras + alto contraste + ARIA | `enhancement` |

---

## 👤 Integrantes e Responsabilidades

| Integrante | Responsabilidade |
|-----------|-----------------|
| **Anderson Gabriel Barbosa Duarte** | Projeto completo — arquitetura HTML/CSS/JS, integração Three.js (cena 3D, iluminação, órbitas), implementação GSAP (ScrollTrigger, animações de entrada), configuração Lenis (scroll suavizado), sistema de modal acessível, VLibras, modo alto contraste, responsividade mobile e deploy. |

> Projeto desenvolvido individualmente.

---

## 📚 Disciplina

**Interface Humano-Computador (IHC)**
Trabalho final — Desenvolvimento de aplicação web com foco em acessibilidade, usabilidade e experiência do usuário.

---

## 📄 Licença

Este projeto é open source sob a licença [MIT](LICENSE).