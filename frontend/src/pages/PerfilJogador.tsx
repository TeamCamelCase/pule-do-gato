import {
  Activity,
  ChevronLeft,
  ExternalLink,
  Info,
  ShieldAlert,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function JogadorDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jogador, setJogador] = useState<any>(null);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        // Rota que criamos no backend para buscar no CSV + IA
        const response = await fetch(
          `http://localhost:8000/jogadores/${id}/perfil?nome=${id}`
        );
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

  if (loading || !jogador) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin" />
        <p className="text-neon animate-pulse font-black uppercase tracking-widest text-xs">
          Mapeando Atleta...
        </p>
      </div>
    );
  }

  // Extraímos os dados do retorno da nossa API
  const scouting = jogador.scouting || {};
  const insightIA =
    jogador.insight_ia || "Processando telemetria de performance...";

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto min-h-screen px-4 pt-6 pb-32 animate-fade-in-up">
      {/* HEADER NAV */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-neon hover:text-white transition-colors font-black text-xs uppercase tracking-tighter"
        >
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="bg-neon/10 border border-neon/20 px-3 py-1 rounded-full">
          <span className="text-neon text-[10px] font-black uppercase tracking-widest">
            Scouting Ativo
          </span>
        </div>
      </div>

      {/* CARD PRINCIPAL - ESTILO POSTER */}
      <div className="relative w-full h-[380px] rounded-[2.5rem] overflow-hidden mb-8 border border-white/5 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-neon fill-neon" />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
              {scouting.time || "Clube"}
            </span>
          </div>
          <h2 className="text-white font-heading text-7xl md:text-8xl tracking-tighter leading-[0.8] italic uppercase mb-4">
            {scouting.nome?.split(" ")[0]}
            <br />
            <span className="text-neon">
              {scouting.nome?.split(" ")[1] || ""}
            </span>
          </h2>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <p className="text-[10px] text-gray-400 uppercase font-black">
                Posição
              </p>
              <p className="text-white font-bold">
                {scouting.posicao || "ATK"}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <p className="text-[10px] text-gray-400 uppercase font-black">
                Idade
              </p>
              <p className="text-white font-bold">
                {scouting.idade || "--"} Anos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE TEMPORADA (DADOS DO CSV) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-center">
          <p className="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">
            Gols 25/26
          </p>
          <p className="text-white text-3xl font-black">
            {scouting.gols_na_temporada || 0}
          </p>
        </div>
        <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-center">
          <p className="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">
            Assistências
          </p>
          <p className="text-white text-3xl font-black">
            {scouting.assistencias || 0}
          </p>
        </div>
        <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl text-center">
          <p className="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">
            Chutes/Jogo
          </p>
          <p className="text-white text-3xl font-black">
            {scouting.chutes_no_gol_media || 0}
          </p>
        </div>
      </div>

      {/* PLAYER PROPS - ONDE APOSTAR */}
      <div className="bg-[#121212] border border-dark-border rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={18} className="text-neon" /> Projeção de Entrada
            (Props)
          </h3>
          <Info size={16} className="text-gray-600" />
        </div>

        <div className="space-y-4">
          {/* PROP: CHUTES */}
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-neon/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neon/10 rounded-xl text-neon">
                <Target size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  Mais de 1.5 Chutes ao Gol
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-black">
                  Confiança IA: 88%
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-neon font-black text-xs uppercase italic tracking-widest">
                Sugerido
              </span>
            </div>
          </div>

          {/* PROP: CARTÃO */}
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  Risco de Cartão Amarelo
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-black">
                  Histórico: {scouting.cartoes_amarelos} acumulados
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-yellow-500 font-black text-[10px] uppercase italic">
                Risco Alto
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INSIGHT DO LUCKY IA */}
      <div className="bg-neon text-black rounded-[2rem] p-8 shadow-[0_0_40px_rgba(204,255,0,0.2)] relative overflow-hidden">
        <Zap
          className="absolute -right-6 -top-6 opacity-10 w-32 h-32"
          fill="currentColor"
        />
        <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2 opacity-70">
          <Activity size={16} fill="currentColor" /> Veredito do Olheiro IA
        </h4>
        <p className="font-medium text-lg md:text-xl leading-tight italic tracking-tight">
          "{insightIA}"
        </p>
      </div>

      {/* BOTÃO DE AÇÃO */}
      <button
        onClick={() => window.open("https://esportesdasorte.com", "_blank")}
        className="mt-8 w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-neon transition-all active:scale-95 uppercase italic tracking-widest text-sm"
      >
        Buscar Odds para {scouting.nome?.split(" ")[0]}{" "}
        <ExternalLink size={18} />
      </button>
    </div>
  );
}
