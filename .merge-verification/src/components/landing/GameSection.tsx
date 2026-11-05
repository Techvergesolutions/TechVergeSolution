import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { Zap, Trophy, RotateCcw, Play, Target } from "lucide-react";

const GRID_SIZE = 4;
const GAME_DURATION = 45;

interface Tile {
  id: number;
  color: string;
  isActive: boolean;
}

const colors = [
  "from-primary to-primary-glow",
  "from-secondary to-secondary-glow",
  "from-accent to-primary",
  "from-primary to-secondary",
];

export const GameSection = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const initializeTiles = useCallback(() => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      isActive: false,
    }));
  }, []);

  const activateRandomTile = useCallback(() => {
    setTiles((prev) => {
      const newTiles = prev.map((t) => ({ ...t, isActive: false }));
      const inactiveIndices = newTiles.map((_, i) => i);
      const numToActivate = Math.min(2 + Math.floor(score / 50), 4);
      
      for (let i = 0; i < numToActivate; i++) {
        if (inactiveIndices.length > 0) {
          const randomIndex = Math.floor(Math.random() * inactiveIndices.length);
          const tileIndex = inactiveIndices.splice(randomIndex, 1)[0];
          newTiles[tileIndex].isActive = true;
          newTiles[tileIndex].color = colors[Math.floor(Math.random() * colors.length)];
        }
      }
      return newTiles;
    });
  }, [score]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setTiles(initializeTiles());
    setTimeout(activateRandomTile, 500);
  };

  const handleTileClick = (id: number) => {
    if (gameState !== "playing") return;

    const tile = tiles.find((t) => t.id === id);
    if (!tile?.isActive) {
      setCombo(0);
      return;
    }

    const newCombo = combo + 1;
    const points = 10 * (1 + Math.floor(newCombo / 3));
    
    setScore((prev) => prev + points);
    setCombo(newCombo);
    
    if (newCombo > 2 && newCombo % 3 === 0) {
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 600);
    }

    setTiles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: false } : t))
    );

    setTimeout(activateRandomTile, 200 + Math.random() * 300);
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          setHighScore((current) => Math.max(current, score));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score]);

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(activateRandomTile, 1500);
      return () => clearInterval(interval);
    }
  }, [gameState, activateRandomTile]);

  return (
    <section id="game" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Interactive Challenge
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Test Your <span className="text-gradient">Reflexes</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience our technical creativity firsthand. Click the glowing tiles as fast as you can
            and build your combo for maximum points!
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-lg mx-auto">
            {/* Game Stats */}
            <div className="flex items-center justify-between mb-6 glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-2xl text-gradient">{score}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground text-sm">x{combo}</span>
                </div>
                <div className="text-muted-foreground font-mono">
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{highScore}</span>
              </div>
            </div>

            {/* Game Grid */}
            <div className="relative">
              <AnimatePresence>
                {showCombo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.5, y: -20 }}
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                  >
                    <span className="text-6xl font-display font-bold text-gradient">
                      COMBO x{combo}!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-4 gap-3 p-6 glass-card rounded-2xl">
                {tiles.map((tile) => (
                  <motion.button
                    key={tile.id}
                    onClick={() => handleTileClick(tile.id)}
                    className={`aspect-square rounded-xl transition-all duration-200 ${
                      tile.isActive
                        ? `bg-gradient-to-br ${tile.color} shadow-lg animate-glow-pulse cursor-pointer`
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                    whileHover={tile.isActive ? { scale: 1.1 } : { scale: 1.02 }}
                    whileTap={tile.isActive ? { scale: 0.9 } : {}}
                    animate={
                      tile.isActive
                        ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                    disabled={gameState !== "playing"}
                  />
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="mt-6 flex justify-center gap-4">
              {gameState === "idle" && (
                <motion.button
                  onClick={startGame}
                  className="btn-primary px-8 py-4 rounded-xl text-primary-foreground font-semibold text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5" />
                  Start Challenge
                </motion.button>
              )}

              {gameState === "finished" && (
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <p className="text-2xl font-display font-bold mb-2">
                      Game Over! Score: <span className="text-gradient">{score}</span>
                    </p>
                    {score >= highScore && score > 0 && (
                      <p className="text-secondary">🎉 New High Score!</p>
                    )}
                  </motion.div>
                  <motion.button
                    onClick={startGame}
                    className="btn-outline-glow px-8 py-4 rounded-xl text-foreground font-semibold flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                  </motion.button>
                </div>
              )}
            </div>

            <p className="text-center text-muted-foreground text-sm mt-6">
              This interactive demo showcases our ability to create engaging,
              performant experiences.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};