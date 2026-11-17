# 👗 Sistema de Estoque de Roupas

Este é o projeto final integrado das disciplinas de **Desenvolvimento Web e Sistemas (DWS)**, **Programação Orientada a Objetos (POO)** e **Banco de Dados (BD)**.

O sistema consiste em uma aplicação web completa (Full-Stack) para o gerenciamento de estoque de uma loja de roupas, permitindo o controle de Produtos, Categorias e Fornecedores.

## 🚀 Tecnologias Utilizadas

- **Back-end:** Python 3 (Flask)
- **Banco de Dados:** SQLite3
- **Front-end:** HTML5, CSS3 e JavaScript (Fetch API)
- **Arquitetura:** Padrão DAO (Data Access Object) e Programação Orientada a Objetos.

## 📁 Estrutura do Projeto

```text
NEXSTOCK/
│
├── static/
│   ├── style.css       # Estilização da interface
│   └── script.js       # Lógica do front-end (Consumo da API)
│
├── templates/
│   └── index.html      # Interface principal do sistema (SPA)
│
├── app.py              # Rotas do Flask e inicialização do servidor
├── dao.py              # Objetos de Acesso a Dados (CRUD no banco)
├── models.py           # Classes do sistema (POO)
├── estrutura.sql       # Script de criação das tabelas (Modelagem BD)
└── README.md           # Documentação do projeto