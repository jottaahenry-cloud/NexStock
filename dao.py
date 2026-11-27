import sqlite3
from pathlib import Path

from models import Fornecedor, Categoria, Produto


# Caminho do banco de dados
RAIZ_PROJETO = Path(__file__).resolve().parent.parent
CAMINHO_BANCO = RAIZ_PROJETO / "estoque_roupas.db"


def conectar():
    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.execute("PRAGMA foreign_keys = ON")
    return conexao

def inicializar_banco():
    caminho_sql = RAIZ_PROJETO / "estrutura.sql"

    with sqlite3.connect(CAMINHO_BANCO) as conexao:
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT name
            FROM sqlite_master
            WHERE type='table' AND name='fornecedores'
        """)

        tabela_existe = cursor.fetchone()

        if not tabela_existe:
            with open(caminho_sql, "r", encoding="utf-8") as arquivo:
                script_sql = arquivo.read()

            conexao.executescript(script_sql)

class FornecedorDAO:
    def inserir(self, fornecedor):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "INSERT INTO fornecedores (nome, cnpj) VALUES (?, ?)",
                (fornecedor.nome, fornecedor.cnpj)
            )
            return cursor.lastrowid

    def buscar_todos(self):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome, cnpj FROM fornecedores")
            return [Fornecedor(*linha) for linha in cursor.fetchall()]

    def atualizar(self, id_fornecedor, fornecedor):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "UPDATE fornecedores SET nome=?, cnpj=? WHERE id=?",
                (fornecedor.nome, fornecedor.cnpj, id_fornecedor)
            )

    def remover(self, id_fornecedor):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "DELETE FROM fornecedores WHERE id=?",
                (id_fornecedor,)
            )


class CategoriaDAO:
    def inserir(self, categoria):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "INSERT INTO categorias (nome) VALUES (?)",
                (categoria.nome,)
            )
            return cursor.lastrowid

    def buscar_todos(self):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome FROM categorias")
            return [Categoria(*linha) for linha in cursor.fetchall()]

    def atualizar(self, id_categoria, categoria):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "UPDATE categorias SET nome=? WHERE id=?",
                (categoria.nome, id_categoria)
            )

    def remover(self, id_categoria):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "DELETE FROM categorias WHERE id=?",
                (id_categoria,)
            )


class ProdutoDAO:
    def inserir(self, produto):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                """
                INSERT INTO produtos
                (nome, preco, quantidade, ativo, fornecedor_id, categoria_id)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    produto.nome,
                    produto.preco,
                    produto.quantidade,
                    produto.ativo,
                    produto.fornecedor_id,
                    produto.categoria_id
                )
            )
            return cursor.lastrowid

    def buscar_todos(self):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                """
                SELECT id, nome, preco, quantidade, ativo,
                       fornecedor_id, categoria_id
                FROM produtos
                """
            )
            return [Produto(*linha) for linha in cursor.fetchall()]

    def atualizar(self, id_produto, produto):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                """
                UPDATE produtos
                SET nome=?, preco=?, quantidade=?, ativo=?,
                    fornecedor_id=?, categoria_id=?
                WHERE id=?
                """,
                (
                    produto.nome,
                    produto.preco,
                    produto.quantidade,
                    produto.ativo,
                    produto.fornecedor_id,
                    produto.categoria_id,
                    id_produto
                )
            )

    def remover(self, id_produto):
        with conectar() as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "DELETE FROM produtos WHERE id=?",
                (id_produto,)
            )
