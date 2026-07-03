import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { KEYBOARD_SHORTCUTS } from '../lib/constants';

export function useKeyboardShortcuts() {
  const {
    currentView,
    setView,
    nextQuestion,
    selectTeam,
    correctAnswer,
    wrongAnswer,
    selectedTeamId,
    getTeamsUnsorted,
    togglePause,
    quizActive,
    soundEnabled,
  } = useGameStore();

  const handleKeyDown = useCallback(
    (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      const key = e.key;
      const shortcut = KEYBOARD_SHORTCUTS[key];
      if (!shortcut) return;

      e.preventDefault();
      if (soundEnabled) soundManager.play('click');

      const teams = getTeamsUnsorted();

      switch (shortcut.action) {
        case 'nextQuestion':
          if (currentView === 'quiz') nextQuestion();
          break;
        case 'selectTeam1':
          if (teams[0]) selectTeam(teams[0].id);
          break;
        case 'selectTeam2':
          if (teams[1]) selectTeam(teams[1].id);
          break;
        case 'selectTeam3':
          if (teams[2]) selectTeam(teams[2].id);
          break;
        case 'selectTeam4':
          if (teams[3]) selectTeam(teams[3].id);
          break;
        case 'selectTeam5':
          if (teams[4]) selectTeam(teams[4].id);
          break;
        case 'correct':
          if (selectedTeamId && currentView === 'quiz') correctAnswer(selectedTeamId);
          break;
        case 'wrong':
          if (selectedTeamId && currentView === 'quiz') wrongAnswer(selectedTeamId);
          break;
        case 'bonus':
          useGameStore.setState({ showBonusPanel: true });
          break;
        case 'activity':
          useGameStore.setState({ showActivityModal: true });
          break;
        case 'fortune':
          setView('wheel');
          break;
        case 'mystery':
          useGameStore.setState({ showMysteryBox: true });
          break;
        case 'leaderboard':
          setView('leaderboard');
          break;
        case 'timer':
          setView('dashboard');
          break;
        case 'home':
          setView('dashboard');
          break;
        case 'pause':
          togglePause();
          break;
        default:
          break;
      }
    },
    [currentView, selectedTeamId, quizActive, soundEnabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
