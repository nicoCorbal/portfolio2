"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

// Simple trigger: just type "play"
const TRIGGER_WORD = "play";

const WORD_POOLS = {
  easy: ["css", "git", "npm", "api", "app", "web", "dev", "bug", "dom", "url", "sql", "cli", "jsx", "vue"],
  medium: ["react", "redux", "async", "hooks", "fetch", "state", "route", "build", "stack", "cache", "props", "array", "const", "class"],
  hard: ["typescript", "component", "frontend", "database", "function", "callback", "promise", "interface", "webpack", "nextjs", "express"],
  expert: ["authentication", "optimization", "middleware", "microservice", "deployment", "infrastructure", "refactoring", "responsive"],
};

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

export default function TypingGame() {
  const [isActive, setIsActive] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastPoints, setLastPoints] = useState<{ points: number; x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);

  const t = useTranslations("game");
  const typedBuffer = useRef("");
  const wordIdCounter = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const difficulty = Math.min(Math.floor(wordsTyped / 5), 15);

  // Trigger: type "play" anywhere on the page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive) return;
      // Ignore if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      if (key.length === 1 && key >= 'a' && key <= 'z') {
        typedBuffer.current += key;
        // Keep only last 4 characters
        if (typedBuffer.current.length > 4) {
          typedBuffer.current = typedBuffer.current.slice(-4);
        }
        if (typedBuffer.current === TRIGGER_WORD) {
          setIsActive(true);
          setShowIntro(true);
          typedBuffer.current = "";
        }
      }
    };

    // Listen for custom event (mobile button click)
    const handleActivateGame = () => {
      if (!isActive) {
        setIsActive(true);
        setShowIntro(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("activateGame", handleActivateGame);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("activateGame", handleActivateGame);
    };
  }, [isActive]);

  const getRandomWord = useCallback(() => {
    let pool: string[];
    if (difficulty <= 3) pool = WORD_POOLS.easy;
    else if (difficulty <= 7) pool = [...WORD_POOLS.easy, ...WORD_POOLS.medium];
    else if (difficulty <= 12) pool = [...WORD_POOLS.medium, ...WORD_POOLS.hard];
    else pool = [...WORD_POOLS.hard, ...WORD_POOLS.expert];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [difficulty]);

  const spawnWord = useCallback(() => {
    const word = getRandomWord();
    const baseSpeed = 0.10 + difficulty * 0.018;
    const newWord: FallingWord = {
      id: wordIdCounter.current++,
      word,
      x: 12 + Math.random() * 76,
      y: -6,
      speed: baseSpeed + Math.random() * 0.025,
    };
    setWords(prev => [...prev, newWord]);
  }, [getRandomWord, difficulty]);

  const resetGame = useCallback(() => {
    setWords([]);
    setInput("");
    setScore(0);
    setLives(5);
    setGameOver(false);
    setWordsTyped(0);
    setCombo(0);
    setLastPoints(null);
    setShake(false);
    wordIdCounter.current = 0;
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (!isActive || showIntro || gameOver) return;
    let lastTime = performance.now();
    const updateGame = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;
      setWords(prev => {
        const updated = prev.map(w => ({ ...w, y: w.y + w.speed * delta }));
        const fallen = updated.filter(w => w.y >= 85);
        const remaining = updated.filter(w => w.y < 85);
        if (fallen.length > 0) {
          setShake(true);
          setTimeout(() => setShake(false), 300);
          setLives(l => {
            const newLives = l - fallen.length;
            if (newLives <= 0) setGameOver(true);
            return Math.max(0, newLives);
          });
          setCombo(0);
        }
        return remaining;
      });
      gameLoopRef.current = requestAnimationFrame(updateGame);
    };
    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isActive, showIntro, gameOver]);

  useEffect(() => {
    if (!isActive || showIntro || gameOver) return;
    const spawnInterval = Math.max(3500 - difficulty * 180, 900);
    const initialDelay = setTimeout(spawnWord, 800);
    spawnTimerRef.current = window.setInterval(spawnWord, spawnInterval);
    return () => {
      clearTimeout(initialDelay);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isActive, showIntro, gameOver, difficulty, spawnWord]);

  useEffect(() => {
    if (isActive && !showIntro && !gameOver) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isActive, showIntro, gameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    setInput(value);
    const matchedWord = words.find(w => w.word === value);
    if (matchedWord) {
      const basePoints = matchedWord.word.length * 10;
      const comboBonus = Math.floor(basePoints * combo * 0.25);
      const points = basePoints + comboBonus;
      setScore(s => {
        const newScore = s + points;
        setBestScore(b => Math.max(b, newScore));
        return newScore;
      });
      setWordsTyped(w => w + 1);
      setCombo(c => c + 1);
      setLastPoints({ points, x: matchedWord.x, y: matchedWord.y });
      setTimeout(() => setLastPoints(null), 800);
      setWords(prev => prev.filter(w => w.id !== matchedWord.id));
      setInput("");
    }
  };

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        setIsActive(false);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      }
      if ((showIntro || gameOver) && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        if (showIntro) setShowIntro(false);
        resetGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, showIntro, gameOver, resetGame]);

  useEffect(() => {
    const saved = localStorage.getItem("typing-game-best");
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (bestScore > 0) localStorage.setItem("typing-game-best", bestScore.toString());
  }, [bestScore]);

  const getMatchState = (word: string) => {
    if (!input) return { matched: "", remaining: word };
    if (word.startsWith(input)) return { matched: input, remaining: word.slice(input.length) };
    return { matched: "", remaining: word };
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100]"
          style={{ backgroundColor: "var(--bg)" }}
        >
          <AnimatePresence mode="wait">
            {showIntro ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col items-center justify-center px-8"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="text-[18vw] sm:text-[14vw] md:text-[11vw] font-semibold tracking-[-0.05em] leading-[0.8]"
                  style={{ color: "var(--text)" }}
                >
                  {t("title")}<span style={{ color: "var(--accent)" }}>.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-8 text-base sm:text-lg tracking-[-0.01em] font-normal"
                  style={{ color: "var(--text)" }}
                >
                  {t("instructions")}
                </motion.p>

                {bestScore > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-xs tracking-[0.2em] uppercase"
                    style={{ color: "var(--text)" }}
                  >
                    {t("best")} {bestScore.toLocaleString()}
                  </motion.p>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => { setShowIntro(false); resetGame(); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-16 px-10 py-4 text-base font-medium tracking-[-0.01em] rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: "var(--text)",
                    color: "var(--bg)",
                  }}
                >
                  {t("play")}
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-8 text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--text)" }}
                >
                  {t("close")}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: shake ? [-2, 2, -2, 2, 0] : 0 }}
                transition={{ duration: shake ? 0.3 : 0.4 }}
                className="h-full flex flex-col"
              >
                {/* Game area */}
                <div className="relative flex-1 overflow-hidden">
                  {/* Score - top left */}
                  <motion.div
                    className="absolute top-8 left-8 sm:left-12 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.p
                      key={score}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="text-5xl sm:text-6xl font-semibold tracking-[-0.04em] tabular-nums"
                      style={{ color: "var(--text)" }}
                    >
                      {score}
                    </motion.p>
                    <AnimatePresence mode="wait">
                      {combo > 1 && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-sm font-medium mt-2 tracking-[-0.01em]"
                          style={{ color: "var(--accent)" }}
                        >
                          {combo}x
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Lives - top right */}
                  <motion.div
                    className="absolute top-10 right-8 sm:right-12 flex gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={{
                          opacity: i < lives ? 0.9 : 0.1,
                          scale: i < lives ? 1 : 0.6,
                        }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "var(--text)" }}
                      />
                    ))}
                  </motion.div>

                  {/* Subtle danger gradient at bottom */}
                  <div
                    className="absolute bottom-28 left-0 right-0 h-32 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, var(--accent), transparent)",
                      opacity: 0.03,
                    }}
                  />

                  {/* Words */}
                  <AnimatePresence>
                    {words.map((word) => {
                      const { matched, remaining } = getMatchState(word.word);
                      const isMatching = matched.length > 0;
                      return (
                        <motion.p
                          key={word.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.15 } }}
                          className="absolute text-2xl sm:text-3xl md:text-[2.5rem] font-medium tracking-[-0.02em] select-none"
                          style={{
                            left: `${word.x}%`,
                            top: `${word.y}%`,
                            transform: "translateX(-50%)",
                          }}
                        >
                          <span
                            style={{ color: "var(--accent)" }}
                            className="transition-all duration-75"
                          >
                            {matched}
                          </span>
                          <span
                            style={{
                              color: "var(--text)",
                              opacity: isMatching ? 0.3 : 0.5,
                            }}
                            className="transition-opacity duration-75"
                          >
                            {remaining}
                          </span>
                        </motion.p>
                      );
                    })}
                  </AnimatePresence>

                  {/* Points popup */}
                  <AnimatePresence>
                    {lastPoints && (
                      <motion.p
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -40, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute text-lg font-semibold pointer-events-none"
                        style={{
                          left: `${lastPoints.x}%`,
                          top: `${lastPoints.y}%`,
                          transform: "translateX(-50%)",
                          color: "var(--accent)",
                        }}
                      >
                        +{lastPoints.points}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input area */}
                <motion.div
                  className="px-8 pb-16 pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative max-w-2xl mx-auto">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      disabled={gameOver}
                      placeholder="start typing..."
                      autoFocus
                      className="w-full text-center text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.02em] bg-transparent border-none outline-none"
                      style={{
                        color: "var(--text)",
                        caretColor: "var(--accent)",
                      }}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                      style={{ backgroundColor: "var(--accent)", width: "120px" }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>

                {/* Game Over */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      style={{ backgroundColor: "var(--bg)" }}
                    >
                      <motion.p
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        className="text-[22vw] sm:text-[16vw] font-semibold tracking-[-0.05em] leading-[0.8]"
                        style={{ color: "var(--text)" }}
                      >
                        {score}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 flex flex-col items-center gap-2"
                      >
                        {score === bestScore && score > 0 && (
                          <p
                            className="text-xs tracking-[0.25em] uppercase font-medium"
                            style={{ color: "var(--accent)" }}
                          >
                            {t("newRecord")}
                          </p>
                        )}
                        <p
                          className="text-sm tracking-[-0.01em]"
                          style={{ color: "var(--text)", opacity: 0.4 }}
                        >
                          {wordsTyped} {wordsTyped === 1 ? t("word") : t("words")}
                        </p>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={resetGame}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-12 px-10 py-4 text-base font-medium tracking-[-0.01em] rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: "var(--text)",
                          color: "var(--bg)",
                        }}
                      >
                        {t("again")}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ESC */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.12 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: "var(--text)" }}
                >
                  {t("esc")}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
