import { useEffect, useState } from "react";

const words = ["MAGIA.", "TECNOLOGIA."];

export default function TypingEffect() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSubstring, setCurrentSubstring] = useState("");
  const [isErasing, setIsErasing] = useState(false);
  const [delay, setDelay] = useState(120);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isErasing) {
        const next = currentWord.substring(0, currentSubstring.length + 1);
        setCurrentSubstring(next);

        if (next === currentWord) {
          setDelay(1200);
          setIsErasing(true);
        } else {
          setDelay(100);
        }
      } else {
        const next = currentWord.substring(0, currentSubstring.length - 1);
        setCurrentSubstring(next);

        if (next === "") {
          setIsErasing(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setDelay(400);
        } else {
          setDelay(50);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentSubstring, isErasing, currentWordIndex, delay]);

  return (
    <span
      className="inline font-bold"
      style={{
        color: "#9cff93",
        textShadow:
          "0 0 6px rgba(156,255,147,0.8), 0 0 12px rgba(156,255,147,0.6)",
      }}
    >
      {currentSubstring}
      <span className="ml-1 animate-pulse">|</span>
    </span>
  );
}
