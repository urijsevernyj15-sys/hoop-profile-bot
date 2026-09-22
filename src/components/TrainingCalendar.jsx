import { useState } from 'react'
import { formatDate } from '../data/schedule'

const PROGRAM_ICONS = {
  sniper: '🎯',
  playmaker: '⚡',
  beast: '💪',
  universal: '🏀',
  custom: '🎨',
}

const PROGRAM_COLORS = {
  sniper: '#FF6B1A',
  playmaker: '#8B5CF6',
  beast: '#FF3B3B',
  universal: '#00E0FF',
  custom: '#B8FF3C',
}

const PROGRAM_NAMES = {
  sniper: 'Снайпер',
  playmaker: 'Плэймейкер',
  beast: 'Зверь',
  universal: 'Универсал',
  custom: 'Свой план',
}

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const DAY_NAMES_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const MONTH_NAMES_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

export default function TrainingCalendar({ user, schedule = {} }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null)

  const today = new Date()
  const todayStr = formatDate(today)

  const monday = new Date(today)
  const diff = today.getDay() === 0 ? 6 : today.getDay() - 1
  monday.setDate(today.getDate() - diff + weekOffset * 7)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const monthLabel = `${MONTH_NAMES[weekDays[3].getMonth()]} ${weekDays[3].getFullYear()}`

  // Прогресс недели
  let plannedCount = 0
  let doneCount = 0
  weekDays.forEach((date) => {
    const dateStr = formatDate(date)
    const data = schedule[dateStr]
    if (data?.programId) {
      plannedCount++
      if (data.done) doneCount++
    }
  })
  const weekProgress = plannedCount > 0 ? Math.round((doneCount / plannedCount) * 100) : 0

  function getDayData(date) {
    const dateStr = formatDate(date)
    return schedule[dateStr] || null
  }

  function handlePrevWeek() {
    setWeekOffset(weekOffset - 1)
    setSelectedDay(null)
  }

  function handleNextWeek() {
    setWeekOffset(weekOffset + 1)
    setSelectedDay(null)
  }

  function handleToday() {
    setWeekOffset(0)
    setSelectedDay(null)
  }

  function handleDayClick(date, dayData) {
    if (!dayData?.programId) return
    setSelectedDay({
      date,
      dateStr: formatDate(date),
      ...dayData,
    })
  }

  return (
    <>
      <div className="tc-container">
        {/* Верхняя полоса с прогрессом */}
        <div className="tc-progress-strip">
          <div className="tc-progress-bar">
            <div
              className="tc-progress-fill"
              style={{ width: weekProgress + '%' }}
            />
          </div>
          <div className="tc-progress-text">
            <span className="tc-progress-done">{doneCount}</span>
            <span className="tc-progress-sep">из</span>
            <span className="tc-progress-total">{plannedCount}</span>
            <span className="tc-progress-label">
              {weekProgress === 100 ? '🎉 всё!' : 'на этой неделе'}
            </span>
          </div>
        </div>

        {/* Заголовок с навигацией */}
        <div className="tc-header">
          <button className="tc-nav-btn" onClick={handlePrevWeek}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>

          <div className="tc-header-center">
            <div className="tc-month">{monthLabel}</div>
            {weekOffset !== 0 ? (
              <button className="tc-today-btn" onClick={handleToday}>
                Сегодня
              </button>
            ) : (
              <div className="tc-week-label">Эта неделя</div>
            )}
          </div>

          <button className="tc-nav-btn" onClick={handleNextWeek}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </div>

        {/* Дни */}
        <div className="tc-days">
          {weekDays.map((date, i) => {
            const dateStr = formatDate(date)
            const isToday = dateStr === todayStr
            const dayData = getDayData(date)
            const programId = dayData?.programId
            const isDone = dayData?.done
            const isRest = !programId

            return (
              <button
                key={i}
                className={`tc-day ${isToday ? 'today' : ''} ${isDone ? 'done' : ''} ${isRest ? 'rest' : ''}`}
                style={{
                  '--day-color': programId
                    ? PROGRAM_COLORS[programId]
                    : 'var(--text-mute)',
                }}
                onClick={() => handleDayClick(date, dayData)}
              >
                <div className="tc-day-name">{DAY_NAMES[i]}</div>

                <div className="tc-day-circle">
                  {isRest ? (
                    <span className="tc-day-rest">—</span>
                  ) : (
                    <span className="tc-day-icon">
                      {PROGRAM_ICONS[programId] || '🏀'}
                    </span>
                  )}
                </div>

                <div className="tc-day-number">{date.getDate()}</div>

                <div className="tc-day-status">
                  {isDone && <span className="tc-day-check">✓</span>}
                  {!isDone && !isRest && <span className="tc-day-dot" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Модалка дня */}
      {selectedDay && (
        <div className="tc-modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-handle" />

            <div
              className="tc-modal-icon"
              style={{ '--day-color': PROGRAM_COLORS[selectedDay.programId] || 'var(--accent)' }}
            >
              {PROGRAM_ICONS[selectedDay.programId]}
            </div>

            <div className="tc-modal-date">
              {DAY_NAMES_FULL[selectedDay.date.getDay() === 0 ? 6 : selectedDay.date.getDay() - 1]}
              , {selectedDay.date.getDate()} {MONTH_NAMES_GEN[selectedDay.date.getMonth()]}
            </div>

            <h3 className="tc-modal-title">
              {PROGRAM_NAMES[selectedDay.programId] || 'Тренировка'}
            </h3>

            {selectedDay.reason && (
              <p className="tc-modal-reason">
                💡 {selectedDay.reason}
              </p>
            )}

            <div className="tc-modal-status">
              {selectedDay.done ? (
                <span className="tc-modal-status-done">✓ Пройдено</span>
              ) : (
                <span className="tc-modal-status-planned">Запланировано</span>
              )}
            </div>

            <button
              className="tc-modal-close"
              onClick={() => setSelectedDay(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  )
}