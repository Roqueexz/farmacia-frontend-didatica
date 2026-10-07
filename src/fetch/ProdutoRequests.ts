import type { ProdutoDTO } from "../interface/ProdutoDTO";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

class ProdutoRequests {
  private url: string;

  constructor() {
    this.url = ${API_URL}/produtos;
  }

  async listar(): Promise<ProdutoDTO[]> {
    try {
      const res = await fetch(this.url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar catálogo de produtos.");
      }

      return await res.json();
    } catch (error) {
      console.error("[ProdutoRequests] Erro ao listar:", error);
      throw error;
    }
  }

  async listarAlertas(): Promise<ProdutoDTO[]> {
    try {
      const res = await fetch(${this.url}/alerta, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar produtos em alerta.");
      }

      return await res.json();
    } catch (error) {
      console.error("[ProdutoRequests] Erro ao listar alertas:", error);
      throw error;
    }
  }

  async cadastrar(produto: {
    descricao: string;
    preco: number;
    qtdEstoque: number;
    qtdMinEstoque: number;
    validade?: string | null;
  }): Promise<{ mensagem: string }> {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao cadastrar produto.");
      }

      return data;
    } catch (error) {
      console.error("[ProdutoRequests] Erro ao cadastrar:", error);
      throw error;
    }
  }

  async atualizar(
    idProduto: number,
    dados: Partial<{
      descricao: string;
      preco: number;
      qtdEstoque: number;
      qtdMinEstoque: number;
      validade: string | null;
    }>
  ): Promise<{ mensagem: string }> {
    try {
      const res = await fetch(${this.url}/, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao atualizar produto.");
      }

      return data;
    } catch (error) {
      console.error([ProdutoRequests] Erro ao atualizar :, error);
      throw error;
    }
  }

  async remover(idProduto: number): Promise<{ mensagem: string }> {
    try {
      const res = await fetch(${this.url}/, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao remover produto.");
      }

      return data;
    } catch (error) {
      console.error([ProdutoRequests] Erro ao remover :, error);
      throw error;
    }
  }
}

export default new ProdutoRequests();
