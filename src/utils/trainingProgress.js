// ============================================================
// ПРОГРЕСС ТРЕНИРОВКИ — сохранение в localStorage
// ============================================================

const STORAGE_KEY = 'hoop_training_progress'

// Получить активную тренировку (если есть)
export function getActiveTraining() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data || null
  } catch (err) {
    console.warn('Ошибка чтения тренировки:', err)
    return null
  }
}

// Сохранить активную тренировку
export function saveActiveTraining(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      updatedAt: Date.now(),
    }))
  } catch (err) {
    console.warn('Ошибка сохранения тренировки:', err)
  }
}

// Очистить активную тренировку (после завершения)
export function clearActiveTraining() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Ошибка очистки тренировки:', err)
  }
}

// Проверить, есть ли незавершённая тренировка
export function hasActiveTraining() {
  return getActiveTraining() !== null
}