
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


// ==================== LISTAR FORNECEDORES ====================

async function carregarFornecedores() {
    const tabela = document.getElementById("lista-fornecedores");
    if (!tabela) return;

    try {
        const resposta = await fetch(API_FORNECEDORES);
        if (!resposta.ok) throw new Error("Erro ao buscar fornecedores.");

        const fornecedores = await resposta.json();
        tabela.innerHTML = "";

        if (fornecedores.length === 0) {
            tabela.innerHTML = `
                <tr><td colspan="4">Nenhum fornecedor cadastrado.</td></tr>
            `;
            return;
        }

        fornecedores.forEach(fornecedor => {
            tabela.innerHTML += `
                <tr>
                    <td>${fornecedor.id}</td>
                    <td>${escaparTexto(fornecedor.nome)}</td>
                    <td>${escaparTexto(fornecedor.cnpj)}</td>
                    <td>
                        <button onclick="editarFornecedor(${fornecedor.id})">Editar</button>
                        <button onclick="excluirFornecedor(${fornecedor.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error(erro);
        tabela.innerHTML = `
            <tr><td colspan="4">Erro ao carregar fornecedores.</td></tr>
        `;
    }
}


// ==================== SALVAR FORNECEDOR ====================

async function salvarFornecedor(evento) {
    evento.preventDefault();

    const id = document.getElementById("fornecedor-id").value;

    const fornecedor = {
        nome: document.getElementById("nome").value.trim(),
        cnpj: document.getElementById("cnpj").value.trim()
    };

    try {
        const resposta = await fetch(
            id ? `${API_FORNECEDORES}/${id}` : API_FORNECEDORES,
            {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fornecedor)
            }
        );

        if (!resposta.ok) throw new Error("Erro ao salvar fornecedor.");

        alert("Fornecedor salvo com sucesso!");
        window.location.href = "/pagina/fornecedores";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar o fornecedor.");
    }
}


// ==================== EDITAR FORNECEDOR ====================

function editarFornecedor(id) {
    window.location.href = `/pagina/fornecedor/editar/${id}`;
}

async function prepararFormularioFornecedor() {
    const formulario = document.getElementById("form-fornecedor");
    if (!formulario) return;

    const partes = window.location.pathname.split("/");
    const indiceEditar = partes.indexOf("editar");
    const id = indiceEditar >= 0 ? partes[indiceEditar + 1] : null;

    if (id) {
        try {
            const resposta = await fetch(API_FORNECEDORES);
            if (!resposta.ok) throw new Error("Erro ao buscar fornecedores.");

            const fornecedores = await resposta.json();
            const fornecedor = fornecedores.find(f => String(f.id) === String(id));

            if (!fornecedor) throw new Error("Fornecedor não encontrado.");

            document.getElementById("fornecedor-id").value = fornecedor.id;
            document.getElementById("nome").value = fornecedor.nome;
            document.getElementById("cnpj").value = fornecedor.cnpj;
            document.getElementById("titulo-formulario").textContent = "Editar fornecedor";

        } catch (erro) {
            console.error(erro);
            alert("Não foi possível carregar o fornecedor.");
        }
    }

    formulario.addEventListener("submit", salvarFornecedor);
}


// ==================== EXCLUIR FORNECEDOR ====================

async function excluirFornecedor(id) {
    if (!confirm("Deseja realmente excluir este fornecedor?")) return;

    try {
        const resposta = await fetch(`${API_FORNECEDORES}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) throw new Error("Erro ao excluir fornecedor.");

        alert("Fornecedor excluído com sucesso!");
        carregarFornecedores();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o fornecedor. Verifique se existem produtos vinculados.");
    }
}


// ==================== INICIALIZAÇÃO ====================

document.addEventListener("DOMContentLoaded", () => {
    carregarFornecedores();
    prepararFormularioFornecedor();
});
