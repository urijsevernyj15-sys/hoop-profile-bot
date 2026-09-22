import { useState } from 'react'
import {
  GoalShootingIcon,
  GoalDribblingIcon,
  GoalAthleticismIcon,
  GoalIQIcon,
  GoalDefenseIcon,
  GoalPassingIcon,
  GearBallIcon,
  GearHoopIcon,
  GearConesIcon,
  GearPartnerIcon,
  GearWallIcon,
  GearBarIcon,
  GearBandIcon,
  GearChalkIcon,
} from '../components/Icons'

const ALL_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function TrainingSettingsScreen({ user, onBack, onSave }) {
  const [goals, setGoals] = useState(user.trainingGoals || [])
  const [gear, setGear] = useState(user.trainingGear || [])
  const [level, setLevel] = useState(user.trainingLevel || 'beginner')
  const [days, setDays] = useState(user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'])

  const GOALS = [
    { id: 'shooting', Icon: GoalShootingIcon, label: 'Бросок' },
    { id: 'dribbling', Icon: GoalDribblingIcon, label: 'Дриблинг' },
    { id: 'athleticism', Icon: GoalAthleticismIcon, label: 'Атлетизм' },
    { id: 'iq', Icon: GoalIQIcon, label: 'IQ' },
    { id: 'defense', Icon: GoalDefenseIcon, label: 'Защита' },
    { id: 'passing', Icon: GoalPassingIcon, label: 'Пас' },
  ]

  const GEAR = [
    { id: 'ball', Icon: GearBallIcon, label: 'Мяч' },
    { id: 'hoop', Icon: GearHoopIcon, label: 'Кольцо' },
    { id: 'cones', Icon: GearConesIcon, label: 'Конусы' },
    { id: 'partner', Icon: GearPartnerIcon, label: 'Партнёр' },
    { id: 'wall', Icon: GearWallIcon, label: 'Стена' },
    { id: 'bar', Icon: GearBarIcon, label: 'Турник' },
    { id: 'band', Icon: GearBandIcon, label: 'Резинка' },
    { id: 'chalk', Icon: GearChalkIcon, label: 'Разметка' },
  ]

  const LEVELS = [
    { id: 'beginner', label: 'Новичок', sub: '3 упражнения в день' },
    { id: 'intermediate', label: 'Любитель', sub: '4 упражнения в день' },
    { id: 'advanced', label: 'Продвинутый', sub: '5 упражнений в день' },
  ]

  function toggleGoal(id) {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  function toggleGear(id) {
    setGear((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  function toggleDay(day) {
    setDays((prev) => {
      if (prev.includes(day)) {
        // Не даём убрать, если останется меньше 3
        if (prev.length <= 3) return prev
        return prev.filter((d) => d !== day)
      }
      // Не даём добавить, если уже 6
      if (prev.length >= 6) return prev
      return [...prev, day]
    })
  }

  function handleSave() {
    onSave({
      trainingGoals: goals,
      trainingGear: gear,
      trainingLevel: level,
      trainingDays: days,
    })
  }

  const canSave = goals.length > 0 && gear.length > 0 && days.length >= 3

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
          <h2 className="screen-head-title">Настройки тренировок</h2>
        </div>
      </div>

      <div className="training-screen">
        {/* ============ ЦЕЛИ ============ */}
        <div className="training-block">
          <div className="training-block-head">
            <div className="training-block-label">Что прокачать</div>
            <h2 className="training-block-title">Твои цели</h2>
            <p className="training-block-sub">
              Выбери навыки — на них будем делать упор в плане недели
            </p>
          </div>
          <div className="training-chips">
            {GOALS.map((g) => {
              const Icon = g.Icon
              const isActive = goals.includes(g.id)
              return (
                <button
                  key={g.id}
                  className={`training-chip ${isActive ? 'active' : ''}`}
                  onClick={() => toggleGoal(g.id)}
                >
                  <span className="training-chip-icon"><Icon /></span>
                  <span className="training-chip-label">{g.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============ ИНВЕНТАРЬ ============ */}
        <div className="training-block">
          <div className="training-block-head">
            <div className="training-block-label">Что есть под рукой</div>
            <h2 className="training-block-title">Твой инвентарь</h2>
            <p className="training-block-sub">
              Выбери, что у тебя есть. Упражнения подберём под это
            </p>
          </div>
          <div className="training-chips">
            {GEAR.map((g) => {
              const Icon = g.Icon
              const isActive = gear.includes(g.id)
              return (
                <button
                  key={g.id}
                  className={`training-chip ${isActive ? 'active' : ''}`}
                  onClick={() => toggleGear(g.id)}
                >
                  <span className="training-chip-icon"><Icon /></span>
                  <span className="training-chip-label">{g.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============ ДНИ ТРЕНИРОВОК ============ */}
        <div className="training-block">
          <div className="training-block-head">
            <div className="training-block-label">Расписание</div>
            <h2 className="training-block-title">Дни тренировок</h2>
            <p className="training-block-sub">
              Выбери 3–6 дней в неделю, когда можешь тренироваться
            </p>
          </div>
          <div className="training-days">
            {ALL_DAYS.map((day) => {
              const isActive = days.includes(day)
              return (
                <button
                  key={day}
                  className={`training-day-chip ${isActive ? 'active' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              )
            })}
          </div>
          <div className="training-days-hint">
            Выбрано: <strong>{days.length} из 7</strong>
            {days.length < 3 && ' — минимум 3 дня'}
            {days.length === 6 && ' — максимум 6 дней'}
          </div>
        </div>

        {/* ============ УРОВЕНЬ ============ */}
        <div className="training-block">
          <div className="training-block-head">
            <div className="training-block-label">Уровень</div>
            <h2 className="training-block-title">Насколько ты опытный?</h2>
            <p className="training-block-sub">
              От уровня зависит количество упражнений в тренировке
            </p>
          </div>
          <div className="training-levels">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                className={`training-level ${level === l.id ? 'active' : ''}`}
                onClick={() => setLevel(l.id)}
              >
                <div className="training-level-name">{l.label}</div>
                <div className="training-level-sub">{l.sub}</div>
                {level === l.id && (
                  <span className="training-level-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="training-save-bar">
        <button
          className={`bottom-cta-inline ${canSave ? '' : 'disabled'}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          Сохранить настройки <span className="arrow">→</span>
        </button>
      </div>
    </>
  )
}