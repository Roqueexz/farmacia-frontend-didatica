import { useState } from "react";
import type { PedidoDTO } from "../../interface/PedidoDTO";
import PedidoRequests from "../../fetch/PedidoRequests";

interface Props {
  pedidos: PedidoDTO[];
  carregando: boolean;
  onNovoPedido: () => void;
  onItemRemovidoSucesso?: () => void;
}

export default function TabelaPedidos({
  pedidos,
  carregando,
  onNovoPedido,
  onItemRemovidoSucesso,
}: Props) {
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [removerCarregando, setRemoverCarregando] = useState(false);

  const handleVerDetalhes = async (idVenda: number) => {
    try {
      setCarregandoDetalhe(true);
      const dados = await PedidoRequests.obter(idVenda);
      setPedidoSelecionado(dados);
    } catch (err: any) {
      alert(err.message || "Erro ao carregar itens do pedido.");
    } finally {
      setCarregandoDetalhe(false);
    }
  };

  const handleRemoverItemVenda = async (idVenda: number, idProduto: number) => {
    if (!window.confirm("Deseja realmente remover este item do pedido?")) return;
    try {
      setRemoverCarregando(true);
      await PedidoRequests.removerItem(idVenda, idProduto);
      alert("Item removido com sucesso!");
      handleVerDetalhes(idVenda);
      if (onItemRemovidoSucesso) onItemRemovidoSucesso();
    } catch (err: any) {
      alert(err.message || "Erro ao remover item.");
    } finally {
      setRemoverCarregando(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span>🛒</span> Pedidos & Vendas Realizadas ({pedidos.length})
        </h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={onNovoPedido}>
          + Nova Venda (PDV)
        </button>
      </div>

      {carregando ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Carregando vendas...</p>
      ) : pedidos.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Nenhum pedido registrado.</p>
      ) : (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Venda #</th>
                <th>Cliente</th>
                <th>Data da Venda</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const dataFormatada = p.dataVenda
                  ? new Date(p.dataVenda).toLocaleString("pt-BR")
                  : "-";
                return (
                  <tr key={p.idVenda}>
                    <td><strong>#{p.idVenda}</strong></td>
                    <td style={{ fontWeight: 600 }}>{p.nomeCliente || `Cliente #${p.idCliente}`}</td>
                    <td>{dataFormatada}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => p.idVenda && handleVerDetalhes(p.idVenda)}
                      >
                        Ver Detalhes / Itens
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalhes do Pedido */}
      {pedidoSelecionado && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "650px" }}>
            <div className="modal-header">
              <h3>Detalhes da Venda #{pedidoSelecionado.pedido?.idVenda}</h3>
              <button
                type="button"
                onClick={() => setPedidoSelecionado(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Cliente:</strong> {pedidoSelecionado.pedido?.nomeCliente || `#${pedidoSelecionado.pedido?.idCliente}`}
              </p>
              <p style={{ marginBottom: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                <strong>Data:</strong> {new Date(pedidoSelecionado.pedido?.dataVenda).toLocaleString("pt-BR")}
              </p>

              <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>Itens Inclusos</h4>
              {carregandoDetalhe ? (
                <p>Atualizando itens...</p>
              ) : pedidoSelecionado.itens?.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Nenhum item restante nesta venda.</p>
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
                      {pedidoSelecionado.itens.map((it: any) => (
                        <tr key={it.idProduto}>
                          <td>{it.descricao || `Produto #${it.idProduto}`}</td>
                          <td>{it.qtdProduto}</td>
                          <td>R$ {Number(it.precoUnit).toFixed(2)}</td>
                          <td>R$ {(it.qtdProduto * it.precoUnit).toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              disabled={removerCarregando}
                              onClick={() => handleRemoverItemVenda(pedidoSelecionado.pedido.idVenda, it.idProduto)}
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPedidoSelecionado(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
