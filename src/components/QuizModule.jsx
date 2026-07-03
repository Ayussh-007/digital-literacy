import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from '../lib/constants';
import TimerWidget from './TimerWidget';
import Button from './ui/Button';
import Card from './ui/Card';
import {
  ChevronLeft, ChevronRight, Eye, EyeOff, Shuffle, Check, ArrowLeft, Play, Award, X
} from 'lucide-react';

export default function QuizModule() {
  const {
    questions, currentQuestionIndex, quizActive, setQuizActive,
    nextQuestion, prevQuestion, revealAnswer, answerRevealed,
    revealQuestion, correctAnswer, wrongAnswer, soundEnabled, setView, getTeams, triggerConfetti,
    setNotification, shuffleQuestions, getTeamsUnsorted, pointMultiplier,
  } = useGameStore();

  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showStandings, setShowStandings] = useState(true);

  const filteredQuestions = questions.filter((q) => {
    if (filterCategory !== 'All' && q.category !== filterCategory) return false;
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  const question = filteredQuestions[currentQuestionIndex % filteredQuestions.length];
  const teams = getTeamsUnsorted();
  const rankedTeams = getTeams();

  if (filteredQuestions.length === 0) {
    // Empty state (omitted for brevity, assume similar to original just styled better)
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Button variant="ghost" onClick={() => setView('dashboard')} icon={ArrowLeft} className="mb-8">Back</Button>
        <Card padding="lg" className="text-center"><h2 className="text-4xl text-white">No Questions Found</h2></Card>
      </div>
    );
  }

  if (!quizActive) {
    // Setup state
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Button variant="ghost" onClick={() => setView('dashboard')} icon={ArrowLeft} className="mb-8">
          Back to Dashboard
        </Button>
        <Card padding="lg" className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[80px] mb-6">❓</motion.div>
          <h2 className="font-heading text-[48px] font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent mb-4">
            Quiz Time!
          </h2>
          <p className="text-dark-muted mb-10 text-xl font-medium">{filteredQuestions.length} questions available</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" icon={Play} onClick={() => { setQuizActive(true); revealQuestion(); if (soundEnabled) soundManager.play('celebration'); }}>
              Start Quiz
            </Button>
            <Button size="lg" variant="secondary" icon={Shuffle} onClick={() => { shuffleQuestions(); if (soundEnabled) soundManager.play('whoosh'); setNotification({ emoji: '🔀', title: 'Questions Shuffled!' }); }}>
              Shuffle
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <Card padding="lg"><h2 className="text-4xl text-white mb-4">Quiz Complete!</h2><Button onClick={() => setQuizActive(false)}>Back</Button></Card>
      </div>
    );
  }

  const handleCorrect = (teamId) => {
    correctAnswer(teamId);
    if (soundEnabled) soundManager.play('correct');
    triggerConfetti();
    const team = teams.find((t) => t.id === teamId);
    setNotification({ emoji: '✅', title: `Correct! +${4 * pointMultiplier} pts`, subtitle: `${team?.emoji} ${team?.name}` });
  };

  const handleWrong = (teamId) => {
    wrongAnswer(teamId);
    if (soundEnabled) soundManager.play('wrong');
    const team = teams.find((t) => t.id === teamId);
    setNotification({ emoji: '❌', title: 'Wrong Answer! -1 pt', subtitle: `${team?.emoji} ${team?.name}` });
  };

  const diffLevel = DIFFICULTY_LEVELS.find((d) => d.id === question.difficulty);
  const optionColors = ['#E21B3C', '#1368CE', '#D89E00', '#26890C'];
  const shapeIcons = ['▲', '◆', '●', '■'];

  const currQNum = (currentQuestionIndex % filteredQuestions.length) + 1;
  const totalQNum = filteredQuestions.length;
  const filledBlocks = Math.round((currQNum / totalQNum) * 10);
  const emptyBlocks = 10 - filledBlocks;
  const asciiProgress = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] gap-6 relative max-w-[1600px] mx-auto w-full pb-8">
      {/* Top Header */}
      <div className="flex flex-shrink-0 items-center justify-between bg-[#151027]/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-[#2D2550] shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => setQuizActive(false)} icon={X} className="text-dark-muted hover:text-white">
          End
        </Button>
        <div className="font-mono text-[16px] text-[#A29BFE] tracking-widest bg-[#A29BFE]/10 px-4 py-2 rounded-lg font-bold border border-[#A29BFE]/20">
          <span className="text-[#6C5CE7] mr-2">{asciiProgress}</span>
          <span className="text-white">Question {currQNum} / {totalQNum}</span>
        </div>
        <div className="flex gap-2">
          {question.category && <span className="text-sm px-4 py-2 rounded-xl font-bold bg-[#6C5CE7]/10 text-[#A29BFE] border border-[#6C5CE7]/20">{question.category}</span>}
          {diffLevel && <span className="text-sm px-4 py-2 rounded-xl font-bold border" style={{ color: diffLevel.color, borderColor: diffLevel.color + '30', background: diffLevel.color + '10' }}>{diffLevel.label}</span>}
        </div>
      </div>

      {/* Main Grid: Quiz Content (approx 70%) | Right Panel (approx 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_min(340px,30%)] gap-8 min-h-0 flex-1">
        
        {/* Left Side: Quiz Content */}
        <div className="flex flex-col min-w-0 h-full">
          
          {/* Question Section - Reduced height, vertically centered, big text */}
          <div className="min-h-[30%] flex-shrink-0 flex items-center justify-center p-8 bg-[#1E1735]/60 rounded-3xl border border-[#2D2550] shadow-sm mb-6">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentQuestionIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="font-heading font-black text-white text-center leading-[1.2]"
                style={{ fontSize: 'clamp(40px, 4vw, 64px)' }}
              >
                {question.question}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Answer Cards Grid */}
          <div className="flex-1">
            {question.type === 'multiple_choice' && question.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                {question.options.map((opt, i) => {
                  const isCorrect = answerRevealed && i === question.correctAnswer;
                  const isWrong = answerRevealed && i !== question.correctAnswer;
                  
                  return (
                    <motion.button
                      key={i}
                      disabled={answerRevealed}
                      whileHover={!answerRevealed ? { scale: 1.02, y: -4 } : {}}
                      whileTap={!answerRevealed ? { scale: 0.98 } : {}}
                      className="relative w-full h-full rounded-3xl p-6 md:p-8 flex items-center shadow-lg transition-all duration-150 overflow-hidden outline-none text-left"
                      style={{
                        backgroundColor: isWrong ? '#2D2550' : optionColors[i],
                        border: isCorrect ? '4px solid #00B894' : isWrong ? '4px solid transparent' : '4px solid rgba(0,0,0,0.1)',
                        opacity: isWrong ? 0.4 : 1,
                        filter: isCorrect ? 'drop-shadow(0 0 32px rgba(0, 184, 148, 0.4)) brightness(1.05)' : 'none',
                        boxShadow: isCorrect ? 'inset 0 0 0 2px rgba(255,255,255,0.2)' : '0 10px 30px rgba(0,0,0,0.2)'
                      }}
                    >
                      {/* Icon */}
                      <div className="absolute right-6 top-6 opacity-20 pointer-events-none">
                        <span className="text-6xl text-white font-black">{shapeIcons[i]}</span>
                      </div>

                      {/* Text content - flex to handle multi-line perfectly */}
                      <div className="relative z-10 w-full pr-12">
                        <span className="text-white font-bold block" style={{ fontSize: 'clamp(20px, 2vw, 28px)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                          {opt}
                        </span>
                      </div>

                      {/* Correct overlay checkmark */}
                      <AnimatePresence>
                        {isCorrect && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="absolute bottom-6 right-6 w-16 h-16 bg-[#00B894] rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20"
                          >
                            <Check size={32} className="text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {question.type === 'true_false' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[250px]">
                {[true, false].map((val) => {
                  const isCorrect = answerRevealed && val === question.correctAnswer;
                  const isWrong = answerRevealed && val !== question.correctAnswer;
                  const color = val ? '#1368CE' : '#E21B3C';
                  
                  return (
                    <motion.button
                      key={String(val)}
                      disabled={answerRevealed}
                      whileHover={!answerRevealed ? { scale: 1.02, y: -4 } : {}}
                      className="relative w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg transition-all duration-150 overflow-hidden outline-none"
                      style={{
                        backgroundColor: isWrong ? '#2D2550' : color,
                        border: isCorrect ? '4px solid #00B894' : '4px solid rgba(0,0,0,0.1)',
                        opacity: isWrong ? 0.4 : 1,
                        filter: isCorrect ? 'drop-shadow(0 0 32px rgba(0, 184, 148, 0.4))' : 'none'
                      }}
                    >
                      <span className="text-white font-heading font-black text-6xl mb-6 z-10">{val ? 'True' : 'False'}</span>
                      <span className="text-6xl opacity-80 z-10">{val ? '✅' : '❌'}</span>
                      <AnimatePresence>
                        {isCorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-8 right-8 w-16 h-16 bg-[#00B894] rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20"
                          >
                            <Check size={32} className="text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Restructured for cleaner hierarchy */}
        <div className="flex flex-col gap-6 h-full min-w-0">
          
          {/* Timer Card - Primary Focus */}
          <div className="bg-[#151027]/80 backdrop-blur-md rounded-[24px] border border-[#2D2550] shadow-lg flex-shrink-0 overflow-hidden p-6 relative">
             <TimerWidget />
          </div>

          {/* Standings - Compacted */}
          {showStandings && (
            <Card padding="md" className="flex-shrink-0 min-h-[160px] max-h-[30vh] flex flex-col rounded-[24px]">
              <h3 className="font-heading font-bold text-[16px] text-dark-text mb-4">🏆 Live Standings</h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
                {rankedTeams.map((team, i) => (
                  <div key={team.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#1E1735] border border-[#2D2550]">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm w-5">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                      <span className="text-lg">{team.emoji}</span>
                      <span className="font-bold text-sm truncate max-w-[100px]" style={{ color: team.color }}>{team.name}</span>
                    </div>
                    <span className="font-black text-sm text-white">{team.totalPoints}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Award Points - Simplified */}
          <Card padding="md" className="flex-1 flex flex-col rounded-[24px] min-h-[200px]">
            <h3 className="font-heading font-bold text-[16px] text-dark-text mb-4 flex items-center gap-2">
              <Award size={18} className="text-[#FDCB6E]" /> Award Points
            </h3>
            <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
              {teams.map((team) => (
                <div key={team.id} className="bg-[#1E1735] rounded-xl border border-[#2D2550] p-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs truncate mb-2" style={{ color: team.color }}>
                    <span>{team.emoji}</span>
                    <span className="truncate">{team.name}</span>
                  </div>
                  <div className="flex gap-1 h-7 mt-auto">
                    <button onClick={() => handleCorrect(team.id)} className="flex-1 bg-success/10 hover:bg-success/20 text-success rounded border border-success/20 font-bold text-[11px] transition-colors">
                      +{4 * pointMultiplier}
                    </button>
                    <button onClick={() => handleWrong(team.id)} className="flex-1 bg-danger/10 hover:bg-danger/20 text-danger rounded border border-danger/20 font-bold text-[11px] transition-colors">
                      -1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="flex-shrink-0 bg-[#151027]/80 backdrop-blur-md p-4 rounded-[24px] border border-[#2D2550] flex items-center justify-between shadow-lg">
        <Button size="lg" variant="ghost" onClick={prevQuestion} icon={ChevronLeft} className="px-8 bg-[#1E1735] hover:bg-white/5 border border-[#2D2550]">
          Previous
        </Button>
        <Button
          size="lg"
          variant={answerRevealed ? 'success' : 'primary'}
          icon={answerRevealed ? Eye : EyeOff}
          onClick={() => { revealAnswer(); if (soundEnabled) soundManager.play('pop'); }}
          className="px-16 py-4 shadow-xl"
        >
          {answerRevealed ? 'Answer Revealed' : 'Reveal Answer'}
        </Button>
        <Button size="lg" onClick={() => { nextQuestion(); if (soundEnabled) soundManager.play('whoosh'); }} className="px-8 bg-white text-[#151027] hover:bg-white/90">
          Next Question <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>

    </div>
  );
}
