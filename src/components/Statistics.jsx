import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, BarChart3, Trophy, Target, Zap, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Button from './ui/Button';
import Card from './ui/Card';
import StatCard from './ui/StatCard';
import Table from './ui/Table';

const CHART_COLORS = ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E', '#FF6B6B', '#A29BFE', '#55EFC4'];

export default function Statistics() {
  const { getTeams, getActiveClass, setView } = useGameStore();
  const teams = getTeams();
  const activeClass = getActiveClass();

  if (!activeClass) return null;

  // Prepare chart data
  const barData = teams.map((t) => ({
    name: `${t.emoji} ${t.name}`,
    quiz: t.quizPoints || 0,
    bonus: t.bonusPoints || 0,
    activity: t.activityPoints || 0,
    total: t.totalPoints,
  }));

  const pieData = teams.map((t) => ({
    name: t.name,
    value: t.totalPoints,
    color: t.color,
  }));

  const stats = activeClass.stats || { totalQuestionsAsked: 0, totalActivities: 0 };
  const totalPoints = teams.reduce((sum, t) => sum + t.totalPoints, 0);

  const statCards = [
    { label: 'Total Points Awarded', value: totalPoints, emoji: '⭐', color: '#FDCB6E', trend: 12 },
    { label: 'Questions Asked', value: stats.totalQuestionsAsked || 0, emoji: '❓', color: '#6C5CE7', trend: 5 },
    { label: 'Activities Completed', value: stats.totalActivities || 0, emoji: '🎯', color: '#00CEC9' },
    { label: 'Total Teams', value: teams.length, emoji: '👥', color: '#FD79A8' },
  ];

  const customTooltipStyle = {
    backgroundColor: '#1E1735',
    border: '1px solid #2D2550',
    borderRadius: '16px',
    padding: '12px 16px',
    color: '#F0ECF9',
    fontSize: '13px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  };

  const tableColumns = [
    { label: 'Rank', align: 'center' },
    { label: 'Team', align: 'left' },
    { label: 'Total', align: 'right' },
    { label: 'Quiz', align: 'right' },
    { label: 'Bonus', align: 'right' },
    { label: 'Activity', align: 'right' },
    { label: 'Badges', align: 'center' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] gap-6 overflow-y-auto custom-scrollbar pr-2 pb-8">
      
      <div className="flex items-center justify-between flex-shrink-0">
        <Button variant="ghost" onClick={() => setView('dashboard')} icon={ArrowLeft}>
          Back to Dashboard
        </Button>
        <div className="text-right">
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent leading-tight">
            📊 Class Statistics
          </h1>
          <p className="text-sm text-dark-muted font-bold tracking-wider uppercase mt-1">{activeClass.name}</p>
        </div>
      </div>

      {/* Top: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {statCards.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            emoji={stat.emoji}
            color={stat.color}
            trend={stat.trend}
            delay={i * 0.1}
          />
        ))}
      </div>

      {/* Middle: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
        <Card padding="md" className="h-[400px] flex flex-col">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
            <BarChart3 size={18} className="text-[#6C5CE7]" /> Points Breakdown
          </h3>
          {teams.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-dark-muted">
              <span className="text-5xl opacity-50 mb-3">📉</span>
              <p>No data to display yet.</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#8E85AD', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8E85AD', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8E85AD' }} />
                  <Bar dataKey="quiz" stackId="a" fill="#6C5CE7" name="Quiz" radius={[0, 0, 0, 0]} animationDuration={1500} />
                  <Bar dataKey="bonus" stackId="a" fill="#00CEC9" name="Bonus" radius={[0, 0, 0, 0]} animationDuration={1500} />
                  <Bar dataKey="activity" stackId="a" fill="#FD79A8" name="Activity" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card padding="md" className="h-[400px] flex flex-col">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
            <Trophy size={18} className="text-[#FDCB6E]" /> Points Distribution
          </h3>
          {teams.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-dark-muted">
              <span className="text-5xl opacity-50 mb-3">🥧</span>
              <p>No data to display yet.</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={70}
                    paddingAngle={4}
                    animationDuration={1500}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8E85AD' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom: Leaderboard Table */}
      <Card padding="md" className="flex-shrink-0">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <Users size={18} className="text-[#00CEC9]" /> Detailed Rankings
        </h3>
        <Table
          columns={tableColumns}
          data={[...teams].sort((a, b) => b.totalPoints - a.totalPoints)}
          keyExtractor={(team) => team.id}
          renderRow={(team, i) => (
            <>
              <td className="px-6 py-4 text-center">
                <span className="text-xl">{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{team.emoji}</span>
                  <span className="font-bold text-base" style={{ color: team.color }}>{team.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-black text-xl text-white">{team.totalPoints}</span>
              </td>
              <td className="px-6 py-4 text-right font-medium text-[#6C5CE7]">{team.quizPoints || 0}</td>
              <td className="px-6 py-4 text-right font-medium text-[#00CEC9]">{team.bonusPoints || 0}</td>
              <td className="px-6 py-4 text-right font-medium text-[#FD79A8]">{team.activityPoints || 0}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-1">
                  {team.badges?.slice(0, 3).map((b, idx) => (
                    <span key={idx} className="text-base" title={b.name}>{b.emoji}</span>
                  ))}
                  {(!team.badges || team.badges.length === 0) && <span className="text-dark-muted text-xs">—</span>}
                </div>
              </td>
            </>
          )}
        />
      </Card>
      
    </div>
  );
}
