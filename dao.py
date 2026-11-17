import sqlite3
from models import Fornecedor, Categoria, Produto

CAMINHO_BANCO = "estoque_roupas.db"


class FornecedorDAO:
    def inserir(self, fornecedor):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "INSERT INTO fornecedores (nome, cnpj) VALUES (?, ?)",
                (fornecedor.nome, fornecedor.cnpj)
            )
            conexao.commit()
            return cursor.lastrowid

    def buscar_todos(self):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome, cnpj FROM fornecedores")
            return [Fornecedor(*linha) for linha in cursor.fetchall()]

    def atualizar(self, id_fornecedor, fornecedor):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "UPDATE fornecedores SET nome=?, cnpj=? WHERE id=?",
                (fornecedor.nome, fornecedor.cnpj, id_fornecedor)
            )
            conexao.commit()

    def remover(self, id_fornecedor):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute("DELETE FROM fornecedores WHERE id=?", (id_fornecedor,))
            conexao.commit()


class CategoriaDAO:
    def inserir(self, categoria):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "INSERT INTO categorias (nome) VALUES (?)",
                (categoria.nome,)
            )
            conexao.commit()
            return cursor.lastrowid

    def buscar_todos(self):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome FROM categorias")
            return [Categoria(*linha) for linha in cursor.fetchall()]

    def atualizar(self, id_categoria, categoria):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "UPDATE categorias SET nome=? WHERE id=?",
                (categoria.nome, id_categoria)
            )
            conexao.commit()

    def remover(self, id_categoria):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute("DELETE FROM categorias WHERE id=?", (id_categoria,))
            conexao.commit()


class ProdutoDAO:
    def inserir(self, produto):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                """INSERT INTO produtos 
                   (nome, preco, quantidade, ativo, fornecedor_id, categoria_id)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (produto.nome, produto.preco, produto.quantidade,
                 produto.ativo, produto.fornecedor_id, produto.categoria_id)
            )
            conexao.commit()
            return cursor.lastrowid

    def buscar_todos(self):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "SELECT id, nome, preco, quantidade, ativo, fornecedor_id, categoria_id FROM produtos"
            )
            return [Produto(*linha) for linha in cursor.fetchall()]

    def atualizar(self, id_produto, produto):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                """UPDATE produtos 
                   SET nome=?, preco=?, quantidade=?, ativo=?, 
                       fornecedor_id=?, categoria_id=?
                   WHERE id=?""",
                (produto.nome, produto.preco, produto.quantidade,
                 produto.ativo, produto.fornecedor_id, produto.categoria_id, id_produto)
            )
            conexao.commit()

    def remover(self, id_produto):
        with sqlite3.connect(CAMINHO_BANCO) as conexao:
            cursor = conexao.cursor()
            cursor.execute("DELETE FROM produtos WHERE id=?", (id_produto,))
            conexao.commit()