import { useState, useEffect } from 'react'
import { PROGRAMS, getProgramProgress } from '../data/programs'
import {
  getWeekSchedule,
  formatDate,
  getTotalCompleted,
  getWeekCompleted,
  isTrialUsed,
  isTrainingCompleted,
} from '../data/schedule'
import TrainingCalendar from '../components/TrainingCalendar'
import TrainingOnboarding from '../components/TrainingOnboarding'
import MixTrainingScreen from './MixTrainingScreen'
import { getActiveTraining, clearActiveTraining } from '../utils/trainingProgress'
import {
  IconShooting,
  IconDribbling,
  IconDrives,
  IconFinishing,
  IconAthleticism,
  IconIQ,
  IconDefense,
  IconPassing,
  IconRobot,
  IconMoon,
  IconTrophy,
} from '../components/Icons'

// Функция — какая SVG-иконка соответствует программе
function getProgramIcon(programId, size = 28) {
  switch (programId) {
    case 'sniper':    return <IconShooting size={size} />
    case 'playmaker': return <IconDribbling size={size} />
    case 'beast':     return <IconAthleticism size={size} />
    case 'slasher':   return <IconDrives size={size} />
    case 'universal': return <IconFinishing size={size} />
    default:          return <IconTrophy size={size} />
  }
}

