# 🌍 Travel Manager

> **Travel Manager** é um gerenciador de destinos de viagem simples, interativo e acessível. Este projeto representa a entrega final desenvolvida para a disciplina de **Desenvolvimento Web-Cliente** na **Universidade Tecnológica Federal do Paraná (UTFPR)**.

---

## 🎯 Funcionalidades

O projeto foi projetado com foco em usabilidade, design responsivo e acessibilidade (com recursos de leitor de tela e navegação por teclado):

- **Cadastro de Destinos:** Adicione nome do destino, país, data da viagem, orçamento planejado e uma imagem personalizada.
- **Busca Rápida:** Filtre seus destinos planejados em tempo real através do campo de busca.
- **Edição & Remoção:** Altere os dados ou remova destinos diretamente pela interface.
- **Página de Detalhes:** Visualize informações detalhadas de cada destino cadastrado.
- **Persistência de Dados:** Todos os dados são salvos e carregados automaticamente no navegador utilizando a `Web Storage API` (`LocalStorage`).

---

## 📂 Estrutura do Projeto

O projeto é inteiramente baseado em tecnologias web nativas (sem frameworks adicionais):

- `index.html` — Tela inicial contendo a listagem e o painel de busca/cadastro dos destinos.
- `details.html` — Tela de visualização detalhada de um destino.
- [css/](file:///d:/GitHub/web-cliente/css) — Folhas de estilo da aplicação (design moderno e responsivo).
- [js/](file:///d:/GitHub/web-cliente/js) — Lógica de controle e persistência.
  - [js/storage.js](file:///d:/GitHub/web-cliente/js/storage.js) — Abstração e gerenciamento do `LocalStorage`.
  - [js/app.js](file:///d:/GitHub/web-cliente/js/app.js) — Controle de eventos, modal e listagem da página principal.
  - [js/details.js](file:///d:/GitHub/web-cliente/js/details.js) — Lógica de carregamento e exibição de detalhes.
- `Projeto Final.pdf` — Relatório/documentação entregue para a avaliação da disciplina.

---

## 🚀 Como Executar

Por ser uma aplicação 100% estática baseada em HTML, CSS e JavaScript puros:

1. Faça o download ou clone do repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador web moderno.
3. (Opcional) Utilize a extensão *Live Server* do VS Code ou similar para rodar um servidor de desenvolvimento local leve.
