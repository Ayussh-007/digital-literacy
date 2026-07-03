// Default teams with avatars, colors, and emojis
export const DEFAULT_TEAMS = [
  { name: 'Lions', emoji: '🦁', color: '#FF6B35', bgGradient: 'linear-gradient(135deg, #FF6B35, #FF9A56)' },
  { name: 'Tigers', emoji: '🐯', color: '#FFC107', bgGradient: 'linear-gradient(135deg, #FFC107, #FFD54F)' },
  { name: 'Pandas', emoji: '🐼', color: '#4ECDC4', bgGradient: 'linear-gradient(135deg, #4ECDC4, #7EDDD6)' },
  { name: 'Frogs', emoji: '🐸', color: '#45B7D1', bgGradient: 'linear-gradient(135deg, #45B7D1, #76CFDF)' },
  { name: 'Penguins', emoji: '🐧', color: '#96CEB4', bgGradient: 'linear-gradient(135deg, #96CEB4, #B5DFCC)' },
];

// Bonus buttons configuration
export const BONUS_BUTTONS = [
  { id: 'participation', emoji: '👏', label: 'Participation', points: 2 },
  { id: 'teamwork', emoji: '🤝', label: 'Teamwork', points: 5 },
  { id: 'creative', emoji: '💡', label: 'Creative Thinking', points: 5 },
  { id: 'fastest', emoji: '⚡', label: 'Fastest Answer', points: 3 },
  { id: 'speaking', emoji: '🎤', label: 'Good Speaking', points: 4 },
  { id: 'behaviour', emoji: '🌟', label: 'Excellent Behaviour', points: 5 },
  { id: 'helping', emoji: '❤️', label: 'Helping Others', points: 3 },
  { id: 'challenge', emoji: '🎯', label: 'Challenge Winner', points: 10 },
  { id: 'creativity_award', emoji: '🎉', label: 'Creativity Award', points: 7 },
  { id: 'listener', emoji: '📚', label: 'Good Listener', points: 3 },
];

// Wheel of Fortune segments
export const WHEEL_SEGMENTS = [
  { label: '+5 Points', value: 5, type: 'points', color: '#6C5CE7' },
  { label: '+10 Points', value: 10, type: 'points', color: '#00CEC9' },
  { label: '+15 Points', value: 15, type: 'points', color: '#FD79A8' },
  { label: '+20 Points', value: 20, type: 'points', color: '#FDCB6E' },
  { label: 'Double Next Q', value: 2, type: 'multiplier', color: '#FF6B6B' },
  { label: 'Triple Next Q', value: 3, type: 'multiplier', color: '#E84393' },
  { label: 'Shield 🛡', value: 'shield', type: 'powerup', color: '#00B894' },
  { label: 'Bonus Question', value: 'bonus_q', type: 'special', color: '#74B9FF' },
  { label: 'Everyone +5', value: 5, type: 'everyone', color: '#A29BFE' },
  { label: 'Steal 10 Pts', value: 10, type: 'steal', color: '#FF7675' },
  { label: 'Lucky Star ⭐', value: 'lucky', type: 'special', color: '#FDCB6E' },
  { label: 'Mystery Box 📦', value: 'mystery', type: 'special', color: '#6C5CE7' },
  { label: 'Golden Ticket 🎫', value: 'golden', type: 'special', color: '#F9CA24' },
  { label: 'Spin Again 🔄', value: 'spin_again', type: 'special', color: '#00CEC9' },
  { label: 'Freeze Team ❄️', value: 'freeze', type: 'special', color: '#74B9FF' },
  { label: 'Lose 5 Points', value: -5, type: 'points', color: '#636E72' },
  { label: 'Dance Challenge 💃', value: 'dance', type: 'fun', color: '#FD79A8' },
  { label: "Teacher's Choice", value: 'teacher', type: 'special', color: '#A29BFE' },
];

