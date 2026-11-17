from flask import Flask, request, jsonify
from models import Fornecedor, Categoria, Produto
from dao import FornecedorDAO, CategoriaDAO, ProdutoDAO
import sqlite3

app = Flask(__name__)

fornecedor_dao = FornecedorDAO()
categoria_dao = CategoriaDAO()
produto_dao = ProdutoDAO()


def criar_tabelas():
    with sqlite3.connect("estoque_roupas.db") as conexao:
        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fornecedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cnpj TEXT NOT NULL
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL
            )
        """)

        cursor.execute("""
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
            )
        """)
        conexao.commit()


# ==================== FORNECEDORES ====================
@app.route("/fornecedores", methods=["GET"])
def listar_fornecedores():
    return jsonify([f.to_dict() for f in fornecedor_dao.buscar_todos()])


@app.route("/fornecedores", methods=["POST"])
def criar_fornecedor():
    dados = request.json
    fornecedor = Fornecedor(None, dados["nome"], dados["cnpj"])
    id_gerado = fornecedor_dao.inserir(fornecedor)
    return jsonify({"id": id_gerado, "mensagem": "Fornecedor criado"}), 201


@app.route("/fornecedores/<int:id_fornecedor>", methods=["PUT"])
def atualizar_fornecedor(id_fornecedor):
    dados = request.json
    fornecedor = Fornecedor(id_fornecedor, dados["nome"], dados["cnpj"])
    fornecedor_dao.atualizar(id_fornecedor, fornecedor)
    return jsonify({"mensagem": "Fornecedor atualizado"})


@app.route("/fornecedores/<int:id_fornecedor>", methods=["DELETE"])
def remover_fornecedor(id_fornecedor):
    fornecedor_dao.remover(id_fornecedor)
    return jsonify({"mensagem": "Fornecedor removido"})


# ==================== CATEGORIAS ====================
@app.route("/categorias", methods=["GET"])
def listar_categorias():
    return jsonify([c.to_dict() for c in categoria_dao.buscar_todos()])


@app.route("/categorias", methods=["POST"])
def criar_categoria():
    dados = request.json
    categoria = Categoria(None, dados["nome"])
    id_gerado = categoria_dao.inserir(categoria)
    return jsonify({"id": id_gerado, "mensagem": "Categoria criada"}), 201


@app.route("/categorias/<int:id_categoria>", methods=["PUT"])
def atualizar_categoria(id_categoria):
    dados = request.json
    categoria = Categoria(id_categoria, dados["nome"])
    categoria_dao.atualizar(id_categoria, categoria)
    return jsonify({"mensagem": "Categoria atualizada"})


@app.route("/categorias/<int:id_categoria>", methods=["DELETE"])
def remover_categoria(id_categoria):
    categoria_dao.remover(id_categoria)
    return jsonify({"mensagem": "Categoria removida"})


# ==================== PRODUTOS ====================
@app.route("/produtos", methods=["GET"])
def listar_produtos():
    return jsonify([p.to_dict() for p in produto_dao.buscar_todos()])


@app.route("/produtos", methods=["POST"])
def criar_produto():
    dados = request.json
    produto = Produto(
        None,
        dados["nome"],
        dados["preco"],
        dados["quantidade"],
        dados.get("ativo", 1),
        dados["fornecedor_id"],
        dados["categoria_id"]
    )
    id_gerado = produto_dao.inserir(produto)
    return jsonify({"id": id_gerado, "mensagem": "Produto criado"}), 201


@app.route("/produtos/<int:id_produto>", methods=["PUT"])
def atualizar_produto(id_produto):
    dados = request.json
    produto = Produto(
        id_produto,
        dados["nome"],
        dados["preco"],
        dados["quantidade"],
        dados.get("ativo", 1),
        dados["fornecedor_id"],
        dados["categoria_id"]
    )
    produto_dao.atualizar(id_produto, produto)
    return jsonify({"mensagem": "Produto atualizado"})


@app.route("/produtos/<int:id_produto>", methods=["DELETE"])
def remover_produto(id_produto):
    produto_dao.remover(id_produto)
    return jsonify({"mensagem": "Produto removido"})


if __name__ == "__main__":
    criar_tabelas()
    app.run(debug=True)