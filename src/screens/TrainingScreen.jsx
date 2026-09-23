import { useState, useEffect } from 'react'
import { PROGRAMS, getProgramProgress } from '../data/programs'
import { getTotalCompleted } from '../data/schedule'
import { isTrialUsed } from '../data/schedule'
import TrainingCalendar from '../components/TrainingCalendar'

export default function TrainingScreen({
  user,
  onOpenProgram,
  onOpenCustomProgram,
  onOpenPro,
}) {
  const isPro = user.plan === 'pro'
  const trialUsed = isTrialUsed(user)

  // ============ FREE: ЗАГЛУШКА ============
  if (!isPro) {
    // Если пробная уже использована — блокировка
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

    // Первый заход — показываем пробную
    return (
      <div className="training-trial-screen">
        <div className="training-head">
          <h1 className="training-head-title">Тренировки</h1>
          <p className="training-head-sub">Доступно в PRO</p>
        </div>

                <div className="training-trial-card">
          {/* Живой фон — биржа */}
          <div className="trial-bg">
            <svg
              className="trial-bg-chart"
              viewBox="0 0 400 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trialChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Заливка под графиком */}
              <path
                d="M0,120 L30,110 L60,115 L90,95 L120,100 L150,75 L180,80 L210,60 L240,65 L270,45 L300,50 L330,30 L360,35 L400,15 L400,150 L0,150 Z"
                fill="url(#trialChartFill)"
              />

              {/* Линия графика — рисуется при заходе */}
              <path
                className="trial-bg-chart-line"
                d="M0,120 L30,110 L60,115 L90,95 L120,100 L150,75 L180,80 L210,60 L240,65 L270,45 L300,50 L330,30 L360,35 L400,15"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Точки-пики */}
              <circle className="trial-chart-dot" cx="90" cy="95" r="3" fill="var(--accent)" />
              <circle className="trial-chart-dot" cx="180" cy="80" r="3" fill="var(--accent)" />
              <circle className="trial-chart-dot" cx="270" cy="45" r="3" fill="var(--accent)" />
              <circle className="trial-chart-dot" cx="360" cy="35" r="3" fill="var(--accent)" />
            </svg>

            {/* Сетка клеточек */}
            <div className="trial-bg-grid" />
          </div>

          {/* Блюр поверх графика */}
          <div className="trial-bg-blur" />

          <div className="training-trial-glow" />

          <div className="training-trial-icon">🎁</div>
          <div className="training-trial-label">ПРОБНАЯ ТРЕНИРОВКА</div>
          <h2 className="training-trial-title">
            Попробуй 1 тренировку
          </h2>
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

  // ============ PRO: полноценные тренировки ============
  const totalCompleted = getTotalCompleted(user)

  return (
    <>
      <div className="training-program-screen">
        <div className="training-head">
          <h1 className="training-head-title">Тренировки</h1>
          <p className="training-head-sub">Твой план</p>
        </div>

        {/* Статистика */}
        <div className="training-stats-row">
          <div className="training-stat">
            <div className="training-stat-value">{totalCompleted}</div>
            <div className="training-stat-label">всего пройдено</div>
          </div>
          <div className="training-stat">
            <div className="training-stat-value">✅</div>
            <div className="training-stat-label">PRO активен</div>
          </div>
          <div className="training-stat">
            <div className="training-stat-value">∞</div>
            <div className="training-stat-label">без лимита</div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="training-divider">
          <span>Выбери программу</span>
        </div>

        {/* Программы */}
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
                  <div className="program-card-icon">{program.icon}</div>
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

        {/* Как строятся тренировки */}
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
                  Чередуем категории
                </div>
                <div className="training-explainer-item-text">
                  Пн — Бросок, Вт — Дриблинг, и так по кругу.
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
                  Тренируйся сколько хочешь — PRO без ограничений.
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