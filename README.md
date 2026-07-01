# 🎬 CineVault

> **CineVault** é um gerenciador de filmes e séries com design premium, interativo e responsivo. Este projeto representa a entrega final desenvolvida para a disciplina de **Desenvolvimento Web-Cliente** na **Universidade Tecnológica Federal do Paraná (UTFPR)**.

---

## 🎯 Funcionalidades

O projeto foi projetado com foco em usabilidade, design premium moderno (Dark Mode, Glassmorphism) e total ausência de rolagem desnecessária, garantindo uma experiência de uso semelhante a um aplicativo nativo:

- **Cofre Pessoal (CRUD de Filmes):** Adicione o título, gênero, ano, pôster (URL) e status (Assistido / Quero Assistir) dos seus filmes favoritos.
- **Carrossel Infinito:** Navegação elegante entre os filmes cadastrados através de um carrossel em loop sem o uso de bibliotecas externas.
- **Avaliações (CRUD Secundário):** Clique em um filme para abrir sua tela de detalhes dedicada (sem rolagem) e adicione, edite ou exclua sua avaliação e nota (1 a 5 estrelas).
- **Busca e Filtros:** Filtre seus filmes em tempo real através do campo de busca textual ou pelos filtros de status.
- **Acessibilidade:** Suporte completo à navegação por teclado (tabulação), leitores de tela (atributos aria) e semântica HTML5.

---

## 📂 Estrutura do Projeto

O projeto é inteiramente baseado em tecnologias web nativas (sem frameworks adicionais, cumprindo os requisitos da disciplina):

- `index.html` — Tela inicial contendo a listagem (carrossel infinito) e o painel de busca/filtros/cadastro dos filmes.
- `details.html` — Tela de visualização detalhada de um filme e sua avaliação pessoal em layout lado-a-lado.
- `css/style.css` — Folhas de estilo da aplicação com design moderno, CSS Variables, Flexbox e pseudo-classes.
- `js/app.js` — Controle de eventos, modais, renderização do carrossel e listagem da página principal.
- `js/details.js` — Lógica de carregamento, exibição de detalhes e manipulação do CRUD de avaliações.
- `js/storage.js` — Abstração e gerenciamento do `LocalStorage` (relacionamento 1 para 1 entre Filmes e Avaliações).
- `Projeto Final.pdf` — Relatório/documentação entregue para a avaliação da disciplina.

---

## 🚀 Como Executar

Por ser uma aplicação 100% estática baseada em HTML, CSS e JavaScript puros:

1. Faça o download ou clone do repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador web moderno.
3. (Opcional) Utilize a extensão *Live Server* do VS Code ou similar para rodar um servidor de desenvolvimento local leve.
