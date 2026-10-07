import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navegacao from "./components/Navegacao/Navegacao";
import Rodape from "./components/Rodape/Rodape";
import PHome from "./pages/PHome/PHome";
import PProdutos from "./pages/PProdutos/PProdutos";
import PClientes from "./pages/PClientes/PClientes";
import PPedidos from "./pages/PPedidos/PPedidos";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navegacao />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<PHome />} />
            <Route path="/produtos" element={<PProdutos />} />
            <Route path="/clientes" element={<PClientes />} />
            <Route path="/pedidos" element={<PPedidos />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Rodape />
      </div>
    </BrowserRouter>
  );
}

export default App;
