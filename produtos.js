
const API_PRODUTOS = "/produtos";
const API_FORNECEDORES = "/fornecedores";
const API_CATEGORIAS = "/categorias";


// ==================== LISTAR PRODUTOS ====================

async function carregarProdutos() {
    const tabela = document.getElementById("lista-produtos");

    if (!tabela) return;

    try {
        const resposta = await fetch(API_PRODUTOS);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos.");
        }

        const produtos = await resposta.json();

        tabela.innerHTML = "";

        if (produtos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhum produto cadastrado.</td>
                </tr>
            `;
            return;
        }

        produtos.forEach(produto => {
            tabela.innerHTML += `
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                    <td>
                        <button onclick="verProduto(${produto.id})">
                            Detalhes
                        </button>

                        <button onclick="editarProduto(${produto.id})">
                            Editar
                        </button>

                        <button onclick="excluirProduto(${produto.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        tabela.innerHTML = `
            <tr>
                <td colspan="6">Não foi possível carregar os produtos.</td>
            </tr>
        `;
        console.error(erro);
    }
}


// ==================== CADASTRAR PRODUTO ====================

async function carregarOpcoesProduto() {
    const fornecedorSelect = document.getElementById("fornecedor_id");
    const categoriaSelect = document.getElementById("categoria_id");

    if (!fornecedorSelect || !categoriaSelect) return;

    try {
        const [respostaFornecedores, respostaCategorias] = await Promise.all([
            fetch(API_FORNECEDORES),
            fetch(API_CATEGORIAS)
        ]);

        if (!respostaFornecedores.ok || !respostaCategorias.ok) {
            throw new Error("Erro ao carregar fornecedores ou categorias.");
        }

        const fornecedores = await respostaFornecedores.json();
        const categorias = await respostaCategorias.json();

        fornecedores.forEach(fornecedor => {
            fornecedorSelect.innerHTML += `
                <option value="${fornecedor.id}">
                    ${fornecedor.nome}
                </option>
            `;
        });

        categorias.forEach(categoria => {
            categoriaSelect.innerHTML += `
                <option value="${categoria.id}">
                    ${categoria.nome}
                </option>
            `;
        });

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar fornecedores e categorias.");
    }
}


async function salvarProduto(evento) {
    evento.preventDefault();

    const id = document.getElementById("produto-id").value;

    const produto = {
        nome: document.getElementById("nome").value,
        preco: Number(document.getElementById("preco").value),
        quantidade: Number(document.getElementById("quantidade").value),
        ativo: Number(document.getElementById("ativo").value),
        fornecedor_id: Number(document.getElementById("fornecedor_id").value),
        categoria_id: Number(document.getElementById("categoria_id").value)
    };

    try {
        const resposta = await fetch(
            id ? `${API_PRODUTOS}/${id}` : API_PRODUTOS,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao salvar produto.");
        }

        alert("Produto salvo com sucesso!");
        window.location.href = "/pagina/produtos";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar o produto.");
    }
}


// ==================== EDITAR PRODUTO ====================

async function editarProduto(id) {
    window.location.href = `/pagina/produto/editar/${id}`;
}


// ==================== EXCLUIR PRODUTO ====================

async function excluirProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
        const resposta = await fetch(`${API_PRODUTOS}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto.");
        }

        alert("Produto excluído com sucesso!");
        carregarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o produto.");
    }
}


// ==================== DETALHES DO PRODUTO ====================

async function verProduto(id) {
    window.location.href = `/pagina/produto/${id}`;
}


async function carregarDetalhesProduto() {
    const container = document.getElementById("detalhes-produto");

    if (!container) return;

    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        container.innerHTML = "<p>Produto não informado.</p>";
        return;
    }

    try {
        const resposta = await fetch(`${API_PRODUTOS}/${id}`);

        if (!resposta.ok) {
            throw new Error("Produto não encontrado.");
        }

        const produto = await resposta.json();

        container.innerHTML = `
            <p><strong>ID:</strong> ${produto.id}</p>
            <p><strong>Nome:</strong> ${produto.nome}</p>
            <p><strong>Preço:</strong> R$ ${Number(produto.preco).toFixed(2)}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
            <p><strong>Status:</strong> ${produto.ativo ? "Ativo" : "Inativo"}</p>
            <p><strong>ID do fornecedor:</strong> ${produto.fornecedor_id}</p>
            <p><strong>ID da categoria:</strong> ${produto.categoria_id}</p>
        `;

    } catch (erro) {
        console.error(erro);
        container.innerHTML = "<p>Não foi possível carregar o produto.</p>";
    }
}


// ==================== INICIALIZAÇÃO ====================

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    carregarOpcoesProduto();
    carregarDetalhesProduto();

    const formulario = document.getElementById("form-produto");

    if (formulario) {
        formulario.addEventListener("submit", salvarProduto);
    }
});
