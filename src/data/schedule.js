// ============================================================
// РАСПИСАНИЕ ТРЕНИРОВОК
// Робот составляет план по настройкам + слабым местам
// ============================================================

import { PROGRAMS, getProgramById } from './programs'

// ============================================================
// ПОЛУЧИТЬ ДЕНЬ НЕДЕЛИ (Пн=0, Вт=1, ..., Вс=6)
// ============================================================
export function getDayIndex(date) {
  const d = date.getDay() // 0=Вс, 1=Пн, ..., 6=Сб
  return d === 0 ? 6 : d - 1
}

// ============================================================
// ФОРМАТ ДАТЫ "2025-09-22"
// ============================================================
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ============================================================
// ПРОВЕРИТЬ — ТРЕНИРОВОЧНЫЙ ЛИ ДЕНЬ
// ============================================================
export function isTrainingDay(user, date) {
  const trainingDays = user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const dayIdx = getDayIndex(date)
  return trainingDays.includes(dayNames[dayIdx])
}

// ============================================================
// ОПРЕДЕЛИТЬ СЛАБЫЕ МЕСТА (по тестам)
// ============================================================
export function getWeakCategories(user) {
  const TEST_TO_CATEGORY = {
    'sht-base': 'shooting',
    'sht-ft': 'shooting',
    'sht-move': 'shooting',
    'sht-drive': 'shooting',
    'drbl-base': 'dribbling',
    'drbl-pressure': 'dribbling',
    'drbl-hands': 'dribbling',
    'atl-base': 'athleticism',
    'atl-jump': 'athleticism',
    'atl-run': 'athleticism',
    'atl-endurance': 'athleticism',
    'b-iq-base': 'iq',
  }

  const categories = {}
  const categoriesCount = {}

  const allTests = user.categories.flatMap((c) => c.tests)
  allTests.forEach((t) => {
    if (t.status !== 'done' || t.score === null) return
    const cat = TEST_TO_CATEGORY[t.id]
    if (!cat) return

    if (!categories[cat]) categories[cat] = 0
    if (!categoriesCount[cat]) categoriesCount[cat] = 0
    categories[cat] += t.score
    categoriesCount[cat] += 1
  })

  const averages = {}
  Object.keys(categories).forEach((cat) => {
    averages[cat] = categories[cat] / categoriesCount[cat]
  })

  return averages
}

// ============================================================
// ОПРЕДЕЛИТЬ ПРОГРАММУ ДЛЯ КОНКРЕТНОГО ДНЯ
// ============================================================
export function getProgramForDay(user, date) {
  if (!isTrainingDay(user, date)) {
    return null
  }

  const mode = user.trainingMode || 'manual'

  if (mode === 'manual') {
    const selectedId = user.selectedProgramId || 'universal'
    return {
      programId: selectedId,
      reason: 'Ты выбрал эту программу',
    }
  }

  const weakCategories = getWeakCategories(user)
  const availablePrograms = PROGRAMS.filter(
    (p) => p.id !== 'custom' && p.plan !== undefined
  )

  if (availablePrograms.length === 0) {
    return {
      programId: 'universal',
      reason: 'Универсальная программа',
    }
  }

  const programScores = availablePrograms.map((program) => {
    let score = 0
    let count = 0

    program.mainCategories.forEach((cat) => {
      const catScore = weakCategories[cat]
      if (catScore !== undefined) {
        score += (100 - catScore)
        count++
      }
    })

    const avgScore = count > 0 ? score / count : 0
    return { program, score: avgScore }
  })

  programScores.sort((a, b) => b.score - a.score)

  const dayIdx = getDayIndex(date)
  const trainingDays = user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const trainingDayNames = dayNames.filter((d) => trainingDays.includes(d))
  const position = trainingDayNames.indexOf(dayNames[dayIdx])

  if (position === -1) return null

  const topPrograms = programScores.slice(0, 3)
  const selected = topPrograms[position % topPrograms.length]

  const reason = getReasonText(selected.program, weakCategories)

  return {
    programId: selected.program.id,
    reason,
  }
}

// ============================================================
// ТЕКСТ ОБЪЯСНЕНИЯ
// ============================================================
function getReasonText(program, weakCategories) {
  const reasons = []

  program.mainCategories.forEach((cat) => {
    const score = weakCategories[cat]
    if (score !== undefined && score < 60) {
      const catName = {
        shooting: 'бросок',
        dribbling: 'дриблинг',
        athleticism: 'атлетизм',
        iq: 'IQ',
        defense: 'защита',
        passing: 'пас',
      }[cat]

      reasons.push(`${catName} — твой слабый навык (${Math.round(score)} баллов)`)
    }
  })

  if (reasons.length === 0) {
    return 'Робот подобрал программу по твоим настройкам'
  }

  return `Робот увидел слабое место: ${reasons.join(', ')}`
}

// ============================================================
// ПОЛУЧИТЬ РАСПИСАНИЕ НА НЕДЕЛЮ
// ============================================================
export function getWeekSchedule(user, monday) {
  const schedule = {}

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)

    const dateStr = formatDate(date)
    const programData = getProgramByMode(user, date)
    const completed = (user.completedTrainings || {})[dateStr]

    if (programData) {
      schedule[dateStr] = {
        programId: programData.programId,
        reason: programData.reason,
        planned: true,
        done: completed?.done || false,
        completedAt: completed?.completedAt || null,
      }
    }
  }

  return schedule
}

// ============================================================
// ОТМЕТИТЬ ТРЕНИРОВКУ КАК ПРОЙДЕННУЮ
// ============================================================
export function markTrainingDone(user, date, programId) {
  const dateStr = formatDate(date)
  const completed = { ...(user.completedTrainings || {}) }

  completed[dateStr] = {
    done: true,
    programId,
    completedAt: new Date().toISOString(),
  }

  return completed
}

