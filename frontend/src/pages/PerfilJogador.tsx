import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Target, Zap, Activity, ShieldAlert } from 'lucide-react';

export default function JogadorDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [jogador, setJogador] = useState<any>(null);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        // Usamos o nome do jogador ou ID para buscar no seu novo serviço de scouting
        const response = await fetch(`http://localhost:8000/jogadores/${id}/perfil`);
        const data = await response.json();
        setJogador(data);
      } catch (error) {
        console.error("Erro ao carregar scouting:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarPerfil();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto min-h-[calc(100dvh-80px)] px-4 mt-4 md:mt-8 pb-28 animate-fade-in-up">
      
      {/* Botão Voltar */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white mb-4 w-fit transition-colors font-medium">
        <ChevronLeft size={20} /> Voltar
      </button>

      {/* HEADER DO JOGADOR (Estilo Pôster) */}
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-6 border border-dark-border shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {/* Imagem de Fundo/Jogador */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-60 mix-blend-luminosity"
          style={{ backgroundImage: `url(${jogador.foto})` }}
        />
        {/* Gradiente escuro para dar leitura ao texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        
        {/* Informações sobrepostas na imagem */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center">
          <span className="bg-neon text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(204,255,0,0.4)]">
            Jogador Destaque
          </span>
          <h2 className="text-white font-heading text-6xl tracking-wider leading-none mb-1">{jogador.nome}</h2>
          <p className="text-gray-400 uppercase tracking-widest text-sm font-medium">{jogador.time}</p>
        </div>
      </div>

      {/* GRID DE CARACTERÍSTICAS FÍSICAS (Igual ao Figma) */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Idade</span>
          <span className="text-white font-bold text-lg">{jogador.idade}</span>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Peso</span>
          <span className="text-white font-bold text-lg">{jogador.peso}</span>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Altura</span>
          <span className="text-white font-bold text-lg">{jogador.altura}</span>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Posição</span>
          <span className="text-white font-bold text-sm truncate w-full">{jogador.posicao}</span>
        </div>
      </div>

      {/* MÉTRICAS AVANÇADAS (Player Props) */}
      <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
        <Target size={20} className="text-neon" /> Projeção da Partida
      </h3>
      
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 mb-6 space-y-4">
        <div className="flex justify-between items-center border-b border-dark-border/50 pb-3">
          <span className="text-gray-400 text-sm">Gols Esperados (xG)</span>
          <span className="text-neon font-bold text-xl">{jogador.stats.xg}</span>
        </div>
        <div className="flex justify-between items-center border-b border-dark-border/50 pb-3">
          <span className="text-gray-400 text-sm">Chutes no Alvo (Média)</span>
          <span className="text-white font-bold text-lg">{jogador.stats.chutes_alvo}</span>
        </div>
        <div className="flex justify-between items-center border-b border-dark-border/50 pb-3">
          <span className="text-gray-400 text-sm">Taxa de Conversão</span>
          <span className="text-white font-bold text-lg">{jogador.stats.conversao}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm flex items-center gap-1">
            <ShieldAlert size={14} className="text-yellow-500" /> Risco de Cartão
          </span>
          <span className="text-yellow-500 font-bold text-lg uppercase">{jogador.stats.risco_cartao}</span>
        </div>
      </div>

      {/* INSIGHT DO OLHEIRO AI */}
      <div className="bg-[#0a0a0c] border border-neon/30 rounded-xl p-5 shadow-[0_0_20px_rgba(204,255,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon" />
        <h4 className="text-neon font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
          <Zap size={16} /> Insight Individual AI
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {jogador.insight_ia}
        </p>
      </div>

    </div>
  );
}