// Mystery box rewards
export const MYSTERY_REWARDS = [
  { label: 'Everyone gets +3!', emoji: '🎁', effect: { type: 'everyone', value: 3 } },
  { label: 'Double Points for Everyone!', emoji: '✨', effect: { type: 'everyone_double', value: 2 } },
  { label: 'Hidden Treasure +15!', emoji: '💎', effect: { type: 'points', value: 15 } },
  { label: 'Lightning Round!', emoji: '⚡', effect: { type: 'special', value: 'lightning' } },
  { label: 'Secret Question!', emoji: '🤫', effect: { type: 'special', value: 'secret_q' } },
  { label: 'Instant Badge!', emoji: '🏅', effect: { type: 'badge', value: 'mystery_solver' } },
  { label: 'Golden Star +20!', emoji: '⭐', effect: { type: 'points', value: 20 } },
  { label: 'Free Spin!', emoji: '🎰', effect: { type: 'special', value: 'free_spin' } },
  { label: 'Swap Positions!', emoji: '🔄', effect: { type: 'special', value: 'swap' } },
  { label: 'Mini Challenge!', emoji: '🏆', effect: { type: 'special', value: 'mini' } },
  { label: 'Treasure Chest +25!', emoji: '🏴‍☠️', effect: { type: 'points', value: 25 } },
  { label: 'Random Team +10!', emoji: '🎲', effect: { type: 'random_team', value: 10 } },
];

// Power-ups
export const POWER_UPS = [
  { id: 'shield', emoji: '🛡', name: 'Shield', desc: 'Protects from losing points' },
  { id: 'double', emoji: '⚡', name: 'Double Points', desc: '2x points on next question' },
  { id: 'triple', emoji: '🔥', name: 'Triple Points', desc: '3x points on next question' },
  { id: 'time_freeze', emoji: '⏱', name: 'Time Freeze', desc: 'Extra time on next question' },
  { id: 'mystery', emoji: '🎁', name: 'Mystery Reward', desc: 'Random surprise' },
  { id: 'hint', emoji: '🧠', name: 'Hint Card', desc: 'Get a hint on next question' },
  { id: 'second_chance', emoji: '🎯', name: 'Second Chance', desc: 'Try again if wrong' },
  { id: 'lucky_star', emoji: '⭐', name: 'Lucky Star', desc: 'Guaranteed bonus' },
  { id: 'speed', emoji: '🚀', name: 'Speed Bonus', desc: '+2 bonus for fast answers' },
  { id: 'golden', emoji: '💎', name: 'Golden Bonus', desc: '+5 on any correct answer' },
];

// Achievement badges
export const ACHIEVEMENTS = [
  { id: 'quiz_champion', name: 'Quiz Champion', emoji: '🏆', desc: 'Win 5 quizzes', requirement: { type: 'wins', count: 5 } },
  { id: 'computer_expert', name: 'Computer Expert', emoji: '💻', desc: 'Score 100+ total points', requirement: { type: 'points', count: 100 } },
  { id: 'password_protector', name: 'Password Protector', emoji: '🔒', desc: 'Complete password mission', requirement: { type: 'mission', id: 'password' } },
  { id: 'smart_surfer', name: 'Smart Surfer', emoji: '🌐', desc: 'Complete internet safety mission', requirement: { type: 'mission', id: 'internet' } },
  { id: 'cyber_hero', name: 'Cyber Hero', emoji: '🛡', desc: 'Complete all safety missions', requirement: { type: 'missions_all' } },
  { id: 'quick_thinker', name: 'Quick Thinker', emoji: '⚡', desc: 'Get 3 fastest answers', requirement: { type: 'bonus', id: 'fastest', count: 3 } },
  { id: 'teamwork', name: 'Excellent Teamwork', emoji: '🤝', desc: 'Get 5 teamwork bonuses', requirement: { type: 'bonus', id: 'teamwork', count: 5 } },
  { id: 'winning_streak', name: 'Winning Streak', emoji: '🔥', desc: 'Win 3 rounds in a row', requirement: { type: 'streak', count: 3 } },
  { id: 'creative_mind', name: 'Creative Mind', emoji: '🎨', desc: 'Get 3 creativity awards', requirement: { type: 'bonus', id: 'creative', count: 3 } },
  { id: 'digital_detective', name: 'Digital Detective', emoji: '🔍', desc: 'Solve 10 quiz questions', requirement: { type: 'questions', count: 10 } },
];

