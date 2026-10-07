export interface ItemPedidoDTO {
  idProduto: number;
  descricao?: string;
  qtdProduto: number;
  precoUnit: number;
}

export interface PedidoDTO {
  idVenda?: number;
  idCliente: number;
  nomeCliente?: string;
  dataVenda?: string | Date;
  total?: number;
  itens?: ItemPedidoDTO[];
}
