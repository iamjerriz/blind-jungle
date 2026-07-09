'use client';

import GameBoard from '../GameBoard';
import PlayerPanel from '../PlayerPanel';
import { useGameScreen } from './useGameScreen';
import { PLAYER_NAMES, TOTAL_PIECES } from './constants';
import { TURN_TIME } from '../../lib/gameLogic';

interface Props {
  onExit?: () => void;
  playerAName?: string;
}

export default function GameScreen({ onExit, playerAName }: Props) {
  const { board, currentPlayer, selectedIndex, validTargets, remainingTurns, timer, timeoutRounds, phase, winner, message, piecesA, piecesB, handleTileClick, resetGame } = useGameScreen();

  const names = { A: playerAName || PLAYER_NAMES.A, B: PLAYER_NAMES.B };
  const timerPct = (timer / TURN_TIME) * 100;
  const timerColor = timerPct > 50 ? '#22d3ee' : timerPct > 25 ? '#f59e0b' : '#ef4444';
  const statusText = message ?? `${names[currentPlayer]}'s turn — flip a tile or move a piece`;

  return (
    <div className='bg-cosmic min-h-screen flex flex-col items-center gap-4 p-3 sm:p-5 relative overflow-hidden'>
      {/* Game Over overlay */}
      {phase === 'gameover' && (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
          <div
            className='rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl animate-pop-in border-2'
            style={{ maxWidth: 380, background: 'linear-gradient(160deg, #0e1730, #0a1120)', borderColor: '#22d3ee' }}
          >
            <div className='text-6xl animate-trophy-bounce'>{winner === 'draw' ? '🤝' : '🏆'}</div>
            <h2 className='font-display text-3xl font-extrabold text-white text-center'>{winner === 'draw' ? "It's a Draw!" : `${names[winner!]} Wins!`}</h2>
            <p className='text-slate-400 font-semibold'>
              Final score: {piecesA} vs {piecesB} pieces
            </p>
            <div className='flex gap-3'>
              <button
                onClick={resetGame}
                className='px-6 py-3 rounded-full font-display font-bold text-white text-base transition-all hover:scale-105 active:scale-95 shadow-lg'
                style={{ background: 'linear-gradient(90deg, #0891b2, #22d3ee)' }}
              >
                🔁 Play Again
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className='px-6 py-3 rounded-full font-display font-bold text-slate-300 text-base border border-white/15 hover:bg-white/5 transition-colors'
                >
                  Home
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className='w-full max-w-3xl flex items-center justify-between z-10'>
        <button onClick={onExit ?? resetGame} className='px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors'>
          [ESC] Give Up
        </button>
        <div className='flex items-center gap-2'>
          <button className='w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors' aria-label='Sound'>
            🔊
          </button>
          <button className='w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors' aria-label='Settings'>
            ⚙️
          </button>
        </div>
      </div>

      {/* Score row */}
      <div className='w-full max-w-3xl flex items-stretch justify-between gap-2 sm:gap-3 z-10'>
        <PlayerPanel player='A' label={names.A} pieceCount={piecesA} totalPieces={TOTAL_PIECES} timeoutRounds={timeoutRounds.A} isCurrentPlayer={currentPlayer === 'A'} />

        <div className='shrink-0 self-center flex flex-col items-center gap-1.5'>
          <div
            className='px-4 py-2 rounded-2xl font-display font-extrabold text-lg sm:text-xl tabular-nums border-2'
            style={{ color: timerColor, borderColor: timerColor, background: 'rgba(255,255,255,0.03)' }}
          >
            {timer}s
          </div>
          <div
            className='px-3 py-1 rounded-full font-display font-bold text-[10px] sm:text-xs whitespace-nowrap border'
            style={{ background: 'rgba(34,211,238,0.1)', color: '#67e8f9', borderColor: 'rgba(34,211,238,0.35)' }}
          >
            ⏳ Turns Left: {remainingTurns}
          </div>
        </div>

        <PlayerPanel player='B' label={names.B} pieceCount={piecesB} totalPieces={TOTAL_PIECES} timeoutRounds={timeoutRounds.B} isCurrentPlayer={currentPlayer === 'B'} />
      </div>

      {/* Main game layout */}
      <div className='flex flex-col items-center gap-4 z-10'>
        <GameBoard board={board} selectedIndex={selectedIndex} validTargets={validTargets} onTileClick={handleTileClick} />
      </div>

      {/* Status / capture log bar */}
      {/* <div
        className="w-full max-w-3xl mt-auto rounded-2xl px-4 py-3 text-center z-10 border"
        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <span className={`text-sm font-semibold ${message ? 'text-amber-300' : 'text-slate-400'}`}>{statusText}</span>
      </div> */}
    </div>
  );
}
