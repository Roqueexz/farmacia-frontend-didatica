import { useEffect, useState } from "react";
import ClienteRequests from "../../fetch/ClienteRequests";
import type { ClienteDTO } from "../../interface/ClienteDTO";
import TabelaClientes from "../../components/Tabelas/TabelaClientes";
import FormCliente from "../../components/Formularios/FormCliente";

export default function PClientes() {
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const lista = await ClienteRequests.listar();
      setClientes(lista);
    } catch (err: any) {
      alert(err.message || "Erro ao carregar clientes.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--red-800)" }}>
          Gerenciamento de Clientes
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Cadastro e consulta de clientes para emissão de pedidos e controle da farmácia.
        </p>
      </div>

      <TabelaClientes
        clientes={clientes}
        carregando={carregando}
        onNovoCliente={() => setModalAberto(true)}
      />

      <FormCliente
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          alert("Cliente cadastrado com sucesso!");
          carregarClientes();
        }}
      />
    </div>
  );
}
