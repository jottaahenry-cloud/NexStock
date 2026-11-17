const API = '';

document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('ativo'));
    document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativo'));
    btn.classList.add('ativo');
    document.getElementById('secao-' + btn.dataset.secao).classList.add('ativo');
  });
});

function toast(msg, tipo = 'sucesso') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + tipo + ' visivel';
  setTimeout(() => el.classList.remove('visivel'), 3000);
}

function fecharModal(id) { document.getElementById(id).classList.remove('aberto'); }

function preencherSelect(selectId, dados, campoValor, campoTexto) {
  const select = document.getElementById(selectId);
  const valorAtual = select.value; 
  select.innerHTML = '<option value="">-- Selecione --</option>' +
    dados.map(d => `<option value="${d[campoValor]}">${d[campoTexto]}</option>`).join('');
  if (valorAtual) select.value = valorAtual;
}

async function carregarFornecedores() {
  const res = await fetch(API + '/fornecedores');
  const dados = await res.json();
  const tbody = document.getElementById('tabela-fornecedores');
  
  if (dados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="vazio">Nenhum fornecedor cadastrado</td></tr>';
  } else {
    tbody.innerHTML = dados.map(f => `
      <tr>
        <td>${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.cnpj}</td>
        <td>
          <button class="btn btn-edit" onclick='editarFornecedor(${JSON.stringify(f)})'>Editar</button>
          <button class="btn btn-del" onclick="removerFornecedor(${f.id})">Excluir</button>
        </td>
      </tr>`).join('');
  }
  preencherSelect('produto-fornecedor', dados, 'id', 'nome');
  return dados;
}

async function carregarCategorias() {
  const res = await fetch(API + '/categorias');
  const dados = await res.json();
  const tbody = document.getElementById('tabela-categorias');

  if (dados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="vazio">Nenhuma categoria cadastrada</td></tr>';
  } else {
    tbody.innerHTML = dados.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>
          <button class="btn btn-edit" onclick='editarCategoria(${JSON.stringify(c)})'>Editar</button>
          <button class="btn btn-del" onclick="removerCategoria(${c.id})">Excluir</button>
        </td>
      </tr>`).join('');
  }
  preencherSelect('produto-categoria', dados, 'id', 'nome');
  return dados;
}

async function carregarProdutos() {
  const [produtos, fornecedores, categorias] = await Promise.all([
    fetch(API + '/produtos').then(r => r.json()),
    fetch(API + '/fornecedores').then(r => r.json()),
    fetch(API + '/categorias').then(r => r.json())
  ]);

  const nomeFornecedor = id => (fornecedores.find(f => f.id === id) || {}).nome || '-';
  const nomeCategoria = id => (categorias.find(c => c.id === id) || {}).nome || '-';

  const tbody = document.getElementById('tabela-produtos');
  if (produtos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="vazio">Nenhum produto cadastrado</td></tr>';
  } else {
    tbody.innerHTML = produtos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</td>
        <td>${p.quantidade}</td>
        <td><span class="badge ${p.ativo ? 'badge-ativo' : 'badge-inativo'}">${p.ativo ? 'Ativo' : 'Inativo'}</span></td>
        <td>${nomeFornecedor(p.fornecedor_id)}</td>
        <td>${nomeCategoria(p.categoria_id)}</td>
        <td>
          <button class="btn btn-edit" onclick='editarProduto(${JSON.stringify(p)})'>Editar</button>
          <button class="btn btn-del" onclick="removerProduto(${p.id})">Excluir</button>
        </td>
      </tr>`).join('');
  }
}

async function abrirModalProduto() {
  document.getElementById('titulo-modal-produto').textContent = 'Novo Produto';
  document.getElementById('produto-id').value = '';
  document.getElementById('produto-nome').value = '';
  document.getElementById('produto-preco').value = '';
  document.getElementById('produto-quantidade').value = '';
  document.getElementById('produto-ativo').value = '1';
  
  await Promise.all([carregarFornecedores(), carregarCategorias()]);
  document.getElementById('modal-produto').classList.add('aberto');
}

function editarProduto(p) {
  document.getElementById('titulo-modal-produto').textContent = 'Editar Produto';
  document.getElementById('produto-id').value = p.id;
  document.getElementById('produto-nome').value = p.nome;
  document.getElementById('produto-preco').value = p.preco;
  document.getElementById('produto-quantidade').value = p.quantidade;
  document.getElementById('produto-ativo').value = p.ativo ? '1' : '0';
  
  Promise.all([carregarFornecedores(), carregarCategorias()]).then(() => {
    document.getElementById('produto-fornecedor').value = p.fornecedor_id;
    document.getElementById('produto-categoria').value = p.categoria_id;
    document.getElementById('modal-produto').classList.add('aberto');
  });
}

