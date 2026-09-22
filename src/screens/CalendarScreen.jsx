import { useState } from 'react'
import { generateWeekPlan } from '../exercises'
import {
  CatShootingIcon,
  CatDribblingIcon,
  CatAthleticismIcon,
  CatIQIcon,
  CatDefenseIcon,
  CatPassingIcon,
  CatRestIcon,
} from '../components/Icons'

const CATEGORY_ICONS = {
  shooting: CatShootingIcon,
  dribbling: CatDribblingIcon,
  athleticism: CatAthleticismIcon,
  iq: CatIQIcon,
  defense: CatDefenseIcon,
  passing: CatPassingIcon,
  rest: CatRestIcon,
}

const TEST_LABELS = {
  'b-iq-base': 'Игровое мышление',
  'sht-base': 'Базовый бросок',
  'drbl-base': 'Базовый дриблинг',
  'atl-base': 'Базовый атлетизм',
}

const TEST_ICONS = {
  'b-iq-base': CatIQIcon,
  'sht-base': CatShootingIcon,
  'drbl-base': CatDribblingIcon,
  'atl-base': CatAthleticismIcon,
}

export default function CalendarScreen({
  user,
  onOpenPro,
  onSaveProfile,
  onOpenTrainingSettings,
  onOpenTests,
}) {
  const [selectedDay, setSelectedDay] = useState(null)

  const isPro = user.plan === 'pro'

  // ========== ПРОВЕРКА 1: FREE ==========
  if (!isPro) {
    return (
      <div className="calendar-locked">
        <div className="locked-bg">
          <svg className="locked-bg-chart" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,80 L40,65 L80,72 L120,50 L160,58 L200,35 L240,42 L280,25 L320,32 L360,15 L400,22 L400,120 L0,120 Z" fill="url(#chartFillGrad)" />
            <path className="locked-bg-chart-line" d="M0,80 L40,65 L80,72 L120,50 L160,58 L200,35 L240,42 L280,25 L320,32 L360,15 L400,22" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="120" cy="50" r="3" fill="var(--accent)" />
            <circle cx="200" cy="35" r="3" fill="var(--accent)" />
            <circle cx="280" cy="25" r="3" fill="var(--accent)" />
            <circle cx="360" cy="15" r="3" fill="var(--accent)" />
          </svg>
          <div className="locked-bg-grid" />
        </div>
        <div className="locked-bg-blur" />
        <div className="locked-content">
          <div className="calendar-locked-icon">📅</div>
          <h1 className="calendar-locked-title">Тренировки только в PRO</h1>
          <p className="calendar-locked-sub">Персональный план под твои цели, инвентарь и уровень.</p>
          <div className="calendar-locked-features">
            <div className="calendar-locked-feature">
              <span className="calendar-locked-feature-icon">🎯</span>
              <div>
                <div className="calendar-locked-feature-title">Тренировки под позицию</div>
                <div className="calendar-locked-feature-sub">Упражнения под PG, SG, SF, PF или C</div>
              </div>
            </div>
            <div className="calendar-locked-feature">
              <span className="calendar-locked-feature-icon">🎒</span>
              <div>
                <div className="calendar-locked-feature-title">Учёт инвентаря</div>
                <div className="calendar-locked-feature-sub">Есть только мяч? План подстроится</div>
              </div>
            </div>
            <div className="calendar-locked-feature">
              <span className="calendar-locked-feature-icon">📊</span>
              <div>
                <div className="calendar-locked-feature-title">Уровень нагрузки</div>
                <div className="calendar-locked-feature-sub">Новичок, любитель или продвинутый</div>
              </div>
            </div>
          </div>
          <button className="calendar-locked-cta" onClick={onOpenPro}>
            <span>Разблокировать PRO</span>
            <span className="calendar-locked-arrow">→</span>
          </button>
        </div>
      </div>
    )
  }

  // ========== ПРОВЕРКА 2: ТЕСТЫ ПРОЙДЕНЫ? ==========
  const allTests = user.categories.flatMap((c) => c.tests)
  const freeTests = allTests.filter((t) => t.plan === 'free')
  const freeTestsDone = freeTests.filter((t) => t.status === 'done')
  const testsTotal = freeTests.length
  const testsDone = freeTestsDone.length
  const allTestsPassed = testsDone === testsTotal && testsTotal > 0
  const testsPercent = testsTotal > 0 ? (testsDone / testsTotal) * 100 : 0

  if (!allTestsPassed) {
    return (
      <div className="calendar-onboarding">
        <div className="onboarding-icon">🔒</div>
        <h1 className="onboarding-title">Сначала пройди тесты</h1>
        <p className="onboarding-sub">
          Тренировки откроются после прохождения всех{' '}
          <strong>{testsTotal} базовых тестов</strong>. Узнай свой уровень —
          потом получи персональный план.
        </p>

        <div className="tests-lock-progress">
          <div className="tests-lock-top">
            <span className="tests-lock-label">Прогресс тестов</span>
            <span className="tests-lock-value">
              {testsDone} / {testsTotal}
            </span>
          </div>
          <div className="tests-lock-bar">
            <div
              className="tests-lock-fill"
              style={{ width: testsPercent + '%' }}
            />
          </div>
        </div>

        <div className="tests-lock-list">
          {freeTests.map((t) => {
            const isDone = t.status === 'done'
            const Icon = TEST_ICONS[t.id] || CatRestIcon
            return (
              <div
                key={t.id}
                className={`tests-lock-item ${isDone ? 'done' : ''}`}
              >
                <span className="tests-lock-item-icon">
                  <Icon />
                </span>
                <span className="tests-lock-item-label">
                  {TEST_LABELS[t.id] || t.title}
                </span>
                <span className="tests-lock-item-status">
                  {isDone ? '✓' : '○'}
                </span>
              </div>
            )
          })}
        </div>

        <button className="onboarding-cta" onClick={onOpenTests}>
          Пройти тесты <span className="arrow">→</span>
        </button>

        <p className="onboarding-note">
          Осталось пройти: <strong>{testsTotal - testsDone}</strong>{' '}
          {testsTotal - testsDone === 1 ? 'тест' : 'теста'}
        </p>
      </div>
    )
  }

  // ========== ПРОВЕРКА 3: НАСТРОЙКИ ==========
  const hasSettings =
    (user.trainingGoals || []).length > 0 &&
    (user.trainingGear || []).length > 0

  if (!hasSettings) {
    return (
      <div className="calendar-onboarding">
        <div className="onboarding-icon">⚙️</div>
        <h1 className="onboarding-title">Настрой тренировки</h1>
        <p className="onboarding-sub">Чтобы собрать персональный план на неделю, нужно указать:</p>
        <div className="onboarding-list">
          <div className="onboarding-item"><span className="onboarding-check">✓</span><span>Твои цели</span></div>
          <div className="onboarding-item"><span className="onboarding-check">✓</span><span>Инвентарь</span></div>
          <div className="onboarding-item"><span className="onboarding-check">✓</span><span>Дни тренировок</span></div>
          <div className="onboarding-item"><span className="onboarding-check">✓</span><span>Уровень</span></div>
        </div>
        <button className="onboarding-cta" onClick={onOpenTrainingSettings}>
          Настроить тренировки <span className="arrow">→</span>
        </button>
        <p className="onboarding-note">Займёт 1 минуту</p>
      </div>
    )
  }

  // ========== КАЛЕНДАРЬ ==========
  const weekPlan = generateWeekPlan(user)

  const today = new Date()
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const todayName = dayNames[today.getDay()]

  const monday = new Date(today)
  const diff = today.getDay() === 0 ? 6 : today.getDay() - 1
  monday.setDate(today.getDate() - diff)

  const weekDates = weekPlan.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.getDate()
  })

  const monthNames = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
  const weekStart = new Date(monday)
  const weekEnd = new Date(monday)
  weekEnd.setDate(monday.getDate() + 6)
  const weekRangeText = `${weekStart.getDate()}–${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]}`

  const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`
  const weeklyProgress = user.weeklyProgress || {}
  const doneDays = weeklyProgress[weekKey] || []

  const totalTrainingDays = weekPlan.filter((d) => d.isTrainingDay).length
  const completed = doneDays.length
  const progressPercent = totalTrainingDays > 0 ? (completed / totalTrainingDays) * 100 : 0

  function isDayDone(dayName) {
    return doneDays.includes(dayName)
  }

  function toggleDayDone(dayName) {
    if (!dayName) return
    let newDoneDays
    if (doneDays.includes(dayName)) {
      newDoneDays = doneDays.filter((d) => d !== dayName)
    } else {
      newDoneDays = [...doneDays, dayName]
    }
    onSaveProfile({
      weeklyProgress: { ...weeklyProgress, [weekKey]: newDoneDays },
    })
  }

  function handleDayClick(item) {
    if (!item.isTrainingDay) {
      setSelectedDay({
        title: 'Отдых',
        description: 'Восстановление — часть программы. Дай мышцам отдохнуть.',
        icon: 'rest',
        day: item.day,
        isRest: true,
      })
      return
    }

    setSelectedDay({
      title: `Тренировка на ${item.label}`,
      description: null,
      icon: item.type,
      day: item.day,
      category: item.label,
      exercises: item.exercises,
      totalDuration: item.totalDuration,
      exercisesCount: item.exercisesCount,
      done: isDayDone(item.day),
      dayKey: item.day,
    })
  }

  return (
    <div className="calendar-screen">
      <div className="calendar-head">
        <div>
          <h1 className="calendar-title">Календарь</h1>
          <p className="calendar-subtitle">Персональный план</p>
        </div>
        <button className="icon-btn" onClick={onOpenTrainingSettings} title="Настройки тренировок">
          ⚙️
        </button>
      </div>

      <div className="calendar-week-card">
        <div className="calendar-week-top">
          <span className="calendar-week-range">{weekRangeText}</span>
          <span className="calendar-week-progress">
            {completed} / {totalTrainingDays}
          </span>
        </div>
        <div className="calendar-week-bar">
          <div className="calendar-week-fill" style={{ width: progressPercent + '%' }} />
        </div>
        <div className="calendar-week-hint">
          {completed === totalTrainingDays && totalTrainingDays > 0
            ? '🎉 Все тренировки недели выполнены!'
            : `Выполнено: ${completed} из ${totalTrainingDays}`}
        </div>
      </div>

      <div className="calendar-days">
        {weekPlan.map((item, i) => {
          const isToday = item.day === todayName
          const isDone = isDayDone(item.day)
          const isRest = !item.isTrainingDay
          const IconComp = CATEGORY_ICONS[item.icon] || CatRestIcon
          return (
            <button
              key={i}
              className={`calendar-day ${isRest ? 'rest' : ''} ${isToday ? 'today' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => handleDayClick(item)}
            >
              <div className="calendar-day-head">
                <span className="calendar-day-name">{item.day}</span>
                <span className="calendar-day-date">{weekDates[i]}</span>
              </div>

              <div className="calendar-day-icon">
                <IconComp />
              </div>
              <div className="calendar-day-label">{item.label}</div>

              {item.isTrainingDay && item.exercisesCount && (
                <div className="calendar-day-count">
                  {item.exercisesCount} упр.
                </div>
              )}

              <div className="calendar-day-status">
                {isDone ? (
                  <span className="calendar-day-check">✓</span>
                ) : (
                  <span className="calendar-day-dot">○</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

            {selectedDay && (
        <div className="day-modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="day-modal day-modal-large" onClick={(e) => e.stopPropagation()}>

            {/* Sticky-шапка */}
            <div className="day-modal-header-sticky">
              <div className="day-modal-icon day-modal-icon-svg">
                {(() => {
                  const Icon = CATEGORY_ICONS[selectedDay.icon] || CatRestIcon
                  return <Icon />
                })()}
              </div>
              <div className="day-modal-day">{selectedDay.day}</div>
              <h2 className="day-modal-title">{selectedDay.title}</h2>

              {selectedDay.category && (
                <div className="day-modal-category">{selectedDay.category}</div>
              )}

              {selectedDay.description && (
                <p className="day-modal-desc">{selectedDay.description}</p>
              )}
            </div>

            {/* Скроллируемый контент */}
            <div className="day-modal-body">
              {selectedDay.exercises && selectedDay.exercises.length > 0 && (
                <div className="day-modal-exercises">
                  {selectedDay.exercises.map((ex, i) => (
                    <div key={ex.id} className="day-modal-exercise">
                      <div className="day-modal-exercise-num">{i + 1}</div>
                      <div className="day-modal-exercise-body">
                        <div className="day-modal-exercise-title">{ex.title}</div>
                        <div className="day-modal-exercise-desc">{ex.description}</div>
                        <div className="day-modal-exercise-meta">
                          <span>⏱️ ~{ex.duration} мин</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedDay.totalDuration && (
                <div className="day-modal-total">
                  Итого: {selectedDay.exercisesCount} упражнения · ~{selectedDay.totalDuration} мин
                </div>
              )}
            </div>

            {/* Sticky-кнопки внизу */}
            <div className="day-modal-footer-sticky">
              {!selectedDay.isRest && selectedDay.dayKey && (
                <button
                  className={`day-modal-mark ${selectedDay.done ? 'done' : ''}`}
                  onClick={() => {
                    toggleDayDone(selectedDay.dayKey)
                    setSelectedDay({ ...selectedDay, done: !selectedDay.done })
                  }}
                >
                  {selectedDay.done ? '↺ Снять отметку' : '✓ Отметить выполненной'}
                </button>
              )}

              <button
                className="day-modal-close"
                onClick={() => setSelectedDay(null)}
              >
                {selectedDay.isRest ? 'Понятно' : 'Закрыть'}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="calendar-tip">
        <span className="calendar-tip-icon">💡</span>
        <span className="calendar-tip-text">
          Нажми на тренировку, чтобы увидеть упражнения. Прогресс сбрасывается каждую неделю.
        </span>
      </div>
    </div>
  )
}