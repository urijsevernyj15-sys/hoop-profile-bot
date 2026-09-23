import { useState, useEffect } from 'react'
import { getProgramById } from '../data/programs'
import { markTrainingComplete, formatDate } from '../data/schedule'
import {
  getActiveTraining,
  saveActiveTraining,
  clearActiveTraining,
} from '../utils/trainingProgress'

export default function ActiveTrainingScreen({
  user,
  programId,
  session,
  onBack,
  onComplete,
}) {
  const isMix = programId === '__mix__'
  const program = isMix ? null : getProgramById(programId)
  const exercises = session.exercises

  // ============================================================
  // ВОССТАНОВЛЕНИЕ ПРОГРЕССА ИЛИ СТАРТ С НУЛЯ
  // ============================================================
  const saved = (() => {
    const active = getActiveTraining()
    // Проверяем, что сохранённая тренировка — та же самая
    if (
      active &&
      active.programId === programId &&
      active.exercisesCount === exercises.length
    ) {
      return active
    }
    return null
  })()

  // Текущее упражнение (восстанавливаем из сохранёнки или 0)
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex || 0)
  const [doneExercises, setDoneExercises] = useState(saved?.doneExercises || {})

  // Таймер общий
  const [elapsed, setElapsed] = useState(saved?.elapsed || 0)
  const [isPaused, setIsPaused] = useState(false)

  // Модалки
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Таймер — идёт всё время, кроме паузы
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  // ============================================================
  // АВТОСОХРАНЕНИЕ ПРОГРЕССА
  // ============================================================
  useEffect(() => {
    // Не сохраняем, если тренировка уже завершена (модалка открыта)
    if (showFinishModal) return

    saveActiveTraining({
      programId,
      exercisesCount: exercises.length,
      currentIndex,
      doneExercises,
      elapsed,
      exercises: exercises,
      startedAt: saved?.startedAt || Date.now(),
    })
  }, [programId, currentIndex, doneExercises, elapsed, exercises, showFinishModal, saved])

  const totalExercises = exercises.length
  const doneCount = Object.values(doneExercises).filter(Boolean).length
  const progressPercent = totalExercises > 0 ? (doneCount / totalExercises) * 100 : 0

  const currentExercise = exercises[currentIndex]
  const isCurrentDone = currentExercise && doneExercises[currentExercise.id]

  // Общее время (приблизительное)
  const totalMinutes = session.totalDuration || 30
  const totalSeconds = totalMinutes * 60
  const timePercent = totalSeconds > 0 ? Math.min(100, (elapsed / totalSeconds) * 100) : 0

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Отметить текущее и перейти к следующему
  function handleDone() {
    if (!currentExercise) return

    const newDone = { ...doneExercises, [currentExercise.id]: true }
    setDoneExercises(newDone)

    if (currentIndex + 1 < totalExercises) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200)
    } else {
      setIsPaused(true)
      setShowFinishModal(true)
    }
  }

  // Вернуться к предыдущему
  function handleBack() {
    if (currentIndex === 0) {
      onBack()
      return
    }
    setCurrentIndex(currentIndex - 1)
  }

  // Завершить тренировку (из основной кнопки)
  function handleFinish() {
    const allDone = doneCount === totalExercises
    if (!allDone) {
      if (!window.confirm(`Выполнено ${doneCount} из ${totalExercises} упражнений. Завершить тренировку?`)) {
        return
      }
    }
    // Открываем модалку завершения
    setIsPaused(true)
    setShowFinishModal(true)
  }

  // Пауза
  function handlePause() {
    setIsPaused(true)
    setShowPauseModal(true)
  }

  // Продолжить
  function handleResume() {
    setIsPaused(false)
    setShowPauseModal(false)
  }

  // Завершить с паузы
  function handleFinishFromPause() {
    setShowPauseModal(false)
    setIsPaused(false)
    handleFinish()
  }

  // Выход с паузы (прогресс сохранится автоматически)
  function handleExitFromPause() {
    setShowPauseModal(false)
    setIsPaused(false)
    onBack()
  }

  // Финальное завершение (из модалки) — сохраняем в историю
  function handleCompleteTraining() {
    console.log('🔍 handleCompleteTraining вызван!', {
      programId,
      userPlan: user.plan,
      doneCount: Object.values(doneExercises).filter(Boolean).length,
      totalExercises: exercises.length,
    })

    const today = new Date()
    const dateStr = formatDate(today)

    const doneCountNow = Object.values(doneExercises).filter(Boolean).length
    const allDone = doneCountNow === exercises.length

    // Для FREE — сохраняем ТОЛЬКО если все упражнения сделаны
    const isPro = user.plan === 'pro'
    if (!isPro && !allDone) {
      // Не сохраняем, но чистим активную сессию
      clearActiveTraining()
      onComplete(null)
      return
    }

    const completed = markTrainingComplete(user, dateStr, programId)
    // ✅ Очищаем сохранённую тренировку — она завершена
    clearActiveTraining()
    onComplete(completed)
  }

  if (!currentExercise) {
    return (
      <div className="active-training-screen">
        <div className="active-training-empty">
          <p>Упражнения не найдены.</p>
          <button className="bottom-cta-inline" onClick={onBack}>
            Назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="active-training-screen">
        {/* ============ ШАПКА ============ */}
        <div className="active-training-head">
          <button className="icon-btn" onClick={handleBack}>←</button>

          <div className="active-training-head-info">
            <div className="active-training-head-title">
              {isMix ? '🤖 Микс' : `${program?.icon || ''} ${program?.title || 'Тренировка'}`}
            </div>
            <div className="active-training-head-sub">
              {doneCount} / {totalExercises} упражнений
            </div>
          </div>

          <button className="icon-btn pause" onClick={handlePause}>
            ⏸️
          </button>
        </div>

        {/* ============ ОБЩИЙ ТАЙМЕР ============ */}
        <div className="active-training-timer">
          <div className="active-training-timer-row">
            <span className="active-training-timer-label">Общее время</span>
            <span className="active-training-timer-value">{formatTime(elapsed)}</span>
          </div>
          <div className="active-training-timer-bar">
            <div
              className="active-training-timer-fill"
              style={{ width: timePercent + '%' }}
            />
          </div>
        </div>

        {/* ============ ПРОГРЕСС УПРАЖНЕНИЙ ============ */}
        <div className="active-training-progress">
          <div className="active-training-progress-top">
            <span>Прогресс</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="active-training-progress-bar">
            <div
              className="active-training-progress-fill"
              style={{ width: progressPercent + '%' }}
            />
          </div>
        </div>

        {/* ============ ТЕКУЩЕЕ УПРАЖНЕНИЕ ============ */}
        <div className="active-exercise-card">
          <div className="active-exercise-glow" />

          <div className="active-exercise-counter">
            {currentIndex + 1} / {totalExercises}
          </div>

          <div className="active-exercise-section">
            {currentExercise.sectionLabel}
          </div>

          <h2 className="active-exercise-title">
            {currentExercise.title}
          </h2>

          <div className="active-exercise-meta">
            <div className="active-exercise-meta-item">
              <span className="active-exercise-meta-label">Подходы</span>
              <span className="active-exercise-meta-value">
                {currentExercise.sets}
              </span>
            </div>
            <div className="active-exercise-meta-item">
              <span className="active-exercise-meta-label">
                {currentExercise.reps ? 'Повторения' : 'Время'}
              </span>
              <span className="active-exercise-meta-value">
                {currentExercise.reps || `${currentExercise.duration} мин`}
              </span>
            </div>
            {currentExercise.restBetweenSets && (
              <div className="active-exercise-meta-item">
                <span className="active-exercise-meta-label">Отдых</span>
                <span className="active-exercise-meta-value">
                  {currentExercise.restBetweenSets} сек
                </span>
              </div>
            )}
          </div>

          <div className="active-exercise-technique">
            <div className="active-exercise-technique-title">📝 Техника</div>
            <p className="active-exercise-technique-text">
              {currentExercise.technique}
            </p>
          </div>

          <div className="active-exercise-actions">
            <button
              className="active-exercise-details-btn"
              onClick={() => setShowDetails(true)}
            >
              ℹ️ Подробнее
            </button>

            <button
              className={`active-exercise-done-btn ${isCurrentDone ? 'done' : ''}`}
              onClick={handleDone}
            >
              {isCurrentDone ? '✓ Выполнено' : '✓ Готово'}
            </button>
          </div>
        </div>

        {/* ============ СЛЕДУЮЩЕЕ УПРАЖНЕНИЕ ============ */}
        {currentIndex + 1 < totalExercises && (
          <div className="active-next-hint">
            <span className="active-next-hint-label">Следующее:</span>
            <span className="active-next-hint-title">
              {exercises[currentIndex + 1].title}
            </span>
          </div>
        )}

        {/* ============ ЗАВЕРШИТЬ ============ */}
        <div className="active-training-actions">
          <button className="active-training-finish" onClick={handleFinish}>
            {doneCount === totalExercises
              ? '🏆 Завершить тренировку'
              : `Завершить (${doneCount}/${totalExercises})`}
          </button>
        </div>
      </div>

      {/* ============ МОДАЛКА ПАУЗЫ ============ */}
      {showPauseModal && (
        <div className="pause-modal-overlay">
          <div className="pause-modal">
            <div className="pause-modal-icon">⏸️</div>
            <h2 className="pause-modal-title">Пауза</h2>
            <p className="pause-modal-text">
              Таймер остановлен. Отдохни или продолжи.
            </p>

            <div className="pause-modal-time">
              {formatTime(elapsed)}
            </div>

            <button className="pause-modal-btn primary" onClick={handleResume}>
              ▶️ Продолжить
            </button>

            <button className="pause-modal-btn secondary" onClick={handleFinishFromPause}>
              🏆 Завершить тренировку
            </button>

            <button className="pause-modal-btn cancel" onClick={handleExitFromPause}>
              ← Выйти (прогресс сохранится)
            </button>
          </div>
        </div>
      )}

      {/* ============ МОДАЛКА ЗАВЕРШЕНИЯ ============ */}
      {showFinishModal && (
        <div className="pause-modal-overlay">
          <div className="pause-modal">
            <div className="pause-modal-icon">🏆</div>
            <h2 className="pause-modal-title">Тренировка завершена!</h2>
            <p className="pause-modal-text">
              Ты выполнил {doneCount} из {totalExercises} упражнений.
              {doneCount === totalExercises
                ? ' Отличная работа!'
                : ' Продолжай тренироваться, чтобы прогрессировать!'}
            </p>

            <div className="pause-modal-time">
              {formatTime(elapsed)}
            </div>

            <button
              className="pause-modal-btn primary"
              onClick={handleCompleteTraining}
            >
              🏆 Завершить
            </button>

            <button
              className="pause-modal-btn cancel"
              onClick={() => {
                setShowFinishModal(false)
                setIsPaused(false)
              }}
            >
              ← Вернуться к тренировке
            </button>
          </div>
        </div>
      )}

      {/* ============ МОДАЛКА ДЕТАЛЕЙ ============ */}
      {showDetails && currentExercise && (
        <div className="exercise-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exercise-modal-handle" />

            <div className="exercise-modal-section">
              {currentExercise.sectionLabel}
            </div>
            <h2 className="exercise-modal-title">{currentExercise.title}</h2>

            <div className="exercise-modal-meta">
              <div className="exercise-modal-meta-item">
                <span className="exercise-modal-meta-label">Подходы</span>
                <span className="exercise-modal-meta-value">
                  {currentExercise.sets}
                </span>
              </div>
              <div className="exercise-modal-meta-item">
                <span className="exercise-modal-meta-label">
                  {currentExercise.reps ? 'Повторения' : 'Время'}
                </span>
                <span className="exercise-modal-meta-value">
                  {currentExercise.reps
                    ? currentExercise.reps
                    : `${currentExercise.duration} мин`}
                </span>
              </div>
              {currentExercise.restBetweenSets && (
                <div className="exercise-modal-meta-item">
                  <span className="exercise-modal-meta-label">Отдых</span>
                  <span className="exercise-modal-meta-value">
                    {currentExercise.restBetweenSets} сек
                  </span>
                </div>
              )}
            </div>

            <div className="exercise-modal-block">
              <div className="exercise-modal-block-title">📝 Техника</div>
              <p className="exercise-modal-block-text">
                {currentExercise.technique}
              </p>
            </div>

            {currentExercise.gear && currentExercise.gear.length > 0 && (
              <div className="exercise-modal-block">
                <div className="exercise-modal-block-title">🎒 Инвентарь</div>
                <p className="exercise-modal-block-text">
                  {currentExercise.gear.join(' · ')}
                </p>
              </div>
            )}

            <button
              className="exercise-modal-close"
              onClick={() => setShowDetails(false)}
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  )
}