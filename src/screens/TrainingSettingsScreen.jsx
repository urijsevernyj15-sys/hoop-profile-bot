import { useState } from 'react'
import {
  GoalShootingIcon,
  GoalDribblingIcon,
  GoalDrivesIcon,
  GoalFinishingIcon,
  GoalAthleticismIcon,
  GoalIQIcon,
  GoalDefenseIcon,
  GoalPassingIcon,
  GearBallIcon,
  GearTwoBallsIcon,
  GearPartnerIcon,
  GearConesIcon,
} from '../components/Icons'

const ALL_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function TrainingSettingsScreen({ user, onBack, onSave }) {
  const [goals, setGoals] = useState(user.trainingGoals || [])
  const [gear, setGear] = useState(user.trainingGear || [])
  const [level, setLevel] = useState(user.trainingLevel || 'beginner')
  const [days, setDays] = useState(user.trainingDays || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'])
  const [mode, setMode] = useState(user.trainingMode || 'manual')
  const [selectedProgram, setSelectedProgram] = useState(user.selectedProgramId || 'universal')

  const GOALS = [
    { id: 'shooting', Icon: GoalShootingIcon, label: 'Бросок' },
    { id: 'dribbling', Icon: GoalDribblingIcon, label: 'Дриблинг' },
    { id: 'drives', Icon: GoalDrivesIcon, label: 'Проходы' },
    { id: 'finishing', Icon: GoalFinishingIcon, label: 'Завершения' },
    { id: 'athleticism', Icon: GoalAthleticismIcon, label: 'Атлетизм' },
    { id: 'iq', Icon: GoalIQIcon, label: 'IQ' },
    { id: 'defense', Icon: GoalDefenseIcon, label: 'Защита' },
    { id: 'passing', Icon: GoalPassingIcon, label: 'Пас' },
  ]

  const GEAR = [
    { id: 'ball', Icon: GearBallIcon, label: 'Мяч' },
    { id: 'ball2', Icon: GearTwoBallsIcon, label: 'Два мяча' },
    { id: 'partner', Icon: GearPartnerIcon, label: 'Партнёр' },
    { id: 'cones', Icon: GearConesIcon, label: 'Конусы' },
  ]

  const LEVELS = [
    { id: 'beginner', label: 'Новичок', sub: '3 упражнения в день' },
    { id: 'intermediate', label: 'Любитель', sub: '5 упражнений в день' },
    { id: 'advanced', label: 'Продвинутый', sub: '7 упражнений в день' },
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
        if (prev.length <= 3) return prev
        return prev.filter((d) => d !== day)
      }
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
      trainingMode: mode,
      selectedProgramId: selectedProgram,
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
        {/* ============ РЕЖИМ ============ */}
        <div className="training-block">
          <div className="training-block-head">
            <div className="training-block-label">Режим</div>
            <h2 className="training-block-title">Как тренироваться?</h2>
            <p className="training-block-sub">
              Выбери одну программу или доверься роботу
            </p>
          </div>

          <div className="training-modes">
            <button
              className={`training-mode ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              <div className="training-mode-title">🎯 Одна программа</div>
              <div className="training-mode-sub">
                Идёшь по выбранной программе
              </div>
              {mode === 'manual' && <span className="training-mode-check">✓</span>}
            </button>

            <button
              className={`training-mode ${mode === 'mix' ? 'active' : ''}`}
              onClick={() => setMode('mix')}
            >
              <div className="training-mode-title">🔀 Микс</div>
              <div className="training-mode-sub">
                Робот чередует по слабым местам
              </div>
              {mode === 'mix' && <span className="training-mode-check">✓</span>}
            </button>
          </div>

          {mode === 'manual' && (
            <div className="training-modes-programs">
              <div className="training-modes-programs-label">Выбери программу:</div>
              <div className="training-modes-programs-list">
                {[
                  { id: 'sniper', label: '🎯 Снайпер' },
                  { id: 'playmaker', label: '⚡ Плэймейкер' },
                  { id: 'beast', label: '💪 Зверь' },
                  { id: 'slasher', label: '🚀 Атакующий' },
                  { id: 'universal', label: '🏀 Универсал' },
                ].map((p) => (
                  <button
                    key={p.id}
                    className={`training-program-choice ${selectedProgram === p.id ? 'active' : ''}`}
                    onClick={() => setSelectedProgram(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
                  <span className="training-chip-icon">
                    <Icon />
                  </span>
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
                  <span className="training-chip-icon">
                    <Icon />
                  </span>
                  <span className="training-chip-label">{g.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============ ДНИ ============ */}
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