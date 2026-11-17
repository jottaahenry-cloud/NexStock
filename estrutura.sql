-- ==========================================================
-- PROJETO INTEGRADO: SISTEMA DE ESTOQUE DE ROUPAS
-- Script de criação do Banco de Dados (SQLite)
-- ==========================================================

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

-- Tabela de Produtos (com chaves estrangeiras)
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    quantidade INTEGER NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,
    fornecedor_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ==========================================================
-- INSERÇÃO DE DADOS INICIAIS (OPCIONAL)
-- ==========================================================

INSERT INTO fornecedores (nome, cnpj) VALUES 
('Tecidos Silva', '12.345.678/0001-90'),
('Moda Brasil', '98.765.432/0001-10');

INSERT INTO categorias (nome) VALUES 
('Camisetas'),
('Calças'),
('Vestidos');

INSERT INTO produtos (nome, preco, quantidade, ativo, fornecedor_id, categoria_id) VALUES 
('Camiseta Algodão Básica', 49.90, 50, 1, 1, 1),
('Calça Jeans Slim', 129.90, 30, 1, 2, 2),
('Vestido Floral', 89.90, 15, 1, 1, 3);