import { useState } from "react";
import ClienteRequests from "../../fetch/ClienteRequests";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSucesso: () => void;
}

export default function FormCliente({ aberto, onFechar, onSucesso }: Props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || !cpf.trim()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSalvando(true);
      await ClienteRequests.cadastrar({
        nome: nome.trim(),
        cpf: cpf.trim(),
      });
      setNome("");
      setCpf("");
      onSucesso();
      onFechar();
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar cliente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Novo Cliente</h3>
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
              <label className="form-label">Nome Completo *</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos Drummond"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF (11 a 14 dígitos) *</label>
              <input
                type="text"
                className="form-control"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Ex: 12345678901 ou 123.456.789-01"
                required
              />
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
              {salvando ? "Cadastrando..." : "Cadastrar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
