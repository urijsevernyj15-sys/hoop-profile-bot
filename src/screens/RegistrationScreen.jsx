import { useState } from 'react'
import { POSITIONS } from '../data/themes'
import InfoModal from '../components/InfoModal'

export default function RegistrationScreen({ onComplete }) {
  const [step, setStep] = useState(1)
  const [sport, setSport] = useState('basketball')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [positions, setPositions] = useState([])
  const [soonModal, setSoonModal] = useState(null) // 'football' | 'volleyball' | null

  const isStep1Valid = height !== '' && weight !== '' && age !== ''
  const isStep2Valid = positions.length > 0

  function togglePosition(code) {
    setPositions((prev) => {
      if (prev.includes(code)) return prev.filter((p) => p !== code)
      if (prev.length >= 2) return prev
      return [...prev, code]
    })
  }

  if (step === 1) {
    return (
      <div className="registration">
        <h1 className="reg-title">Добро пожаловать</h1>
        <p className="reg-subtitle">Выбери вид спорта и расскажи о себе</p>

        <div className="sport-picker">
          <button
            className={`sport-btn ${sport === 'basketball' ? 'active' : ''}`}
            onClick={() => setSport('basketball')}
          >
            <span className="sport-icon">🏀</span>
            <span className="sport-label">Баскетбол</span>
          </button>

          <button
            className="sport-btn disabled"
            onClick={() => setSoonModal('football')}
          >
            <span className="sport-icon">⚽</span>
            <span className="sport-label">Футбол</span>
            <span className="sport-soon">скоро</span>
          </button>

          <button
            className="sport-btn disabled"
            onClick={() => setSoonModal('volleyball')}
          >
            <span className="sport-icon">🏐</span>
            <span className="sport-label">Волейбол</span>
            <span className="sport-soon">скоро</span>
          </button>
        </div>

        <div className="reg-form">
          <label className="reg-field">
            <span className="reg-label">Рост (см)</span>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Например, 195"
            />
          </label>

          <label className="reg-field">
            <span className="reg-label">Вес (кг)</span>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Например, 88"
            />
          </label>

          <label className="reg-field">
            <span className="reg-label">Возраст</span>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Например, 22"
            />
          </label>

          <button
            className={`reg-submit ${isStep1Valid ? 'active' : ''}`}
            onClick={() => isStep1Valid && setStep(2)}
            disabled={!isStep1Valid}
          >
            Далее
          </button>
        </div>

        {soonModal === 'football' && (
          <InfoModal
            icon="⚽"
            title="Футбол уже в разработке"
            text="Мы активно работаем над этим. Футбол появится в одном из ближайших обновлений — следи за новостями."
            buttonText="Жду!"
            onClose={() => setSoonModal(null)}
          />
        )}

        {soonModal === 'volleyball' && (
          <InfoModal
            icon="🏐"
            title="Волейбол уже в разработке"
            text="Мы активно работаем над этим. Волейбол появится в одном из ближайших обновлений — следи за новостями."
            buttonText="Жду!"
            onClose={() => setSoonModal(null)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="registration">
      <h1 className="reg-title">Твоя позиция</h1>
      <p className="reg-subtitle">
        Выбери одну или две позиции, на которых играешь
      </p>

      <div className="reg-notice">
        💡 Позиция влияет на тесты и будущие тренировки. Выбирай внимательно.
      </div>

      <div className="position-list">
        {POSITIONS.map((p) => {
          const isSelected = positions.includes(p.code)
          const isDisabled = !isSelected && positions.length >= 2
          return (
            <button
              key={p.code}
              className={`position-btn ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => togglePosition(p.code)}
              disabled={isDisabled}
            >
              <span className="position-code">{p.code}</span>
              <span className="position-label">{p.label}</span>
            </button>
          )
        })}

        <button
          className={`position-btn position-submit ${isStep2Valid ? 'active' : ''}`}
          onClick={() =>
            isStep2Valid && onComplete({ sport, height, weight, age, positions })
          }
          disabled={!isStep2Valid}
        >
          <span className="position-submit-text">Готово</span>
        </button>

        <button className="position-btn position-back" onClick={() => setStep(1)}>
          <span className="position-back-text">← Назад</span>
        </button>
      </div>
    </div>
  )
}