export default function TrainingScreen({
  user,
  onOpenProgram,
  onOpenCustomProgram,
  onOpenPro,
  onOpenSettings,
  onSaveProfile,
}) {
  const isPro = user.plan === 'pro'
  const trialUsed = isTrialUsed(user)

  const [activeTraining, setActiveTraining] = useState(null)

  useEffect(() => {
    const active = getActiveTraining()
    setActiveTraining(active || null)
  }, [user])

  function handleResumeTraining() {
    if (!activeTraining) return
    onOpenProgram(activeTraining.programId, {
      exercises: activeTraining.exercises,
      totalExercises: activeTraining.exercises.length,
      totalDuration: activeTraining.exercises.reduce(
        (sum, ex) => sum + (ex.duration || 5),
        0
      ),
      mainCategory: 'resumed',
    })
  }

  // ============ ОНБОРДИНГ ПРИ ПЕРВОМ ЗАХОДЕ ============
  if (isPro && !user.trainingOnboarded) {
    return (
      <TrainingOnboarding
        onComplete={() => {
          onSaveProfile({ trainingOnboarded: true })
        }}
        onOpenSettings={() => {
          onSaveProfile({ trainingOnboarded: true })
          onOpenSettings()
        }}
      />
    )
  }

  // ============ FREE: ЗАГЛУШКА / ПРОБНАЯ ============
  if (!isPro) {
    if (trialUsed) {
      return (
        <div className="training-locked">
          <div className="training-locked-bg">
            <svg className="training-locked-chart" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 L40,65 L80,72 L120,50 L160,58 L200,35 L240,42 L280,25 L320,32 L360,15 L400,22 L400,120 L0,120 Z" fill="url(#chartFillGrad)" />
              <path className="training-locked-chart-line" d="M0,80 L40,65 L80,72 L120,50 L160,58 L200,35 L240,42 L280,25 L320,32 L360,15 L400,22" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="120" cy="50" r="3" fill="var(--accent)" />
              <circle cx="200" cy="35" r="3" fill="var(--accent)" />
              <circle cx="280" cy="25" r="3" fill="var(--accent)" />
              <circle cx="360" cy="15" r="3" fill="var(--accent)" />
            </svg>
            <div className="training-locked-grid" />
          </div>
          <div className="training-locked-blur" />

          <div className="training-locked-content">
            <div className="training-locked-icon">🔒</div>
            <h1 className="training-locked-title">Тренировки только в PRO</h1>
            <p className="training-locked-sub">
              Ты уже попробовал пробную тренировку. Оформи PRO, чтобы открыть:
            </p>

            <div className="training-locked-features">
              <div className="training-locked-feature">
                <span className="training-locked-feature-check">✓</span>
                <span>Персональный план под цели</span>
              </div>
              <div className="training-locked-feature">
                <span className="training-locked-feature-check">✓</span>
                <span>Чередование категорий по дням</span>
              </div>
              <div className="training-locked-feature">
                <span className="training-locked-feature-check">✓</span>
                <span>Учёт уровня и позиции</span>
              </div>
              <div className="training-locked-feature">
                <span className="training-locked-feature-check">✓</span>
                <span>5 готовых программ</span>
              </div>
              <div className="training-locked-feature">
                <span className="training-locked-feature-check">✓</span>
                <span>Прогрессия по неделям</span>
              </div>
            </div>

            <button className="training-locked-cta" onClick={onOpenPro}>
              Оформить PRO
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )
    }

    // Первый заход — пробная
    return (
      <div className="training-trial-screen">
        <div className="training-head">
          <h1 className="training-head-title">Тренировки</h1>
          <p className="training-head-sub">Доступно в PRO</p>
        </div>

        <div className="training-trial-card">
          <div className="trial-bg">
            <svg className="trial-bg-chart" viewBox="0 0 400 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trialChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,120 L30,110 L60,115 L90,95 L120,100 L150,75 L180,80 L210,60 L240,65 L270,45 L300,50 L330,30 L360,35 L400,15 L400,150 L0,150 Z" fill="url(#trialChartFill)" />
              <path className="trial-bg-chart-line" d="M0,120 L30,110 L60,115 L90,95 L120,100 L150,75 L180,80 L210,60 L240,65 L270,45 L300,50 L330,30 L360,35 L400,15" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle className="trial-chart-dot" cx="90" cy="95" r="3" fill="var(--accent)" />
              <circle className="trial-chart-dot" cx="180" cy="80" r="3" fill="var(--accent)" />
              <circle className="trial-chart-dot" cx="270" cy="45" r="3" fill="var(--accent)" />
              <circle className="trial-chart-dot" cx="360" cy="35" r="3" fill="var(--accent)" />
            </svg>
            <div className="trial-bg-grid" />
          </div>
          <div className="trial-bg-blur" />

          <div className="training-trial-icon">🎁</div>
          <div className="training-trial-label">ПРОБНАЯ ТРЕНИРОВКА</div>
          <h2 className="training-trial-title">Попробуй 1 тренировку</h2>
          <p className="training-trial-sub">
            Чтобы ты понял, что тебя ждёт в PRO — мы даём
            одну полноценную тренировку бесплатно.
          </p>

          <div className="training-trial-info">
            <div className="training-trial-info-row">
              <span className="training-trial-info-icon">🎯</span>
              <span>2 упражнения на бросок</span>
            </div>
            <div className="training-trial-info-row">
              <span className="training-trial-info-icon">⚡</span>
              <span>2 упражнения на дриблинг</span>
            </div>
            <div className="training-trial-info-row">
              <span className="training-trial-info-icon">🚀</span>
              <span>1 упражнение на проход</span>
            </div>
            <div className="training-trial-info-row">
              <span className="training-trial-info-icon">💪</span>
              <span>2 упражнения на атлетизм</span>
            </div>
          </div>

          <button
            className="training-trial-btn"
            onClick={() => onOpenProgram('__trial__')}
          >
            Начать пробную
            <span className="arrow">→</span>
          </button>

          <p className="training-trial-note">
            💡 Одна тренировка — один раз. Потом только PRO.
          </p>
        </div>

        <div className="training-divider">
          <span>Или оформи PRO сразу</span>
        </div>

        <button className="training-trial-pro-btn" onClick={onOpenPro}>
          🔒 Разблокировать все тренировки
        </button>
      </div>
    )
  }

  // ============ РЕЖИМ МИКС ============
  if (user.trainingMode === 'mix') {
    return (
      <MixTrainingScreen
        user={user}
        onOpenSettings={onOpenSettings}
        onStartMixTraining={(session) => onOpenProgram('__mix__', session)}
        onOpenPro={onOpenPro}
      />
    )
  }

  // ============ PRO: полная версия ============
  const totalCompleted = getTotalCompleted(user)

  const today = new Date()
  const monday = new Date(today)
  const diff = today.getDay() === 0 ? 6 : today.getDay() - 1
  monday.setDate(today.getDate() - diff)

  const weekSchedule = getWeekSchedule(user, monday)
  const weekCompleted = getWeekCompleted(user, monday)

  const todayStr = formatDate(today)
  const todayData = weekSchedule[todayStr]
  const todayProgramId = todayData?.programId || null
  const todayProgram = todayProgramId
    ? PROGRAMS.find((p) => p.id === todayProgramId) || null
    : null

  const isTodayDone = isTrainingCompleted(user, todayStr)

  return (
    <>
      <div className="training-program-screen">
        <div className="training-head">
          <h1 className="training-head-title">Тренировки</h1>
          <p className="training-head-sub">Твой план</p>
        </div>

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
            <div className="training-stat-value">∞</div>
            <div className="training-stat-label">без лимита</div>
          </div>
        </div>

        <TrainingCalendar
          user={user}
          schedule={weekSchedule}
        />

        {todayProgram ? (
          <div
            className={`single-training-card ${isTodayDone ? 'done' : ''}`}
            style={{ '--program-color': todayProgram.color }}
          >
            <div className="single-training-glow" />

            <div className="single-training-icon">
              {isTodayDone
                ? <IconTrophy size={48} />
                : getProgramIcon(todayProgram.id, 48)}
            </div>
            <div className="single-training-label">
              {isTodayDone
                ? 'СЕГОДНЯ · ВЫПОЛНЕНО'
                : `СЕГОДНЯ · ${todayProgram.title.toUpperCase()}`}
            </div>
            <h2 className="single-training-title">
              {isTodayDone ? 'Тренировка пройдена!' : 'Моя тренировка'}
            </h2>
            <p className="single-training-sub">
              {isTodayDone
                ? 'Отдыхай — мышцы растут во время отдыха'
                : todayData.reason || `Программа «${todayProgram.title}»`}
            </p>

            {isTodayDone ? (
              <div className="single-training-done-badge">
                <span className="single-training-done-check">✓</span>
                <span>Возвращайся завтра</span>
              </div>
            ) : activeTraining && activeTraining.programId === todayProgram.id ? (
              <button
                className="single-training-btn mix-resume-btn"
                onClick={handleResumeTraining}
              >
                Продолжить тренировку
                <span className="arrow">→</span>
              </button>
            ) : (
              <button
                className="single-training-btn"
                style={{ '--program-color': todayProgram.color }}
                onClick={() => onOpenProgram(todayProgram.id)}
              >
                Начать тренировку
                <span className="arrow">→</span>
              </button>
            )}
          </div>
        ) : (
          <div className="single-training-card rest">
            <div className="single-training-glow" />

            <div className="single-training-icon">
              <IconMoon size={48} />
            </div>
            <div className="single-training-label">СЕГОДНЯ · ОТДЫХ</div>
            <h2 className="single-training-title">Восстановление</h2>
            <p className="single-training-sub">
              Сегодня не тренировочный день. Мышцы восстанавливаются.
            </p>

            <div className="single-training-rest-info">
              <div className="single-training-rest-label">
                Следующая тренировка
              </div>
              <div className="single-training-rest-value">
                {(() => {
                  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                  const trainingDays = user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
                  for (let i = 1; i <= 7; i++) {
                    const nextDate = new Date(today)
                    nextDate.setDate(today.getDate() + i)
                    const nextIdx = nextDate.getDay() === 0 ? 6 : nextDate.getDay() - 1
                    const nextDayName = dayNames[nextIdx]
                    if (trainingDays.includes(nextDayName)) {
                      return `${nextDayName}, ${nextDate.getDate()}`
                    }
                  }
                  return '—'
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="training-divider">
          <span>Или выбери программу</span>
        </div>

        <div className="programs-list">
          {PROGRAMS.filter((p) => p.id !== 'custom').map((program) => {
            const progress = getProgramProgress(program.id, user)

            return (
              <button
                key={program.id}
                className="program-card"
                style={{ '--program-color': program.color }}
                onClick={() => onOpenProgram(program.id)}
              >
                <div className="program-card-glow" />

                <div className="program-card-top">
                  <div className="program-card-icon">
                    {getProgramIcon(program.id, 26)}
                  </div>
                  <div className="program-card-badge">
                    {progress && progress.started ? (
                      <span className="program-card-badge-progress">
                        {progress.percent}%
                      </span>
                    ) : (
                      <span className="program-card-badge-new">НОВОЕ</span>
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
                  Открыть <span className="program-card-arrow">→</span>
                </div>
              </button>
            )
          })}
        </div>

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
                </div>
              </div>
            </div>
            <div className="training-explainer-item">
              <span className="training-explainer-num">3</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Чередуем категории по дням
                </div>
                <div className="training-explainer-item-text">
                  Пн — Бросок, Вт — Дриблинг, Ср — Проходы, и так по кругу.
                </div>
              </div>
            </div>
            <div className="training-explainer-item">
              <span className="training-explainer-num">4</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Без лимитов
                </div>
                <div className="training-explainer-item-text">
                  В PRO — тренируйся сколько хочешь. Никаких кулдаунов.
                </div>
              </div>
            </div>
            <div className="training-explainer-item">
              <span className="training-explainer-num">5</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Структура — 3 части
                </div>
                <div className="training-explainer-item-text">
                  🔥 Разминка → 🎯 Основная часть → 🧘 Заминка.
                </div>
              </div>
            </div>
          </div>

          <div className="training-explainer-note">
            💪 Регулярность важнее интенсивности.
          </div>
        </div>
      </div>
    </>
  )
}