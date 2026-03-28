import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-80 min-h-screen border-r border-[#272727] dark-bg sticky top-0">
      {/* HEADER */}
      <div className="flex flex-col items-start px-5 pt-12">
        <h1 className="text-white text-[18px] font-bold">
          Central de análises
        </h1>
        <span className="text-[#9cff93] text-[10px] font-bold">
          LIVE ANALYSIS
        </span>
      </div>

      {/* MENU */}
      <ul className="flex flex-col gap-5 mt-8">
        {/* FUTEBOL (ATIVO) */}
        <li>
          <button
            onClick={() => navigate("/futebol")}
            className="flex items-center w-full px-3 py-2 text-[#9cff93] bg-[#303030] border-l-[3px] border-[#9cff93] rounded-r-[15px] cursor-pointer transition"
          >
            <img className="ml-2" src="./futebol-icon.svg" alt="futebol" />
            <p className="ml-3">FUTEBOL</p>
          </button>
        </li>

        {/* OUTROS */}
        <li>
          <button className="flex items-center w-full px-3 py-2 text-[#aaa] hover:bg-[#1f1f1f] cursor-pointer transition">
            <img className="ml-2" src="./casino-icon.svg" alt="cassino" />
            <p className="ml-3">CASSINO</p>
          </button>
        </li>

        <li>
          <button className="flex items-center w-full px-3 py-2 text-[#aaa] hover:bg-[#1f1f1f] cursor-pointer transition">
            <img className="ml-2" src="./sports-icon.svg" alt="esportes" />
            <p className="ml-3">ESPORTES</p>
          </button>
        </li>

        <li>
          <button className="flex items-center w-full px-3 py-2 text-[#aaa] hover:bg-[#1f1f1f] cursor-pointer transition">
            <img className="ml-2" src="./games-icon.svg" alt="jogos" />
            <p className="ml-3">JOGOS</p>
          </button>
        </li>

        <li>
          <button className="flex items-center w-full px-3 py-2 text-[#aaa] hover:bg-[#1f1f1f] cursor-pointer transition">
            <img className="ml-2" src="./settings-icon.svg" alt="settings" />
            <p className="ml-3">CONFIGURAÇÕES</p>
          </button>
        </li>

        <li>
          <button className="flex items-center w-full px-3 py-2 text-[#aaa] hover:bg-[#1f1f1f] cursor-pointer transition">
            <img className="ml-2" src="./support-icon.svg" alt="support" />
            <p className="ml-3">SUPORTE</p>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
