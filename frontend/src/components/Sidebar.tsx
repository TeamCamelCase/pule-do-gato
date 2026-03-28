import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sticky left-0 top-20 w-80 min-h-screen border-r border-[#272727] dark-bg">
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
            onClick={() => navigate("/home")}
            className={`flex items-center w-full px-3 py-2 cursor-pointer transition
    ${
      location.pathname === "/home"
        ? "text-[#9cff93] bg-[#303030] border-l-[3px] border-[#9cff93] rounded-r-[15px]"
        : "text-[#aaa] hover:bg-[#1f1f1f]"
    }
  `}
          >
            <svg
              className="ml-2 mt-1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isActive("/home") ? "#9cff93" : "#ABABAB"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM15 7.5L16.35 7.05L16.75 5.7C16.2167 4.9 15.575 4.2125 14.825 3.6375C14.075 3.0625 13.25 2.63333 12.35 2.35L11 3.3V4.7L15 7.5ZM5 7.5L9 4.7V3.3L7.65 2.35C6.75 2.63333 5.925 3.0625 5.175 3.6375C4.425 4.2125 3.78333 4.9 3.25 5.7L3.65 7.05L5 7.5ZM3.95 15.2L5.1 15.1L5.85 13.75L4.4 9.4L3 8.9L2 9.65C2 10.7333 2.15 11.7208 2.45 12.6125C2.75 13.5042 3.25 14.3667 3.95 15.2ZM10 18C10.4333 18 10.8583 17.9667 11.275 17.9C11.6917 17.8333 12.1 17.7333 12.5 17.6L13.2 16.1L12.55 15H7.45L6.8 16.1L7.5 17.6C7.9 17.7333 8.30833 17.8333 8.725 17.9C9.14167 17.9667 9.56667 18 10 18ZM7.75 13H12.25L13.65 9L10 6.45L6.4 9L7.75 13ZM16.05 15.2C16.75 14.3667 17.25 13.5042 17.55 12.6125C17.85 11.7208 18 10.7333 18 9.65L17 8.95L15.6 9.4L14.15 13.75L14.9 15.1L16.05 15.2Z" />
            </svg>

            <p className="ml-2">FUTEBOL</p>
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
