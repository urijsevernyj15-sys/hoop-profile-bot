import { useState, useEffect } from 'react'
import { getProgramById, getProgramProgress } from '../data/programs'
import {
  getTrainingSession,
  getPersonalTraining,
  getTrialSession,
} from '../data/exercisesData'
import { canStartNewTraining, isTrainingCompleted, formatDate, formatRemainingTime } from '../data/schedule'
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
  IconFire,
  IconCooldown,
  IconTrophy,
} from '../components/Icons'

// Какая иконка у программы
function getProgramIcon(programId, size = 48) {
  switch (programId) {
    case 'sniper':    return <IconShooting size={size} />
    case 'playmaker': return <IconDribbling size={size} />
    case 'beast':     return <IconAthleticism size={size} />
    case 'slasher':   return <IconDrives size={size} />
    case 'universal': return <IconFinishing size={size} />
    case '__trial__': return <IconTrophy size={size} />
    default:          return <IconTrophy size={size} />
  }
}

export default function ProgramScreen({
  user,
  programId,
  onBack,
  onStartTraining,
  onOpenSettings,
  onOpenPro,
}) {
  const [selectedDay, setSelectedDay] = useState(null)
  const [activeTraining, setActiveTraining] = useState(null)

  useEffect(() => {
    const active = getActiveTraining()
    if (active && active.programId === programId) {
      setActiveTraining(active)
    } else {
      setActiveTraining(null)
    }
  }, [programId])

  function handleResume() {
    if (!activeTraining) return
    onStartTraining(programId, {
      exercises: activeTraining.exercises,
      totalExercises: activeTraining.exercises.length,
      totalDuration: activeTraining.exercises.reduce(
        (sum, ex) => sum + (ex.duration || 5),
        0
      ),
      mainCategory: 'resumed',
    })
  }

  const todayStr = formatDate(new Date())
  const isTodayDone = isTrainingCompleted(user, todayStr)

  let program = getProgramById(programId)

  // Для пробной — фейковая программа
  if (!program && programId === '__trial__') {
    program = {
      id: '__trial__',
      title: 'Пробная тренировка',
      subtitle: 'Знакомство с PRO',
      description: 'Полноценная тренировка, чтобы понять, что тебя ждёт в PRO.',
      icon: 'trophy',
      color: '#FF6B1A',
      duration: '~45 минут',
      daysPerWeek: 1,
      difficulty: 'Разная',
      focus: ['Бросок', 'Дриблинг', 'Проход', 'Атлетизм'],
    }
  }

  const progress = getProgramProgress(programId, user)

  const isMixMode = user.trainingMode === 'mix'
  const hasGoals = (user.trainingGoals || []).length > 0
  const hasGear = (user.trainingGear || []).length > 0
  const hasSettings = isMixMode ? (hasGoals && hasGear) : hasGear

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

  const position = user.positions?.[0] || null
  const level = user.trainingLevel || 'beginner'
  const gear = user.trainingGear || []
  const daysPerWeek = program.daysPerWeek

  const currentDay = progress?.currentDay || 1
  const currentWeek = progress?.currentWeek || 1

  const isTrial =
    user.plan !== 'pro' &&
    (!user.completedTrainings || Object.keys(user.completedTrainings).length === 0)

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

  const cooldown = canStartNewTraining(user)
  const showCooldown = !cooldown.canStart && user.plan !== 'pro'

  // Группируем упражнения по секциям
  const groupedExercises = {
    warmup: todaySession.exercises.filter((ex) => ex.section === 'warmup'),
    main: todaySession.exercises.filter((ex) => ex.section === 'main'),
    cooldown: todaySession.exercises.filter((ex) => ex.section === 'cooldown'),
  }

  const SECTION_META = {
    warmup:   { label: 'Разминка',       Icon: IconFire },
    main:     { label: 'Основная часть', Icon: IconShooting },
    cooldown: { label: 'Заминка',        Icon: IconCooldown },
  }

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
          <div className="program-hero-icon">
            {getProgramIcon(programId, 64)}
          </div>
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

        {/* Описание + Фокус */}
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
        <div className={`program-today ${isTodayDone ? 'mix-done' : ''}`}>
          <div className="program-today-head">
            <div className="program-today-label">
              {isTodayDone
                ? '✓ ВЫПОЛНЕНО'
                : progress && progress.started && programId !== '__trial__'
                  ? `НЕДЕЛЯ ${currentWeek} · ДЕНЬ ${currentDay}`
                  : 'СЕГОДНЯ'}
            </div>
            <h2 className="program-today-title">
              {isTodayDone ? 'Тренировка пройдена!' : 'Сегодня'}
            </h2>
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
              <span className="program-today-stat-value program-today-stat-icon">
                {(() => {
                  const cat = todaySession.mainCategory
                  const map = {
                    shooting: <IconShooting size={26} />,
                    dribbling: <IconDribbling size={26} />,
                    drives: <IconDrives size={26} />,
                    finishing: <IconFinishing size={26} />,
                    athleticism: <IconAthleticism size={26} />,
                    iq: <IconIQ size={26} />,
                    defense: <IconDefense size={26} />,
                    passing: <IconPassing size={26} />,
                    mixed: <IconTrophy size={26} />,
                  }
                  return map[cat] || <IconShooting size={26} />
                })()}
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
          ) : isTodayDone ? (
            <div className="single-training-done-badge" style={{ marginTop: 0 }}>
              <span className="single-training-done-check">✓</span>
              <span>Возвращайся завтра</span>
            </div>
          ) : activeTraining ? (
            <button
              className="program-start-btn mix-resume-btn"
              style={{ '--program-color': program.color }}
              onClick={handleResume}
            >
              Продолжить тренировку <span className="arrow">→</span>
            </button>
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
            {['warmup', 'main', 'cooldown'].map((sectionKey) => {
              const sectionExercises = groupedExercises[sectionKey]
              if (!sectionExercises || sectionExercises.length === 0) return null

              const meta = SECTION_META[sectionKey]
              const SectionIcon = meta.Icon

              return (
                <div key={sectionKey} className="preview-section">
                  <div className="preview-section-title">
                    <span className="preview-section-title-left">
                      {SectionIcon && <SectionIcon size={16} />}
                      <span>{meta.label}</span>
                    </span>
                    <span className="preview-section-count">
                      {sectionExercises.length}
                    </span>
                  </div>

                  {sectionExercises.map((ex, i) => (
                    <div key={ex.id} className="program-preview-item">
                      <div className="program-preview-num">{i + 1}</div>
                      <div className="program-preview-body">
                        <div className="program-preview-title">{ex.title}</div>
                        <div className="program-preview-meta">
                          {ex.sets} × {ex.reps || ex.duration + ' мин'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Настройки */}
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