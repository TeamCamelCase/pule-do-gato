import { useState, useEffect } from 'react';
import { Flame, Activity, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Tipagem baseada no que o seu backend retorna
interface JogoAoVivo {
  id: string;
  time_casa: string;
  time_fora: string;
  placar: string;
  tempo: string;
  ip_casa?: number;
  ip_fora?: number;
  alerta?: string;
}

export default function FeedQuente() {
  const [jogos, setJogos] = useState<JogoAoVivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Aqui nós batemos na sua API de verdade!
    const buscarJogos = async () => {
      try {
        // Ajuste a URL para a rota correta do seu backend
        const response = await fetch('http://localhost:8000/jogos-ao-vivo'); 
        if (!response.ok) throw new Error('Erro ao buscar jogos');
        
        const data = await response.json();
        // Assumindo que o backend retorna { jogos: [...] }
        setJogos(data.jogos || data); 
      } catch (err) {
        console.error(err);
        setErro('Não foi possível conectar ao Radar AI. Verifique se o backend está rodando.');
        
        // MOCK DE SOBREVIVÊNCIA (Caso o backend caia na apresentação)
        setJogos([
          { id: '11648148', time_casa: 'São Paulo U20', time_fora: 'Ferroviária U20', placar: '1-0', tempo: '57', ip_casa: 0.44, ip_fora: 0.25, alerta: 'NORMAL' },
          { id: '999', time_casa: 'Sport Recife', time_fora: 'Náutico', placar: '0-0', tempo: '78', ip_casa: 1.8, alerta: 'CRÍTICO' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    buscarJogos();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-80px)] px-4 py-6 md:py-10 pb-28 md:pb-10 animate-fade-in-up">
      
      {/* Cabeçalho da Página */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-wide flex items-center gap-2">
            <Flame className="text-neon animate-pulse" size={28} />
            EM ALTA
          </h2>
          <p className="text-sm text-gray-400 mt-1">Jogos filtrados pelo Índice de Pressão AI</p>
        </div>
        <div className="bg-dark-card border border-dark-border px-3 py-1 rounded-full text-xs font-bold text-neon flex items-center gap-2 shadow-[0_0_10px_rgba(204,255,0,0.1)]">
          <div className="w-2 h-2 rounded-full bg-neon animate-pulse" /> AO VIVO
        </div>
      </div>

      {/* Tratamento de Erro e Loading */}
      {erro && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p>{erro} <br/><span className="text-gray-400 text-xs">Exibindo dados simulados para teste.</span></p>
        </div>
      )}

      {loading ? (
        // Skeleton Loading
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-dark-card rounded-xl animate-pulse border border-dark-border" />
          ))}
        </div>
      ) : (
        // Lista de Jogos
        <div className="flex flex-col gap-4">
          {jogos.map((jogo) => (
            <Link 
              to={`/jogo/${jogo.id}`} 
              key={jogo.id}
              className={`block bg-dark-card border rounded-xl p-4 transition-all hover:border-gray-500 active:scale-[0.98] relative overflow-hidden group ${
                jogo.alerta === 'CRÍTICO' ? 'border-neon/50 shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'border-dark-border'
              }`}
            >
              {/* Efeito visual se estiver crítico */}
              {jogo.alerta === 'CRÍTICO' && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon/10 blur-2xl rounded-full group-hover:bg-neon/20 transition-all" />
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 bg-dark-bg px-2 py-1 rounded border border-dark-border">
                  {jogo.tempo}' MIN
                </span>
                {(jogo.ip_casa || jogo.ip_fora) && (
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-300">
                    <Activity size={14} className={jogo.alerta === 'CRÍTICO' ? 'text-neon' : 'text-gray-500'} />
                    IP Max: {Math.max(jogo.ip_casa || 0, jogo.ip_fora || 0).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1 text-right">
                  <p className="font-bold text-base md:text-lg text-white truncate">{jogo.time_casa}</p>
                </div>
                
                <div className="px-4 py-2 bg-black rounded-lg mx-3 font-heading text-2xl tracking-widest border border-dark-border text-neon drop-shadow-[0_0_8px_rgba(204,255,0,0.3)] min-w-[80px] text-center">
                  {jogo.placar}
                </div>
                
                <div className="flex-1 text-left">
                  <p className="font-bold text-base md:text-lg text-white truncate">{jogo.time_fora}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dark-border flex justify-center items-center text-xs font-bold text-gray-400 group-hover:text-neon transition-colors">
                ABRIR ANÁLISE PULE DO GATO <ChevronRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}