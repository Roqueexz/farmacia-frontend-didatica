import { useState, useEffect } from "react";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../interface/ProdutoDTO";

interface Props {
  aberto: boolean;
  produtoEdicao?: ProdutoDTO | null;
  onFechar: () => void;
  onSucesso: () => void;
}

export default function FormProduto({
  aberto,
  produtoEdicao,
  onFechar,
  onSucesso,
}: Props) {
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [qtdEstoque, setQtdEstoque] = useState("");
  const [qtdMinEstoque, setQtdMinEstoque] = useState("");
  const [validade, setValidade] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (produtoEdicao) {
      setDescricao(produtoEdicao.descricao || "");
      setPreco(produtoEdicao.preco !== undefined ? String(produtoEdicao.preco) : "");
      setQtdEstoque(
        produtoEdicao.qtdEstoque !== undefined ? String(produtoEdicao.qtdEstoque) : ""
      );
      setQtdMinEstoque(
        produtoEdicao.qtdMinEstoque !== undefined
          ? String(produtoEdicao.qtdMinEstoque)
          : ""
      );
      if (produtoEdicao.validade) {
        const d = new Date(produtoEdicao.validade);
        if (!isNaN(d.getTime())) {
          setValidade(d.toISOString().substring(0, 10));
        } else {
          setValidade("");
        }
      } else {
        setValidade("");
      }
    } else {
      setDescricao("");
      setPreco("");
      setQtdEstoque("");
      setQtdMinEstoque("");
      setValidade("");
    }
  }, [produtoEdicao, aberto]);

  if (!aberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const precoNum = parseFloat(preco);
    const qtdEstoqueNum = parseInt(qtdEstoque, 10);
    const qtdMinNum = parseInt(qtdMinEstoque, 10);

    if (isNaN(precoNum) || precoNum < 0) {
      setErro("Informe um preço unitário válido.");
      return;
    }
    if (isNaN(qtdEstoqueNum) || qtdEstoqueNum < 0) {
      setErro("Informe uma quantidade de estoque válida.");
      return;
    }
    if (isNaN(qtdMinNum) || qtdMinNum < 0) {
      setErro("Informe uma quantidade mínima de estoque válida.");
      return;
    }

    try {
      setSalvando(true);
      const id = produtoEdicao?.idProduto || produtoEdicao?.id_produto;

      if (id) {
        await ProdutoRequests.atualizar(id, {
          descricao: descricao.trim(),
          preco: precoNum,
          qtdEstoque: qtdEstoqueNum,
          qtdMinEstoque: qtdMinNum,
          validade: validade || null,
        });
      } else {
        await ProdutoRequests.cadastrar({
          descricao: descricao.trim(),
          preco: precoNum,
          qtdEstoque: qtdEstoqueNum,
          qtdMinEstoque: qtdMinNum,
          validade: validade || null,
        });
      }

      onSucesso();
      onFechar();
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{produtoEdicao ? "Editar Medicamento/Produto" : "Novo Medicamento/Produto"}</h3>
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
              <label className="form-label">Descrição / Nome do Produto *</label>
              <input
                type="text"
                className="form-control"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Paracetamol 750mg c/ 20 comp"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Preço Unitário (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data de Validade</label>
                <input
                  type="date"
                  className="form-control"
                  value={validade}
                  onChange={(e) => setValidade(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Estoque Atual *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={qtdEstoque}
                  onChange={(e) => setQtdEstoque(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estoque Mínimo *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={qtdMinEstoque}
                  onChange={(e) => setQtdMinEstoque(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
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
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando
                ? "Gravando..."
                : produtoEdicao
                ? "Salvar Alterações"
                : "Cadastrar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
