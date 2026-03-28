import { Flame, Home, Ticket, User } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.svg";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  // Função para verificar se a rota está ativa
  const isActive = (rota: string) => path === rota;

  // Estilo para Mobile (Bottom Nav)
  const getEstiloMobile = (rota: string) =>
    isActive(rota) ? "text-neon" : "text-gray-500 hover:text-gray-300";

  // Estilo para Desktop (Top Nav)
  const getEstiloDesktop = (rota: string) =>
    isActive(rota) ? "text-neon" : "text-gray-400 hover:text-white";

  return (
    <div className="min-h-screen font-sans flex flex-col bg-dark-bg">
      {/* SIDEBAR */}

      {/* HEADER (Com Menu Desktop integrado) */}
      <header className="h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 bg-dark-bg/95 backdrop-blur z-40 border-b border-dark-border/50">
        {/* Logo à esquerda (Clica para ir pra Home) */}
        <Link
          to="/home"
          className="flex items-center hover:scale-105 transition-transform"
        >
          <img
            src={logoImg}
            alt="O Pule do Gato"
            className="h-10 md:h-14 w-auto object-contain drop-shadow-md"
          />
        </Link>

        {/* === MENU DESKTOP (Escondido no Mobile, Visível no PC) === */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/quentes"
            className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${getEstiloDesktop(
              "/quentes"
            )}`}
          >
            <Flame
              size={18}
              fill={isActive("/quentes") ? "currentColor" : "none"}
            />{" "}
            Em Alta
          </Link>

          <Link
            to="/zebras"
            className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${getEstiloDesktop(
              "/zebras"
            )}`}
          >
            <Ticket
              size={18}
              fill={isActive("/zebras") ? "currentColor" : "none"}
            />{" "}
            Zebras
          </Link>

          <Link
            to="/perfil"
            className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${getEstiloDesktop(
              "/perfil"
            )}`}
          >
            <User
              size={18}
              fill={isActive("/perfil") ? "currentColor" : "none"}
            />{" "}
            Perfil
          </Link>

          {/* O Botão do Assistente Destacado no Desktop */}
        </div>
      </header>

      {/* ÁREA CENTRAL */}
      <main className="flex-1 w-full mx-auto flex pb-24 md:pb-0">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <Outlet />
      </main>

      {/* === BOTTOM NAV MOBILE (Escondido no Desktop, Visível no Celular) === */}
      <nav className="md:hidden fixed bottom-0 w-full bg-dark-card border-t border-dark-border py-2 px-6 pb-6 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 ${getEstiloMobile(
              "/"
            )}`}
          >
            <Home size={24} fill="currentColor" />
            <span className="text-[10px] font-medium">Início</span>
          </Link>

          <Link
            to="/quentes"
            className={`flex flex-col items-center gap-1 ${getEstiloMobile(
              "/quentes"
            )}`}
          >
            <Flame size={24} fill="currentColor" />
            <span className="text-[10px] font-medium">Em Alta</span>
          </Link>

          {/* O Botão Central "Pule do Gato" Mobile */}
          <Link
            to="/simular"
            className="relative -top-6 flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="bg-neon w-16 h-16 flex justify-center rounded-full shadow-[0_0_20px_rgba(204,255,0,0.3)] text-black">
              <img src="/cat-mascot.png" alt="" className="w-14 mt-1 ml-0.5" />
            </div>
            <span className="text-[10px] font-medium text-gray-500 mt-1">
              Lucky IA
            </span>
          </Link>

          <Link
            to="/zebras"
            className={`flex flex-col items-center gap-1 ${getEstiloMobile(
              "/zebras"
            )}`}
          >
            <Ticket size={24} fill="currentColor" />
            <span className="text-[10px] font-medium">Zebras</span>
          </Link>

          <Link
            to="/perfil"
            className={`flex flex-col items-center gap-1 ${getEstiloMobile(
              "/perfil"
            )}`}
          >
            <User size={24} fill="currentColor" />
            <span className="text-[10px] font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
