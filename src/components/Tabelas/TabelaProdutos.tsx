import { useState } from "react";
import type { ProdutoDTO } from "../../interface/ProdutoDTO";

interface Props {
  produtos: ProdutoDTO[];
  carregando: boolean;
  onNovoProduto: () => void;
  onEditarProduto: (p: ProdutoDTO) => void;
  onExcluirProduto: (id: number, nome: string) => void;
}

export default function TabelaProdutos({
  produtos,
  carregando,
  onNovoProduto,
  onEditarProduto,
  onExcluirProduto,
}: Props) {
  const [filtro, setFiltro] = useState("");
  const [somenteAlerta, setSomenteAlerta] = useState(false);

  const produtosFiltrados = produtos.filter((p) => {
    const atendeTexto = p.descricao.toLowerCase().includes(filtro.toLowerCase());
    const atendeAlerta = somenteAlerta ? p.emAlerta : true;
    return atendeTexto && atendeAlerta;
  });

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span>💊</span> Catálogo de Produtos & Medicamentos ({produtos.length})
        </h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={onNovoProduto}>
          + Novo Produto
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por descrição..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={somenteAlerta}
            onChange={(e) => setSomenteAlerta(e.target.checked)}
          />
          Mostrar apenas produtos em alerta de estoque
        </label>
      </div>

      {carregando ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Carregando produtos...</p>
      ) : produtosFiltrados.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          Nenhum produto encontrado com os filtros aplicados.
        </p>
      ) : (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>Descrição</th>
                <th>Preço Unit.</th>
                <th>Estoque Atual</th>
                <th>Mínimo</th>
                <th>Status Estoque</th>
                <th style={{ textAlign: "right", width: "160px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((p) => {
                const id = (p.idProduto || p.id_produto) as number;
                return (
                  <tr key={id}>
                    <td><strong>#{id}</strong></td>
                    <td style={{ fontWeight: 600 }}>{p.descricao}</td>
                    <td>R$ {Number(p.preco).toFixed(2)}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: p.emAlerta ? "var(--red-600)" : "inherit",
                        }}
                      >
                        {p.qtdEstoque}
                      </span>
                    </td>
                    <td>{p.qtdMinEstoque}</td>
                    <td>
                      {p.emAlerta ? (
                        <span className="badge badge-alert">Estoque Baixo</span>
                      ) : (
                        <span className="badge badge-ok">Normal</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onEditarProduto(p)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => onExcluirProduto(id, p.descricao)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