// Progress map locations
export const MAP_LOCATIONS = [
  { id: 'school', name: 'School', emoji: '🏫', pointsRequired: 0 },
  { id: 'computer_lab', name: 'Computer Lab', emoji: '🖥', pointsRequired: 25 },
  { id: 'password_castle', name: 'Password Castle', emoji: '🔒', pointsRequired: 60 },
  { id: 'internet_forest', name: 'Internet Forest', emoji: '🌐', pointsRequired: 100 },
  { id: 'cyber_mountain', name: 'Cyber Safety Mountain', emoji: '🛡', pointsRequired: 150 },
  { id: 'hero_castle', name: 'Digital Hero Castle', emoji: '🏆', pointsRequired: 200 },
];

// Timer presets
export const TIMER_PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '45s', seconds: 45 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
];

// Quiz categories
export const QUIZ_CATEGORIES = [
  'Computer Basics',
  'Internet Safety',
  'Passwords',
  'Digital Citizenship',
  'Coding Concepts',
  'Hardware',
  'Software',
  'Online Communication',
  'Privacy',
  'Cyberbullying',
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Easy ⭐', color: '#00B894' },
  { id: 'medium', label: 'Medium ⭐⭐', color: '#FDCB6E' },
  { id: 'hard', label: 'Hard ⭐⭐⭐', color: '#FF6B6B' },
];

