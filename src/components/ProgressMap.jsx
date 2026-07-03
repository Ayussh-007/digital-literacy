import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MAP_LOCATIONS } from '../lib/constants';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

export default function ProgressMap() {
  const { getTeams, setView, getActiveClass } = useGameStore();
  const teams = getTeams();
  const activeClass = getActiveClass();

  const getTeamPosition = (team) => {
    for (let i = MAP_LOCATIONS.length - 1; i >= 0; i--) {
      if (team.totalPoints >= MAP_LOCATIONS[i].pointsRequired) return i;
    }
    return 0;
  };

  const highestTeamPosition = Math.max(...teams.map(getTeamPosition), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] gap-6">
      <div className="flex items-center justify-between flex-shrink-0">
        <Button variant="ghost" onClick={() => setView('dashboard')} icon={ArrowLeft}>
          Back to Dashboard
        </Button>
        <div className="text-right">
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent leading-tight">
            🗺️ Progress Journey
          </h1>
          <p className="text-sm text-dark-muted font-bold tracking-wider uppercase mt-1">{activeClass?.name}</p>
        </div>
      </div>

      <Card padding="none" className="flex-1 overflow-y-auto custom-scrollbar relative p-8">
        <div className="max-w-3xl mx-auto relative py-12">
          
          {/* Vertical Progress Line */}
          <div className="absolute left-[80px] md:left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-[#151027] rounded-full border border-[#2D2550]">
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-full bg-gradient-to-b from-[#6C5CE7] via-[#00CEC9] to-[#FD79A8]"
              initial={{ height: 0 }}
              animate={{ height: `${(highestTeamPosition / (MAP_LOCATIONS.length - 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ boxShadow: '0 0 20px rgba(0, 206, 201, 0.5)' }}
            />
          </div>

          {/* Journey Nodes */}
          <div className="space-y-32">
            {MAP_LOCATIONS.map((location, locIdx) => {
              const teamsHere = teams.filter((t) => getTeamPosition(t) === locIdx);
              const isUnlocked = teams.some((t) => getTeamPosition(t) >= locIdx);
              const isCompleted = teams.some((t) => getTeamPosition(t) > locIdx);
              const isCurrent = highestTeamPosition === locIdx;

              const isLeft = locIdx % 2 === 0;

              return (
                <div key={location.id} className="relative flex items-center w-full min-h-[160px]">
                  
                  {/* Central Node Circle */}
                  <div className="absolute left-[80px] md:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: locIdx * 0.1, type: 'spring' }}
                      className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl text-4xl z-10 ${
                        isCompleted
                          ? 'bg-[#00B894] border-[#55EFC4] shadow-[0_0_24px_rgba(0,184,148,0.4)]'
                          : isCurrent
                          ? 'bg-[#6C5CE7] border-[#A29BFE] shadow-[0_0_32px_rgba(108,92,231,0.6)]'
                          : isUnlocked
                          ? 'bg-[#2D2550] border-[#A29BFE] text-white'
                          : 'bg-[#151027] border-[#2D2550] text-dark-muted grayscale opacity-70'
                      }`}
                    >
                      {isUnlocked ? location.emoji : <Lock size={28} />}
                    </motion.div>
                  </div>

                  {/* Desktop Layout: Alternate left/right cards */}
                  <div className={`hidden md:flex w-full ${isLeft ? 'justify-end pr-[calc(50%+60px)]' : 'justify-start pl-[calc(50%+60px)]'}`}>
                    <Card
                      variant={isCurrent ? 'important' : isUnlocked ? 'primary' : 'secondary'}
                      className="w-[340px] text-left relative"
                    >
                      {/* Connecting Line (Horizontal) */}
                      <div className={`absolute top-1/2 -translate-y-1/2 w-[60px] h-1 border-t-2 border-dashed ${isUnlocked ? 'border-[#A29BFE]' : 'border-[#2D2550]'} ${isLeft ? '-right-[60px]' : '-left-[60px]'}`} />
                      
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-heading font-bold text-2xl ${isUnlocked ? 'text-white' : 'text-dark-muted'}`}>
                          {location.name}
                        </h3>
                        {isCompleted && <CheckCircle2 className="text-success" size={24} />}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">Threshold:</span>
                        <span className={`px-2 py-1 rounded-md text-sm font-bold ${isUnlocked ? 'bg-primary/20 text-primary-light' : 'bg-[#151027] text-dark-muted'}`}>
                          {location.pointsRequired} pts
                        </span>
                      </div>

                      {/* Teams Avatar Row */}
                      <div className="min-h-[64px] flex flex-wrap gap-2 pt-2 mt-4 border-t border-[#2D2550]">
                        {teamsHere.length === 0 ? (
                          <span className="text-xs text-dark-muted italic self-center">No teams here</span>
                        ) : (
                          teamsHere.map((team, idx) => (
                            <motion.div
                              key={team.id}
                              initial={{ scale: 0, y: -20 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1, type: 'spring' }}
                              className="relative group"
                            >
                              <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 hover:-translate-y-1 transition-transform"
                                style={{ background: `${team.color}20`, borderColor: team.color }}
                              >
                                {team.emoji}
                              </div>
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-[#151027] text-xs font-bold px-2 py-1 rounded border border-[#2D2550] pointer-events-none z-30" style={{ color: team.color }}>
                                {team.name} ({team.totalPoints}pts)
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Mobile Layout: All cards on the right */}
                  <div className="md:hidden flex w-full justify-start pl-[140px]">
                    <Card
                      variant={isCurrent ? 'important' : isUnlocked ? 'primary' : 'secondary'}
                      className="w-full text-left relative"
                    >
                      <div className={`absolute top-1/2 -translate-y-1/2 w-[40px] h-1 border-t-2 border-dashed ${isUnlocked ? 'border-[#A29BFE]' : 'border-[#2D2550]'} -left-[40px]`} />
                      
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-heading font-bold text-xl ${isUnlocked ? 'text-white' : 'text-dark-muted'}`}>
                          {location.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${isUnlocked ? 'bg-primary/20 text-primary-light' : 'bg-[#151027] text-dark-muted'}`}>
                          {location.pointsRequired} pts
                        </span>
                      </div>

                      <div className="min-h-[48px] flex flex-wrap gap-2 pt-2 mt-2 border-t border-[#2D2550]">
                        {teamsHere.length === 0 ? (
                          <span className="text-[10px] text-dark-muted italic self-center">No teams</span>
                        ) : (
                          teamsHere.map((team, idx) => (
                            <motion.div
                              key={team.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + idx * 0.1 }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow border-2"
                              style={{ background: `${team.color}20`, borderColor: team.color }}
                            >
                              {team.emoji}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </Card>
    </div>
  );
}
