import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Zap, AlertTriangle, TrendingUp, 
  Shield, Activity, MessageSquare, Play, Crosshair, Bot, X, Target
} from 'lucide-react';

export default function DetalheJogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [simulando, setSimulando] = useState(false);
  const [showSimulacaoModal, setShowSimulacaoModal] = useState(false);
  const [showExplicacaoModal, setShowExplicacaoModal] = useState(false);
  
  const [dados, setDados] = useState<any>(null);
  const [erroApi, setErroApi] = useState(false);

  // Função de busca com lógica de histórico para o Feed
  const buscarDadosReais = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/jogos/${id}/analise-cruzada`);
      if (!response.ok) throw new Error('API não retornou dados.');
      const newData = await response.json();
      console.log("📦 DADOS RECEBIDOS DA IA:", newData);

      setDados((prevDados: any) => {
        if (!prevDados) return newData;

        const feedAntigo = prevDados.feed || [];
        const feedNovo = newData.feed || [];
        
        // Filtra duplicados pelo texto do insight
        const feedFiltrado = feedNovo.filter(
          (n: any) => !feedAntigo.some((o: any) => o.texto === n.texto)
        );

        return {
          ...newData,
          feed: [...feedFiltrado, ...feedAntigo].slice(0, 15)
        };
      });

      setErroApi(false);
    } catch (error) {
      console.error("Erro ao buscar dados do jogo:", error);
      setErroApi(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    buscarDadosReais();
    const interval = setInterval(buscarDadosReais, 15000); 
    return () => clearInterval(interval);
  }, [buscarDadosReais]);

  const handleSimular = () => {
    setSimulando(true);
    setTimeout(() => {
      setSimulando(false);
      setShowSimulacaoModal(true);
    }, 2000);
  };

  // Tratamento de Erro de Conexão
  if (erroApi && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-6 bg-black">
        <AlertTriangle size={48} className="text-red-500" />
        <h2 className="text-white font-bold text-xl uppercase">Falha na Conexão Neural</h2>
        <p className="text-gray-400 text-sm">Verifique se o backend Python está rodando na porta 8000.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-dark-card border border-dark-border text-white rounded-lg hover:bg-gray-800 transition-colors">Voltar</button>
      </div>
    );
  }

  // Tela de Loading
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin" />
        <p className="text-neon font-bold animate-pulse uppercase tracking-widest text-xs">Cruzando Redes Neurais...</p>
      </div>
    );
  }

  // ==========================================
  // MAPEAMENTO SEGURO (Prevenção de Tela Branca)
  // ==========================================
  const probs = dados?.probabilidades || {};
  const gol10 = probs.gol_10min || { valor: 0, texto: "Analisando..." };
  
  const feedAtivo = dados?.feed || [];
  const fatores = dados?.fatores_chave || ["Iniciando telemetria..."];
  const recomendacaoPrincipal = dados?.recomendacao_principal || "Aguardando sinal master...";
  const explicacaoIa = dados?.explicacao_detalhada || dados?.explicacao || "O motor está processando o volume de jogo atual.";
  const insightsMicro = dados?.projecao_10min?.insights_micro || [];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto min-h-screen px-4 mt-4 md:mt-8 pb-32 animate-fade-in-up">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-neon hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
          <ChevronLeft size={20} /> Voltar
        </button>
        <div className="flex items-center gap-3">
            <span className="text-gray-500 text-[10px] font-bold animate-pulse uppercase tracking-tighter">Live Sync Ativo</span>
            <h1 className="text-white font-bold text-xl md:text-2xl hidden md:block uppercase italic">Análise: <span className="text-neon">Pule do Gato</span></h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          
          {/* PLACAR */}
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-8 shadow-lg relative">
            <div className="flex justify-between items-center text-center px-4">
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">{dados?.ao_vivo?.time_casa || 'Mandante'}</p>
                <p className="font-heading text-6xl text-white">{dados?.ao_vivo?.placar?.split('-')[0] || 0}</p>
              </div>
              <div className="flex flex-col items-center justify-center px-6">
                <div className="bg-neon text-black px-4 py-1 rounded-lg font-black text-xl mb-2">
                  {dados?.ao_vivo?.tempo || '0'}'
                </div>
                <div className="text-gray-600 font-bold italic tracking-tighter text-xs">VERSUS</div>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">{dados?.ao_vivo?.time_fora || 'Visitante'}</p>
                <p className="font-heading text-6xl text-white">{dados?.ao_vivo?.placar?.split('-')[1] || 0}</p>
              </div>
            </div>
          </div>

          {/* RECOMENDAÇÃO MASTER */}
          <div className="flex flex-col gap-5">
            <div className="relative bg-neon text-black rounded-2xl p-7 shadow-[0_0_30px_rgba(204,255,0,0.2)] overflow-hidden">
              <Zap className="absolute -right-8 -top-8 opacity-10 w-40 h-40" fill="currentColor" />
              <h3 className="font-black tracking-widest text-xs uppercase flex items-center gap-2 mb-3 opacity-70">
                <Target size={18} fill="currentColor" /> Recomendação Master (IA)
              </h3>
              <p className="font-heading text-2xl md:text-3xl leading-tight tracking-wide relative z-10 italic">
                {recomendacaoPrincipal}
              </p>
            </div>

            {/* MERCADOS ALTERNATIVOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dados.mercados_alternativos?.map((m: any, idx: number) => (
                    <div key={idx} className="bg-[#121212] border border-dark-border p-4 rounded-xl border-t-2 border-t-neon/20">
                        <p className="text-neon text-[10px] font-black uppercase mb-1">{m.mercado}</p>
                        <p className="text-white font-bold text-sm mb-1">{m.tip}</p>
                        <p className="text-gray-500 text-[10px] leading-tight italic">{m.porque}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* RADAR DE 10 MINUTOS COM INSIGHTS MICRO */}
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-white font-bold mb-6 italic uppercase text-sm">
                <Activity size={18} className="text-neon"/> Radar de 10 Minutos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black p-5 rounded-2xl border border-dark-border border-l-4 border-l-neon">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Prob. de Gol (10')</span>
                      <span className="text-neon font-heading text-4xl">{gol10.valor}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2.5 rounded-full mb-3 shadow-inner">
                      <div className="bg-neon h-2.5 rounded-full shadow-[0_0_15px_#ccff00]" style={{width: `${gol10.valor}%`}}/>
                  </div>
                  {/* Texto direto e instrutivo da IA */}
                  <p className="text-[11px] text-gray-300 italic leading-snug bg-white/5 p-2 rounded-lg border border-white/5">
                      {gol10.texto}
                  </p>
              </div>

                <div className="flex flex-col gap-2.5">
                    {insightsMicro.length > 0 ? insightsMicro.map((insight: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-neon/30 transition-all group">
                            <div className="text-neon p-2 bg-neon/10 rounded-lg group-hover:bg-neon/20 transition-colors">
                                {insight.icon === 'zap' && <Zap size={16} />}
                                {insight.icon === 'target' && <Target size={16} />}
                                {insight.icon === 'corner' && <TrendingUp size={16} className="rotate-90" />}
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-black text-gray-500 leading-none mb-1 tracking-widest">{insight.label}</p>
                                <p className="text-xs text-white font-semibold leading-tight">{insight.desc}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex items-center justify-center h-full text-gray-600 text-[10px] italic border border-dashed border-dark-border rounded-xl">
                            Aguardando micro-dados...
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* INTELIGÊNCIA DE CAMPO */}
          <div className="relative bg-[#0a0a0c] border border-dark-border rounded-2xl p-7">
            <h3 className="text-white font-black tracking-widest text-[10px] uppercase flex items-center gap-2 mb-6 border-b border-dark-border pb-4">
              <Crosshair size={16} className="text-neon" /> Inteligência de Campo (Diagnósticos)
            </h3>
            <ul className="space-y-4">
              {fatores.map((fator: string, idx: number) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-neon mt-2 shadow-[0_0_8px_#ccff00]" />
                  <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{fator}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUNA DIREITA (FEED) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col h-full">
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6 flex-1 max-h-[850px] overflow-hidden flex flex-col relative">
            <h2 className="flex items-center gap-2 text-white font-bold mb-6 pb-4 border-b border-dark-border uppercase text-[11px] tracking-widest italic">
                <Zap size={16} className="text-neon"/> Live Intel Feed 
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-neon/10">
              {feedAtivo.length === 0 ? (
                <div className="text-center text-gray-600 mt-10 italic text-sm">Aguardando telemetria...</div>
              ) : feedAtivo.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 group animate-fade-in">
                  <div className="mt-1">
                    <div className="p-2 bg-gray-900 text-neon rounded-lg border border-neon/5 group-hover:border-neon/30 transition-all">
                        <Bot size={16}/>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium leading-snug group-hover:text-white transition-colors">{item.texto}</p>
                    <span className="text-[9px] text-gray-500 font-black mt-1 block uppercase italic tracking-tighter">{item.tempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER FIXO */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-dark-border p-4 md:px-12 z-40 flex gap-4 md:justify-end">
        <button 
          onClick={() => setShowExplicacaoModal(true)}
          className="flex-1 md:flex-none bg-dark-card border border-dark-border text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 text-sm"
        >
          <MessageSquare size={18} /> Raciocínio IA
        </button>
        <button 
          onClick={handleSimular}
          disabled={simulando}
          className="flex-1 md:flex-none bg-neon text-black font-black px-12 py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(204,255,0,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 uppercase italic text-sm tracking-widest"
        >
          {simulando ? <span className="animate-pulse">Cruzando Dados...</span> : <><Play size={20} fill="currentColor"/> Simular Desfecho</>}
        </button>
      </div>

      {/* MODAL EXPLICAÇÃO */}
      {showExplicacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0a0a0c] border border-neon/30 rounded-[2.5rem] p-8 w-full max-w-2xl relative shadow-2xl">
            <button onClick={() => setShowExplicacaoModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={28} /></button>
            <h3 className="text-neon font-heading text-4xl mb-4 italic flex items-center gap-3 tracking-tighter"><Bot size={36} /> Análise do Modelo</h3>
            <div className="space-y-4 text-gray-300 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
                <div className="p-6 bg-neon/5 border border-neon/20 rounded-2xl border-l-4 border-l-neon">
                    <p className="font-medium text-gray-200">{explicacaoIa}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {dados.mercados_alternativos?.map((m: any, i: number) => (
                        <div key={i} className="border-l-2 border-neon/30 pl-4 py-2 bg-white/5 rounded-r-xl">
                            <span className="text-neon text-[10px] font-black uppercase">{m.mercado}</span>
                            <p className="text-white font-bold text-sm">{m.tip}</p>
                            <p className="text-xs text-gray-500 italic mt-1">{m.porque}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => setShowExplicacaoModal(false)} className="w-full bg-neon text-black font-bold py-5 rounded-2xl mt-8 hover:brightness-110 transition-all uppercase tracking-widest">Entendido</button>
          </div>
        </div>
      )}

      {/* MODAL SIMULAÇÃO (PROJEÇÃO 10') */}
      {showSimulacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-fade-in">
          <div className="bg-[#0a0a0c] border border-neon/50 rounded-3xl p-10 w-full max-w-lg relative shadow-[0_0_60px_rgba(204,255,0,0.15)]">
            <button onClick={() => setShowSimulacaoModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-neon/20 rounded-lg text-neon">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-neon font-heading text-3xl italic tracking-tighter">Projeção 10'</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Cálculo Probabilístico em Tempo Real</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {/* Título da Oportunidade (Vem do Backend) */}
              <div className="text-center p-4 bg-neon rounded-2xl">
                <p className="text-black font-black text-xl uppercase italic">
                  {dados.projecao_10min?.titulo || "Pico de Pressão Detectado"}
                </p>
              </div>

              {/* Bloco de Análise (Vem do Backend) */}
              <div className="bg-[#121212] p-6 rounded-2xl border border-dark-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon"></div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">
                  {dados.projecao_10min?.analise_correlacionada || "O motor identificou um comportamento anômalo nas linhas defensivas, sugerindo um desequilíbrio iminente."}
                </p>
                
                <div className="mt-4 flex items-center justify-between border-t border-dark-border pt-4">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Confiança IA</p>
                    <p className="text-neon font-heading text-3xl">{dados.projecao_10min?.valor_estimado || "80%"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Volume vs Média</p>
                    <p className="text-white font-bold text-lg">{dados.projecao_10min?.concorrencia_estatistica || "2.4x superior"}</p>
                  </div>
                </div>
              </div>

              <button 
                className="w-full bg-neon text-black font-black py-5 rounded-2xl hover:shadow-[0_0_30px_#ccff0080] transition-all transform active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                onClick={() => window.open('https://esportesdasorte.com', '_blank')}
              >
                Fazer Entrada na Esportes da Sorte <Play size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}