// Sample quiz questions
export const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: 'If you post your pictures or photos on the internet, and delete them later, how long can your images be there on the internet?',
    type: 'multiple_choice',
    options: ['Forever', 'Until you delete it', 'For exactly 30 days', 'Until you turn off your device'],
    correctAnswer: 0,
    category: 'Internet Safety',
    difficulty: 'medium',
  },
  {
    id: 2,
    question: 'Sometimes people online will ask you about your personal info. What should you do before giving away any info online?',
    type: 'multiple_choice',
    options: ['Share it only if they promise to keep it a secret', 'Ask an adult you trust', 'Think twice, then give it to them anyway', 'Give them your friend’s information instead'],
    correctAnswer: 1,
    category: 'Privacy',
    difficulty: 'easy',
  },
  {
    id: 3,
    question: 'There\'s a lot of fun stuff on the Internet which contains surveys and tell you that you can win prizes. Why do websites use such surveys and contests?',
    type: 'multiple_choice',
    options: ['To really give you a chance to win prizes', 'To get your personal info', 'To help you practice your typing skills', 'To make your device run faster'],
    correctAnswer: 1,
    category: 'Internet Safety',
    difficulty: 'medium',
  },
  {
    id: 4,
    question: 'It can be a lot of fun to see pictures and videos on the internet. Who can see your photos or videos you post on the internet?',
    type: 'multiple_choice',
    options: ['Anybody', 'Just the people you send it to', 'Only your family members', 'No one, unless they have your secret password'],
    correctAnswer: 0,
    category: 'Privacy',
    difficulty: 'easy',
  },
  {
    id: 5,
    question: 'What\'s the best choice to use as your name online?',
    type: 'multiple_choice',
    options: ['A nickname', 'Your first name', 'Your full name', 'Your home address'],
    correctAnswer: 0,
    category: 'Privacy',
    difficulty: 'easy',
  },
  {
    id: 6,
    question: 'What should you do if someone asks you to send them your picture?',
    type: 'multiple_choice',
    options: ['Send it to them right away', 'Send it only as long as you think you know who it is', 'Ask an adult you trust first', 'Send them a picture of your house instead'],
    correctAnswer: 2,
    category: 'Privacy',
    difficulty: 'easy',
  },
  {
    id: 7,
    question: 'What might happen if you enter a contest online?',
    type: 'multiple_choice',
    options: ['Your device will explode', 'You might get a lot of junk emails', 'You might win a lakh rupees', 'The internet will shut down'],
    correctAnswer: 1,
    category: 'Internet Safety',
    difficulty: 'medium',
  },
  {
    id: 8,
    question: 'If you see someone being mean or bullying another person in an online game or chat, what is the best thing to do?',
    type: 'multiple_choice',
    options: ['Join in so they don\'t pick on you next', 'Tell an adult you trust and block the mean person', 'Yell back at them online to defend the person', 'Turn off the screen and pretend it didn\'t happen'],
    correctAnswer: 1,
    category: 'Cyberbullying',
    difficulty: 'easy',
  },
  {
    id: 9,
    question: 'Who is the ONLY person you should ever share your internet passwords with?',
    type: 'multiple_choice',
    options: ['Your best friend', 'Your parents or guardians', 'A police officer you meet online', 'Your favorite teacher'],
    correctAnswer: 1,
    category: 'Passwords',
    difficulty: 'easy',
  },
  {
    id: 10,
    question: 'You get a message from a stranger with a link that says, "Click here for a free game!" What should you do?',
    type: 'multiple_choice',
    options: ['Click it immediately to get the free game', 'Forward it to all your friends so they can play too', 'Delete the message and do not click the link', 'Reply and ask them if it is a virus'],
    correctAnswer: 2,
    category: 'Internet Safety',
    difficulty: 'easy',
  },
  {
    id: 11,
    question: 'Someone you met in an online game asks to meet you in person at a nearby park. What is the safest response?',
    type: 'multiple_choice',
    options: ['Go, but bring a friend with you', 'Tell them no, and tell a trusted adult immediately', 'Tell them to come to your house instead', 'Go, but only if it\'s during the daytime'],
    correctAnswer: 1,
    category: 'Internet Safety',
    difficulty: 'hard',
  },
  {
    id: 12,
    question: 'Why is it dangerous to download files or apps from websites you don\'t know?',
    type: 'multiple_choice',
    options: ['They might contain viruses that can break your device or steal data', 'They take too long to download and waste your battery', 'They will automatically delete all your favorite games', 'They will alert the police that you are downloading things'],
    correctAnswer: 0,
    category: 'Internet Safety',
    difficulty: 'medium',
  },
];

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  ' ': { action: 'nextQuestion', label: 'Space', desc: 'Next Question' },
  '1': { action: 'selectTeam1', label: '1', desc: 'Select Team 1' },
  '2': { action: 'selectTeam2', label: '2', desc: 'Select Team 2' },
  '3': { action: 'selectTeam3', label: '3', desc: 'Select Team 3' },
  '4': { action: 'selectTeam4', label: '4', desc: 'Select Team 4' },
  '5': { action: 'selectTeam5', label: '5', desc: 'Select Team 5' },
  'c': { action: 'correct', label: 'C', desc: 'Correct Answer' },
  'w': { action: 'wrong', label: 'W', desc: 'Wrong Answer' },
  'b': { action: 'bonus', label: 'B', desc: 'Bonus' },
  'a': { action: 'activity', label: 'A', desc: 'Add Activity' },
  'f': { action: 'fortune', label: 'F', desc: 'Wheel of Fortune' },
  'm': { action: 'mystery', label: 'M', desc: 'Mystery Box' },
  'l': { action: 'leaderboard', label: 'L', desc: 'Leaderboard' },
  't': { action: 'timer', label: 'T', desc: 'Timer' },
  'h': { action: 'home', label: 'H', desc: 'Home' },
  'Escape': { action: 'pause', label: 'Esc', desc: 'Pause Game' },
};
