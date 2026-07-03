import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import {
  ArrowLeft, Plus, Trash2, Edit3, RotateCcw, Download, Upload,
  Save, AlertTriangle, Users, School, FileSpreadsheet, ShieldAlert
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';

export default function AdminPanel() {
  const {
    classes, activeClassId, setView, addClass, deleteClass, renameClass,
    setActiveClass, getActiveClass, getTeamsUnsorted, addTeam, removeTeam,
    resetClassScores, soundEnabled, setNotification, setQuestions,
    questions,
  } = useGameStore();

  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', emoji: '🐾', color: '#6C5CE7' });
  const [editingClassId, setEditingClassId] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  const activeClass = getActiveClass();
  const teams = getTeamsUnsorted();

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    addClass(newClassName.trim());
    setNewClassName('');
    setShowAddClass(false);
    if (soundEnabled) soundManager.play('bonus');
    setNotification({ emoji: '🏫', title: `Class "${newClassName}" created!` });
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure? This will permanently delete this class and all its data.')) {
      deleteClass(classId);
      if (soundEnabled) soundManager.play('click');
    }
  };

  const handleAddTeam = () => {
    if (!newTeam.name.trim()) return;
    addTeam({
      name: newTeam.name.trim(),
      emoji: newTeam.emoji,
      color: newTeam.color,
      bgGradient: `linear-gradient(135deg, ${newTeam.color}, ${newTeam.color}88)`,
    });
    setNewTeam({ name: '', emoji: '🐾', color: '#6C5CE7' });
    setShowAddTeam(false);
    if (soundEnabled) soundManager.play('bonus');
  };

  const handleExport = () => {
    const data = JSON.stringify({ classes, questions }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-literacy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification({ emoji: '💾', title: 'Backup downloaded!' });
  };

  const handleImportQuestions = () => {
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        setQuestions([...questions, ...parsed]);
        setNotification({ emoji: '📥', title: `${parsed.length} questions imported!` });
      } else if (parsed.classes) {
        useGameStore.setState({ classes: parsed.classes, questions: parsed.questions || questions });
        setNotification({ emoji: '📥', title: 'Backup restored!' });
      }
      setImportText('');
      setShowImport(false);
    } catch {
      const lines = importText.trim().split('\n');
      const imported = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 3) {
          imported.push({
            id: Date.now() + i,
            question: cols[0],
            type: cols.length > 4 ? 'multiple_choice' : 'true_false',
            options: cols.length > 4 ? [cols[1], cols[2], cols[3], cols[4]].filter(Boolean) : undefined,
            correctAnswer: cols.length > 4 ? Number(cols[5] || 0) : cols[1]?.toLowerCase() === 'true',
            category: cols[cols.length - 2] || 'General',
            difficulty: cols[cols.length - 1] || 'easy',
          });
        }
      }
      if (imported.length > 0) {
        setQuestions([...questions, ...imported]);
        setNotification({ emoji: '📥', title: `${imported.length} questions imported from CSV!` });
        setImportText('');
        setShowImport(false);
      } else {
        setNotification({ emoji: '❌', title: 'Could not parse import data' });
      }
    }
  };

  const emojiOptions = ['🦁', '🐯', '🐼', '🐸', '🐧', '🦊', '🐺', '🦅', '🐬', '🦋', '🐉', '🦄', '🐝', '🐢', '🦈', '🐙'];
  const colorOptions = ['#FF6B35', '#FFC107', '#4ECDC4', '#45B7D1', '#96CEB4', '#6C5CE7', '#FD79A8', '#FF6B6B', '#00B894', '#FDCB6E', '#A29BFE', '#E84393'];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] gap-6 overflow-y-auto custom-scrollbar pr-2 pb-8">
      
      <div className="flex items-center justify-between flex-shrink-0">
        <Button variant="ghost" onClick={() => setView('dashboard')} icon={ArrowLeft}>
          Back to Dashboard
        </Button>
        <div className="text-right">
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent leading-tight">
            ⚙️ Administration
          </h1>
          <p className="text-sm text-dark-muted font-bold tracking-wider uppercase mt-1">System Settings & Data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
        
        {/* Classes Management */}
        <Card padding="lg" className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl flex items-center gap-2 text-white">
              <School size={22} className="text-[#6C5CE7]" /> Manage Classes
            </h2>
            <Button size="sm" onClick={() => setShowAddClass(!showAddClass)} icon={Plus}>
              New Class
            </Button>
          </div>

          <AnimatePresence>
            {showAddClass && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Enter class name (e.g., Grade 3B)"
                    className="flex-1 bg-[#151027] border border-[#2D2550] rounded-xl px-4 py-3 text-sm font-medium text-white focus:border-[#6C5CE7] outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
                  />
                  <Button variant="success" onClick={handleAddClass} icon={Save}>
                    Save
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer border ${
                  cls.id === activeClassId
                    ? 'bg-[#6C5CE7]/10 border-[#6C5CE7]/30 shadow-inner'
                    : 'bg-[#151027] border-[#2D2550] hover:border-[#6C5CE7]/20'
                }`}
                onClick={() => setActiveClass(cls.id)}
              >
                <span className="text-2xl">🏫</span>
                {editingClassId === cls.id ? (
                  <input
                    type="text"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    onBlur={() => { renameClass(cls.id, editClassName); setEditingClassId(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { renameClass(cls.id, editClassName); setEditingClassId(null); } }}
                    className="flex-1 bg-[#0B0718] border border-[#6C5CE7] rounded-lg px-3 py-1.5 text-sm font-medium text-white outline-none"
                    autoFocus
                  />
                ) : (
                  <div className="flex-1">
                    <p className="font-bold text-base text-white">{cls.name}</p>
                    <p className="text-xs text-dark-muted">{cls.teams.length} teams registered</p>
                  </div>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingClassId(cls.id); setEditClassName(cls.name); }}
                    className="p-2 rounded-lg hover:bg-white/10 text-dark-muted hover:text-white transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }}
                    className="p-2 rounded-lg hover:bg-[#FF6B6B]/20 text-dark-muted hover:text-[#FF6B6B] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Teams Management */}
        <Card padding="lg" className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl flex items-center gap-2 text-white">
                <Users size={22} className="text-[#00CEC9]" /> Manage Teams
              </h2>
              <span className="text-xs font-bold text-[#00CEC9] bg-[#00CEC9]/10 px-2 py-1 rounded-md">
                {activeClass?.name}
              </span>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setShowAddTeam(!showAddTeam)} icon={Plus}>
              New Team
            </Button>
          </div>

          <AnimatePresence>
            {showAddTeam && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="space-y-4 p-5 rounded-2xl bg-[#151027] border border-[#2D2550]">
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Enter team name..."
                    className="w-full bg-[#0B0718] border border-[#2D2550] rounded-xl px-4 py-3 text-sm font-medium text-white focus:border-[#6C5CE7] outline-none"
                  />
                  <div>
                    <label className="text-[11px] text-dark-muted mb-2 block font-bold uppercase tracking-wider">Select Emoji</label>
                    <div className="flex flex-wrap gap-2">
                      {emojiOptions.map((e) => (
                        <button
                          key={e}
                          onClick={() => setNewTeam({ ...newTeam, emoji: e })}
                          className={`text-2xl w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                            newTeam.emoji === e ? 'bg-[#6C5CE7]/20 border-2 border-[#6C5CE7] shadow-sm' : 'bg-transparent border-2 border-transparent hover:bg-white/5'
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-dark-muted mb-2 block font-bold uppercase tracking-wider">Select Color</label>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((c) => (
                        <button
                          key={c}
                          onClick={() => setNewTeam({ ...newTeam, color: c })}
                          className={`w-8 h-8 rounded-full transition-all ${
                            newTeam.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#151027] scale-110' : 'hover:scale-110'
                          }`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button variant="success" className="w-full" onClick={handleAddTeam} icon={Plus}>
                    Create Team
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {teams.length === 0 ? (
              <p className="text-dark-muted text-sm text-center py-6">No teams in this class yet.</p>
            ) : (
              teams.map((team) => (
                <div key={team.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#151027] border border-[#2D2550] hover:border-[#2D2550]/80">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border" style={{ background: `${team.color}15`, borderColor: `${team.color}40` }}>
                    {team.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: team.color }}>{team.name}</p>
                    <p className="text-xs text-dark-muted">{team.totalPoints} total points</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove team "${team.name}"?`)) removeTeam(team.id);
                    }}
                    className="p-2 rounded-lg hover:bg-[#FF6B6B]/20 text-dark-muted hover:text-[#FF6B6B] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Backup & Import */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
        <Card padding="lg">
          <h2 className="font-heading font-bold text-lg mb-2 text-white flex items-center gap-2">
            <Download size={20} className="text-[#A29BFE]" /> Export Data
          </h2>
          <p className="text-sm text-dark-muted mb-6">Download a complete JSON backup of all classes, teams, scores, and custom questions.</p>
          <Button onClick={handleExport} icon={Download} className="w-full">
            Download Full Backup
          </Button>
        </Card>

        <Card padding="lg">
          <h2 className="font-heading font-bold text-lg mb-2 text-white flex items-center gap-2">
            <Upload size={20} className="text-[#A29BFE]" /> Import Questions & Data
          </h2>
          <p className="text-sm text-dark-muted mb-6">Restore a previous backup or import a list of questions via CSV/JSON.</p>
          <Button onClick={() => setShowImport(true)} variant="secondary" icon={Upload} className="w-full">
            Open Import Tool
          </Button>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card variant="important" padding="lg" className="border-[#FF6B6B]/30 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl flex items-center gap-2 text-[#FF6B6B] mb-2">
              <ShieldAlert size={22} /> Danger Zone
            </h2>
            <p className="text-sm text-dark-muted">Resetting scores will permanently clear all points, history, and power-ups for the active class <strong>({activeClass?.name})</strong>.</p>
          </div>
          <Button variant="danger" onClick={() => setShowResetConfirm(true)} icon={RotateCcw}>
            Reset All Scores
          </Button>
        </div>
      </Card>

      {/* Import Modal */}
      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Data"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="bg-[#151027] border border-[#2D2550] rounded-xl p-4">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2"><FileSpreadsheet size={16} className="text-[#00CEC9]" /> CSV Format</h4>
            <p className="text-xs text-dark-muted font-mono bg-[#0B0718] p-2 rounded">question,optionA,optionB,optionC,optionD,correctIndex,category,difficulty</p>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full bg-[#151027] border border-[#2D2550] rounded-xl p-4 text-sm font-mono text-white focus:border-[#6C5CE7] outline-none custom-scrollbar"
            rows={10}
            placeholder="Paste JSON array of questions, full JSON backup, or CSV data here..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button variant="success" onClick={handleImportQuestions} icon={Upload}>Process Import</Button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Confirm Reset"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={40} className="text-[#FF6B6B]" />
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">Reset All Scores?</h3>
            <p className="text-dark-muted">
              This action cannot be undone. All teams in <strong>{activeClass?.name}</strong> will lose their points, badges, and history.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                resetClassScores();
                setShowResetConfirm(false);
                setNotification({ emoji: '🔄', title: 'Scores reset!' });
                if (soundEnabled) soundManager.play('click');
              }}
              className="w-full"
            >
              Yes, Reset Everything
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setShowResetConfirm(false)} className="w-full">
              Keep Scores
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
