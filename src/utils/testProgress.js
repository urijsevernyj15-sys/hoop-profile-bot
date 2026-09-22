// src/utils/testProgress.js
// Модуль для сохранения прогресса тестов в localStorage

const STORAGE_KEY = 'hoop_test_progress'

// Получить прогресс по конкретному тесту
export function getTestProgress(testId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return all[testId] || null
  } catch (err) {
    console.warn('Ошибка чтения прогресса:', err)
    return null
  }
}

// Сохранить прогресс теста
export function saveTestProgress(testId, progress) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    all[testId] = {
      ...progress,
      updatedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (err) {
    console.warn('Ошибка сохранения прогресса:', err)
  }
}

// Очистить прогресс теста
export function clearTestProgress(testId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    delete all[testId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (err) {
    console.warn('Ошибка очистки прогресса:', err)
  }
}

// Очистить весь прогресс (например, при сбросе аккаунта)
export function clearAllProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Ошибка очистки всего прогресса:', err)
  }
}