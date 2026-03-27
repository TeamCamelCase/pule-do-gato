import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FeedQuente from './pages/FeedQuente';
import DetalheJogo from './pages/DetalheJogo';
import SimuladorInterativo from './pages/SimuladorInterativo';
import Zebras from './pages/Zebras';
import JogadorDetalhe from './pages/PerfilJogador';

// Criamos um componente provisório para a rota de jogos quentes não dar erro
function QuentesPlaceholder() {
  return <div className="p-8 text-center text-neon text-2xl">🔥 Feed de Jogos em breve...</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* O Layout envolve todas as telas dentro dele */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quentes" element={<FeedQuente />} />
          <Route path="/jogo/:id" element={<DetalheJogo />} />
          <Route path="/simular" element={<SimuladorInterativo />} />
          <Route path="/zebras" element={<Zebras />} />
          <Route path="/jogador/:id" element={<JogadorDetalhe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;