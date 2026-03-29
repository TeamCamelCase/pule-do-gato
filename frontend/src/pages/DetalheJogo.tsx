import {
  Activity,
  AlertTriangle,
  Bot,
  ChevronLeft,
  Crosshair,
  MessageSquare,
  Play,
  ShieldAlert,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/jogos/${id}/analise-cruzada`);
      if (!response.ok) throw new Error("API não retornou dados.");
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
          feed: [...feedFiltrado, ...feedAntigo].slice(0, 15),
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
        <h2 className="text-white font-bold text-xl uppercase">
          Falha na Conexão Neural
        </h2>
        <p className="text-gray-400 text-sm">
          Verifique se o backend Python está rodando na porta 8000.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-dark-card border border-dark-border text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Tela de Loading
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin" />
        <p className="text-neon font-bold animate-pulse uppercase tracking-widest text-xs">
          Cruzando Redes Neurais...
        </p>
      </div>
    );
  }

  // ==========================================
  // MAPEAMENTO SEGURO (Prevenção de Tela Branca)
  // ==========================================
  /*  const probs = dados?.probabilidades || {}; */
  /*   const gol10 = probs.gol_10min || { valor: 0, texto: "Analisando..." }; */

  const feedAtivo = dados?.feed || [];
  const fatores = dados?.fatores_chave || ["Iniciando telemetria..."];
  const recomendacaoPrincipal =
    dados?.recomendacao_principal || "Aguardando sinal master...";
  const explicacaoIa =
    dados?.explicacao_detalhada ||
    dados?.explicacao ||
    "O motor está processando o volume de jogo atual.";
  /*   const insightsMicro = dados?.projecao_10min?.insights_micro || []; */

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto min-h-screen px-4 mt-4 md:mt-8 pb-32 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-neon hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-[10px] font-bold animate-pulse uppercase tracking-tighter">
            Live Sync Ativo
          </span>
          <h1 className="text-white font-bold text-xl md:text-2xl hidden md:block uppercase italic">
            Análise: <span className="text-neon">Pule do Gato</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          {/* PLACAR */}
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-8 shadow-lg relative">
            <div className="flex justify-between items-center text-center px-4">
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">
                  {dados?.ao_vivo?.time_casa || "Mandante"}
                </p>
                <p className="font-heading text-6xl text-white">
                  {dados?.ao_vivo?.placar?.split("-")[0] || 0}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-6">
                <div className="bg-neon text-black px-4 py-1 rounded-lg font-black text-xl mb-2">
                  {dados?.ao_vivo?.tempo || "0"}'
                </div>
                <div className="text-gray-600 font-bold italic tracking-tighter text-xs">
                  VERSUS
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">
                  {dados?.ao_vivo?.time_fora || "Visitante"}
                </p>
                <p className="font-heading text-6xl text-white">
                  {dados?.ao_vivo?.placar?.split("-")[1] || 0}
                </p>
              </div>
            </div>
          </div>

          {/* RECOMENDAÇÃO MASTER */}
          <div className="flex flex-col gap-5">
            <div className="relative bg-neon text-black rounded-2xl p-7 shadow-[0_0_30px_rgba(204,255,0,0.2)] overflow-hidden">
              <Zap
                className="absolute -right-8 -top-8 opacity-10 w-40 h-40"
                fill="currentColor"
              />
              <h3 className="font-black tracking-widest text-xs uppercase flex items-center gap-2 mb-3 opacity-70">
                <Target size={18} fill="currentColor" /> Recomendação Master
                (IA)
              </h3>
              <p className="font-heading text-2xl md:text-3xl leading-tight tracking-wide relative z-10 italic">
                {recomendacaoPrincipal}
              </p>
            </div>

            {/* MERCADOS ALTERNATIVOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dados.mercados_alternativos?.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#121212] border border-dark-border p-4 rounded-xl border-t-2 border-t-neon/20"
                >
                  <p className="text-neon text-[10px] font-black uppercase mb-1">
                    {m.mercado}
                  </p>
                  <p className="text-white font-bold text-sm mb-1">{m.tip}</p>
                  <p className="text-gray-500 text-[10px] leading-tight italic">
                    {m.porque}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RADAR DE 10 MINUTOS (Termômetro de Inércia) */}
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="flex items-center gap-2 text-white font-bold italic uppercase text-xs tracking-widest">
                <Activity size={18} className="text-neon" />
                Telemetria: Últimos 10 Minutos
              </h2>
              <span className="text-[9px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold uppercase">
                Inércia de Campo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coluna de Barras */}
              <div className="space-y-6">
                {[
                  {
                    label: "Pressão Ofensiva",
                    val: dados.termometro_10min?.pressao_ofensiva || 0,
                    color: "bg-neon",
                  },
                  {
                    label: "Domínio Territorial",
                    val: dados.termometro_10min?.dominio_territorial || 0,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Intensidade de Duelos",
                    val: dados.termometro_10min?.intensidade_duelos || 0,
                    color: "bg-purple-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      <span className="text-white font-heading text-lg leading-none">
                        {item.val}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`${item.color} h-full rounded-full shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all duration-1000 ease-out`}
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Coluna de Resumo do Lucky */}
              <div className="relative bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <TrendingUp size={40} className="text-neon" />
                </div>
                <p className="text-[9px] text-neon font-black uppercase mb-2 tracking-widest">
                  Veredito da Inércia
                </p>
                <p className="text-gray-300 text-sm italic leading-relaxed relative z-10">
                  "
                  {dados.termometro_10min?.resumo_tatico ||
                    "O motor está processando o volume de jogo recente..."}
                  "
                </p>
              </div>
            </div>
          </div>

          {/* INTELIGÊNCIA DE CAMPO */}
          <div className="relative bg-[#0a0a0c] border border-dark-border rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-8 border-b border-dark-border pb-4">
              <h3 className="text-white font-black tracking-widest text-[11px] uppercase flex items-center gap-2">
                <Crosshair size={18} className="text-neon" />
                Inteligência de Campo{" "}
                <span className="text-gray-600">| Diagnósticos do Lucky</span>
              </h3>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-neon animate-ping"></div>
                <div className="w-1 h-1 rounded-full bg-neon opacity-50"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fatores.map((fator: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#121212] border border-white/5 p-4 rounded-xl hover:border-neon/30 transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    {/* O split aqui assume que você enviou "Emoji Título: Descrição" do backend */}
                    <div className="text-neon font-bold text-xs uppercase tracking-tighter group-hover:scale-105 transition-transform origin-left">
                      {fator.split(":")[0]}
                    </div>
                    <p className="text-gray-300 text-sm leading-snug font-medium italic">
                      {fator.split(":")[1] || fator}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé tático interno */}
            <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-50">
              <ShieldAlert size={12} /> Dados processados em baixa latência
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (FEED) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col h-full">
          <div className="bg-[#121212] border border-dark-border rounded-2xl p-6 flex-1 max-h-212.5 overflow-hidden flex flex-col relative">
            <h2 className="flex items-center gap-2 text-white font-bold mb-6 pb-4 border-b border-dark-border uppercase text-[11px] tracking-widest italic">
              <Zap size={16} className="text-neon" /> Live Intel Feed
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-neon/10">
              {feedAtivo.length === 0 ? (
                <div className="text-center text-gray-600 mt-10 italic text-sm">
                  Aguardando telemetria...
                </div>
              ) : (
                feedAtivo.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 group animate-fade-in">
                    <div className="mt-1">
                      <div className="p-2 bg-gray-900 text-neon rounded-lg border border-neon/5 group-hover:border-neon/30 transition-all">
                        <Bot size={16} />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-200 text-sm font-medium leading-snug group-hover:text-white transition-colors">
                        {item.texto}
                      </p>
                      <span className="text-[9px] text-gray-500 font-black mt-1 block uppercase italic tracking-tighter">
                        {item.tempo}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
          <MessageSquare size={18} /> Lucky explica
        </button>
        <button
          onClick={handleSimular}
          disabled={simulando}
          className="flex-1 md:flex-none bg-neon text-black font-black px-12 py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(204,255,0,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 uppercase italic text-sm tracking-widest"
        >
          {simulando ? (
            <span className="animate-pulse">Cruzando Dados...</span>
          ) : (
            <>
              <Play size={20} fill="currentColor" /> Simular próx. 10min
            </>
          )}
        </button>
      </div>

      {/* MODAL EXPLICAÇÃO */}
      {showExplicacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0a0a0c] border border-neon/30 rounded-[2.5rem] p-8 w-full max-w-2xl relative shadow-2xl">
            <button
              onClick={() => setShowExplicacaoModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              <X size={28} />
            </button>
            <h3 className="text-neon font-heading text-4xl mb-4 italic flex items-center gap-3 tracking-tighter">
              <Bot size={36} /> Análise do Modelo
            </h3>
            <div className="space-y-4 text-gray-300 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              <div className="p-6 bg-neon/5 border border-neon/20 rounded-2xl border-l-4 border-l-neon">
                <p className="font-medium text-gray-200">{explicacaoIa}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {dados.mercados_alternativos?.map((m: any, i: number) => (
                  <div
                    key={i}
                    className="border-l-2 border-neon/30 pl-4 py-2 bg-white/5 rounded-r-xl"
                  >
                    <span className="text-neon text-[10px] font-black uppercase">
                      {m.mercado}
                    </span>
                    <p className="text-white font-bold text-sm">{m.tip}</p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      {m.porque}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowExplicacaoModal(false)}
              className="w-full bg-neon text-black font-bold py-5 rounded-2xl mt-8 hover:brightness-110 transition-all uppercase tracking-widest"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL SIMULAÇÃO (PROJEÇÃO 10') */}
      {showSimulacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-fade-in">
          <div className="bg-[#0a0a0c] border border-neon/50 rounded-3xl p-10 w-full max-w-lg relative shadow-[0_0_60px_rgba(204,255,0,0.15)]">
            <button
              onClick={() => setShowSimulacaoModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-neon/20 rounded-lg text-neon">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-neon font-heading text-3xl italic tracking-tighter">
                  Projeção 10'
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                  Cálculo Probabilístico em Tempo Real
                </p>
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
                  {dados.projecao_10min?.analise_correlacionada ||
                    "O motor identificou um comportamento anômalo nas linhas defensivas, sugerindo um desequilíbrio iminente."}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-dark-border pt-4">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      Confiança IA
                    </p>
                    <p className="text-neon font-heading text-3xl">
                      {dados.projecao_10min?.valor_estimado || "80%"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      Volume vs Média
                    </p>
                    <p className="text-white font-bold text-lg">
                      {dados.projecao_10min?.concorrencia_estatistica ||
                        "2.4x superior"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-neon text-black font-black py-5 rounded-2xl hover:shadow-[0_0_30px_#ccff0080] transition-all transform active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                onClick={() =>
                  window.open("https://esportesdasorte.com", "_blank")
                }
              >
                Fazer Entrada na Esportes da Sorte{" "}
                <Play size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
