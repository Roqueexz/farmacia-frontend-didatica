import type { ClienteDTO } from "../interface/ClienteDTO";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

class ClienteRequests {
  private url: string;

  constructor() {
    this.url = ${API_URL}/clientes;
  }

  async listar(): Promise<ClienteDTO[]> {
    try {
      const res = await fetch(this.url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar a lista de clientes.");
      }

      return await res.json();
    } catch (error) {
      console.error("[ClienteRequests] Erro ao listar:", error);
      throw error;
    }
  }

  async cadastrar(cliente: { nome: string; cpf: string }): Promise<{ mensagem: string }> {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao cadastrar cliente.");
      }

      return data;
    } catch (error) {
      console.error("[ClienteRequests] Erro ao cadastrar:", error);
      throw error;
    }
  }
}

export default new ClienteRequests();