async function salvarProduto() {
  const id = document.getElementById('produto-id').value;
  const dados = {
    nome: document.getElementById('produto-nome').value.trim(),
    preco: parseFloat(document.getElementById('produto-preco').value),
    quantidade: parseInt(document.getElementById('produto-quantidade').value),
    ativo: parseInt(document.getElementById('produto-ativo').value),
    fornecedor_id: parseInt(document.getElementById('produto-fornecedor').value),
    categoria_id: parseInt(document.getElementById('produto-categoria').value)
  };

  if (!dados.nome || isNaN(dados.preco) || isNaN(dados.quantidade) || 
      isNaN(dados.fornecedor_id) || isNaN(dados.categoria_id)) {
    toast('Preencha todos os campos corretamente.', 'erro');
    return;
  }

  const url = id ? `/produtos/${id}` : '/produtos';
  const metodo = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(API + url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error();
    fecharModal('modal-produto');
    toast(id ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    carregarProdutos();
  } catch {
    toast('Erro ao salvar produto', 'erro');
  }
}

async function removerProduto(id) {
  if (!confirm('Tem certeza que deseja remover este produto?')) return;
  try {
    await fetch(API + `/produtos/${id}`, { method: 'DELETE' });
    toast('Produto removido!');
    carregarProdutos();
  } catch { toast('Erro ao remover', 'erro'); }
}

function abrirModalCategoria() {
  document.getElementById('titulo-modal-categoria').textContent = 'Nova Categoria';
  document.getElementById('categoria-id').value = '';
  document.getElementById('categoria-nome').value = '';
  document.getElementById('modal-categoria').classList.add('aberto');
}

function abrirModalCategoriaAtalho() { abrirModalCategoria(); }

function editarCategoria(c) {
  document.getElementById('titulo-modal-categoria').textContent = 'Editar Categoria';
  document.getElementById('categoria-id').value = c.id;
  document.getElementById('categoria-nome').value = c.nome;
  document.getElementById('modal-categoria').classList.add('aberto');
}

async function salvarCategoria() {
  const id = document.getElementById('categoria-id').value;
  const nome = document.getElementById('categoria-nome').value.trim();
  if (!nome) { toast('Informe o nome da categoria', 'erro'); return; }

  const url = id ? `/categorias/${id}` : '/categorias';
  const metodo = id ? 'PUT' : 'POST';

  try {
    await fetch(API + url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    });
    fecharModal('modal-categoria');
    toast(id ? 'Categoria atualizada!' : 'Categoria criada!');
    carregarCategorias();
    carregarProdutos();
  } catch { toast('Erro ao salvar categoria', 'erro'); }
}

async function removerCategoria(id) {
  if (!confirm('Remover esta categoria?')) return;
  try {
    await fetch(API + `/categorias/${id}`, { method: 'DELETE' });
    toast('Categoria removida!');
    carregarCategorias();
    carregarProdutos();
  } catch { toast('Erro ao remover', 'erro'); }
}

function abrirModalFornecedor() {
  document.getElementById('titulo-modal-fornecedor').textContent = 'Novo Fornecedor';
  document.getElementById('fornecedor-id').value = '';
  document.getElementById('fornecedor-nome').value = '';
  document.getElementById('fornecedor-cnpj').value = '';
  document.getElementById('modal-fornecedor').classList.add('aberto');
}

function abrirModalFornecedorAtalho() { abrirModalFornecedor(); }

function editarFornecedor(f) {
  document.getElementById('titulo-modal-fornecedor').textContent = 'Editar Fornecedor';
  document.getElementById('fornecedor-id').value = f.id;
  document.getElementById('fornecedor-nome').value = f.nome;
  document.getElementById('fornecedor-cnpj').value = f.cnpj;
  document.getElementById('modal-fornecedor').classList.add('aberto');
}

async function salvarFornecedor() {
  const id = document.getElementById('fornecedor-id').value;
  const dados = {
    nome: document.getElementById('fornecedor-nome').value.trim(),
    cnpj: document.getElementById('fornecedor-cnpj').value.trim()
  };
  if (!dados.nome || !dados.cnpj) { toast('Preencha todos os campos', 'erro'); return; }

  const url = id ? `/fornecedores/${id}` : '/fornecedores';
  const metodo = id ? 'PUT' : 'POST';

  try {
    await fetch(API + url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    fecharModal('modal-fornecedor');
    toast(id ? 'Fornecedor atualizado!' : 'Fornecedor criado!');
    carregarFornecedores();
    carregarProdutos();
  } catch { toast('Erro ao salvar fornecedor', 'erro'); }
}

async function removerFornecedor(id) {
  if (!confirm('Remover este fornecedor?')) return;
  try {
    await fetch(API + `/fornecedores/${id}`, { method: 'DELETE' });
    toast('Fornecedor removido!');
    carregarFornecedores();
    carregarProdutos();
  } catch { toast('Erro ao remover', 'erro'); }
}

(async function init() {
  await Promise.all([carregarFornecedores(), carregarCategorias()]);
  await carregarProdutos();
})();