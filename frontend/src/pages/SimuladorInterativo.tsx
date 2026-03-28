import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Opções de Esportes e Ligas (Mockado conforme o Figma)
const opcoes = {
  futebol: [
    { id: "bra", nome: "Série A Brasil", icone: "🇧🇷" },
    { id: "eng", nome: "Premier League", icone: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id: "esp", nome: "La Liga", icone: "🇪🇸" },
    { id: "lib", nome: "Libertadores", icone: "🏆" },
  ],
  basquete: [
    { id: "nba", nome: "NBA", icone: "🏀" },
    { id: "euo", nome: "EuroLeague", icone: "🇪🇺" },
  ],
};

export default function SimuladorInterativo() {
  // Estados para controlar o fluxo da conversa
  const [passo, setPasso] = useState(0);
  const [esporte, setEsporte] = useState<string | null>(null);
  const [liga, setLiga] = useState<any>(null);

  // Função para reiniciar o chat
  const resetChat = () => {
    setPasso(0);
    setEsporte(null);
    setLiga(null);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto min-h-[calc(100dvh-80px)] px-4 mt-6 md:mt-10 pb-32 md:pb-16 animate-fade-in-up">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center gap-3 border-b border-dark-border pb-5 mb-8">
        <div className="bg-neon/10 rounded-2xl border border-neon/30 text-neon animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.15)]">
          <img src="cat-mascot.png" className="w-16" alt="" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading tracking-wide uppercase">
            Lucky: O Mestre Tático
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Olá! Eu sou o assistente inteligente do Pule do Gato. O que vamos
            analisar hoje?
          </p>
        </div>
      </div>

      {/* ÁREA DA CONVERSA (Os balões de chat) */}
      <div className="flex-1 flex flex-col gap-8">
        {/* --- MENSAGEM 1: O esporte (Sempre visível) --- */}
        <div className="flex flex-col items-start gap-3 w-full animate-fade-in-up">
          <div className="flex items-center gap-2">
            {/* <Bot size={18} className="text-neon" /> */}
            <span className="font-bold text-sm text-gray-300">Lucky</span>
          </div>
          <div className="bg-dark-card p-4 rounded-xl rounded-bl-none border border-dark-border text-white text-base max-w-[85%]">
            Para começarmos, qual esporte você deseja ter o **Pule do Gato**?
          </div>

          {/* Opções de Resposta do Usuário (Esporte) */}
          <div className="flex flex-wrap gap-2 mt-2 ml-4">
            <button
              onClick={() => {
                setEsporte("futebol");
                setPasso(1);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border transition-all ${
                esporte === "futebol"
                  ? "bg-neon text-dark-bg border-neon shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                  : "bg-dark-bg text-white border-dark-border hover:border-gray-500 hover:bg-dark-card"
              }`}
            >
              Futebol ⚽
            </button>
            <button
              onClick={() => {
                setEsporte("basquete");
                setPasso(1);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border transition-all ${
                esporte === "basquete"
                  ? "bg-neon text-dark-bg border-neon shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                  : "bg-dark-bg text-white border-dark-border hover:border-gray-500 hover:bg-dark-card"
              }`}
            >
              Basquete 🏀
            </button>
          </div>
        </div>

        {/* --- MENSAGEM 2: A Liga (Aparece após escolher o esporte) --- */}
        {passo >= 1 && esporte && (
          <div className="flex flex-col items-start gap-3 w-full animate-fade-in-up delay-100">
            <div className="flex items-center gap-2">
              {/* <Bot size={18} className="text-neon" /> */}
              <span className="font-bold text-sm text-gray-300">Lucky</span>
            </div>
            <div className="bg-dark-card p-4 rounded-xl rounded-bl-none border border-dark-border text-white text-base max-w-[85%]">
              Ótima escolha! Qual campeonato você quer analisar as estatísticas
              táticas e o Índice de Pressão AI?
            </div>

            {/* Opções de Resposta do Usuário (Ligas) - COM A TIPAGEM CORRIGIDA AQUI */}
            <div className="flex flex-wrap gap-2 mt-2 ml-4 max-w-[90%]">
              {opcoes[esporte as keyof typeof opcoes].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLiga(item);
                    setPasso(2);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border transition-all ${
                    liga?.id === item.id
                      ? "bg-neon text-dark-bg border-neon shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                      : "bg-dark-bg text-white border-dark-border hover:border-gray-500 hover:bg-dark-card"
                  }`}
                >
                  {item.icone} {item.nome}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- MENSAGEM 3: O Veredito Final (Aparece após escolher a liga) --- */}
        {passo >= 2 && liga && (
          <div className="flex flex-col items-start gap-3 w-full animate-fade-in-up delay-200 mb-8 pb-8 border-b border-dark-border">
            <div className="flex items-center gap-2">
              {/*  <Bot size={18} className="text-neon" /> */}
              <span className="font-bold text-sm text-gray-300">Lucky</span>
            </div>
            <div className="bg-dark-card p-4 rounded-xl rounded-bl-none border border-dark-border text-white text-base max-w-[85%] relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-neon animate-pulse" />
              Pronto! O Radar AI está monitorando a **{liga.nome}** {liga.icone}
              . Eu separei as melhores oportunidades táticas e os jogos que
              estão **"Fervendo"** no Índice de Pressão (IP).{" "}
              <br className="hidden md:block" /> Vamos lá?
            </div>

            {/* Ação Principal do Usuário (Link para o Feed Quente) */}
            <div className="mt-4 w-full flex justify-center">
              <Link
                to="/quentes"
                className="w-full md:w-auto text-center bg-neon text-black font-bold text-lg px-12 py-4 rounded-xl hover:bg-[#aacc00] hover:scale-105 transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] uppercase tracking-widest flex items-center gap-2 justify-center z-10"
              >
                Abrir Radar AI <ArrowRight size={20} />
              </Link>
            </div>

            <button
              onClick={resetChat}
              className="text-xs text-gray-500 hover:text-white mt-4 ml-4"
            >
              Reiniciar Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
