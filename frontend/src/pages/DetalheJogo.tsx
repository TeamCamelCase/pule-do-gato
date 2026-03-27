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

  // Função de busca memorizada para ser usada no mount e no intervalo
  const buscarDadosReais = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/jogos/${id}/analise-cruzada`);
      if (!response.ok) throw new Error('API não retornou dados.');
      const newData = await response.json();

      setDados((prevDados: any) => {
        // Se for a primeira vez, apenas retorna os dados
        if (!prevDados) return newData;

        // PEGA O FEED ANTIGO E JUNTA COM O NOVO
        // O set() evita duplicados se a IA mandar o mesmo ID
        const feedAntigo = prevDados.feed || [];
        const feedNovo = newData.feed || [];
        
        // Filtra para não repetir itens que já estão lá (com base no texto ou ID)
        const feedFiltrado = feedNovo.filter(
          (n: any) => !feedAntigo.some((o: any) => o.texto === n.texto)
        );

        // Retorna os dados novos, mas mantém o histórico do feed (limitado a 10 itens)
        return {
          ...newData,
          feed: [...feedFiltrado, ...feedAntigo].slice(0, 10)
        };
      });

      setErroApi(false);
    } catch (error) {
      console.error("Erro:", error);
      setErroApi(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Efeito para busca inicial e atualização automática a cada 60 segundos
  useEffect(() => {
    buscarDadosReais();
    const interval = setInterval(buscarDadosReais, 6000); 
    return () => clearInterval(interval);
  }, [buscarDadosReais]);

  const handleSimular = () => {
    setSimulando(true);
    setTimeout(() => {
      setSimulando(false);
      setShowSimulacaoModal(true);
    }, 2000);
  };

  if (erroApi && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-6">
        <AlertTriangle size={48} className="text-red-500" />
        <h2 className="text-white font-bold text-xl">Falha na Conexão Neural</h2>
        <p className="text-gray-400 text-sm">Não foi possível conectar ao backend.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-dark-card border border-dark-border text-white rounded-lg">Voltar</button>
      </div>
    );
  }

  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin" />
        <p className="text-neon font-bold animate-pulse">Cruzando dados na Rede Neural...</p>
      </div>
    );
  }

  // ==========================================
  // MAPEAMENTO DE DADOS (IA DINÂMICA)
  // ==========================================
  const probabilidades = dados?.probabilidades || {
    gol_10min: { valor: 0, texto: "Analisando pressão..." },
    escanteio_proximo: { valor: 0, texto: "Calculando trajetórias..." },
    cartao_iminente: { valor: 0, texto: "Monitorando disciplina..." },
    dominio_territorial: { valor: 0, texto: "Mapeando campo..." }
  };

  const feedAtivo = dados?.feed || [];
  const fatores = dados?.fatores_chave || ["O motor de IA está processando as táticas atuais..."];
  const recomendacaoPrincipal = dados?.recomendacao_principal || dados?.recomendacao || "Analisando melhor entrada...";
  const explicacaoIa = dados?.explicacao_detalhada || dados?.explicacao || "O motor está cruzando IP, xG e DNA tático...";

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto min-h-screen px-4 mt-4 md:mt-8 pb-32 animate-fade-in-up">
      
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-neon hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
          <ChevronLeft size={20} /> Voltar
        </button>
        <div className="flex items-center gap-3">
            <span className="text-gray-500 text-[10px] font-bold animate-pulse uppercase tracking-tighter">Live Sync Ativo</span>
            <h1 className="text-white font-bold text-xl md:text-2xl hidden md:block">Análise: <span className="text-neon">PRO</span></h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LADO ESQUERDO */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          
          {/* PLACAR REAL-TIME */}
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6 relative shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-2 text-white font-bold"><Activity size={18} className="text-neon"/> Status do Jogo</h2>
              <div className="bg-neon/20 border border-neon/50 text-neon px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse"/> AO VIVO
              </div>
            </div>

            <div className="flex justify-between items-center text-center px-4">
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-2">{dados?.ao_vivo?.time_casa || 'Casa'}</p>
                <p className="font-heading text-5xl text-white">{(dados?.ao_vivo?.placar || "0-0").split('-')[0]}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-neon font-bold flex items-center gap-1 text-lg">
                  <span className="animate-pulse">⏱</span> {dados?.ao_vivo?.tempo || '0'}'
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-2">{dados?.ao_vivo?.time_fora || 'Fora'}</p>
                <p className="font-heading text-5xl text-white">{(dados?.ao_vivo?.placar || "0-0").split('-')[1]}</p>
              </div>
            </div>
          </div>

          {/* O PULE DO GATO E MERCADOS */}
          <div className="flex flex-col gap-5">
            {/* CARD PRINCIPAL */}
            <div className="relative bg-neon text-black rounded-xl p-6 shadow-[0_0_25px_rgba(204,255,0,0.2)] overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10"><Zap size={100} fill="currentColor" /></div>
              <h3 className="font-bold tracking-widest text-sm uppercase flex items-center gap-2 mb-2 opacity-80"><Target size={18} fill="currentColor" /> RECOMENDAÇÃO MASTER</h3>
              <p className="font-heading text-xl md:text-3xl leading-tight tracking-wide relative z-10">
                {recomendacaoPrincipal}
              </p>
            </div>

            {/* MERCADOS ALTERNATIVOS (DINÂMICO) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dados.mercados_alternativos?.map((m: any, idx: number) => (
                    <div key={idx} className="bg-[#121212] border border-dark-border p-4 rounded-xl hover:border-neon/30 transition-colors">
                        <p className="text-neon text-[10px] font-bold uppercase mb-1">{m.mercado}</p>
                        <p className="text-white font-bold text-sm mb-1">{m.tip}</p>
                        <p className="text-gray-500 text-[11px] leading-tight">{m.porque}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* RADAR TÁTICO (INSIGHTS COMPORTAMENTAIS) */}
          <div className="relative bg-[#0a0a0c] border border-dark-border rounded-xl p-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-neon/50" />
            <h3 className="text-white font-bold tracking-widest text-sm uppercase flex items-center gap-2 mb-4">
              <Crosshair size={18} className="text-gray-400" /> Inteligência de Campo
            </h3>
            <ul className="space-y-4">
              {fatores.map((fator: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-neon mt-2 shadow-[0_0_5px_#ccff00]" />
                  <span className="text-gray-300 text-sm leading-relaxed font-medium">{fator}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PROJEÇÕES DE RISCO (MERCADOS REAIS) */}
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6 mt-2">
            <h2 className="flex items-center gap-2 text-white font-bold mb-6"><TrendingUp size={18} className="text-neon"/> Projeções de Risco (Próx. 10min)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-[#0a0a0c] p-4 rounded-xl border border-dark-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm font-medium">Probabilidade de Gol</span>
                  <span className="text-neon font-heading text-3xl">{probabilidades.gol_10min.valor}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full mb-3">
                  <div className="bg-neon h-2 rounded-full shadow-[0_0_10px_#ccff00]" style={{width: `${probabilidades.gol_10min.valor}%`}}/>
                </div>
                <p className="text-xs text-gray-500">{probabilidades.gol_10min.texto}</p>
              </div>

              <div className="bg-[#0a0a0c] p-4 rounded-xl border border-dark-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm font-medium">Pressão p/ Escanteio</span>
                  <span className="text-blue-500 font-heading text-3xl">{probabilidades.escanteio_proximo.valor}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full mb-3">
                  <div className="bg-blue-500 h-2 rounded-full shadow-[0_0_10px_#3b82f6]" style={{width: `${probabilidades.escanteio_proximo.valor}%`}}/>
                </div>
                <p className="text-xs text-gray-500">{probabilidades.escanteio_proximo.texto}</p>
              </div>
              
              <div className="bg-[#0a0a0c] p-4 rounded-xl border border-dark-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm font-medium">Risco de Cartão</span>
                  <span className="text-yellow-500 font-heading text-3xl">{probabilidades.cartao_iminente.valor}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full mb-3">
                  <div className="bg-yellow-500 h-2 rounded-full shadow-[0_0_10px_#eab308]" style={{width: `${probabilidades.cartao_iminente.valor}%`}}/>
                </div>
                <p className="text-xs text-gray-500">{probabilidades.cartao_iminente.texto}</p>
              </div>

              <div className="bg-[#0a0a0c] p-4 rounded-xl border border-dark-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm font-medium">Domínio Territorial</span>
                  <span className="text-purple-500 font-heading text-3xl">{probabilidades.dominio_territorial.valor}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full mb-3">
                  <div className="bg-purple-500 h-2 rounded-full shadow-[0_0_10px_#a855f7]" style={{width: `${probabilidades.dominio_territorial.valor}%`}}/>
                </div>
                <p className="text-xs text-gray-500">{probabilidades.dominio_territorial.texto}</p>
              </div>

            </div>
          </div>
        </div>

        {/* LADO DIREITO: FEED VIVO */}
        <div className="col-span-1 lg:col-span-5 flex flex-col">
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6 flex-1 max-h-[850px] overflow-hidden flex flex-col relative">
            <h2 className="flex items-center gap-2 text-white font-bold mb-6 pb-4 border-b border-dark-border">
                <Zap size={18} className="text-neon"/> Live Intel Feed 
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-dark-border">
              {feedAtivo.length === 0 && (
                <div className="text-center text-gray-500 mt-10 italic">Aguardando novos lances...</div>
              )}
              {feedAtivo.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 group animate-fade-in">
                  <div className="mt-1">
                    {item.tipo === 'ataque' && <div className="p-2 bg-blue-900/20 text-blue-500 rounded-lg border border-blue-500/20"><TrendingUp size={16}/></div>}
                    {item.tipo === 'defesa' && <div className="p-2 bg-green-900/20 text-green-500 rounded-lg border border-green-500/20"><Shield size={16}/></div>}
                    {item.tipo === 'alerta' && <div className="p-2 bg-yellow-900/20 text-yellow-500 rounded-lg border border-yellow-500/20"><AlertTriangle size={16}/></div>}
                    {!['ataque', 'defesa', 'alerta'].includes(item.tipo) && <div className="p-2 bg-gray-800 text-neon rounded-lg border border-neon/20"><Bot size={16}/></div>}
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium leading-snug group-hover:text-white transition-colors">{item.texto}</p>
                    <span className="text-[10px] text-gray-500 font-bold mt-1 block uppercase tracking-widest">{item.tempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE AÇÕES */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-dark-border p-4 md:px-12 z-40 flex gap-4 md:justify-end">
        <button 
          onClick={() => setShowExplicacaoModal(true)}
          className="flex-1 md:flex-none bg-dark-card border border-dark-border text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95"
        >
          <MessageSquare size={18} /> <span className="hidden sm:inline">Raciocínio Profundo</span><span className="sm:hidden">Lógica</span>
        </button>
        <button 
          onClick={handleSimular}
          disabled={simulando}
          className="flex-1 md:flex-none bg-neon text-black font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_#ccff0080] transition-all active:scale-95 disabled:opacity-50"
        >
          {simulando ? <span className="animate-pulse">Cruzando Variáveis...</span> : <><Play size={18} fill="currentColor"/> Simular Desfecho</>}
        </button>
      </div>

      {/* MODAIS */}
      {showExplicacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0a0a0c] border border-neon/30 rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl">
            <button onClick={() => setShowExplicacaoModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
            <h3 className="text-neon font-heading text-3xl mb-4 flex items-center gap-3"><Bot size={32} /> ANÁLISE DO MODELO</h3>
            <div className="space-y-4 text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
                <div className="p-4 bg-neon/5 border border-neon/20 rounded-xl">
                    <p className="font-medium">{explicacaoIa}</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {dados.mercados_alternativos?.map((m: any, i: number) => (
                        <div key={i} className="border-l-2 border-neon pl-4 py-1">
                            <span className="text-neon text-xs font-bold uppercase">{m.mercado}: {m.tip}</span>
                            <p className="text-sm text-gray-400 italic">{m.porque}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => setShowExplicacaoModal(false)} className="w-full bg-neon text-black font-bold py-4 rounded-xl mt-8 hover:brightness-110 transition-all">CONCLUÍDO</button>
          </div>
        </div>
      )}

      {showSimulacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-fade-in">
            <div className="bg-[#0a0a0c] border border-neon/50 rounded-3xl p-8 w-full max-w-lg relative shadow-[0_0_60px_rgba(204,255,0,0.15)]">
            <button onClick={() => setShowSimulacaoModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-neon/20 rounded-lg">
                <Zap size={24} className="text-neon" fill="currentColor" />
                </div>
                <div>
                <h3 className="text-neon font-heading text-3xl italic tracking-tighter">PROJEÇÃO 10'</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Cálculo Probabilístico em Tempo Real</p>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {/* Título da Oportunidade */}
                <div className="text-center p-4 bg-neon rounded-2xl">
                <p className="text-black font-black text-xl uppercase italic">
                    {dados.projecao_10min?.titulo || "Pico de Pressão Detectado"}
                </p>
                </div>

                {/* Bloco de Análise */}
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

                {/* Aviso de Risco */}
                <div className="flex items-center gap-3 px-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <p className="text-[10px] text-gray-500 font-medium">
                    Análise baseada em dados de {dados?.ao_vivo?.tempo}' minutos de jogo. O mercado pode oscilar rapidamente.
                </p>
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