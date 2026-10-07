import { useEffect, useState } from "react";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../interface/ProdutoDTO";
import TabelaProdutos from "../../components/Tabelas/TabelaProdutos";
import FormProduto from "../../components/Formularios/FormProduto";
import AlertaEstoque from "../../components/AlertaEstoque/AlertaEstoque";

export default function PProdutos() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [alertas, setAlertas] = useState<ProdutoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoDTO | null>(null);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const [lista, listaAlertas] = await Promise.all([
        ProdutoRequests.listar(),
        ProdutoRequests.listarAlertas(),
      ]);
      setProdutos(lista);
      setAlertas(listaAlertas);
    } catch (err: any) {
      alert(err.message || "Erro ao carregar catálogo de produtos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleNovo = () => {
    setProdutoEmEdicao(null);
    setModalAberto(true);
  };

  const handleEditar = (prod: ProdutoDTO) => {
    setProdutoEmEdicao(prod);
    setModalAberto(true);
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (!window.confirm(`Deseja realmente excluir o medicamento/produto "${nome}"?`)) {
      return;
    }
    try {
      const res = await ProdutoRequests.remover(id);
      alert(res.mensagem || "Produto excluído com sucesso!");
      carregarProdutos();
    } catch (err: any) {
      alert(err.message || "Erro ao remover produto.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--red-800)" }}>
          Controle de Medicamentos & Estoque
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Cadastro, alteração de preços, acompanhamento de estoque mínimo e reposição.
        </p>
      </div>

      <AlertaEstoque alertas={alertas} />

      <TabelaProdutos
        produtos={produtos}
        carregando={carregando}
        onNovoProduto={handleNovo}
        onEditarProduto={handleEditar}
        onExcluirProduto={handleExcluir}
      />

      <FormProduto
        aberto={modalAberto}
        produtoEdicao={produtoEmEdicao}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          alert("Produto gravado com sucesso!");
          carregarProdutos();
        }}
      />
    </div>
  );
}