// ============================================================
// ПОЛУЧИТЬ РЕЖИМ ТРЕНИРОВОК
// ============================================================
export function getTrainingMode(user) {
  return user.trainingMode || 'manual'
}

// ============================================================
// ПОЛУЧИТЬ ВЫБРАННУЮ ПРОГРАММУ (для manual)
// ============================================================
export function getSelectedProgram(user) {
  return user.selectedProgramId || 'universal'
}

// ============================================================
// ПОЛУЧИТЬ ПРОГРАММУ ПО РЕЖИМУ
// manual — выбранная, mix — топ-3 по слабым местам
// ============================================================
export function getProgramByMode(user, date) {
  const mode = getTrainingMode(user)

  // Ручной режим — одна программа
  if (mode === 'manual') {
    // ⚠️ ГЛАВНЫЙ ФИКС: проверяем, тренировочный ли день
    if (!isTrainingDay(user, date)) {
      return null
    }

    const programId = getSelectedProgram(user)
    const program = getProgramById(programId)
    return {
      programId,
      reason: program
        ? `Ты выбрал программу «${program.title}»`
        : 'Ты выбрал эту программу',
    }
  }

  // Режим «Микс» — чередуем программы по тренировочным дням
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1
  const dayName = dayNames[dayIdx]

  const trainingDays = user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']

  if (!trainingDays.includes(dayName)) return null

  const trainingDayNames = dayNames.filter((d) => trainingDays.includes(d))
  const position = trainingDayNames.indexOf(dayName)

  const programs = ['sniper', 'playmaker', 'beast', 'slasher']
  const programId = programs[position % programs.length]
  const program = getProgramById(programId)

  return {
    programId,
    reason: `Программа «${program?.title || programId}» — день ${position + 1} тренировочной недели`,
  }
}

// ============================================================
// ОТМЕТИТЬ ТРЕНИРОВКУ ВЫПОЛНЕННОЙ
// ============================================================
export function markTrainingComplete(user, dateStr, programId) {
  const completed = { ...(user.completedTrainings || {}) }

  completed[dateStr] = {
    done: true,
    programId,
    completedAt: new Date().toISOString(),
  }

  return completed
}

// ============================================================
// ПРОВЕРИТЬ, ПРОЙДЕНА ЛИ ТРЕНИРОВКА
// ============================================================
export function isTrainingCompleted(user, dateStr) {
  const completed = user.completedTrainings || {}
  return completed[dateStr]?.done || false
}

// ============================================================
// СКОЛЬКО ТРЕНИРОВОК ПРОЙДЕНО ЗА ВСЁ ВРЕМЯ
// ============================================================
export function getTotalCompleted(user) {
  const completed = user.completedTrainings || {}
  return Object.values(completed).filter((c) => c.done).length
}

// ============================================================
// СКОЛЬКО ТРЕНИРОВОК ПРОЙДЕНО ЗА ЭТУ НЕДЕЛЮ
// ============================================================
export function getWeekCompleted(user, monday) {
  const completed = user.completedTrainings || {}
  let count = 0

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateStr = formatDate(date)
    if (completed[dateStr]?.done) count++
  }

  return count
}

// ============================================================
// ПРОВЕРИТЬ — ДОСТУПНА ЛИ ПРОБНАЯ ТРЕНИРОВКА
// ============================================================
export function canStartTraining(user) {
  if (user.plan === 'pro') return true

  const completed = user.completedTrainings || {}
  const completedCount = Object.values(completed).filter((c) => c.done).length

  return completedCount === 0
}

// ============================================================
// СКОЛЬКО ПРОБНЫХ ПРОЙДЕНО (для FREE)
// ============================================================
export function getCompletedCount(user) {
  const completed = user.completedTrainings || {}
  return Object.values(completed).filter((c) => c.done).length
}

// ============================================================
// КУЛДАУН ТРЕНИРОВКИ — 96 ЧАСОВ (4 дня)
// ============================================================
export const TRAINING_COOLDOWN_HOURS = 96

// ============================================================
// ПОЛУЧИТЬ ПОСЛЕДНЮЮ ТРЕНИРОВКУ
// ============================================================
export function getLastTrainingTime(user) {
  const completed = user.completedTrainings || {}
  const dates = Object.values(completed)
    .filter((c) => c.done && c.completedAt)
    .map((c) => new Date(c.completedAt).getTime())

  if (dates.length === 0) return null
  return Math.max(...dates)
}

// ============================================================
// МОЖНО ЛИ НАЧАТЬ ТРЕНИРОВКУ?
// Кулдаун убран
// ============================================================
export function canStartNewTraining(user) {
  return { canStart: true, nextAvailable: null }
}

// ============================================================
// ПРОБНАЯ — использована ли?
// ============================================================
export function isTrialUsed(user) {
  return user.trialCompleted === true
}

// ============================================================
// ОТМЕТИТЬ ПРОБНУЮ КАК ИСПОЛЬЗОВАННУЮ
// ============================================================
export function markTrialCompleted(user) {
  return { ...user, trialCompleted: true }
}

// ============================================================
// ФОРМАТ ОСТАВШЕГОСЯ ВРЕМЕНИ
// ============================================================
export function formatRemainingTime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (days > 0) {
    return `${days} ${declOfNum(days, ['день', 'дня', 'дней'])} ${hours} ч`
  }
  if (hours > 0) {
    return `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} ${minutes} мин`
  }
  return `${minutes} ${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`
}

function declOfNum(n, titles) {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[(n % 10 < 5) ? n % 10 : 5]]
}