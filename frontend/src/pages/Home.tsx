import { Link } from "react-router-dom";
import catMascotImg from "../assets/cat-mascot.png";
import logoImg from "../assets/logo.svg";
// IMPORTANDO A NOVA ANIMAÇÃO MÁGICA ESTABILIZADA E ALINHADA VERTICALMENTE
import TypingEffect from "../components/TypingEffect";

export default function Home() {
  return (
    // PARENTE PRINCIPAL RESPONSIVO
    // No Mobile: justify-start (move tudo pra cima), pt-12 (respiro topo), pb-32 (fundo livre).
    // No PC: md:justify-center (centraliza verticalmente), md:py-16 (respiro padrão).
    <div className="flex flex-col md:flex-row items-center justify-start md:justify-center w-full min-h-[calc(100dvh-80px)] px-6 pt-12 pb-32 md:py-16 text-center md:text-left overflow-hidden relative">
      {/* --- MOBILE STACKS: GATO/LOGO EM CIMA NO CELULAR --- */}
      {/* Lado Esquerdo (PC): O Mascote e o Logo */}
      {/* md:order-2: No PC, vai para a direita */}
      {/* mb-8 md:mb-0: Compactamos a margem inferior no mobile. */}
      <div className="flex-1 flex justify-center items-center flex-col md:items-start md:order-2 mt-4 md:mt-0 relative mb-8 md:mb-0 max-w-lg h-full z-10">
        {/* Glow azul neon atrás do gato - Ajustado para ser menor no mobile */}
        <div className="absolute top-35 left-35 md:top-50 md:left-50 -translate-x-1/2 -translate-y-1/2 bg-[#7cff6b] blur-[100px] md:blur-[120px] rounded-full w-[120px] h-[120px] md:w-[100px] md:h-[100px] pointer-events-none" />

        {/* O GATO com animação de flutuar e brilhar, diminuído MUITO no PC */}
        <img
          src={catMascotImg}
          alt="Mascote O Pule do Gato"
          className="relative z-10 w-full max-w-[280px] md:max-w-xs lg:max-w-sm object-contain animate-float-glow drop-shadow-2xl"
        />

        {/* O LOGO: Colado e centralizado no gatinho. SUPER APROXIMADO (-mt-16 md:-mt-24) */}
        <img
          src={logoImg}
          alt="O Pule do Gato"
          className="relative z-10 w-full max-w-[220px] md:max-w-[320px] lg:max-w-[380px] object-contain -mt-10 md:-mt-20 lg:-mt-24 lg:ml-1  md:ml-[-20px] drop-shadow-lg"
        />
      </div>

      {/* --- TEXTO SEMPRE EMBAIXO NO MOBILE, ALINHADO NO PC --- */}
      {/* Lado Direito (PC): O Texto e o Botão */}
      {/* md:order-1: No PC, vai para a esquerda */}
      {/* gap-2 md:gap-4: Diminuímos o gap entre texto e botão. mt-0 no mobile. */}
      <div className="flex-1 flex flex-col items-center md:items-start md:justify-center gap-2 md:gap-4 max-w-2xl md:max-w-4xl z-10 md:mt-[-100px] md:mt-0 md:order-1 h-full md:pr-12">
        {/* Usando a fonte Bebas Neue (font-heading) */}
        {/* text-xl (md:text-5xl): TÍTULO DIMINUÍDO GIGANTEMENTE PARA ELEGÂNCIA */}
        {/* O tamanho pequeno text-xl no mobile centraliza melhor com a imagem */}
        <h2 className="font-heading text-xl sm:text-2xl md:text-7xl lg:text-7xl font-extrabold leading-[1.0] tracking-widest text-white uppercase">
          FUTEBOL, DADOS E <br className="hidden md:block" />
          {/* AQUI ESTÁ A MÁGICA! A animação de digitação estabilizada e alinhada */}
          <TypingEffect />
        </h2>

        {/* Botão centralizado no mobile, menor e alinhado no PC. TOTALMENTE FIXO AGORA. */}
        <Link
          to="/home"
          className="mt-2 md:mt-6 w-full md:w-auto text-center bg-neon text-black font-bold text-sm md:text-lg px-8 md:px-12 py-3.5 md:py-4 rounded hover:bg-[#1eff00] hover:scale-105 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.3)] z-20"
        >
          Começar agora
        </Link>
      </div>
    </div>
  );
}
