
const API_CATEGORIAS = "/categorias";

function escaparTexto(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


// ==================== LISTAR CATEGORIAS ====================

async function carregarCategorias() {
    const tabela = document.getElementById("lista-categorias");
    if (!tabela) return;

    try {
        const resposta = await fetch(API_CATEGORIAS);
        if (!resposta.ok) throw new Error("Erro ao buscar categorias.");

        const categorias = await resposta.json();
        tabela.innerHTML = "";

        if (categorias.length === 0) {
            tabela.innerHTML = `
                <tr><td colspan="3">Nenhuma categoria cadastrada.</td></tr>
            `;
            return;
        }

        categorias.forEach(categoria => {
            tabela.innerHTML += `
                <tr>
                    <td>${categoria.id}</td>
                    <td>${escaparTexto(categoria.nome)}</td>
                    <td>
                        <button onclick="editarCategoria(${categoria.id})">Editar</button>
                        <button onclick="excluirCategoria(${categoria.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error(erro);
        tabela.innerHTML = `
            <tr><td colspan="3">Erro ao carregar categorias.</td></tr>
        `;
    }
}


// ==================== SALVAR CATEGORIA ====================

async function salvarCategoria(evento) {
    evento.preventDefault();

    const id = document.getElementById("categoria-id").value;
    const categoria = {
        nome: document.getElementById("nome").value.trim()
    };

    try {
        const resposta = await fetch(
            id ? `${API_CATEGORIAS}/${id}` : API_CATEGORIAS,
            {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoria)
            }
        );

        if (!resposta.ok) throw new Error("Erro ao salvar categoria.");

        alert("Categoria salva com sucesso!");
        window.location.href = "/pagina/categorias";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar a categoria.");
    }
}


// ==================== EDITAR CATEGORIA ====================

function editarCategoria(id) {
    window.location.href = `/pagina/categoria/editar/${id}`;
}

async function prepararFormularioCategoria() {
    const formulario = document.getElementById("form-categoria");
    if (!formulario) return;

    const partes = window.location.pathname.split("/");
    const indiceEditar = partes.indexOf("editar");
    const id = indiceEditar >= 0 ? partes[indiceEditar + 1] : null;

    if (id) {
        try {
            const resposta = await fetch(API_CATEGORIAS);
            if (!resposta.ok) throw new Error("Erro ao buscar categorias.");

            const categorias = await resposta.json();
            const categoria = categorias.find(c => String(c.id) === String(id));

            if (!categoria) throw new Error("Categoria não encontrada.");

            document.getElementById("categoria-id").value = categoria.id;
            document.getElementById("nome").value = categoria.nome;
            document.getElementById("titulo-formulario").textContent = "Editar categoria";

        } catch (erro) {
            console.error(erro);
            alert("Não foi possível carregar a categoria.");
        }
    }

    formulario.addEventListener("submit", salvarCategoria);
}


// ==================== EXCLUIR CATEGORIA ====================

async function excluirCategoria(id) {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    try {
        const resposta = await fetch(`${API_CATEGORIAS}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) throw new Error("Erro ao excluir categoria.");

        alert("Categoria excluída com sucesso!");
        carregarCategorias();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir a categoria. Verifique se existem produtos vinculados.");
    }
}


// ==================== INICIALIZAÇÃO ====================

document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
    prepararFormularioCategoria();
});
