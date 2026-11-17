class Fornecedor:
    def __init__(self, id, nome, cnpj):
        self.id = id
        self.nome = nome
        self.cnpj = cnpj

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cnpj": self.cnpj
        }


class Categoria:
    def __init__(self, id, nome):
        self.id = id
        self.nome = nome

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome
        }


class Produto:
    def __init__(self, id, nome, preco, quantidade, ativo, fornecedor_id, categoria_id):
        self.id = id
        self.nome = nome
        self.preco = preco
        self.quantidade = quantidade
        self.ativo = ativo
        self.fornecedor_id = fornecedor_id
        self.categoria_id = categoria_id

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "preco": self.preco,
            "quantidade": self.quantidade,
            "ativo": self.ativo,
            "fornecedor_id": self.fornecedor_id,
            "categoria_id": self.categoria_id
        }