import { useEffect, useState } from "react";
import PedidoRequests from "../../fetch/PedidoRequests";
import ClienteRequests from "../../fetch/ClienteRequests";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import type { PedidoDTO } from "../../interface/PedidoDTO";
import type { ClienteDTO } from "../../interface/ClienteDTO";
import type { ProdutoDTO } from "../../interface/ProdutoDTO";
import TabelaPedidos from "../../components/Tabelas/TabelaPedidos";
import FormNovoPedido from "../../components/Formularios/FormNovoPedido";

export default function PPedidos() {
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [listaPedidos, listaClientes, listaProdutos] = await Promise.all([
        PedidoRequests.listar(),
        ClienteRequests.listar(),
        ProdutoRequests.listar(),
      ]);
      setPedidos(listaPedidos);
      setClientes(listaClientes);
      setProdutos(listaProdutos);
    } catch (err: any) {
      alert(err.message || "Erro ao carregar dados de pedidos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--red-800)" }}>
          Vendas & Pedidos (PDV)
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Emissão de pedidos com baixa automática de estoque, inclusão de múltiplos medicamentos e histórico.
        </p>
      </div>

      <TabelaPedidos
        pedidos={pedidos}
        carregando={carregando}
        onNovoPedido={() => setModalAberto(true)}
        onItemRemovidoSucesso={carregarDados}
      />

      <FormNovoPedido
        aberto={modalAberto}
        clientes={clientes}
        produtos={produtos}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          alert("Venda realizada com sucesso! O estoque foi debitado.");
          carregarDados();
        }}
      />
    </div>
  );
}
