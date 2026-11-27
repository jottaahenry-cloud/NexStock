
const API_PRODUTOS = "/produtos";
const API_CATEGORIAS = "/categorias";
const API_FORNECEDORES = "/fornecedores";

function escaparTexto(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


// ==================== CARREGAR RELATÓRIOS ====================

async function carregarRelatorios() {
    try {
        const [resProdutos, resCategorias, resFornecedores] = await Promise.all([
            fetch(API_PRODUTOS),
            fetch(API_CATEGORIAS),
            fetch(API_FORNECEDORES)
        ]);

        if (!resProdutos.ok || !resCategorias.ok || !resFornecedores.ok) {
            throw new Error("Erro ao buscar dados dos relatórios.");
        }

        const produtos = await resProdutos.json();
        const categorias = await resCategorias.json();
        const fornecedores = await resFornecedores.json();

        const totalEstoque = produtos.reduce(
            (total, produto) => total + Number(produto.quantidade),
            0
        );

        document.getElementById("total-produtos").textContent = produtos.length;
        document.getElementById("total-categorias").textContent = categorias.length;
        document.getElementById("total-fornecedores").textContent = fornecedores.length;
        document.getElementById("quantidade-estoque").textContent = totalEstoque;

        carregarProdutosBaixoEstoque(produtos);

    } catch (erro) {
        console.error(erro);

        document.getElementById("total-produtos").textContent = "Erro";
        document.getElementById("total-categorias").textContent = "Erro";
        document.getElementById("total-fornecedores").textContent = "Erro";
        document.getElementById("quantidade-estoque").textContent = "Erro";

        const tabela = document.getElementById("lista-baixo-estoque");

        if (tabela) {
            tabela.innerHTML = `
                <tr><td colspan="3">Não foi possível carregar os dados.</td></tr>
            `;
        }
    }
}


// ==================== PRODUTOS COM BAIXO ESTOQUE ====================

function carregarProdutosBaixoEstoque(produtos) {
    const tabela = document.getElementById("lista-baixo-estoque");
    if (!tabela) return;

    // Considera baixo estoque quando há 5 unidades ou menos.
    const produtosBaixoEstoque = produtos.filter(
        produto => Number(produto.quantidade) <= 5 && Number(produto.ativo) === 1
    );

    tabela.innerHTML = "";

    if (produtosBaixoEstoque.length === 0) {
        tabela.innerHTML = `
            <tr><td colspan="3">Nenhum produto com baixo estoque.</td></tr>
        `;
        return;
    }

    produtosBaixoEstoque.forEach(produto => {
        tabela.innerHTML += `
            <tr>
                <td>${escaparTexto(produto.nome)}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${Number(produto.preco).toFixed(2)}</td>
            </tr>
        `;
    });
}


// ==================== INICIALIZAÇÃO ====================

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("total-produtos")) {
        carregarRelatorios();
    }
});
