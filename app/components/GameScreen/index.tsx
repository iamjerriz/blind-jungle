'use client';

import GameBoard from '../GameBoard';
import PlayerPanel from '../PlayerPanel';
import PieceQueue from '../PieceQueue';
import { useGameScreen } from './useGameScreen';
import { PLAYER_NAMES, TOTAL_PIECES } from './constants';

export default function GameScreen() {
  const {
    board,
    currentPlayer,
    selectedIndex,
    validTargets,
    remainingTurns,
    timer,
    timeoutRounds,
    phase,
    winner,
    message,
    piecesA,
    piecesB,
    handleTileClick,
    resetGame,
  } = useGameScreen();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #e8d5f5 0%, #c7d7f5 50%, #b8e4f9 100%)',
      }}
    >
      {/* Decorative top ribbon */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-b-full opacity-60"
        style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
      />

      {/* Capture message toast */}
      {message && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full shadow-lg text-lg animate-bounce">
          {message}
        </div>
      )}

      {/* Game Over overlay */}
      {phase === 'gameover' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl p-10 flex flex-col items-center gap-6 shadow-2xl"
            style={{ maxWidth: 360 }}
          >
            <div className="text-5xl">
              {winner === 'draw' ? '🤝' : '🏆'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {winner === 'draw' ? "It's a Draw!" : `${PLAYER_NAMES[winner!]} Wins!`}
            </h2>
            <p className="text-gray-500">
              Final score: {piecesA} vs {piecesB} pieces
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-3 rounded-full font-bold text-white text-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Main game layout */}
      <div className="flex items-start gap-6 mt-8">
        <PlayerPanel
          player="A"
          label={PLAYER_NAMES.A}
          pieceCount={piecesA}
          totalPieces={TOTAL_PIECES}
          timeoutRounds={timeoutRounds.A}
          isCurrentPlayer={currentPlayer === 'A'}
          timer={timer}
        />

        <GameBoard
          board={board}
          selectedIndex={selectedIndex}
          validTargets={validTargets}
          onTileClick={handleTileClick}
          remainingTurns={remainingTurns}
        />

        <PlayerPanel
          player="B"
          label={PLAYER_NAMES.B}
          pieceCount={piecesB}
          totalPieces={TOTAL_PIECES}
          timeoutRounds={timeoutRounds.B}
          isCurrentPlayer={currentPlayer === 'B'}
          timer={timer}
        />
      </div>

      <div className="mt-6">
        <PieceQueue />
      </div>
    </div>
  );
}
