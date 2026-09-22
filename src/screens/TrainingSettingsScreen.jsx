import { useState } from 'react'

export default function TrainingSettingsScreen({ user, onBack, onSave }) {
  const [goals, setGoals] = useState(user.trainingGoals || [])
  const [gear, setGear] = useState(user.trainingGear || [])
  const [level, setLevel] = useState(user.trainingLevel || 'beginner')

  const GOALS = [
    { id: 'shooting', icon: '🎯', label: 'Бросок' },
    { id: 'dribbling', icon: '⚡', label: 'Дриблинг' },
    { id: 'athleticism', icon: '💪', label: 'Атлетизм' },
    { id: 'iq', icon: '🧠', label: 'IQ' },
    { id: 'defense', icon: '🛡️', label: 'Защита' },
    { id: 'passing', icon: '🎁', label: 'Пас' },
  ]

  const GEAR = [
    { id: 'ball', icon: '🏀', label: 'Мяч' },
    { id: 'hoop', icon: '🥅', label: 'Кольцо' },
    { id: 'cones', icon: '🚧', label: 'Конусы' },
    { id: 'partner', icon: '👥', label: 'Партнёр' },
    { id: 'wall', icon: '🧱', label: 'Стена' },
    { id: 'bar', icon: '🏋️', label: 'Турник' },
    { id: 'band', icon: '🪢', label: 'Резинка' },
    { id: 'chalk', icon: '🎯', label: 'Разметка' },
  ]

  const LEVELS = [
    { id: 'beginner', label: 'Новичок', sub: 'Только начинаю' },
    { id: 'intermediate', label: 'Любитель', sub: 'Играю регулярно' },
    { id: 'advanced', label: 'Продвинутый', sub: 'Играю в команде' },
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

  function handleSave() {
    onSave({ trainingGoals: goals, trainingGear: gear, trainingLevel: level })
  }

  const canSave = goals.length > 0 && gear.length > 0

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
          <h2 className="screen-head-title">Настройки тренировок</h2>
        </div>
      </div>

      <div className="training-screen">
        <div className="card">
          <div className="tag-pill">Что прокачать</div>
          <h2 className="card-title">Твои цели</h2>
          <p className="card-text">
            Выбери навыки — на них будем делать упор в плане недели.
          </p>
          <div className="chip-grid">
            {GOALS.map((g) => (
              <button
                key={g.id}
                className={`chip ${goals.includes(g.id) ? 'active' : ''}`}
                onClick={() => toggleGoal(g.id)}
              >
                <span className="chip-icon">{g.icon}</span>
                <span className="chip-label">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="tag-pill">Что есть под рукой</div>
          <h2 className="card-title">Твой инвентарь</h2>
          <p className="card-text">
            Выбери, что у тебя есть. Упражнения подберём под это.
          </p>
          <div className="chip-grid">
            {GEAR.map((g) => (
              <button
                key={g.id}
                className={`chip ${gear.includes(g.id) ? 'active' : ''}`}
                onClick={() => toggleGear(g.id)}
              >
                <span className="chip-icon">{g.icon}</span>
                <span className="chip-label">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="tag-pill">Уровень</div>
          <h2 className="card-title">Насколько ты опытный?</h2>
          <p className="card-text">
            План будет адаптирован под твой уровень нагрузки.
          </p>
          <div className="level-list">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                className={`level-btn ${level === l.id ? 'active' : ''}`}
                onClick={() => setLevel(l.id)}
              >
                <div className="level-btn-main">{l.label}</div>
                <div className="level-btn-sub">{l.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          className={`bottom-cta ${canSave ? '' : 'disabled'}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          Сохранить настройки <span className="arrow">→</span>
        </button>
      </div>
    </>
  )
}