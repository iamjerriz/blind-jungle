import { useCallback, useEffect, useRef, useState } from 'react';
import { GamePhase, Player, Tile } from '../../lib/types';
import {
  ANIMALS,
  INITIAL_TURNS,
  MAX_TIMEOUT_ROUNDS,
  TURN_TIME,
  canCapture,
  countPieces,
  getValidMoveTargets,
  initBoard,
} from '../../lib/gameLogic';

export function useGameScreen() {
  const [board, setBoard] = useState<(Tile | null)[]>(() => initBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('A');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [validTargets, setValidTargets] = useState<number[]>([]);
  const [remainingTurns, setRemainingTurns] = useState(INITIAL_TURNS);
  const [timer, setTimer] = useState(TURN_TIME);
  const [timeoutRounds, setTimeoutRounds] = useState<Record<Player, number>>({ A: 0, B: 0 });
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const didTimeoutRef = useRef(false);

  const nextPlayer = useCallback((): Player => (currentPlayer === 'A' ? 'B' : 'A'), [currentPlayer]);

  const endTurn = useCallback(
    (newBoard: (Tile | null)[], timedOut = false) => {
      const piecesA = countPieces(newBoard, 'A');
      const piecesB = countPieces(newBoard, 'B');
      const newRemaining = remainingTurns - 1;

      if (piecesA === 0) {
        setPhase('gameover');
        setWinner('B');
        setBoard(newBoard);
        return;
      }
      if (piecesB === 0) {
        setPhase('gameover');
        setWinner('A');
        setBoard(newBoard);
        return;
      }
      if (newRemaining <= 0) {
        setPhase('gameover');
        setWinner(piecesA > piecesB ? 'A' : piecesB > piecesA ? 'B' : 'draw');
        setBoard(newBoard);
        setRemainingTurns(0);
        return;
      }

      const newTimeouts = timedOut
        ? { ...timeoutRounds, [currentPlayer]: timeoutRounds[currentPlayer] + 1 }
        : timeoutRounds;

      if (newTimeouts[currentPlayer] >= MAX_TIMEOUT_ROUNDS) {
        setPhase('gameover');
        setWinner(nextPlayer());
        setBoard(newBoard);
        return;
      }

      setTimeoutRounds(newTimeouts);
      setBoard(newBoard);
      setCurrentPlayer(nextPlayer());
      setSelectedIndex(null);
      setValidTargets([]);
      setRemainingTurns(newRemaining);
      setTimer(TURN_TIME);
      didTimeoutRef.current = false;
    },
    [currentPlayer, nextPlayer, remainingTurns, timeoutRounds]
  );

  useEffect(() => {
    if (phase === 'gameover') return;

    didTimeoutRef.current = false;
    setTimer(TURN_TIME);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (!didTimeoutRef.current) didTimeoutRef.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPlayer, phase]);

  useEffect(() => {
    if (timer === 0 && phase === 'playing' && didTimeoutRef.current) {
      endTurn(board, true);
    }
  }, [timer, phase, board, endTurn]);

  const handleTileClick = useCallback(
    (index: number) => {
      if (phase === 'gameover') return;

      const tile = board[index];

      if (selectedIndex !== null) {
        if (index === selectedIndex) {
          setSelectedIndex(null);
          setValidTargets([]);
          return;
        }

        if (validTargets.includes(index)) {
          const newBoard = [...board];
          const moving = newBoard[selectedIndex]!;
          const target = newBoard[index];

          if (target === null) {
            newBoard[index] = moving;
            newBoard[selectedIndex] = null;
          } else if (target.isRevealed && target.owner !== currentPlayer) {
            if (moving.tier === target.tier) {
              newBoard[index] = null;
              newBoard[selectedIndex] = null;
              setMessage(`Both ${ANIMALS[moving.tier].name}s eliminated!`);
              setTimeout(() => setMessage(null), 1500);
            } else if (canCapture(moving.tier, target.tier)) {
              newBoard[index] = moving;
              newBoard[selectedIndex] = null;
              setMessage(`${ANIMALS[moving.tier].name} captures ${ANIMALS[target.tier].name}!`);
              setTimeout(() => setMessage(null), 1500);
            }
          }

          endTurn(newBoard);
          return;
        }

        setSelectedIndex(null);
        setValidTargets([]);
      }

      if (!tile) return;

      if (!tile.isRevealed) {
        const newBoard = [...board];
        newBoard[index] = { ...tile, isRevealed: true };
        endTurn(newBoard);
        return;
      }

      if (tile.isRevealed && tile.owner === currentPlayer) {
        setSelectedIndex(index);
        setValidTargets(getValidMoveTargets(board, index, currentPlayer));
      }
    },
    [board, currentPlayer, endTurn, phase, selectedIndex, validTargets]
  );

  const resetGame = useCallback(() => {
    setBoard(initBoard());
    setCurrentPlayer('A');
    setSelectedIndex(null);
    setValidTargets([]);
    setRemainingTurns(INITIAL_TURNS);
    setTimer(TURN_TIME);
    setTimeoutRounds({ A: 0, B: 0 });
    setPhase('playing');
    setWinner(null);
    setMessage(null);
    didTimeoutRef.current = false;
  }, []);

  const piecesA = countPieces(board, 'A');
  const piecesB = countPieces(board, 'B');

  return {
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
  };
}
