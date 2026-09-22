// ============================================================
// ПРОГРАММЫ ТРЕНИРОВОК
// 5 программ: Снайпер, Плэймейкер, Зверь, Универсал, Свой план
// ============================================================

export const PROGRAMS = [
  {
    id: 'sniper',
    title: 'Снайпер',
    subtitle: 'Прокачка броска',
    description: 'Программа для тех, кто хочет улучшить бросок. Работа над техникой, точностью и стабильностью на дистанции.',
    icon: '🎯',
    color: '#FF6B1A',
    duration: '4 недели',
    daysPerWeek: 3,
    difficulty: 'Средняя',
        mainCategories: ['shooting'],
    plan: 'pro',
    focus: ['Бросок', 'Техника', 'Точность'],
  },
  {
    id: 'playmaker',
    title: 'Плэймейкер',
    subtitle: 'Дриблинг + IQ',
    description: 'Программа для разыгрывающих. Дриблинг под давлением, видение площадки, принятие решений.',
    icon: '⚡',
    color: '#8B5CF6',
    duration: '6 недель',
    daysPerWeek: 4,
    difficulty: 'Средняя',
        mainCategories: ['dribbling', 'iq', 'passing'],
    plan: 'pro',
    focus: ['Дриблинг', 'IQ', 'Пас'],
  },
  {
    id: 'beast',
    title: 'Зверь',
    subtitle: 'Атлетизм + защита',
    description: 'Программа для мощных игроков. Сила, прыжок, выносливость и защита в краске.',
    icon: '💪',
    color: '#FF3B3B',
    duration: '8 недель',
    daysPerWeek: 4,
    difficulty: 'Высокая',
        mainCategories: ['athleticism', 'defense'],
    plan: 'pro',
    focus: ['Атлетизм', 'Защита', 'Сила'],
  },
  {
    id: 'universal',
    title: 'Универсал',
    subtitle: 'Всё понемногу',
    description: 'Сбалансированная программа для разностороннего развития. Равномерно прокачивает все навыки.',
    icon: '🏀',
    color: '#00E0FF',
    duration: '6 недель',
    daysPerWeek: 3,
    difficulty: 'Средняя',
        mainCategories: ['shooting', 'dribbling', 'athleticism', 'defense'],
    plan: 'free',
    focus: ['Баланс', 'Все навыки', 'Универсальность'],
  },
  {
    id: 'custom',
    title: 'Свой план',
    subtitle: 'Собрать вручную',
    description: 'Собери программу под себя: выбери категории, дни, объём.',
    icon: '🎨',
    color: '#B8FF3C',
    duration: 'Свободно',
    daysPerWeek: 3,
    difficulty: 'Любая',
        mainCategories: [],
    plan: 'pro',
    focus: ['Свой выбор', 'Гибкость'],
  },
]

// ============================================================
// ПОЛУЧИТЬ ПРОГРАММУ ПО ID
// ============================================================
export function getProgramById(id) {
  return PROGRAMS.find((p) => p.id === id) || null
}

// ============================================================
// ПРОГРЕСС ПРОГРАММЫ
// Возвращает: какую неделю, какой день, % завершения
// ============================================================
export function getProgramProgress(programId, user) {
  const progress = (user.trainingProgress || {})[programId]
  if (!progress) {
    return {
      currentWeek: 1,
      currentDay: 1,
      completedSessions: 0,
      totalSessions: 0,
      percent: 0,
      started: false,
    }
  }

  const program = getProgramById(programId)
  if (!program) return null

  const totalWeeks = parseInt(program.duration) || 4
  const totalSessions = totalWeeks * program.daysPerWeek
  const completed = progress.completedSessions || 0
  const percent = totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0

  // Определяем текущую неделю и день
  const currentWeek = Math.min(totalWeeks, Math.floor(completed / program.daysPerWeek) + 1)
  const currentDay = (completed % program.daysPerWeek) + 1

  return {
    currentWeek,
    currentDay,
    completedSessions: completed,
    totalSessions,
    percent,
    started: true,
    lastSessionDate: progress.lastSessionDate || null,
  }
}

// ============================================================
// ОТМЕТИТЬ ТРЕНИРОВКУ ПРОЙДЕННОЙ
// ============================================================
export function completeTraining(programId, user) {
  const progress = (user.trainingProgress || {})[programId] || {
    completedSessions: 0,
    lastSessionDate: null,
  }

  const newProgress = {
    ...progress,
    completedSessions: (progress.completedSessions || 0) + 1,
    lastSessionDate: new Date().toISOString(),
  }

  return {
    ...(user.trainingProgress || {}),
    [programId]: newProgress,
  }
}

// ============================================================
// СБРОСИТЬ ПРОГРЕСС ПРОГРАММЫ
// ============================================================
export function resetProgramProgress(programId, user) {
  const newProgress = { ...(user.trainingProgress || {}) }
  delete newProgress[programId]
  return newProgress
}