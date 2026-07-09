'use client';

import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';

export default function Home() {
  const [view, setView] = useState<'home' | 'game'>('home');
  const [nickname, setNickname] = useState('');

  if (view === 'game') {
    return <GameScreen playerAName={nickname.trim() || undefined} onExit={() => setView('home')} />;
  }

  return <HomeScreen nickname={nickname} onNicknameChange={setNickname} onStart={() => setView('game')} />;
}
