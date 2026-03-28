import { Link } from "react-router-dom";

import { partidas, tendencias } from "../data/mock";

const Dashboard = () => {
  return (
    <div className="flex flex-col align-middle w-full text-white dark-bg min-h-screen">
      {/* ÁREA DIREITA */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* HEADER FIXO */}

        {/* CONTEÚDO */}
        <div className="overflow-y-auto flex-1 p-6 md:p-10 flex flex-col gap-8 w-full max-w-[1400px] mx-auto">
          {/* HEADER */}
          <div>
            <span className="bg-[#163c2c] text-[#9CFF93] px-3 py-1 rounded-md text-xs font-semibold">
              EXCLUSIVE ACCESS
            </span>

            <h1 className="text-4xl font-bold mt-4">Jogos & Competições</h1>

            <p className="text-[#8a8a8a] mt-2 max-w-[600px]">
              Análise avançada e probabilidades em tempo real para as principais
              competições do futebol mundial.
            </p>
          </div>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD PRINCIPAL */}
            <div className="col-span-1 md:col-span-2 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative">
              <div>
                <div className="flex">
                  <div className="flex mr-3 mt-2 justify-center w-13 h-13 rounded-full bg-[#9CFF931A] border border-[#9CFF9333]">
                    <img src="/premium.svg" alt="" className="w-6" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mt-2">JOGOS AO VIVO</h2>

                    <span className="text-xs text-[#9CFF93] font-light">
                      ACOMPANHE OS MELHORES JOGOS EM TEMPO REAL
                    </span>
                  </div>
                </div>

                <p className="text-[#8a8a8a] mt-3 max-w-[500px]">
                  Acompanhe partidas ao vivo com atualizações em tempo real,
                  estatísticas detalhadas e análises instantâneas. Tenha acesso
                  a probabilidades dinâmicas, desempenho das equipes e insights
                  inteligentes para tomar decisões com mais precisão durante o
                  jogo.
                </p>

                {/* PLAYER */}
                <div className="absolute bottom-0 right-0 hidden md:block">
                  <img
                    src="/player.png"
                    alt=""
                    className="w-60 lg:w-75 opacity-20"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 flex-wrap">
                <Link
                  to="/quentes"
                  className="bg-[#9CFF93] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1eff00] transition"
                >
                  Acompanhar jogos
                </Link>

                <button className="border border-[#7C98FF] text-[#7C98FF] px-4 py-2 rounded-lg text-sm hover:border-[#6887fa] transition bg-[#1f1f1f] hover:bg-[#6887fa] hover:text-black cursor-pointer">
                  Ver estatísticas
                </button>
              </div>
            </div>

            {/* CARD LATERAL */}
            <div className="border border-white/10 rounded-2xl p-5 flex flex-col justify-between bg-[#191919] w-full">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="w-12 h-12 flex rounded-xl bg-[#7C98FF1A] justify-center">
                    <img src="/trophy.svg" alt="" className="w-6" />
                  </div>

                  <span className="text-xs bg-[#1d3f2a] px-2 py-1 rounded text-[#9CFF93]">
                    LIVE NOW
                  </span>
                </div>

                <span className="text-xl font-semibold">Copa do Brasil</span>

                <p className="text-[#8a8a8a] text-sm mt-2">
                  O torneio mais democrático do país. 92 clubes em busca da
                  glória máxima e a maior premiação do continente.
                </p>

                <div className="flex justify-between mt-5 text-[13px] bg-[#1F1F1F] px-4 py-3 rounded-lg">
                  <span>Flamengo vs Palmeiras</span>
                  <span className="text-[#9CFF93] font-semibold">
                    Odds 2.45
                  </span>
                </div>
              </div>

              <button className="text-[#9CFF93] text-sm mt-4 hover:underline cursor-pointer">
                Explorar Tabela Completa
              </button>
            </div>
          </div>

          {/* CARDS MENORES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "nordeste.svg",
                title: "Copa do Nordeste",
                desc: "A Lampions League. Cobertura completa dos clássicos regionais e scouts exclusivos.",
              },
              {
                img: "estaduais.svg",
                title: "Estaduais",
                desc: "Paulistão, Cariocão e Mineiro. Onde as rivalidades locais ganham vida com dados de performance.",
              },
              {
                img: "europeia.svg",
                title: "Liga Europeia",
                desc: "Champions League, Premier League e La Liga. O topo do futebol mundial com análise de IA.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-2xl p-5 hover:border-[#9CFF93] transition w-full"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-11 h-11 bg-[#262626] flex justify-center items-center rounded-full">
                    <img src={item.img} alt="" className="w-5" />
                  </div>

                  <h3 className="font-semibold">{item.title}</h3>
                </div>

                <p className="text-[#8a8a8a] text-sm mt-2">{item.desc}</p>

                <button className="mt-4 border border-[#9CFF93] px-4 py-2 w-full rounded-lg text-sm text-[#9CFF93] hover:bg-[#9CFF93] hover:text-black transition cursor-pointer bg-[#1F1F1F]">
                  Acessar
                </button>
              </div>
            ))}
          </div>

          {/* BOTTOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TENDÊNCIAS */}
            <div className="border border-white/10 rounded-2xl p-6">
              <span className="text-[#9CFF93] text-xs font-semibold">
                PARTIDAS MAIS AGUARDADAS
              </span>

              <h2 className="mt-4 text-2xl font-bold">
                Tendências da Semana:
                <br />
                <span className="text-[#9CFF93]">Futebol Brasileiro</span>
              </h2>

              <div className="mt-6 flex flex-col gap-3">
                {tendencias.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#191919] p-4 rounded-xl hover:bg-[#2a2a2a] transition"
                  >
                    <div className="flex items-center gap-3 border-l-4 border-[#9CFF93] pl-3">
                      <span className="text-[#9CFF93] font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <p className="font-semibold">{t.nome}</p>
                        <span className="text-xs text-[#8a8a8a]">
                          Eficiência em alta
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MATCHES */}
            <div className="flex flex-col gap-4">
              {partidas.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#191919] border border-white/10 rounded-xl p-4 grid grid-cols-3 items-center hover:border-[#9CFF938f] transition w-full"
                >
                  <span className="text-left truncate">{p.casa}</span>

                  <div className="flex justify-center">
                    <div className="bg-[#1d3f2a] px-4 py-1 rounded text-[#9CFF93] font-bold">
                      {p.placar}
                    </div>
                  </div>

                  <span className="text-right truncate">{p.fora}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <Link
        to="/simular"
        className="fixed hidden bottom-6 right-6 md:bottom-10 md:right-10 md:flex lg:flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-black bg-neon rounded-full hover:bg-[#63fa4f] transition uppercase shadow-[0_0_15px_rgba(204,255,0,0.2)]"
      >
        <img src="cat-mascot.png" className="w-12 md:w-16" alt="" />
      </Link>
    </div>
  );
};

export default Dashboard;
