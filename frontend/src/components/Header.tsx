import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between border-[#272727] text-sm dark-bg px-4 md:px-10 py-4 relative z-50">
        {/* LOGO */}
        <Link to="/" className="w-fit">
          <img
            src="/pule-logo.png"
            alt="logo"
            className="w-[100px] md:w-[120px]"
          />
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-8">
          <Link to="/quentes">
            <li className="text-[#aaa] cursor-pointer hover:text-white transition">
              Jogos ao vivo
            </li>
          </Link>
          <li className="text-[#aaa] cursor-pointer hover:text-white transition">
            Campeonatos
          </li>
          <li className="text-[#aaa] cursor-pointer hover:text-white transition">
            Esportes
          </li>
          <li className="text-[#aaa] cursor-pointer hover:text-white transition">
            Análises
          </li>
        </ul>

        {/* INPUT DESKTOP */}
        <div className="hidden md:block relative w-[250px]">
          <img
            src="/lupa.svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 opacity-60"
          />
          <input
            placeholder="Pesquisar ligas..."
            className="w-full bg-[#272727] text-white pl-10 pr-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-[#7cff6b] transition"
          />
        </div>

        {/* BOTÃO MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MODAL MOBILE */}
      {open && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-[#111] border-t border-[#272727] px-6 py-6 flex flex-col gap-6 z-40 animate-fade-in">
          {/* INPUT */}
          <div className="relative w-full">
            <img
              src="/lupa.svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 opacity-60"
            />
            <input
              placeholder="Pesquisar ligas..."
              className="w-full bg-[#272727] text-white pl-10 pr-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-[#7cff6b]"
            />
          </div>

          {/* MENU */}
          <ul className="flex flex-col gap-4 text-lg">
            <Link to="/quentes" onClick={() => setOpen(false)}>
              <li className="text-[#aaa] hover:text-white">Jogos ao vivo</li>
            </Link>

            <li className="text-[#aaa] hover:text-white cursor-pointer">
              Campeonatos
            </li>

            <li className="text-[#aaa] hover:text-white cursor-pointer">
              Esportes
            </li>

            <li className="text-[#aaa] hover:text-white cursor-pointer">
              Análises
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
