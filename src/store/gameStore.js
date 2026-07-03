import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TEAMS, SAMPLE_QUESTIONS } from '../lib/constants';

// Generate unique IDs
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// Default class factory
const createDefaultClass = (name) => ({
  id: uid(),
  name,
  teams: DEFAULT_TEAMS.map((t, i) => ({
    id: uid(),
    ...t,
    totalPoints: 0,
    bonusPoints: 0,
    quizPoints: 0,
    activityPoints: 0,
    wheelPoints: 0,
    wins: 0,
    gamesPlayed: 0,
    streak: 0,
    powerUps: [],
    badges: [],
    position: 0,
    order: i,
  })),
  history: [],
  quizHistory: [],
  achievements: [],
  stats: {
    totalGamesPlayed: 0,
    totalQuestionsAsked: 0,
    totalActivities: 0,
    totalWheelSpins: 0,
    totalMysteryBoxes: 0,
  },
  createdAt: new Date().toISOString(),
});

const defaultClass = createDefaultClass('Grade 1A');

export const useGameStore = create(
  persist(
    (set, get) => ({
      // === Classes ===
      classes: [defaultClass],
      activeClassId: defaultClass.id,

      // === Game State ===
      currentView: 'dashboard', // dashboard, quiz, wheel, activity, map, leaderboard, admin, stats
      currentMission: 'Digital Literacy Basics',
      currentRound: 1,
      currentQuestionIndex: 0,
      selectedTeamId: null,
      isPaused: false,

      // === Quiz State ===
      questions: SAMPLE_QUESTIONS,
      quizActive: false,
      quizCategory: 'All',
      quizDifficulty: 'all',
      questionRevealed: false,
      answerRevealed: false,
      quizShuffled: false,
      pointMultiplier: 1,

      // === Timer State ===
      timerActive: false,
      timerSeconds: 30,
      timerRemaining: 30,

      // === Wheel State ===
      wheelSpinning: false,
      wheelResult: null,

      // === Mystery Box ===
      mysteryBoxOpen: false,
      mysteryResult: null,

      // === UI State ===
      showBonusPanel: false,
      showActivityModal: false,
      showMysteryBox: false,
      showSettings: false,
      soundEnabled: true,
      darkMode: true,
      showShortcutsHelp: false,
      showConfetti: false,
      notification: null,

      // === Init ===
      initialize: () => {
        const state = get();
        if (state.classes.length > 0 && !state.activeClassId) {
          set({ activeClassId: state.classes[0].id });
        }
        
        // Ensure the user gets exactly the 12 new questions
        if (!state.migratedTo12Questions) {
          set({ questions: SAMPLE_QUESTIONS, migratedTo12Questions: true });
        }
      },

      // === Class Management ===
      addClass: (name) => {
        const newClass = createDefaultClass(name);
        set((s) => ({
          classes: [...s.classes, newClass],
          activeClassId: newClass.id,
        }));
        return newClass.id;
      },

      deleteClass: (classId) => {
        set((s) => {
          const filtered = s.classes.filter((c) => c.id !== classId);
          return {
            classes: filtered,
            activeClassId: s.activeClassId === classId ? (filtered[0]?.id || null) : s.activeClassId,
          };
        });
      },

      setActiveClass: (classId) => {
        set({ activeClassId: classId, selectedTeamId: null });
      },

      renameClass: (classId, newName) => {
        set((s) => ({
          classes: s.classes.map((c) => c.id === classId ? { ...c, name: newName } : c),
        }));
      },

      // === Active Class Helper ===
      getActiveClass: () => {
        const state = get();
        return state.classes.find((c) => c.id === state.activeClassId) || null;
      },

      getTeams: () => {
        const cls = get().getActiveClass();
        return cls ? [...cls.teams].sort((a, b) => b.totalPoints - a.totalPoints) : [];
      },

      getTeamsUnsorted: () => {
        const cls = get().getActiveClass();
        return cls ? [...cls.teams].sort((a, b) => a.order - b.order) : [];
      },

      // === Team Management ===
      addTeam: (teamData) => {
        const state = get();
        const cls = state.getActiveClass();
        if (!cls) return;
        const newTeam = {
          id: uid(),
          ...teamData,
          totalPoints: 0,
          bonusPoints: 0,
          quizPoints: 0,
          activityPoints: 0,
          wheelPoints: 0,
          wins: 0,
          gamesPlayed: 0,
          streak: 0,
          powerUps: [],
          badges: [],
          position: 0,
          order: cls.teams.length,
        };
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === s.activeClassId ? { ...c, teams: [...c.teams, newTeam] } : c
          ),
        }));
      },

      removeTeam: (teamId) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === s.activeClassId
              ? { ...c, teams: c.teams.filter((t) => t.id !== teamId) }
              : c
          ),
        }));
      },

      updateTeam: (teamId, updates) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === s.activeClassId
              ? { ...c, teams: c.teams.map((t) => t.id === teamId ? { ...t, ...updates } : t) }
              : c
          ),
        }));
      },

      // === Scoring ===
      addPoints: (teamId, points, category = 'bonus', description = '') => {
        set((s) => ({
          classes: s.classes.map((c) => {
            if (c.id !== s.activeClassId) return c;
            const catKey = `${category}Points`;
            return {
              ...c,
              teams: c.teams.map((t) => {
                if (t.id !== teamId) return t;
                const multiplier = s.pointMultiplier;
                const actualPoints = points * multiplier;
                // Apply shield if losing points
                if (actualPoints < 0 && t.powerUps.includes('shield')) {
                  return {
                    ...t,
                    powerUps: t.powerUps.filter((p) => p !== 'shield'),
                  };
                }
                return {
                  ...t,
                  totalPoints: Math.max(0, t.totalPoints + actualPoints),
                  [catKey]: (t[catKey] || 0) + actualPoints,
                };
              }),
              history: [
                {
                  id: uid(),
                  teamId,
                  points: points * s.pointMultiplier,
                  category,
                  description,
                  timestamp: new Date().toISOString(),
                },
                ...c.history,
              ].slice(0, 500), // Keep last 500 entries
            };
          }),
          pointMultiplier: 1, // Reset multiplier after use
        }));
      },

      addPointsToAll: (points, description = '') => {
        const cls = get().getActiveClass();
        if (!cls) return;
        cls.teams.forEach((t) => {
          get().addPoints(t.id, points, 'bonus', description);
        });
      },

      // === Quiz ===
      setQuizActive: (active) => set({ quizActive: active }),

      nextQuestion: () => {
        set((s) => {
          const nextIdx = s.currentQuestionIndex + 1;
          if (nextIdx >= s.questions.length) {
            return { currentQuestionIndex: 0, quizActive: false, answerRevealed: false, questionRevealed: false };
          }
          return { currentQuestionIndex: nextIdx, answerRevealed: false, questionRevealed: true };
        });
      },

      prevQuestion: () => {
        set((s) => ({
          currentQuestionIndex: Math.max(0, s.currentQuestionIndex - 1),
          answerRevealed: false,
          questionRevealed: true,
        }));
      },

      revealAnswer: () => set({ answerRevealed: true }),
      revealQuestion: () => set({ questionRevealed: true }),

      correctAnswer: (teamId) => {
        get().addPoints(teamId, 4, 'quiz', 'Correct answer');
        set((s) => ({
          classes: s.classes.map((c) => {
            if (c.id !== s.activeClassId) return c;
            return {
              ...c,
              stats: { ...c.stats, totalQuestionsAsked: c.stats.totalQuestionsAsked + 1 },
              teams: c.teams.map((t) =>
                t.id === teamId ? { ...t, gamesPlayed: t.gamesPlayed + 1 } : t
              ),
            };
          }),
        }));
      },

      wrongAnswer: (teamId) => {
        get().addPoints(teamId, -1, 'quiz', 'Wrong answer');
      },

      setQuestions: (questions) => set({ questions }),
      addQuestion: (question) => set((s) => ({ questions: [...s.questions, { ...question, id: uid() }] })),

      shuffleQuestions: () => {
        set((s) => {
          const shuffled = [...s.questions].sort(() => Math.random() - 0.5);
          return { questions: shuffled, quizShuffled: true, currentQuestionIndex: 0 };
        });
      },

      // === Activities ===
      addActivity: (activity) => {
        set((s) => ({
          classes: s.classes.map((c) => {
            if (c.id !== s.activeClassId) return c;
            return {
              ...c,
              history: [
                {
                  id: uid(),
                  ...activity,
                  category: 'activity',
                  timestamp: new Date().toISOString(),
                },
                ...c.history,
              ],
              stats: { ...c.stats, totalActivities: c.stats.totalActivities + 1 },
            };
          }),
        }));
        if (activity.winningTeamId && activity.points) {
          get().addPoints(activity.winningTeamId, activity.points, 'activity', activity.name);
        }
      },

      // === Power-ups ===
      addPowerUp: (teamId, powerUpId) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === s.activeClassId
              ? {
                  ...c,
                  teams: c.teams.map((t) =>
                    t.id === teamId ? { ...t, powerUps: [...t.powerUps, powerUpId] } : t
                  ),
                }
              : c
          ),
        }));
      },

      removePowerUp: (teamId, powerUpId) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === s.activeClassId
              ? {
                  ...c,
                  teams: c.teams.map((t) =>
                    t.id === teamId
                      ? { ...t, powerUps: t.powerUps.filter((p, i) => !(p === powerUpId && i === t.powerUps.indexOf(powerUpId))) }
                      : t
                  ),
                }
              : c
          ),
        }));
      },

      // === Multiplier ===
      setMultiplier: (mult) => set({ pointMultiplier: mult }),

      // === Badges ===
      awardBadge: (teamId, badgeId) => {
        set((s) => ({
          classes: s.classes.map((c) =>
            c.id === s.activeClassId
              ? {
                  ...c,
                  teams: c.teams.map((t) =>
                    t.id === teamId && !t.badges.includes(badgeId)
                      ? { ...t, badges: [...t.badges, badgeId] }
                      : t
                  ),
                }
              : c
          ),
        }));
      },

      // === Timer ===
      startTimer: (seconds) => set({ timerActive: true, timerSeconds: seconds, timerRemaining: seconds }),
      stopTimer: () => set({ timerActive: false }),
      tickTimer: () => {
        set((s) => {
          if (s.timerRemaining <= 0) return { timerActive: false, timerRemaining: 0 };
          return { timerRemaining: s.timerRemaining - 1 };
        });
      },
      resetTimer: () => set((s) => ({ timerRemaining: s.timerSeconds, timerActive: false })),

      // === Wheel ===
      setWheelSpinning: (spinning) => set({ wheelSpinning: spinning }),
      setWheelResult: (result) => set({ wheelResult: result }),

      // === UI ===
      setView: (view) => set({ currentView: view, showBonusPanel: false }),
      selectTeam: (teamId) => set({ selectedTeamId: teamId }),
      togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
      setNotification: (msg) => {
        set({ notification: msg });
        if (msg) setTimeout(() => set({ notification: null }), 3000);
      },
      triggerConfetti: () => {
        set({ showConfetti: true });
        setTimeout(() => set({ showConfetti: false }), 3000);
      },

      // === Reset ===
      resetClassScores: () => {
        set((s) => ({
          classes: s.classes.map((c) => {
            if (c.id !== s.activeClassId) return c;
            return {
              ...c,
              teams: c.teams.map((t) => ({
                ...t,
                totalPoints: 0,
                bonusPoints: 0,
                quizPoints: 0,
                activityPoints: 0,
                wheelPoints: 0,
                wins: 0,
                gamesPlayed: 0,
                streak: 0,
                powerUps: [],
                position: 0,
              })),
              history: [],
              stats: {
                totalGamesPlayed: 0,
                totalQuestionsAsked: 0,
                totalActivities: 0,
                totalWheelSpins: 0,
                totalMysteryBoxes: 0,
              },
            };
          }),
          currentRound: 1,
          currentQuestionIndex: 0,
        }));
      },

      // Settings
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: 'digital-literacy-adventure',
      version: 1,
    }
  )
);
