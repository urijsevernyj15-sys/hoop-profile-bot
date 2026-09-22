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
// Возвращает: { shooting: 0.7, dribbling: 0.4, ... } — приоритет 0-1
// Чем НИЖЕ балл — тем выше приоритет
// ============================================================
export function getWeakCategories(user) {
  // Маппинг тестов на категории
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

  // Среднее по каждой категории
  const averages = {}
  Object.keys(categories).forEach((cat) => {
    averages[cat] = categories[cat] / categoriesCount[cat]
  })

  return averages
}

// ============================================================
// ОПРЕДЕЛИТЬ ПРОГРАММУ ДЛЯ КОНКРЕТНОГО ДНЯ
// Логика:
// 1. Если пользователь выбрал ОДНУ программу — она и есть
// 2. Если режим "микс" — робот чередует по слабым местам
// ============================================================
export function getProgramForDay(user, date) {
  // Проверяем — тренировочный ли день
  if (!isTrainingDay(user, date)) {
    return null
  }

  const mode = user.trainingMode || 'manual' // 'manual' или 'mix'

  // === РЕЖИМ "РУЧНОЙ" — одна программа ===
  if (mode === 'manual') {
    const selectedId = user.selectedProgramId || 'universal'
    return {
      programId: selectedId,
      reason: 'Ты выбрал эту программу',
    }
  }

  // === РЕЖИМ "МИКС" — робот выбирает ===
  const weakCategories = getWeakCategories(user)

  // Доступные программы (кроме custom)
  const availablePrograms = PROGRAMS.filter(
    (p) => p.id !== 'custom' && p.plan !== undefined
  )

  if (availablePrograms.length === 0) {
    return {
      programId: 'universal',
      reason: 'Универсальная программа',
    }
  }

  // Считаем приоритет каждой программы
  const programScores = availablePrograms.map((program) => {
    let score = 0
    let count = 0

    // Для каждой категории программы смотрим балл
    program.mainCategories.forEach((cat) => {
      const catScore = weakCategories[cat]
      if (catScore !== undefined) {
        // Чем НИЖЕ балл — тем ВЫШЕ приоритет
        score += (100 - catScore)
        count++
      }
    })

    const avgScore = count > 0 ? score / count : 0
    return { program, score: avgScore }
  })

  // Сортируем по убыванию (слабые места — выше)
  programScores.sort((a, b) => b.score - a.score)

  // Берём тренировочный день по счёту и чередуем
  const dayIdx = getDayIndex(date)
  const trainingDays = user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  // На каком месте этот день среди тренировочных
  const trainingDayNames = dayNames.filter((d) => trainingDays.includes(d))
  const position = trainingDayNames.indexOf(dayNames[dayIdx])

  if (position === -1) return null

  // Чередуем из топ-3 приоритетных
  const topPrograms = programScores.slice(0, 3)
  const selected = topPrograms[position % topPrograms.length]

  // Формируем объяснение
  const reason = getReasonText(selected.program, weakCategories)

  return {
    programId: selected.program.id,
    reason,
  }
}

// ============================================================
// ТЕКСТ ОБЪЯСНЕНИЯ — почему выбрана эта программа
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
// 'manual' — одна программа, 'mix' — робот чередует
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

  if (mode === 'manual') {
    const programId = getSelectedProgram(user)
    const program = getProgramById(programId)
    return {
      programId,
      reason: program
        ? `Ты выбрал программу «${program.title}»`
        : 'Ты выбрал эту программу',
    }
  }

  // Режим МИКС — робот чередует
  return getProgramForDay(user, date)
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
// FREE может пройти ТОЛЬКО 1 тренировку
// ============================================================
export function canStartTraining(user) {
  // PRO — всегда можно
  if (user.plan === 'pro') return true

  // FREE — проверяем, проходил ли уже
  const completed = user.completedTrainings || {}
  const completedCount = Object.values(completed).filter((c) => c.done).length

  // Можно — только если ещё НИ РАЗУ не тренировался
  return completedCount === 0
}

// ============================================================
// СКОЛЬКО ПРОБНЫХ ПРОЙДЕНО (для FREE)
// ============================================================
export function getCompletedCount(user) {
  const completed = user.completedTrainings || {}
  return Object.values(completed).filter((c) => c.done).length
}