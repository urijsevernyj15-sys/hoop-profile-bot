import { useState } from 'react'
import { generateWeekPlan } from '../exercises'

export default function CalendarScreen({ user, onOpenPro }) {
  const [selectedDay, setSelectedDay] = useState(null)

  // ========== ЗАБЛОКИРОВАНО ДЛЯ FREE ==========
  if (user.plan !== 'pro') {
    return (
      <div className="calendar-locked">
        <div className="calendar-locked-icon">📅</div>
        <h1 className="calendar-locked-title">Тренировки только в PRO</h1>
        <p className="calendar-locked-sub">
          Персональный план под твои цели, инвентарь и уровень.
          Меняй настройки — план пересобирается автоматически.
        </p>

        <div className="calendar-locked-features">
          <div className="calendar-locked-feature">
            <span className="calendar-locked-feature-icon">🎯</span>
            <div>
              <div className="calendar-locked-feature-title">
                Тренировки под позицию
              </div>
              <div className="calendar-locked-feature-sub">
                Упражнения, заточенные под PG, SG, SF, PF или C
              </div>
            </div>
          </div>
          <div className="calendar-locked-feature">
            <span className="calendar-locked-feature-icon">🎒</span>
            <div>
              <div className="calendar-locked-feature-title">
                Учёт инвентаря
              </div>
              <div className="calendar-locked-feature-sub">
                Есть только мяч? План подстроится
              </div>
            </div>
          </div>
          <div className="calendar-locked-feature">
            <span className="calendar-locked-feature-icon">📊</span>
            <div>
              <div className="calendar-locked-feature-title">
                Уровень нагрузки
              </div>
              <div className="calendar-locked-feature-sub">
                Новичок, любитель или продвинутый
              </div>
            </div>
          </div>
          <div className="calendar-locked-feature">
            <span className="calendar-locked-feature-icon">🔔</span>
            <div>
              <div className="calendar-locked-feature-title">
                Напоминания
              </div>
              <div className="calendar-locked-feature-sub">
                Бот напомнит, когда пора тренироваться
              </div>
            </div>
          </div>
        </div>

        <button className="calendar-locked-cta" onClick={onOpenPro}>
          <span>Разблокировать PRO</span>
          <span className="calendar-locked-arrow">→</span>
        </button>

        <p className="calendar-locked-note">
          В бесплатной версии доступны 4 базовых теста и карточка игрока
        </p>
      </div>
    )
  }

  // ========== РЕАЛЬНЫЙ КАЛЕНДАРЬ ДЛЯ PRO ==========
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

  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ]
  const weekStart = new Date(monday)
  const weekEnd = new Date(monday)
  weekEnd.setDate(monday.getDate() + 6)

  const weekRangeText = `${weekStart.getDate()}–${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]}`

  const completed = user.calendarDone || 0
  const totalTrainingDays = weekPlan.filter((d) => d.type !== 'rest').length
  const progressPercent =
    totalTrainingDays > 0 ? (completed / totalTrainingDays) * 100 : 0

  function handleDayClick(item) {
    if (item.type === 'rest') {
      setSelectedDay({
        title: 'Отдых',
        description:
          'Восстановление — часть программы. Дай мышцам отдохнуть, чтобы на следующей тренировке быть сильнее.',
        icon: '😴',
        day: item.day,
      })
      return
    }

    const ex = item.exercise
    if (!ex) {
      setSelectedDay({
        title: item.label,
        description: 'Упражнение подбирается под твои настройки.',
        icon: item.icon,
        day: item.day,
      })
      return
    }

    setSelectedDay({
      title: ex.title,
      description: ex.description,
      icon: item.icon,
      day: item.day,
      duration: ex.duration,
      category: item.label,
    })
  }

  return (
    <div className="calendar-screen">
      <div className="calendar-head">
        <div>
          <h1 className="calendar-title">Календарь</h1>
          <p className="calendar-subtitle">Персональный план</p>
        </div>
      </div>

      <div className="calendar-week-card">
        <div className="calendar-week-top">
          <span className="calendar-week-range">{weekRangeText}</span>
          <span className="calendar-week-progress">
            {completed} / {totalTrainingDays}
          </span>
        </div>
        <div className="calendar-week-bar">
          <div
            className="calendar-week-fill"
            style={{ width: progressPercent + '%' }}
          />
        </div>
        <div className="calendar-week-hint">
          {completed === totalTrainingDays
            ? '🎉 Все тренировки недели выполнены!'
            : `Выполнено: ${completed} из ${totalTrainingDays}`}
        </div>
      </div>

      <div className="calendar-days">
        {weekPlan.map((item, i) => {
          const isToday = item.day === todayName
          return (
            <button
              key={i}
              className={`calendar-day ${item.type === 'rest' ? 'rest' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(item)}
            >
              <div className="calendar-day-head">
                <span className="calendar-day-name">{item.day}</span>
                <span className="calendar-day-date">{weekDates[i]}</span>
              </div>

              <div className="calendar-day-icon">{item.icon}</div>
              <div className="calendar-day-label">{item.label}</div>

              <div className="calendar-day-status">
                <span className="calendar-day-dot">○</span>
              </div>
            </button>
          )
        })}
      </div>

      {selectedDay && (
        <div className="day-modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="day-modal" onClick={(e) => e.stopPropagation()}>
            <div className="day-modal-handle" />

            <div className="day-modal-icon">{selectedDay.icon}</div>
            <div className="day-modal-day">{selectedDay.day}</div>
            <h2 className="day-modal-title">{selectedDay.title}</h2>

            {selectedDay.category && (
              <div className="day-modal-category">{selectedDay.category}</div>
            )}

            <p className="day-modal-desc">{selectedDay.description}</p>

            {selectedDay.duration && (
              <div className="day-modal-meta">
                <span>⏱️ ~{selectedDay.duration} мин</span>
              </div>
            )}

            <button
              className="day-modal-close"
              onClick={() => setSelectedDay(null)}
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      <div className="calendar-tip">
        <span className="calendar-tip-icon">💡</span>
        <span className="calendar-tip-text">
          План построен под твои цели и инвентарь. Меняй настройки — план
          обновится.
        </span>
      </div>
    </div>
  )
}