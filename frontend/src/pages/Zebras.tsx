import { AlertTriangle, ChevronRight, Ticket, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Tipagem baseada na narrativa da Zebra
interface ZebraData {
  id: string;
  favorito: string;
  zebra: string;
  placar: string;
  tempo: string;
  odd_zebra: number;
  ip_zebra: number;
  ip_favorito: number;
}

export default function Zebras() {
  const [jogos, setJogos] = useState<ZebraData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando uma requisição para a rota de Zebras (Mock de apresentação)
    setTimeout(() => {
      setJogos([
        {
          id: "zebra-1",
          favorito: "Flamengo",
          zebra: "Nova Iguaçu",
          placar: "0-1",
          tempo: "68",
          odd_zebra: 8.5,
          ip_zebra: 1.45,
          ip_favorito: 0.3,
        },
        {
          id: "zebra-2",
          favorito: "Palmeiras",
          zebra: "Água Santa",
          placar: "0-0",
          tempo: "35",
          odd_zebra: 12.0,
          ip_zebra: 0.95,
          ip_favorito: 0.15,
        },
      ]);
      setLoading(false);
    }, 1000); // 1 segundo de loading para dar o efeito de busca
  }, []);

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-80px)] px-4 py-6 md:py-10 pb-28 md:pb-10 animate-fade-in-up max-w-3xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="mb-6 flex items-center justify-between border-b border-dark-border pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-wide flex items-center gap-2">
            <Ticket className="text-neon" size={28} />
            CAÇADOR DE ZEBRAS
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Azarões com alto Índice de Pressão (IP).
          </p>
        </div>
        <div className="bg-neon/10 border border-neon/30 px-3 py-1 rounded-full text-xs font-bold text-neon flex items-center gap-2 shadow-[0_0_10px_rgba(204,255,0,0.1)] animate-pulse">
          <TrendingUp size={14} /> ALTO RISCO, ALTO RETORNO
        </div>
      </div>

      {loading ? (
        // Skeleton Loading
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 bg-dark-card rounded-xl animate-pulse border border-dark-border"
            />
          ))}
        </div>
      ) : (
        // Lista de Zebras
        <div className="flex flex-col gap-5">
          {jogos.map((jogo) => (
            <Link
              to={`/jogo/${jogo.id}`}
              key={jogo.id}
              className="block bg-dark-card border border-dark-border rounded-xl p-5 transition-all hover:border-neon/50 active:scale-[0.98] relative overflow-hidden group shadow-lg"
            >
              {/* Efeito visual de Alerta de Zebra */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 blur-[50px] rounded-full group-hover:bg-neon/15 transition-all pointer-events-none" />

              {/* Topo do Card: Tempo e Alerta */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-white bg-dark-bg px-3 py-1 rounded border border-dark-border shadow-inner">
                  {jogo.tempo}' MIN
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-neon bg-neon/10 px-2 py-1 rounded">
                  <AlertTriangle size={14} /> ODD @{jogo.odd_zebra.toFixed(2)}
                </span>
              </div>

              {/* O Confronto: Favorito (apagado) vs Zebra (Destaque) */}
              <div className="flex items-center justify-between relative z-10 bg-dark-bg/50 rounded-lg p-3 border border-dark-border/50">
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm md:text-base text-gray-500 uppercase tracking-wider">
                    Favorito
                  </p>
                  <p className="font-bold text-base md:text-xl text-gray-400 truncate strike">
                    {jogo.favorito}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    IP: {jogo.ip_favorito.toFixed(2)}
                  </p>
                </div>

                <div className="px-4 py-2 bg-black rounded-lg mx-3 font-heading text-3xl tracking-widest border border-dark-border text-white shadow-inner min-w-[80px] text-center">
                  {jogo.placar}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm md:text-base text-neon uppercase tracking-wider flex items-center gap-1">
                    Zebra <Ticket size={14} />
                  </p>
                  <p className="font-bold text-base md:text-xl text-white truncate">
                    {jogo.zebra}
                  </p>
                  <p className="text-xs text-neon font-bold mt-1">
                    IP: {jogo.ip_zebra.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dark-border flex justify-center items-center text-xs font-bold text-gray-400 group-hover:text-neon transition-colors uppercase tracking-widest">
                Analisar Oportunidade{" "}
                <ChevronRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/simular"
        className="absolute flex justify-center w-20 h-20 bottom-10 right-10 ml-4 align-middle items-center gap-2 text-sm font-bold text-black bg-neon rounded-full hover:bg-[#63fa4f] transition-transform uppercase tracking-widest shadow-[0_0_15px_rgba(204,255,0,0.2)]"
      >
        <img src="cat-mascot.png" className="w-16 mt-1 ml-0.5" alt="" />
      </Link>
    </div>
  );
}
