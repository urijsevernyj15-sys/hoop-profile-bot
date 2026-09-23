import { useState } from 'react'
import { getProgramById, getProgramProgress } from '../data/programs'
import {
  getTrainingSession,
  getPersonalTraining,
  getTrialSession,
} from '../data/exercisesData'
import { canStartNewTraining } from '../data/schedule'

export default function ProgramScreen({
  user,
  programId,
  onBack,
  onStartTraining,
  onOpenSettings,
  onOpenPro,
}) {
  const [selectedDay, setSelectedDay] = useState(null)

  let program = getProgramById(programId)

  // Для пробной — фейковая программа
  if (!program && programId === '__trial__') {
    program = {
      id: '__trial__',
      title: 'Пробная тренировка',
      subtitle: 'Знакомство с PRO',
      description: 'Полноценная тренировка, чтобы понять, что тебя ждёт в PRO.',
      icon: '🏀',
      color: '#FF6B1A',
      duration: '~45 минут',
      daysPerWeek: 1,
      difficulty: 'Разная',
      focus: ['Бросок', 'Дриблинг', 'Проход', 'Атлетизм'],
    }
  }

  const progress = getProgramProgress(programId, user)

  // Проверка — заполнены ли настройки (кроме пробной)
  const hasGoals = (user.trainingGoals || []).length > 0
  const hasGear = (user.trainingGear || []).length > 0
  const hasSettings = hasGoals && hasGear

  // Если программа не найдена
  if (!program) {
    return (
      <>
        <div className="screen-head screen-head-minimal">
          <button className="icon-btn" onClick={onBack}>←</button>
        </div>
        <div className="test-run">
          <p className="test-run-desc">Программа не найдена.</p>
        </div>
      </>
    )
  }

  // Онбординг настроек — только для PRO, если настройки пусты
  if (!hasSettings && programId !== '__trial__' && user.plan === 'pro') {
    return (
      <>
        <div className="screen-head screen-head-minimal">
          <button className="icon-btn" onClick={onBack}>←</button>
        </div>

        <div className="program-onboarding">
          <div className="program-onboarding-icon">⚙️</div>
          <h1 className="program-onboarding-title">Настрой тренировку</h1>
          <p className="program-onboarding-sub">
            Прежде чем начать, ответь на 3 вопроса. Программа подстроится под тебя.
          </p>

          <div className="program-onboarding-list">
            <div className="program-onboarding-item">
              <span className="program-onboarding-item-num">1</span>
              <div>
                <div className="program-onboarding-item-title">Какие цели?</div>
                <div className="program-onboarding-item-sub">
                  Бросок, дриблинг, атлетизм, IQ, защита, пас, проходы, завершения
                </div>
              </div>
            </div>
            <div className="program-onboarding-item">
              <span className="program-onboarding-item-num">2</span>
              <div>
                <div className="program-onboarding-item-title">Что есть под рукой?</div>
                <div className="program-onboarding-item-sub">
                  Мяч, два мяча, партнёр, конусы
                </div>
              </div>
            </div>
            <div className="program-onboarding-item">
              <span className="program-onboarding-item-num">3</span>
              <div>
                <div className="program-onboarding-item-title">Какой уровень?</div>
                <div className="program-onboarding-item-sub">
                  Новичок, любитель или продвинутый
                </div>
              </div>
            </div>
          </div>

          <button className="program-onboarding-btn" onClick={onOpenSettings}>
            Настроить и начать
            <span className="arrow">→</span>
          </button>

          <p className="program-onboarding-note">Займёт 1 минуту</p>
        </div>
      </>
    )
  }

  // Определяем позицию и уровень
  const position = user.positions?.[0] || null
  const level = user.trainingLevel || 'beginner'
  const gear = user.trainingGear || []
  const daysPerWeek = program.daysPerWeek

  const currentDay = progress?.currentDay || 1
  const currentWeek = progress?.currentWeek || 1

  const isTrial =
    user.plan !== 'pro' &&
    (!user.completedTrainings || Object.keys(user.completedTrainings).length === 0)

  // Определяем сессию
  let todaySession
  if (programId === '__trial__') {
    todaySession = getTrialSession()
  } else if (programId === 'universal') {
    todaySession = getPersonalTraining(user)
  } else {
    todaySession = getTrainingSession({
      program,
      user,
      isTrial,
      dayIndex: currentDay - 1,
    })
  }

  // Кулдаун (для FREE)
  const cooldown = canStartNewTraining(user)
  const showCooldown = !cooldown.canStart && user.plan !== 'pro'

  return (
    <>
      <div className="screen-head screen-head-minimal">
        <button className="icon-btn" onClick={onBack}>←</button>
        {programId !== '__trial__' && user.plan === 'pro' && (
          <button className="icon-btn" onClick={onOpenSettings}>⚙️</button>
        )}
      </div>

      <div className="program-screen">
        {/* Hero программы */}
        <div
          className="program-hero"
          style={{ '--program-color': program.color }}
        >
          <div className="program-hero-glow" />
          <div className="program-hero-icon">{program.icon}</div>
          <h1 className="program-hero-title">{program.title}</h1>
          <p className="program-hero-sub">{program.subtitle}</p>

          <div className="program-hero-meta">
            <span className="program-hero-meta-item">
              📅 {program.duration}
            </span>
            <span className="program-hero-meta-item">
              🔁 {daysPerWeek} раза/нед
            </span>
            <span className="program-hero-meta-item">
              📊 {program.difficulty}
            </span>
          </div>
        </div>

        {/* Прогресс */}
        {progress && progress.started && programId !== '__trial__' && (
          <div className="program-progress-card">
            <div className="program-progress-top">
              <span className="program-progress-label">Прогресс программы</span>
              <span className="program-progress-value">{progress.percent}%</span>
            </div>
            <div className="program-progress-bar">
              <div
                className="program-progress-fill"
                style={{
                  width: progress.percent + '%',
                  background: `linear-gradient(90deg, ${program.color}, ${program.color}cc)`,
                }}
              />
            </div>
            <div className="program-progress-hint">
              Неделя {progress.currentWeek} из {parseInt(program.duration) || 4} · Пройдено {progress.completedSessions} из {progress.totalSessions} тренировок
            </div>
          </div>
        )}

        {/* Описание + Фокус — объединено */}
        <div className="card intro-card">
          <div className="tag-pill">О программе</div>
          <p className="card-text">{program.description}</p>

          {program.focus && program.focus.length > 0 && (
            <div className="program-focus-inline">
              <div className="program-focus-label">На что упор</div>
              <div className="program-focus-chips">
                {program.focus.map((f, i) => (
                  <div key={i} className="program-focus-chip">
                    <span className="program-focus-chip-check">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Сегодняшняя тренировка */}
        <div className="program-today">
          <div className="program-today-head">
            <div className="program-today-label">
              {progress && progress.started && programId !== '__trial__'
                ? `НЕДЕЛЯ ${currentWeek} · ДЕНЬ ${currentDay}`
                : 'СЕГОДНЯ'}
            </div>
            <h2 className="program-today-title">Сегодня</h2>
          </div>

          <div className="program-today-info">
            <div className="program-today-stat">
              <span className="program-today-stat-value">
                {todaySession.totalExercises}
              </span>
              <span className="program-today-stat-label">упражнений</span>
            </div>
            <div className="program-today-stat">
              <span className="program-today-stat-value">
                ~{todaySession.totalDuration}
              </span>
              <span className="program-today-stat-label">минут</span>
            </div>
            <div className="program-today-stat">
              <span className="program-today-stat-value">
                {todaySession.mainCategory === 'shooting' ? '🎯' :
                 todaySession.mainCategory === 'dribbling' ? '⚡' :
                 todaySession.mainCategory === 'drives' ? '🚀' :
                 todaySession.mainCategory === 'finishing' ? '🏀' :
                 todaySession.mainCategory === 'athleticism' ? '💪' :
                 todaySession.mainCategory === 'iq' ? '🧠' :
                 todaySession.mainCategory === 'defense' ? '🛡️' :
                 todaySession.mainCategory === 'mixed' ? '🎁' : '🎁'}
              </span>
              <span className="program-today-stat-label">фокус</span>
            </div>
          </div>

          {showCooldown ? (
            <div className="program-cooldown-block">
              <div className="program-cooldown-icon">⏳</div>
              <div className="program-cooldown-title">Кулдаун</div>
              <div className="program-cooldown-text">
                Следующая тренировка через{' '}
                <strong>{formatRemainingTime(cooldown.remainingMs)}</strong>
              </div>
              <div className="program-cooldown-hint">
                Мышцам нужно восстановиться. Кулдаун — 96 часов.
              </div>
            </div>
          ) : (
            <button
              className="program-start-btn"
              style={{ '--program-color': program.color }}
              onClick={() => onStartTraining(programId, todaySession)}
            >
              {progress && progress.started && programId !== '__trial__'
                ? 'Продолжить'
                : 'Начать тренировку'}
              <span className="arrow">→</span>
            </button>
          )}
        </div>

        {/* Предпросмотр тренировки */}
        <div className="card intro-card">
          <div className="tag-pill">Что в тренировке</div>
          <div className="program-preview-list">
            {todaySession.exercises.map((ex, i) => (
              <div key={ex.id} className="program-preview-item">
                <div className="program-preview-num">{i + 1}</div>
                <div className="program-preview-body">
                  <div className="program-preview-title">{ex.title}</div>
                  <div className="program-preview-meta">
                    {ex.sectionLabel} · {ex.sets} × {ex.reps || ex.duration + ' мин'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Настройки — видны всем, но изменить может только PRO */}
        {programId !== '__trial__' && (
          <div className="program-settings-info">
            <div className="program-settings-info-row">
              <span className="program-settings-info-icon">📊</span>
              <span className="program-settings-info-text">
                Уровень: <strong>
                  {level === 'beginner' ? 'Новичок' :
                   level === 'intermediate' ? 'Любитель' : 'Продвинутый'}
                </strong>
              </span>
            </div>
            <div className="program-settings-info-row">
              <span className="program-settings-info-icon">🏀</span>
              <span className="program-settings-info-text">
                Позиция: <strong>{position || '—'}</strong>
              </span>
            </div>
            <div className="program-settings-info-row">
              <span className="program-settings-info-icon">🎒</span>
              <span className="program-settings-info-text">
                Инвентарь: <strong>{gear.length} шт.</strong>
              </span>
            </div>

            {user.plan === 'pro' ? (
              <button className="program-settings-edit" onClick={onOpenSettings}>
                Изменить настройки →
              </button>
            ) : (
              <button
                className="program-settings-edit locked"
                onClick={() => onOpenPro && onOpenPro()}
              >
                🔒 Изменить — только PRO
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}