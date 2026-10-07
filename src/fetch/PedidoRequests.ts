import type { PedidoDTO, ItemPedidoDTO } from "../interface/PedidoDTO";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

class PedidoRequests {
  private url: string;

  constructor() {
    this.url = ${API_URL}/pedidos;
  }

  async listar(): Promise<PedidoDTO[]> {
    try {
      const res = await fetch(this.url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar a lista de pedidos.");
      }

      return await res.json();
    } catch (error) {
      console.error("[PedidoRequests] Erro ao listar:", error);
      throw error;
    }
  }

  async obter(idVenda: number): Promise<{
    pedido: { idVenda: number; idCliente: number; dataVenda: string; nomeCliente?: string };
    itens: ItemPedidoDTO[];
  }> {
    try {
      const res = await fetch(${this.url}/, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao obter detalhes do pedido.");
      }

      return data;
    } catch (error) {
      console.error([PedidoRequests] Erro ao obter pedido :, error);
      throw error;
    }
  }

  async criar(idCliente: number, itens: ItemPedidoDTO[]): Promise<{
    idVenda: number;
    mensagem: string;
    totalItens: number;
  }> {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCliente, itens }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao registrar pedido.");
      }

      return data;
    } catch (error) {
      console.error("[PedidoRequests] Erro ao criar pedido:", error);
      throw error;
    }
  }

  async listarItens(idVenda: number): Promise<ItemPedidoDTO[]> {
    try {
      const res = await fetch(${this.url}//itens, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao listar itens do pedido.");
      }

      return await res.json();
    } catch (error) {
      console.error([PedidoRequests] Erro ao listar itens de :, error);
      throw error;
    }
  }

  async removerItem(idVenda: number, idProduto: number): Promise<{ mensagem: string }> {
    try {
      const res = await fetch(${API_URL}/itens//, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao remover item do pedido.");
      }

      return data;
    } catch (error) {
      console.error([PedidoRequests] Erro ao remover item da venda :, error);
      throw error;
    }
  }
}

export default new PedidoRequests();
