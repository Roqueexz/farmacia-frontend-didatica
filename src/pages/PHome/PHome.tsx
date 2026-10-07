import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import ClienteRequests from "../../fetch/ClienteRequests";
import PedidoRequests from "../../fetch/PedidoRequests";
import type { ProdutoDTO } from "../../interface/ProdutoDTO";
import AlertaEstoque from "../../components/AlertaEstoque/AlertaEstoque";

export default function PHome() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [alertas, setAlertas] = useState<ProdutoDTO[]>([]);
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [totalPedidos, setTotalPedidos] = useState<number>(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        const [listaProds, listaAlertas, listaClientes, listaPedidos] =
          await Promise.all([
            ProdutoRequests.listar(),
            ProdutoRequests.listarAlertas(),
            ClienteRequests.listar(),
            PedidoRequests.listar(),
          ]);

        setProdutos(listaProds);
        setAlertas(listaAlertas);
        setTotalClientes(listaClientes.length);
        setTotalPedidos(listaPedidos.length);
      } catch (err) {
        console.error("Erro ao carregar métricas da home:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--red-800)" }}>
          Painel Farmacêutico
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
          Visão geral do inventário de medicamentos, clientes ativos e vendas da drogaria.
        </p>
      </div>

      <AlertaEstoque alertas={alertas} />

      {/* Grid de Métricas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Medicamentos & Produtos
            </span>
            <span style={{ fontSize: "1.5rem" }}>💊</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--text-main)" }}>
            {carregando ? "..." : produtos.length}
          </div>
          <Link
            to="/produtos"
            style={{ fontSize: "0.8rem", color: "var(--red-600)", fontWeight: 600, display: "inline-block", marginTop: "0.5rem" }}
          >
            Ver catálogo completo →
          </Link>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Estoque Crítico / Alertas
            </span>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--red-600)" }}>
            {carregando ? "..." : alertas.length}
          </div>
          <Link
            to="/produtos"
            style={{ fontSize: "0.8rem", color: "var(--red-600)", fontWeight: 600, display: "inline-block", marginTop: "0.5rem" }}
          >
            Repor medicamentos →
          </Link>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Clientes Registrados
            </span>
            <span style={{ fontSize: "1.5rem" }}>👥</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--text-main)" }}>
            {carregando ? "..." : totalClientes}
          </div>
          <Link
            to="/clientes"
            style={{ fontSize: "0.8rem", color: "var(--red-600)", fontWeight: 600, display: "inline-block", marginTop: "0.5rem" }}
          >
            Gerenciar clientes →
          </Link>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Total de Vendas / Pedidos
            </span>
            <span style={{ fontSize: "1.5rem" }}>🛒</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--text-main)" }}>
            {carregando ? "..." : totalPedidos}
          </div>
          <Link
            to="/pedidos"
            style={{ fontSize: "0.8rem", color: "var(--red-600)", fontWeight: 600, display: "inline-block", marginTop: "0.5rem" }}
          >
            Abrir ponto de venda →
          </Link>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-main)" }}>
          Acesso Rápido às Operações
        </h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/pedidos" className="btn btn-primary">
            🛒 Nova Venda de Balcão (PDV)
          </Link>
          <Link to="/produtos" className="btn btn-secondary">
            💊 Cadastrar Novo Medicamento
          </Link>
          <Link to="/clientes" className="btn btn-secondary">
            👥 Cadastrar Cliente
          </Link>
        </div>
      </div>
    </div>
  );
}
