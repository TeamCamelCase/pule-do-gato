import { 
  AlertTriangle, 
  ChevronRight, 
  Ticket, 
  Search, 
  MessageSquare, 
  Clock, 
  Zap,
  ShieldAlert,
  Bot
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Tipagem rigorosa para evitar erros de "undefined"
interface ZebraData {
  id: string;
  favorito: string;
  zebra: string;
  placar: string;
  tempo: string;
  odd_zebra: number;
  ip_zebra: number;
  ip_favorito: number;
  analise_contextual: string; // Onde entra o "Tabu" ou Notícias
  confianca_zebra: number;    // Ex: 85%
}

export default function Zebras() {
  // 1. IMPORTANTE: Inicializar com [] para evitar erro de .map() em null
  const [jogos, setJogos] = useState<ZebraData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarZebras() {
      try {
        const response = await fetch("http://localhost:8000/jogos/zebras");
        if (!response.ok) throw new Error("Erro na API");
        const data = await response.json();
        
        // Garante que se a API falhar ou vier vazia, mantenha um array
        setJogos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar zebras reais:", error);
        setJogos([]); // Fallback para não quebrar a tela
      } finally {
        setLoading(false);
      }
    }
    carregarZebras();
    
    // Refresh a cada 30 segundos para pegar mudanças no placar/notícias
    const interval = setInterval(carregarZebras, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-80px)] px-4 py-6 md:py-10 pb-28 md:pb-10 animate-fade-in-up max-w-3xl mx-auto">
      
      {/* Cabeçalho de Elite */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-dark-border pb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold font-heading tracking-tighter flex items-center gap-3">
            <Search className="text-neon animate-pulse" size={32} />
            DETECTOR DE <span className="text-neon italic">ZEBRAS</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Lucky analisando <span className="text-gray-300">notícias, tabus e desfalques</span> em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neon/5 border border-neon/20 px-4 py-2 rounded-xl">
          <Zap size={16} className="text-neon" />
          <span className="text-[10px] font-black text-neon uppercase tracking-widest text-center leading-none">
            High ROI <br/> Potential
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neon/20 border-t-neon rounded-full animate-spin" />
            <Bot size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon" />
          </div>
          <p className="text-neon font-bold animate-pulse text-xs uppercase tracking-[0.2em]">
            Lucky está lendo os portais de notícias...
          </p>
        </div>
      ) : jogos.length === 0 ? (
        <div className="text-center py-20 bg-dark-card rounded-3xl border border-dashed border-dark-border">
          <ShieldAlert size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 font-bold uppercase text-sm">Nenhuma zebra detectada agora.</p>
          <p className="text-gray-600 text-xs mt-1">Os favoritos estão sob controle total.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {jogos.map((jogo) => (
            <div key={jogo.id} className="relative group">
              {/* Badge de Probabilidade da IA */}
              <div className="absolute -top-4 -left-2 z-20 bg-white text-black text-[11px] font-black px-3 py-1 rounded-lg shadow-xl border-2 border-neon transform -rotate-2 group-hover:rotate-0 transition-transform">
                {jogo.confianca_zebra}% SCORE DE ZEBRA
              </div>

              <Link
                to={`/jogo/${jogo.id}`}
                className="block bg-[#121212] border border-dark-border rounded-[2rem] p-6 transition-all hover:border-neon/50 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
              >
                {/* Placar e Tempo Real */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{jogo.tempo}' MIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-neon bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
                      ODD @{jogo.odd_zebra.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Times e Placar Central */}
                <div className="grid grid-cols-3 items-center mb-8 px-2">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Favorito</p>
                    <p className="font-bold text-gray-400 truncate text-sm md:text-base">{jogo.favorito}</p>
                  </div>
                  <div className="bg-black py-2 rounded-2xl border border-white/5 shadow-inner">
                    <p className="font-heading text-3xl text-center text-white tracking-widest">{jogo.placar}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-neon uppercase mb-1">Zebra</p>
                    <p className="font-bold text-white truncate text-sm md:text-base">{jogo.zebra}</p>
                  </div>
                </div>

                {/* Veredito Contextual (Notícias/Meme/Tabu) */}
                <div className="bg-neon/5 border border-neon/20 p-5 rounded-2xl mb-6 relative group-hover:bg-neon/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={16} className="text-neon" />
                    <span className="text-[10px] font-black text-neon uppercase italic tracking-widest">
                      Análise de Campo (Lucky Search):
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm italic leading-relaxed font-medium">
                    "{jogo.analise_contextual}"
                  </p>
                  {/* Decoração visual */}
                  <div className="absolute bottom-2 right-4 opacity-10">
                     <Ticket size={40} className="text-neon" />
                  </div>
                </div>

                {/* Telemetria de Pressão (IP) */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <div className="flex justify-between mb-2 uppercase font-black text-[9px] text-gray-500">
                      <span>Inércia Favorito</span>
                      <span>{jogo.ip_favorito} IP</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500/50" style={{ width: `${Math.min(jogo.ip_favorito * 50, 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 uppercase font-black text-[9px] text-neon">
                      <span>Inércia Zebra</span>
                      <span>{jogo.ip_zebra} IP</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-neon shadow-[0_0_10px_#ccff00]" style={{ width: `${Math.min(jogo.ip_zebra * 50, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                   <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] group-hover:text-neon transition-colors">
                      Clique para abrir scanner tático
                   </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}