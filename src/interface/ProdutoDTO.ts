export interface ProdutoDTO {
  idProduto?: number;
  id_produto?: number;
  descricao: string;
  validade?: string | Date | null;
  preco: number;
  qtdEstoque: number;
  qtdMinEstoque: number;
  emAlerta?: boolean;
}
