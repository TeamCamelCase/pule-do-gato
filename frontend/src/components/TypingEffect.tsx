import { useState, useEffect } from 'react';

// Texto que vai ficar trocando na tela
const words = ['MAGIA.', 'TECNOLOGIA.'];

export default function TypingEffect() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSubstring, setCurrentSubstring] = useState('');
  const [isErasing, setIsErasing] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150); // Velocidade de digitação

  useEffect(() => {
    // Lógica da Máquina de Escrever (Digitar -> Apagar -> Trocar de palavra -> Repetir)
    const timeout = setTimeout(() => {
      const currentFullWord = words[currentWordIndex];

      if (!isErasing) {
        // --- DIGITANDO ---
        setCurrentSubstring(currentFullWord.substring(0, currentSubstring.length + 1));
        setTypingSpeed(150); // Velocidade normal

        if (currentSubstring.length === currentFullWord.length) {
          // Terminou de digitar a palavra inteira, aguarda 2 segundos e começa a apagar
          setIsErasing(true);
          setTypingSpeed(2000); 
        }
      } else {
        // --- APAGANDO ---
        setCurrentSubstring(currentFullWord.substring(0, currentSubstring.length - 1));
        setTypingSpeed(80); // Velocidade mais rápida ao apagar

        if (currentSubstring.length === 0) {
          // Terminou de apagar, troca de palavra e começa a digitar a próxima
          setIsErasing(false);
          setTypingSpeed(500); 
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentSubstring, isErasing, typingSpeed, currentWordIndex]);

  return (
    // PARENTE RELATIVO PARA MANTER O LAYOUT ESTÁVEL
    // 1. Trocamos h-[1.1em] por h-auto para maior flexibilidade vertical.
    // 2. Trocamos inline-block por inline e align-baseline para alinhar perfeitamente com o texto estático no mobile.
    <span className="relative inline h-auto overflow-hidden align-baseline">
      
      {/* O HACK DE ESTABILIDADE (Renderizamos a palavra mais longa invisível) */}
      <span className="invisible select-none h-0 pointer-events-none" aria-hidden="true">
        TECNOLOGIA.
      </span>
      
      {/* O TEXTO QUE DIGITA REALMENTE, POSICIONADO ABSOLUTO */}
      {/* 3. APLICAMOS A CLASSE .text-blur-fade-right para o efeito de blur no final. */}
      <span className="absolute top-0 left-0 text-neon inline-flex items-center gap-1 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)] text-blur-fade-right">
        {currentSubstring}
        {/* Cursor piscando */}
        <span className="w-[3px] h-[0.8em] bg-neon rounded-full animate-blink-cursor" />
      </span>
    </span>
  );
}