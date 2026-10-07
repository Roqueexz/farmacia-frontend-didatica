import type { ProdutoDTO } from "../../interface/ProdutoDTO";
import { Link } from "react-router-dom";

interface Props {
  alertas: ProdutoDTO[];
}

export default function AlertaEstoque({ alertas }: Props) {
  if (!alertas || alertas.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--red-50)",
        border: "1px solid var(--red-200)",
        borderRadius: "var(--radius-md)",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.5rem" }}>⚠️</span>
        <div>
          <h4 style={{ color: "var(--red-800)", fontSize: "0.95rem", fontWeight: 700 }}>
            Alerta de Estoque Baixo! ({alertas.length}{" "}
            {alertas.length === 1 ? "produto crítico" : "produtos críticos"})
          </h4>
          <p style={{ color: "var(--red-700)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
            {alertas.slice(0, 3).map((p) => p.descricao).join(", ")}
            {alertas.length > 3 ? "..." : ""}
          </p>
        </div>
      </div>
      <Link to="/produtos" className="btn btn-danger btn-sm">
        Gerenciar Estoque
      </Link>
    </div>
  );
}
