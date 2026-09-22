export const DEFAULT_USER = {
  username: '@player',
  avatarLetter: 'P',
  avatarUrl: null,
  ovr: 99,
  height: '', weight: '', age: '',
  positions: [],
  sport: '',
  plan: 'free',
  testsPassed: 0,
  testsTotal: 4,
  theme: 'classic',
  cardTheme: 'classic',
  trainingGoals: [],
  trainingGear: [],
  trainingLevel: 'beginner',
  trainingDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
  calendarDone: 0,
}

export const INITIAL_CATEGORIES = [
  {
    id: 'b-iq', icon: '🏀', title: 'Баскетбольный IQ',
    tests: [
      { id: 'b-iq-base', title: 'Игровое мышление', plan: 'free', status: 'active', score: null },
    ],
  },
  {
    id: 'shooting', icon: '🎯', title: 'Бросок',
    tests: [
      { id: 'sht-base', title: 'Базовый бросок', plan: 'free', status: 'pending', score: null },
      { id: 'sht-ft', title: 'Точность штрафных', plan: 'pro', status: 'locked', score: null },
      { id: 'sht-move', title: 'Бросок в движении', plan: 'pro', status: 'locked', score: null },
      { id: 'sht-drive', title: 'Проходы под кольцо', plan: 'pro', status: 'locked', score: null },
    ],
  },
  {
    id: 'dribbling', icon: '⚡', title: 'Дриблинг',
    tests: [
      { id: 'drbl-base', title: 'Базовый дриблинг', plan: 'free', status: 'pending', score: null },
      { id: 'drbl-pressure', title: 'Дриблинг под давлением', plan: 'pro', status: 'locked', score: null },
      { id: 'drbl-hands', title: 'Скорость рук', plan: 'pro', status: 'locked', score: null },
    ],
  },
  {
    id: 'athleticism', icon: '💪', title: 'Атлетизм',
    tests: [
      { id: 'atl-base', title: 'Базовый атлетизм', plan: 'free', status: 'pending', score: null },
      { id: 'atl-jump', title: 'Прыжок в длину с места', plan: 'pro', status: 'locked', score: null },
      { id: 'atl-run', title: 'Прыжок в длину с разбега', plan: 'pro', status: 'locked', score: null },
      { id: 'atl-endurance', title: 'Выносливость (спринт)', plan: 'pro', status: 'locked', score: null },
    ],
  },
]

export function freshCategories() {
  return JSON.parse(JSON.stringify(INITIAL_CATEGORIES))
}