import { Link, useLocation } from "react-router-dom";

export default function Navegacao() {
  const location = useLocation();

  const rotas = [
    { caminho: "/", label: "Dashboard", icone: "📊" },
    { caminho: "/produtos", label: "Produtos", icone: "💊" },
    { caminho: "/clientes", label: "Clientes", icone: "👥" },
    { caminho: "/pedidos", label: "Vendas / Pedidos", icone: "🛒" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">+</div>
          <div>
            <span className="brand-title">FARMÁCIA VIDA</span>
            <span className="brand-sub">Sistema de Gestão & Estoque</span>
          </div>
        </Link>

        <nav className="navbar-links">
          {rotas.map((r) => {
            const isActive = location.pathname === r.caminho;
            return (
              <Link
                key={r.caminho}
                to={r.caminho}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span>{r.icone}</span>
                <span>{r.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
