import { useState, useEffect } from 'react'
import { PROGRAMS, getProgramProgress } from '../data/programs'
import {
  getWeekSchedule,
  formatDate,
  getTrainingMode,
  getSelectedProgram,
  getTotalCompleted,
  getWeekCompleted,
  canStartTraining,
  getCompletedCount,
} from '../data/schedule'
import TrainingCalendar from '../components/TrainingCalendar'

export default function TrainingScreen({
  user,
  onOpenProgram,
  onOpenCustomProgram,
}) {
  const isPro = user.plan === 'pro'

  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (isPro) return
    const seen = localStorage.getItem('hoop_training_welcome')
    if (!seen) {
      setShowWelcome(true)
    }
  }, [isPro])

  function closeWelcome() {
    setShowWelcome(false)
    localStorage.setItem('hoop_training_welcome', 'true')
  }

  function handleStartFree() {
    closeWelcome()
    onOpenProgram('universal')
  }

  // Расписание
  const today = new Date()
  const monday = new Date(today)
  const diff = today.getDay() === 0 ? 6 : today.getDay() - 1
  monday.setDate(today.getDate() - diff)

  const weekSchedule = getWeekSchedule(user, monday)
  const todayStr = formatDate(today)
  const todayData = weekSchedule[todayStr]

  const todayProgram = todayData
    ? PROGRAMS.find((p) => p.id === todayData.programId)
    : null

  const mode = getTrainingMode(user)
  const totalCompleted = getTotalCompleted(user)
  const weekCompleted = getWeekCompleted(user, monday)

  // Сортировка программ
  const sortedPrograms = [...PROGRAMS].sort((a, b) => {
    if (a.plan === 'free' && b.plan === 'pro') return -1
    if (a.plan === 'pro' && b.plan === 'free') return 1
    return 0
  })
    const canTrain = canStartTraining(user)
  const completedCount = getCompletedCount(user)
  const trialUsed = !isPro && completedCount > 0

  return (
    <>
      <div className="training-program-screen">
        <div className="training-head">
          <h1 className="training-head-title">Тренировки</h1>
          <p className="training-head-sub">Твой план на неделю</p>
        </div>

        {/* Статистика */}
        <div className="training-stats-row">
          <div className="training-stat">
            <div className="training-stat-value">{weekCompleted}</div>
            <div className="training-stat-label">на этой неделе</div>
          </div>
          <div className="training-stat">
            <div className="training-stat-value">{totalCompleted}</div>
            <div className="training-stat-label">всего пройдено</div>
          </div>
          <div className="training-stat">
            <div className="training-stat-value">
              {mode === 'mix' ? '🔀' : '🎯'}
            </div>
            <div className="training-stat-label">
              {mode === 'mix' ? 'микс' : 'одна'}
            </div>
          </div>
        </div>

        {/* Календарь — всегда активен */}
        <TrainingCalendar
          user={user}
          schedule={weekSchedule}
        />

               {/* Карточка «Сегодня» */}
        {todayData && todayProgram ? (
          <div
            className="training-today-card"
            style={{ '--program-color': todayProgram.color }}
          >
            <div className="training-today-label">
              {todayData.done ? '✓ ПРОЙДЕНО' : 'СЕГОДНЯ'}
            </div>
            <div className="training-today-title">
              {todayProgram.icon} {todayProgram.title}
            </div>
            <div className="training-today-reason">
              💡 {todayData.reason}
            </div>

            {/* FREE — заблокировано после пробной */}
            {trialUsed && !todayData.done ? (
              <button
                className="training-today-btn locked"
                onClick={() => onOpenProgram('pro')}
              >
                🔒 Пробная пройдена — оформи PRO
              </button>
            ) : (
              <button
                className="training-today-btn"
                onClick={() => onOpenProgram(todayData.programId)}
              >
                {todayData.done ? 'Перепройти' : 'Начать'}
                <span className="arrow">→</span>
              </button>
            )}
          </div>
        ) : (
          <div className="training-rest-card">
            <div className="training-rest-icon">😴</div>
            <div className="training-rest-title">Сегодня отдых</div>
            <div className="training-rest-sub">
              Восстановление — часть тренировки
            </div>
          </div>
        )}

        {/* Разделитель */}
        <div className="training-divider">
          <span>Или выбери программу</span>
        </div>

        {/* Программы */}
        <div className="programs-list">
          {sortedPrograms.map((program) => {
            const progress = getProgramProgress(program.id, user)
            const isCustom = program.id === 'custom'
            const isLocked = program.plan === 'pro' && !isPro

            return (
              <button
                key={program.id}
                className={`program-card ${isCustom ? 'custom' : ''} ${isLocked ? 'locked' : ''}`}
                style={{ '--program-color': program.color }}
                onClick={() => {
                  if (isLocked) {
                    onOpenProgram('pro')
                    return
                  }
                  if (isCustom) {
                    onOpenCustomProgram()
                  } else {
                    onOpenProgram(program.id)
                  }
                }}
              >
                <div className="program-card-glow" />

                <div className="program-card-top">
                  <div className="program-card-icon">{program.icon}</div>
                  <div className="program-card-badge">
                    {isLocked ? (
                      <span className="program-card-badge-locked">🔒 PRO</span>
                    ) : program.plan === 'free' ? (
                      <span className="program-card-badge-free">БЕСПЛАТНО</span>
                    ) : progress && progress.started ? (
                      <span className="program-card-badge-progress">
                        {progress.percent}%
                      </span>
                    ) : (
                      <span className="program-card-badge-new">Новое</span>
                    )}
                  </div>
                </div>

                <div className="program-card-title">{program.title}</div>
                <div className="program-card-subtitle">{program.subtitle}</div>

                <div className="program-card-meta">
                  <span className="program-card-meta-item">
                    <span className="program-card-meta-icon">📅</span>
                    {program.duration}
                  </span>
                  <span className="program-card-meta-item">
                    <span className="program-card-meta-icon">🔁</span>
                    {program.daysPerWeek} раза/нед
                  </span>
                  <span className="program-card-meta-item">
                    <span className="program-card-meta-icon">📊</span>
                    {program.difficulty}
                  </span>
                </div>

                <div className="program-card-action">
                  {isLocked ? (
                    <>Разблокировать <span className="program-card-arrow">→</span></>
                  ) : isCustom ? (
                    <>Собрать <span className="program-card-arrow">→</span></>
                  ) : (
                    <>Открыть <span className="program-card-arrow">→</span></>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* ============ КАК СТРОЯТСЯ ТРЕНИРОВКИ ============ */}
        <div className="training-explainer">
          <div className="training-explainer-header">
            <span className="training-explainer-icon">💡</span>
            <h3 className="training-explainer-title">Как строятся тренировки</h3>
          </div>

          <div className="training-explainer-list">
            <div className="training-explainer-item">
              <span className="training-explainer-num">1</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Учитываем твой уровень
                </div>
                <div className="training-explainer-item-text">
                  Новичок — 3 упражнения, любитель — 5, продвинутый — 7.
                  Прогрессия каждую неделю.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">2</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Подбираем под позицию
                </div>
                <div className="training-explainer-item-text">
                  Упражнения заточены под PG, SG, SF, PF или C.
                  Разыгрывающий и центровой тренируются по-разному.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">3</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Учитываем инвентарь
                </div>
                <div className="training-explainer-item-text">
                  Есть только мяч — план подстроится. Есть партнёр — добавим
                  упражнения в паре.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">4</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Режим «Микс» ищет слабые места
                </div>
                <div className="training-explainer-item-text">
                  Робот анализирует твои тесты и подбирает программы, которые
                  прокачают слабые навыки.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">5</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Структура — всегда 3 части
                </div>
                <div className="training-explainer-item-text">
                  🔥 Разминка → 🎯 Основная часть → 🧘 Заминка.
                  Это снижает риск травм и ускоряет прогресс.
                </div>
              </div>
            </div>
          </div>

          <div className="training-explainer-note">
            💪 Регулярность важнее интенсивности. Лучше 3 короткие тренировки в неделю, чем 1 длинная.
          </div>
        </div>
      </div>

      {/* МОДАЛКА ПРИВЕТСТВИЯ */}
      {showWelcome && (
        <div className="welcome-modal-overlay" onClick={closeWelcome}>
          <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
            <div className="welcome-modal-glow" />
            <div className="welcome-modal-icon">🎁</div>
            <h2 className="welcome-modal-title">
              1 программа <span className="welcome-modal-highlight">бесплатно</span>
            </h2>
            <p className="welcome-modal-text">
              Попробуй программу <strong className="welcome-modal-accent">«Универсал»</strong> — она доступна всем без PRO.
              Остальные программы откроются с подпиской PRO.
            </p>
            <div className="welcome-modal-features">
              <div className="welcome-modal-feature">
                <span className="welcome-modal-feature-check">✓</span>
                <span>Тренировки на все навыки</span>
              </div>
              <div className="welcome-modal-feature">
                <span className="welcome-modal-feature-check">✓</span>
                <span>Прогрессия по неделям</span>
              </div>
              <div className="welcome-modal-feature">
                <span className="welcome-modal-feature-check">✓</span>
                <span>Под твою позицию и уровень</span>
              </div>
            </div>
            <button className="welcome-modal-btn" onClick={handleStartFree}>
              Начать бесплатно <span className="arrow">→</span>
            </button>
            <button className="welcome-modal-skip" onClick={closeWelcome}>
              Посмотреть все программы
            </button>
          </div>
        </div>
      )}
    </>
  )
}