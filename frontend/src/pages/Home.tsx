import { Link } from "react-router-dom";
import catMascotImg from "../assets/cat-mascot.png";
import logoImg from "../assets/logo.svg";
import TypingEffect from "../components/TypingEffect";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start md:justify-center w-full min-h-[calc(100dvh-80px)] px-6 pt-12 pb-32 md:py-16 text-center md:text-left overflow-hidden relative">
      {/* GATO + LOGO */}
      <div className="flex-1 flex justify-center items-center flex-col md:items-start md:order-2 mt-4 md:mt-0 relative mb-8 md:mb-0 max-w-lg h-full z-10">
        <div className="absolute top-35 left-35 md:top-50 md:left-50 -translate-x-1/2 -translate-y-1/2 bg-[#7cff6b] blur-[100px] md:blur-[120px] rounded-full w-[120px] h-[120px] md:w-[100px] md:h-[100px] pointer-events-none" />

        <img
          src={catMascotImg}
          alt="Mascote"
          className="relative z-10 w-full max-w-[280px] md:max-w-xs lg:max-w-sm object-contain animate-float-glow drop-shadow-2xl"
        />

        <img
          src={logoImg}
          alt="Logo"
          className="relative z-10 w-full max-w-[220px] md:max-w-[320px] lg:max-w-[380px] object-contain -mt-10 md:-mt-20 lg:-mt-24 lg:ml-1 md:ml-[-20px] drop-shadow-lg"
        />
      </div>

      {/* TEXTO + BOTÃO */}
      <div className="flex-1 flex flex-col items-center md:items-start md:justify-center gap-3 md:gap-4 max-w-2xl md:max-w-4xl z-10 md:order-1 h-full md:pr-12">
        <h2 className="font-heading text-xl sm:text-2xl md:text-7xl lg:text-7xl font-extrabold leading-tight tracking-widest text-white uppercase text-center md:text-left">
          FUTEBOL, DADOS E <TypingEffect />
        </h2>

        <Link
          to="/home"
          className="mt-2 md:mt-6 w-[270px] md:w-[300px] lg:w-[300px] text-center bg-neon text-black font-bold text-sm md:text-lg px-8 md:px-12 py-3.5 md:py-4 rounded hover:bg-[#1eff00] hover:scale-105 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.3)] z-20"
        >
          Começar agora
        </Link>
      </div>
    </div>
  );
}
