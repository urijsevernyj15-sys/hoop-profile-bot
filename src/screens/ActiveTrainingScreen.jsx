import { useState, useEffect } from 'react'
import { getProgramById } from '../data/programs'
import { markTrainingComplete, formatDate } from '../data/schedule'
import {
  getActiveTraining,
  saveActiveTraining,
  clearActiveTraining,
} from '../utils/trainingProgress'
import { IconFire, IconShooting, IconCooldown, IconRobot } from '../components/Icons'

// Определяем иконку по ключу секции
function getSectionIcon(section, size = 16) {
  switch (section) {
    case 'warmup':   return <IconFire size={size} />
    case 'main':     return <IconShooting size={size} />
    case 'cooldown': return <IconCooldown size={size} />
    default:         return null
  }
}

// Название секции (без эмодзи)
function getSectionLabel(section) {
  switch (section) {
    case 'warmup':   return 'Разминка'
    case 'main':     return 'Основная часть'
    case 'cooldown': return 'Заминка'
    default:         return ''
  }
}

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

  // Восстановление прогресса
  const saved = (() => {
    const active = getActiveTraining()
    if (
      active &&
      active.programId === programId &&
      active.exercisesCount === exercises.length
    ) {
      return active
    }
    return null
  })()

  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex || 0)
  const [doneExercises, setDoneExercises] = useState(saved?.doneExercises || {})
  const [elapsed, setElapsed] = useState(saved?.elapsed || 0)
  const [isPaused, setIsPaused] = useState(false)

  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Таймер
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  // Автосохранение
  useEffect(() => {
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

  const totalMinutes = session.totalDuration || 30
  const totalSeconds = totalMinutes * 60
  const timePercent = totalSeconds > 0 ? Math.min(100, (elapsed / totalSeconds) * 100) : 0

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

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

  function handleBack() {
    if (currentIndex === 0) {
      onBack()
      return
    }
    setCurrentIndex(currentIndex - 1)
  }

  function handleFinish() {
    const allDone = doneCount === totalExercises
    if (!allDone) {
      if (!window.confirm(`Выполнено ${doneCount} из ${totalExercises} упражнений. Завершить тренировку?`)) {
        return
      }
    }
    setIsPaused(true)
    setShowFinishModal(true)
  }

  function handlePause() {
    setIsPaused(true)
    setShowPauseModal(true)
  }

  function handleResume() {
    setIsPaused(false)
    setShowPauseModal(false)
  }

  function handleFinishFromPause() {
    setShowPauseModal(false)
    setIsPaused(false)
    handleFinish()
  }

  function handleExitFromPause() {
    setShowPauseModal(false)
    setIsPaused(false)
    onBack()
  }

  function handleCompleteTraining() {
    const today = new Date()
    const dateStr = formatDate(today)

    const doneCountNow = Object.values(doneExercises).filter(Boolean).length
    const allDone = doneCountNow === exercises.length

    const isPro = user.plan === 'pro'
    if (!isPro && !allDone) {
      clearActiveTraining()
      onComplete(null)
      return
    }

    const completed = markTrainingComplete(user, dateStr, programId)
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
              {isMix ? (
                <span className="active-training-head-title-inner">
                  <IconRobot size={18} />
                  <span>Микс</span>
                </span>
              ) : (
                `${program?.title || 'Тренировка'}`
              )}
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
            {getSectionIcon(currentExercise.section, 14)}
            <span>{getSectionLabel(currentExercise.section)}</span>
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
              {getSectionIcon(currentExercise.section, 14)}
              <span>{getSectionLabel(currentExercise.section)}</span>
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