import type { ClienteDTO } from "../../interface/ClienteDTO";

interface Props {
  clientes: ClienteDTO[];
  carregando: boolean;
  onNovoCliente: () => void;
}

export default function TabelaClientes({ clientes, carregando, onNovoCliente }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span>👥</span> Clientes Cadastrados ({clientes.length})
        </h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={onNovoCliente}>
          + Novo Cliente
        </button>
      </div>

      {carregando ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Carregando clientes...</p>
      ) : clientes.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Nenhum cliente cadastrado.</p>
      ) : (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Nome Completo</th>
                <th>CPF</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id_cliente}>
                  <td><strong>#{c.id_cliente}</strong></td>
                  <td>{c.nome}</td>
                  <td><code>{c.cpf}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
