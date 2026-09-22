import { useState } from 'react'
import { getProgramById, getProgramProgress } from '../data/programs'
import { getTrainingSession } from '../data/exercisesData'

export default function ProgramScreen({
  user,
  programId,
  onBack,
  onStartTraining,
  onOpenSettings,
}) {
  const [selectedDay, setSelectedDay] = useState(null)

  const program = getProgramById(programId)
  const progress = getProgramProgress(programId, user)

  if (!program) {
    return (
      <>
        <div className="screen-head screen-head-minimal">
          <button className="icon-btn" onClick={onBack}>←</button>
          <button className="icon-btn">🏠</button>
        </div>
        <div className="test-run">
          <p className="test-run-desc">Программа не найдена.</p>
        </div>
      </>
    )
  }

  // Определяем позицию и уровень
  const position = user.positions?.[0] || null
  const level = user.trainingLevel || 'beginner'
  const gear = user.trainingGear || []
  const daysPerWeek = program.daysPerWeek

  // Смотрим, что должно быть сегодня
  const currentDay = progress?.currentDay || 1
  const currentWeek = progress?.currentWeek || 1

  // Получаем тренировку для сегодняшнего дня
  const todaySession = getTrainingSession({
    program,
    level,
    position,
    gear,
    dayIndex: currentDay - 1,
  })

  return (
    <>
      <div className="screen-head screen-head-minimal">
        <button className="icon-btn" onClick={onBack}>←</button>
        <button className="icon-btn" onClick={onOpenSettings}>⚙️</button>
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
        {progress && progress.started && (
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

        {/* Описание */}
        <div className="card intro-card">
          <div className="tag-pill">О программе</div>
          <p className="card-text">{program.description}</p>
        </div>

        {/* Фокус */}
        {program.focus && program.focus.length > 0 && (
          <div className="card intro-card">
            <div className="tag-pill">На что упор</div>
            <div className="intro-bullets">
              {program.focus.map((f, i) => (
                <div key={i} className="intro-bullet">
                  <span className="intro-bullet-check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Сегодняшняя тренировка */}
        <div className="program-today">
          <div className="program-today-head">
            <div className="program-today-label">
              {progress && progress.started
                ? `НЕДЕЛЯ ${currentWeek} · ДЕНЬ ${currentDay}`
                : 'ПЕРВАЯ ТРЕНИРОВКА'}
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
                 todaySession.mainCategory === 'athleticism' ? '💪' :
                 todaySession.mainCategory === 'iq' ? '🧠' :
                 todaySession.mainCategory === 'defense' ? '🛡️' : '🎁'}
              </span>
              <span className="program-today-stat-label">фокус</span>
            </div>
          </div>

          <button
            className="program-start-btn"
            style={{ '--program-color': program.color }}
            onClick={() => onStartTraining(programId, todaySession)}
          >
            {progress && progress.started ? 'Продолжить' : 'Начать тренировку'}
            <span className="arrow">→</span>
          </button>
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

        {/* Уровень / позиция */}
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

          <button className="program-settings-edit" onClick={onOpenSettings}>
            Изменить настройки →
          </button>
        </div>
      </div>
    </>
  )
}