import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DetalheJogo from "./pages/DetalheJogo";
import FeedQuente from "./pages/FeedQuente";
import Home from "./pages/Home";
import JogadorDetalhe from "./pages/PerfilJogador";
import SimuladorInterativo from "./pages/SimuladorInterativo";
import Zebras from "./pages/Zebras";

function App() {
  return (
    <Router>
      <Routes>
        {/* O Layout envolve todas as telas dentro dele */}
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/quentes" element={<FeedQuente />} />
          <Route path="/jogo/:id" element={<DetalheJogo />} />
          <Route path="/simular" element={<SimuladorInterativo />} />
          <Route path="/zebras" element={<Zebras />} />
          <Route path="/jogadores/:id" element={<JogadorDetalhe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
