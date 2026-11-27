from flask import Flask, request, jsonify, render_template, redirect, url_for
from pathlib import Path

from models import Fornecedor, Categoria, Produto
from dao import FornecedorDAO, CategoriaDAO, ProdutoDAO, inicializar_banco


# Caminhos das pastas do projeto
RAIZ_PROJETO = Path(__file__).resolve().parent.parent

app = Flask(
    __name__,
    template_folder=str(RAIZ_PROJETO / "templates"),
    static_folder=str(RAIZ_PROJETO / "static")
)

# Inicializa o banco de dados
inicializar_banco()

# Instâncias dos DAOs
fornecedor_dao = FornecedorDAO()
categoria_dao = CategoriaDAO()
produto_dao = ProdutoDAO()


# ==================== PÁGINAS ====================

@app.route("/")
def inicio():
    return redirect(url_for("pagina_produtos"))


@app.route("/pagina/produtos")
def pagina_produtos():
    return render_template("produtos.html")


@app.route("/pagina/produto/novo")
def pagina_novo_produto():
    return render_template("produto_form.html")


@app.route("/pagina/produto/editar/<int:id_produto>")
def pagina_editar_produto(id_produto):
    return render_template("produto_form.html")


@app.route("/pagina/produto/<int:id_produto>")
def pagina_detalhes_produto(id_produto):
    return render_template("produto_detalhes.html")


@app.route("/pagina/categorias")
def pagina_categorias():
    return render_template("categorias.html")


@app.route("/pagina/categoria/nova")
def pagina_nova_categoria():
    return render_template("categoria_form.html")


@app.route("/pagina/categoria/editar/<int:id_categoria>")
def pagina_editar_categoria(id_categoria):
    return render_template("categoria_form.html")


@app.route("/pagina/fornecedores")
def pagina_fornecedores():
    return render_template("fornecedores.html")


@app.route("/pagina/fornecedor/novo")
def pagina_novo_fornecedor():
    return render_template("fornecedor_form.html")


@app.route("/pagina/fornecedor/editar/<int:id_fornecedor>")
def pagina_editar_fornecedor(id_fornecedor):
    return render_template("fornecedor_form.html")


@app.route("/pagina/relatorios")
def pagina_relatorios():
    return render_template("relatorios.html")


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
    app.run(debug=True)
