'use client';

import { useEffect, useState } from 'react';

interface Props {
  nickname: string;
  onNicknameChange: (value: string) => void;
  onStart: () => void;
}

const STEPS = [
  { title: 'Flip Tiles', desc: null },
  { title: 'Animal Hierarchy', desc: '(Beware the Mouse!)' },
  { title: 'Move & Capture', desc: null },
];

function ElephantConstellation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <ellipse cx="55" cy="60" rx="30" ry="22" />
      <circle cx="35" cy="35" r="18" />
      <path d="M30 60 q-12 10 -8 28 q3 10 12 8 q6 -2 4 -12" />
      <circle cx="45" cy="55" r="1.5" fill="currentColor" stroke="none" />
      <line x1="18" y1="18" x2="35" y2="35" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <line x1="72" y1="24" x2="58" y2="40" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="72" cy="24" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MouseConstellation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 90" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="50" cy="52" r="24" />
      <circle cx="30" cy="24" r="12" />
      <circle cx="70" cy="24" r="12" />
      <path d="M74 62 q18 4 14 20" />
      <circle cx="50" cy="52" r="1.4" fill="currentColor" stroke="none" />
      <line x1="18" y1="72" x2="30" y2="56" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="18" cy="72" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LionConstellation({ className }: { className?: string }) {
  const spikes = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    return {
      x1: 60 + Math.cos(angle) * 28,
      y1: 55 + Math.sin(angle) * 28,
      x2: 60 + Math.cos(angle) * 42,
      y2: 55 + Math.sin(angle) * 42,
    };
  });
  return (
    <svg viewBox="0 0 120 110" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="60" cy="55" r="26" />
      {spikes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
      ))}
      <circle cx="50" cy="50" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="70" cy="50" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function HomeScreen({ nickname, onNicknameChange, onStart }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchSecs, setSearchSecs] = useState(0);

  const showComingSoon = (label: string) => {
    setToast(`${label} is coming soon!`);
    window.setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    if (!searching) return;
    const tick = window.setInterval(() => setSearchSecs((s) => s + 1), 1000);
    const stop = window.setTimeout(() => {
      setSearching(false);
      showComingSoon('Online matchmaking');
    }, 6000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(stop);
    };
  }, [searching]);

  const handleFindMatch = () => {
    if (searching) return;
    setSearchSecs(0);
    setSearching(true);
  };

  const ss = String(searchSecs % 60).padStart(2, '0');

  return (
    <div className="bg-cosmic min-h-screen flex flex-col items-center gap-6 p-4 sm:p-6 relative overflow-hidden">
      {/* Constellation decorations */}
      <ElephantConstellation className="pointer-events-none select-none absolute top-16 left-4 sm:left-8 w-24 sm:w-28 h-auto text-white/15 animate-float-slow" />
      <MouseConstellation className="pointer-events-none select-none absolute top-20 right-4 sm:right-10 w-20 sm:w-24 h-auto text-white/15 animate-drift" />
      <MouseConstellation className="pointer-events-none select-none absolute bottom-24 left-6 sm:left-12 w-20 sm:w-24 h-auto text-white/15 animate-drift" />
      <LionConstellation className="pointer-events-none select-none absolute bottom-12 right-6 sm:right-14 w-24 sm:w-28 h-auto text-orange-400/25 animate-float-slow" />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 font-display font-bold px-6 py-3 rounded-full shadow-2xl text-sm animate-pop-in border-2"
          style={{ background: '#0e1730', color: '#67e8f9', borderColor: '#22d3ee' }}
        >
          {toast}
        </div>
      )}

      {/* Top nav */}
      <div className="w-full max-w-2xl flex items-center justify-between z-10 pt-2">
        <button
          onClick={() => showComingSoon('Menu')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Menu"
        >
          ☰
        </button>

        <div className="flex flex-col items-center gap-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg border-2"
            style={{ borderColor: '#22d3ee', background: 'rgba(34,211,238,0.1)' }}
          >
            🐾
          </div>
          <div className="font-display font-extrabold text-sm text-white tracking-[0.2em] leading-none text-center">
            BLIND
            <br />
            JUNGLE
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showComingSoon('Rules')}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 border border-white/15 bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            About / Rules
          </button>
          <button
            onClick={() => showComingSoon('Login')}
            className="px-3 py-2 rounded-xl text-xs font-bold text-cyan-200 border border-cyan-400/50 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
            style={{ boxShadow: '0 0 12px rgba(34,211,238,0.25)' }}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Hero */}
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-2 z-10 border"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          WELCOME TO <span className="text-cyan-300">BLIND JUNGLE</span>
        </h1>
        <p className="text-slate-400 font-semibold text-sm sm:text-base leading-snug">
          Outsmart. Outrank. Escape.
          <br />
          Flip tiles, ambush rivals, and rule the jungle!
        </p>
      </div>

      {/* Action hub */}
      <div
        className="w-full max-w-2xl rounded-3xl p-6 flex flex-col sm:flex-row gap-5 z-10 border"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex-1 flex flex-col gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs font-bold text-slate-500 tracking-widest">ACTION HUB FOR REAL-TIME PLAY</div>
            <div className="font-display font-extrabold text-cyan-300 text-lg">MULTI-TURN BATTLE ARENA</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-widest">NICKNAME</label>
            <input
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value)}
              placeholder="Enter your handle..."
              maxLength={16}
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60"
            />
          </div>

          <button
            onClick={handleFindMatch}
            disabled={searching}
            className="w-full py-3 rounded-xl font-display font-bold text-white tracking-wide transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-90 disabled:hover:scale-100 shadow-lg"
            style={{ background: 'linear-gradient(90deg, #0891b2, #22d3ee)', boxShadow: '0 0 24px rgba(34,211,238,0.35)' }}
          >
            [ FIND A MATCH ]
          </button>

          {searching && (
            <div className="flex items-center justify-center gap-2 text-xs text-cyan-300/80 font-bold tracking-wide">
              SEARCHING FOR OPPONENT… (0:{ss})
              <span className="inline-block w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={onStart}
          className="sm:w-28 shrink-0 flex flex-row sm:flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40 transition-colors py-4 sm:py-0"
        >
          <span className="text-2xl">🤖</span>
          <span className="font-display font-extrabold text-slate-300 text-sm tracking-wide">PLAY AI</span>
        </button>
      </div>

      {/* How to play */}
      <div className="w-full max-w-2xl flex flex-col gap-4 z-10 pb-6">
        <div className="text-center font-display font-extrabold text-slate-300 tracking-widest text-sm">HOW TO PLAY</div>

        <div className="relative flex items-center justify-between px-4">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 -translate-y-1/2 bg-cyan-500/70" />
          <span className="relative z-10 w-3.5 h-3.5 rounded-full" style={{ background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.8)' }} />
          <span className="relative z-10 w-4 h-4 rounded-full" style={{ background: '#22d3ee', boxShadow: '0 0 10px rgba(34,211,238,0.9)' }} />
          <span className="relative z-10 w-3 h-3 rounded-full bg-slate-600" />
        </div>

        <div className="flex gap-2 sm:gap-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="flex-1 rounded-xl px-2 py-2.5 text-center border"
              style={{
                background: i < 2 ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.03)',
                borderColor: i < 2 ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-[10px] font-bold text-cyan-400">{i + 1}.</div>
              <div className="text-xs font-display font-bold text-white leading-tight">{s.title}</div>
              {s.desc && <div className="text-[9px] text-slate-500 leading-tight mt-0.5">{s.desc}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
