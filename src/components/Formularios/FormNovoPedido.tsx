import { useState } from "react";
import PedidoRequests from "../../fetch/PedidoRequests";
import type { ClienteDTO } from "../../interface/ClienteDTO";
import type { ProdutoDTO } from "../../interface/ProdutoDTO";
import type { ItemPedidoDTO } from "../../interface/PedidoDTO";

interface Props {
  aberto: boolean;
  clientes: ClienteDTO[];
  produtos: ProdutoDTO[];
  onFechar: () => void;
  onSucesso: () => void;
}

export default function FormNovoPedido({
  aberto,
  clientes,
  produtos,
  onFechar,
  onSucesso,
}: Props) {
  const [idCliente, setIdCliente] = useState<number | "">("");
  const [itens, setItens] = useState<ItemPedidoDTO[]>([]);
  const [idProdutoSelecionado, setIdProdutoSelecionado] = useState<number | "">("");
  const [qtdSelecionada, setQtdSelecionada] = useState<number>(1);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const handleAdicionarItem = () => {
    setErro(null);
    if (!idProdutoSelecionado) {
      setErro("Selecione um produto.");
      return;
    }
    if (qtdSelecionada <= 0) {
      setErro("A quantidade deve ser maior que zero.");
      return;
    }

    const prod = produtos.find(
      (p) => (p.idProduto || p.id_produto) === Number(idProdutoSelecionado)
    );
    if (!prod) {
      setErro("Produto não encontrado.");
      return;
    }

    if (qtdSelecionada > prod.qtdEstoque) {
      setErro(`Estoque insuficiente! Saldo atual deste produto: ${prod.qtdEstoque}`);
      return;
    }

    // Se item já estiver na lista, soma a quantidade
    const indexExistente = itens.findIndex((i) => i.idProduto === prod.idProduto || i.idProduto === prod.id_produto);
    if (indexExistente >= 0) {
      const novaQtd = itens[indexExistente].qtdProduto + qtdSelecionada;
      if (novaQtd > prod.qtdEstoque) {
        setErro(`Quantidade somada (${novaQtd}) excede o estoque disponível (${prod.qtdEstoque}).`);
        return;
      }
      const copia = [...itens];
      copia[indexExistente].qtdProduto = novaQtd;
      setItens(copia);
    } else {
      setItens([
        ...itens,
        {
          idProduto: (prod.idProduto || prod.id_produto) as number,
          descricao: prod.descricao,
          qtdProduto: qtdSelecionada,
          precoUnit: Number(prod.preco),
        },
      ]);
    }

    setIdProdutoSelecionado("");
    setQtdSelecionada(1);
  };

  const handleRemoverItemLista = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const totalGeral = itens.reduce(
    (acc, item) => acc + item.qtdProduto * item.precoUnit,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!idCliente) {
      setErro("Selecione um cliente para a venda.");
      return;
    }

    if (itens.length === 0) {
      setErro("Adicione pelo menos um medicamento/item ao pedido.");
      return;
    }

    try {
      setSalvando(true);
      await PedidoRequests.criar(Number(idCliente), itens);
      setItens([]);
      setIdCliente("");
      onSucesso();
      onFechar();
    } catch (err: any) {
      setErro(err.message || "Erro ao criar pedido.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "680px" }}>
        <div className="modal-header">
          <h3>Nova Venda / Pedido Farmacêutico</h3>
          <button
            type="button"
            onClick={onFechar}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {erro && (
              <div
                style={{
                  background: "var(--red-100)",
                  color: "var(--red-800)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "1rem",
                  fontSize: "0.85rem",
                }}
              >
                {erro}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Selecione o Cliente *</label>
              <select
                className="form-control"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value ? Number(e.target.value) : "")}
                required
              >
                <option value="">-- Selecione o Cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nome} (CPF: {c.cpf})
                  </option>
                ))}
              </select>
            </div>

            {/* Adição de itens */}
            <div
              style={{
                border: "1px dashed var(--border-light)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                marginBottom: "1.25rem",
                backgroundColor: "#fdfdfd",
              }}
            >
              <h4 style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--text-main)" }}>
                Adicionar Medicamentos ao Carrinho
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr auto", gap: "0.5rem", alignItems: "end" }}>
                <div>
                  <label className="form-label">Medicamento</label>
                  <select
                    className="form-control"
                    value={idProdutoSelecionado}
                    onChange={(e) =>
                      setIdProdutoSelecionado(e.target.value ? Number(e.target.value) : "")
                    }
                  >
                    <option value="">-- Selecione o Medicamento --</option>
                    {produtos.map((p) => {
                      const id = p.idProduto || p.id_produto;
                      return (
                        <option key={id} value={id}>
                          {p.descricao} - R$ {Number(p.preco).toFixed(2)} (Estoque: {p.qtdEstoque})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="form-label">Qtd</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={qtdSelecionada}
                    onChange={(e) => setQtdSelecionada(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAdicionarItem}
                  style={{ alignSelf: "end", height: "38px" }}
                >
                  + Inserir
                </button>
              </div>
            </div>

            {/* Lista de itens no pedido */}
            <div>
              <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>Itens Selecionados</h4>
              {itens.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Nenhum item adicionado ainda.
                </p>
              ) : (
                <div className="table-container">
                  <table className="app-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Preço Unit.</th>
                        <th>Subtotal</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.descricao || `Produto #${it.idProduto}`}</td>
                          <td>{it.qtdProduto}</td>
                          <td>R$ {Number(it.precoUnit).toFixed(2)}</td>
                          <td>R$ {(it.qtdProduto * it.precoUnit).toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoverItemLista(idx)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totalizador */}
            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--red-700)" }}>
                Total: R$ {totalGeral.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onFechar}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={salvando || itens.length === 0}
            >
              {salvando ? "Processando Venda..." : "Concluir Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
