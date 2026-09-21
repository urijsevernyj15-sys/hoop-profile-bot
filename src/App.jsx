import { useState, useEffect } from 'react'
import { getQuestionsForPositions, getTestDescription } from './iqQuestions'
import './App.css'

const DEFAULT_USER = {
  username: '@player',
  avatarLetter: 'P',
  avatarUrl: null,
  ovr: 99,
  height: '', weight: '', age: '',
  positions: [],
  sport: '',
  plan: 'free',
  testsPassed: 0,
  testsTotal: 4,
  theme: 'classic',
  cardTheme: 'classic',
}

const THEMES = [
  { id: 'classic', label: 'Классика', icon: '🏀', color: '#FF6B1A' },
  { id: 'nba', label: 'NBA', icon: '🔥', color: '#FF3B3B' },
  { id: 'neon', label: 'Неон', icon: '🌌', color: '#8B5CF6' },
  { id: 'techno', label: 'Техно', icon: '🧊', color: '#00E0FF' },
  { id: 'acid', label: 'Кислота', icon: '🌿', color: '#B8FF3C' },
]

const STORAGE_KEYS = {
  registered: 'hoop_registered',
  user: 'hoop_user',
}

const POSITIONS = [
  { code: 'PG', label: 'Разыгрывающий' },
  { code: 'SG', label: 'Атакующий защитник' },
  { code: 'SF', label: 'Лёгкий форвард' },
  { code: 'PF', label: 'Тяжёлый форвард' },
  { code: 'C', label: 'Центровой' },
]

const INITIAL_CATEGORIES = [
  {
    id: 'b-iq', icon: '🏀', title: 'Баскетбольный IQ',
    tests: [
      { id: 'b-iq-base', title: 'Игровое мышление', plan: 'free', status: 'active', score: null },
      { id: 'b-iq-vision', title: 'Видение площадки', plan: 'pro', status: 'locked', score: null },
      { id: 'b-iq-decision', title: 'Принятие решений', plan: 'pro', status: 'locked', score: null },
    ],
  },
  {
    id: 'shooting', icon: '🎯', title: 'Бросок',
    tests: [
      { id: 'sht-base', title: 'Базовый бросок', plan: 'free', status: 'pending', score: null },
      { id: 'sht-ft', title: 'Точность штрафных', plan: 'pro', status: 'locked', score: null },
      { id: 'sht-move', title: 'Бросок в движении', plan: 'pro', status: 'locked', score: null },
      { id: 'sht-3pt', title: 'Трёхочковые', plan: 'pro', status: 'locked', score: null },
    ],
  },
  {
    id: 'dribbling', icon: '⚡', title: 'Дриблинг',
    tests: [
      { id: 'drbl-base', title: 'Базовый дриблинг', plan: 'free', status: 'pending', score: null },
      { id: 'drbl-pressure', title: 'Дриблинг под давлением', plan: 'pro', status: 'locked', score: null },
      { id: 'drbl-hands', title: 'Скорость рук', plan: 'pro', status: 'locked', score: null },
    ],
  },
  {
    id: 'athleticism', icon: '💪', title: 'Атлетизм',
    tests: [
      { id: 'atl-base', title: 'Базовый атлетизм', plan: 'free', status: 'pending', score: null },
      { id: 'atl-jump', title: 'Прыжок с разбега', plan: 'pro', status: 'locked', score: null },
      { id: 'atl-endurance', title: 'Выносливость', plan: 'pro', status: 'locked', score: null },
      { id: 'atl-reaction', title: 'Реакция', plan: 'pro', status: 'locked', score: null },
    ],
  },
]

function freshCategories() {
  return JSON.parse(JSON.stringify(INITIAL_CATEGORIES))
}

// ============================================================
// РАСЧЁТ OVR
// ============================================================
const OVR_WEIGHTS = {
  PG: { 'b-iq-base': 25, 'sht-base': 15, 'drbl-base': 35, 'atl-base': 25 },
  SG: { 'b-iq-base': 20, 'sht-base': 30, 'drbl-base': 25, 'atl-base': 25 },
  SF: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25 },
  PF: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 15, 'atl-base': 35 },
  C:  { 'b-iq-base': 25, 'sht-base': 20, 'drbl-base': 10, 'atl-base': 45 },
  default: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25 },
}

function calculateOVR(categories, positions) {
  const allTests = categories.flatMap((c) => c.tests)
  const freeTests = allTests.filter((t) => t.plan === 'free')
  const doneTests = freeTests.filter((t) => t.status === 'done' && t.score !== null)
  if (doneTests.length < freeTests.length) return null

  const main = positions && positions[0] ? positions[0] : 'default'
  const weights = OVR_WEIGHTS[main] || OVR_WEIGHTS.default

  let weightedSum = 0
  let totalWeight = 0

  freeTests.forEach((t) => {
    const w = weights[t.id] || 0
    weightedSum += (t.score || 0) * w
    totalWeight += w
  })

  if (totalWeight === 0) return null
  return Math.round(weightedSum / totalWeight)
}

function calculateFinalScore(blockScores, blocks) {
  let totalWeighted = 0
  let totalWeight = 0
  blocks.forEach((block, bIdx) => {
    const points = blockScores[bIdx] || []
    const totalPossible = block.totalPerPoint
    if (points.length === 0) return
    block.weights.forEach((weight, pIdx) => {
      const score = Number(points[pIdx]) || 0
      const percent = score / totalPossible
      totalWeighted += percent * weight
      totalWeight += weight
    })
  })
  if (totalWeight === 0) return 0
  return Math.round((totalWeighted / totalWeight) * 100)
}

// ============ РЕГИСТРАЦИЯ ============
function RegistrationScreen({ onComplete }) {
  const [step, setStep] = useState(1)
  const [sport, setSport] = useState('basketball')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [positions, setPositions] = useState([])

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
          <button className={`sport-btn ${sport === 'basketball' ? 'active' : ''}`} onClick={() => setSport('basketball')}>
            <span className="sport-icon">🏀</span>
            <span className="sport-label">Баскетбол</span>
          </button>
          <button className="sport-btn disabled" onClick={() => alert('Футбол — скоро!')}>
            <span className="sport-icon">⚽</span>
            <span className="sport-label">Футбол</span>
            <span className="sport-soon">скоро</span>
          </button>
          <button className="sport-btn disabled" onClick={() => alert('Волейбол — скоро!')}>
            <span className="sport-icon">🏐</span>
            <span className="sport-label">Волейбол</span>
            <span className="sport-soon">скоро</span>
          </button>
        </div>
        <div className="reg-form">
          <label className="reg-field">
            <span className="reg-label">Рост (см)</span>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Например, 195" />
          </label>
          <label className="reg-field">
            <span className="reg-label">Вес (кг)</span>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Например, 88" />
          </label>
          <label className="reg-field">
            <span className="reg-label">Возраст</span>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Например, 22" />
          </label>
          <button className={`reg-submit ${isStep1Valid ? 'active' : ''}`} onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid}>
            Далее
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="registration">
      <h1 className="reg-title">Твоя позиция</h1>
      <p className="reg-subtitle">Выбери одну или две позиции, на которых играешь</p>
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
      </div>
      <button className={`reg-submit ${isStep2Valid ? 'active' : ''}`} onClick={() => isStep2Valid && onComplete({ sport, height, weight, age, positions })} disabled={!isStep2Valid}>
        Готово
      </button>
      <button className="reg-back" onClick={() => setStep(1)}>← Назад</button>
    </div>
  )
}

// ============ ГЛАВНАЯ ============
function HomeScreen({ user, onOpenCard, onOpenPro, onStartTest, onOpenTests }) {
  const allTests = user.categories.flatMap((c) => c.tests)
  const passed = allTests.filter((t) => t.status === 'done' && t.plan === 'free').length

  const nextActive = allTests.find((t) => t.status === 'active' && t.plan === 'free')
  const progressPercent = user.testsTotal > 0 ? (passed / user.testsTotal) * 100 : 0
  const ovr = calculateOVR(user.categories, user.positions)

  const homeMetrics = [
    { code: 'B-IQ', testId: 'b-iq-base', value: allTests.find((t) => t.id === 'b-iq-base')?.score ?? null },
    { code: 'SHT', testId: 'sht-base', value: allTests.find((t) => t.id === 'sht-base')?.score ?? null },
    { code: 'DRBL', testId: 'drbl-base', value: allTests.find((t) => t.id === 'drbl-base')?.score ?? null },
    { code: 'ATL', testId: 'atl-base', value: allTests.find((t) => t.id === 'atl-base')?.score ?? null },
  ]

  return (
    <>
      <div className="top-bar">
        <div className="profile">
          <div className="avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
            ) : (
              user.avatarLetter
            )}
          </div>
          <div className="profile-info">
            <div className="username">
              {user.username}
              {user.plan === 'pro' && <span className="pro-badge">PRO</span>}
            </div>
            <div className="tests-progress">
              Пройдено: {passed} / {user.testsTotal}
            </div>
          </div>
        </div>
        <button className="card-btn" onClick={onOpenCard}>Моя карточка</button>
      </div>

      <div className="home-progress">
        <div className="home-progress-top">
          <span className="home-progress-label">Прогресс карточки</span>
          <span className="home-progress-value">{passed}/{user.testsTotal}</span>
        </div>
        <div className="home-progress-bar">
          <div className="home-progress-fill" style={{ width: progressPercent + '%' }} />
        </div>
      </div>

      {nextActive && (
        <button className="home-continue" onClick={() => onStartTest(nextActive.id)}>
          <div className="home-continue-left">
            <div className="home-continue-label">Продолжить</div>
            <div className="home-continue-title">{nextActive.title}</div>
          </div>
          <div className="home-continue-arrow">→</div>
        </button>
      )}

      {ovr !== null ? (
        <div className="ovr-hero">
          <div className="ovr-hero-ring">
            <svg viewBox="0 0 200 200" className="ovr-hero-svg">
              <circle cx="100" cy="100" r="88" className="ovr-hero-track" />
              <circle
                cx="100"
                cy="100"
                r="88"
                className="ovr-hero-progress"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - ovr / 100)}
              />
            </svg>
            <div className="ovr-hero-inner">
              <div className="ovr-hero-label">OVR</div>
              <div className="ovr-hero-value">{ovr}</div>
            </div>
          </div>
          <div className="ovr-hero-rank">
            {ovr >= 90 ? 'Элита' : ovr >= 75 ? 'Про' : ovr >= 60 ? 'Любитель' : ovr >= 40 ? 'Новичок' : 'Начинающий'}
          </div>
          <div className="ovr-hero-hint">Средневзвешенное по твоей позиции</div>
        </div>
      ) : (
        <div className="ovr-placeholder">
          OVR появится после всех тестов ({passed} / {user.testsTotal})
        </div>
      )}

      <div className="next-test">
        <div className="next-test-label">ВЫБЕРИ, ЧТО ЗАМЕРИТЬ</div>
        <h2 className="next-test-title">Навыки</h2>
        <p className="next-test-desc">Нажми на плашку — откроется тест.</p>
        <div className="metrics">
          {homeMetrics.map((m) => (
            <button
              key={m.code}
              className={`metric metric-btn ${m.value !== null ? 'done' : 'pending'}`}
              onClick={() => onStartTest(m.testId)}
            >
              {m.value !== null && <span className="check">✓</span>}
              <span className="metric-code">{m.code}</span>
              <span className="metric-value">{m.value !== null ? m.value : '—'}</span>
            </button>
          ))}
        </div>
        <button className="home-link-btn" onClick={onOpenTests}>
          Все тесты →
        </button>
      </div>

      <div className="rating-explainer">
        <div className="rating-explainer-head">
          <span className="rating-explainer-icon">📊</span>
          <span className="rating-explainer-title">Как строится оценка</span>
        </div>
        <div className="rating-explainer-list">
          <div className="rating-explainer-item">
            <span className="rating-explainer-num">1</span>
            <span>Твой результат сравнивается с нормой для твоей позиции</span>
          </div>
          <div className="rating-explainer-item">
            <span className="rating-explainer-num">2</span>
            <span>Норма — 100 баллов. Выше нормы — тоже максимум 100</span>
          </div>
          <div className="rating-explainer-item">
            <span className="rating-explainer-num">3</span>
            <span>В дриблинге за каждую потерю снимается 3 балла</span>
          </div>
          <div className="rating-explainer-item">
            <span className="rating-explainer-num">4</span>
            <span>OVR — средневзвешенное по позиции. Каждый навык имеет свой вес</span>
          </div>
        </div>
        <div className="rating-explainer-note">
          Нормы и веса различаются для PG, SG, SF, PF и C — учитываем твою роль на площадке.
        </div>
      </div>

      {user.plan === 'free' && (
        <div className="pro-promo" onClick={onOpenPro}>
          <div className="pro-promo-icon">✨</div>
          <div className="pro-promo-text">
            <div className="pro-promo-title">С PRO-карточкой результаты точнее</div>
            <div className="pro-promo-sub">Больше тестов, история и тренировки</div>
          </div>
          <div className="pro-promo-arrow">→</div>
        </div>
      )}
    </>
  )
}

// ============ ТЕСТЫ ============
function TestsScreen({ user, onOpenPro, onStartTest }) {
  const [expanded, setExpanded] = useState({})

  function toggleCategory(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function getProgress(cat) {
    const total = cat.tests.length
    const done = cat.tests.filter((t) => t.status === 'done').length
    return { done, total, percent: total > 0 ? (done / total) * 100 : 0 }
  }

  function getScore(cat) {
    const done = cat.tests.filter((t) => t.status === 'done' && t.score !== null)
    if (done.length === 0) return null
    return Math.round(done.reduce((a, t) => a + t.score, 0) / done.length)
  }

  const allTests = user.categories.flatMap((c) => c.tests)
  const freeTotal = allTests.filter((t) => t.plan === 'free').length
  const freeDone = allTests.filter((t) => t.status === 'done' && t.plan === 'free').length
  const percent = freeTotal > 0 ? (freeDone / freeTotal) * 100 : 0

  return (
    <>
      <div className="tests-header">
        <h1 className="screen-head-title">Тесты</h1>
        <p className="tests-subtitle">Тесты разработаны профи — чтобы честно определить твой уровень</p>
      </div>

      <div className="tests-summary">
        <div className="tests-summary-row">
          <span className="tests-summary-label">Прогресс тестов</span>
          <span className="tests-summary-value">{freeDone} / {freeTotal}</span>
        </div>
        <div className="tests-summary-bar">
          <div className="tests-summary-fill" style={{ width: percent + '%' }} />
        </div>
        <div className="tests-summary-hint">
          {freeDone === freeTotal ? '🎉 Все бесплатные тесты пройдены' : `Осталось пройти: ${freeTotal - freeDone}`}
        </div>
      </div>

      <div className="categories-list">
        {user.categories.map((cat) => {
          const isOpen = expanded[cat.id]
          const progress = getProgress(cat)
          const avg = getScore(cat)
          return (
            <div key={cat.id} className="category">
              <button className="category-header" onClick={() => toggleCategory(cat.id)}>
                <div className="category-header-left">
                  <span className="category-icon">{cat.icon}</span>
                  <div className="category-info">
                    <div className="category-title">{cat.title}</div>
                    <div className="category-progress">
                      <div className="category-progress-bar">
                        <div className="category-progress-fill" style={{ width: progress.percent + '%' }} />
                      </div>
                      <span className="category-progress-text">{progress.done} / {progress.total}</span>
                    </div>
                  </div>
                </div>
                <div className="category-header-right">
                  {avg !== null && <span className="category-score">{avg}</span>}
                  <span className={`category-arrow ${isOpen ? 'open' : ''}`}>▾</span>
                </div>
              </button>

              {isOpen && (
                <div className="category-tests">
                  {cat.tests.map((t) => {
                    const isLocked = t.plan === 'pro'
                    return (
                      <button
                        key={t.id}
                        className={`test-item ${t.status} ${isLocked ? 'locked' : ''}`}
                        onClick={() => {
                          if (isLocked) return onOpenPro()
                          if (t.status === 'locked') return
                          onStartTest(t.id)
                        }}
                      >
                        <div className="test-info">
                          <div className="test-title">
                            {t.title}
                            {isLocked && <span className="pro-badge-small">PRO</span>}
                          </div>
                        </div>
                        <div className="test-right">
                          {t.status === 'done' && (
                            <div className="test-score-badge"><span className="check">✓</span><span>{t.score}</span></div>
                          )}
                          {t.status === 'active' && !isLocked && <span className="test-action">Начать →</span>}
                          {t.status === 'pending' && !isLocked && <span className="test-action dim">Замерить →</span>}
                          {isLocked && <span className="lock">🔒</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ============ ПРОХОЖДЕНИЕ ТЕСТА ============
function TestRunScreen({ testId, testTitle, user, onBack, onSave, onGoHome, onOpenProfile }) {
  const [phase, setPhase] = useState('safety')
  const [finalResult, setFinalResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [result, setResult] = useState('')

  const [iqQuestions, setIqQuestions] = useState([])
  const [iqIndex, setIqIndex] = useState(0)
  const [iqAnswers, setIqAnswers] = useState([])

  const [blockIndex, setBlockIndex] = useState(0)
  const [blockScores, setBlockScores] = useState([])
  const [blockInputs, setBlockInputs] = useState({})

  const [dribbleTaskIndex, setDribbleTaskIndex] = useState(0)
  const [dribbleData, setDribbleData] = useState({})
  const [dribbleInputCount, setDribbleInputCount] = useState('')
  const [dribbleInputLosses, setDribbleInputLosses] = useState(null)

  const [atletIndex, setAtletIndex] = useState(0)
  const [atletData, setAtletData] = useState({})
  const [atletInput, setAtletInput] = useState('')

  const isIQ = testId === 'b-iq-base'
  const isDribble = testId === 'drbl-base'
  const isAtlet = testId === 'atl-base'
  const hasPositions = user.positions.length > 0
  const desc = getTestDescription(testId, user.positions)
  const hasBlocks = desc && desc.blocks && desc.blocks.length > 0
  const hasTasks = desc && desc.tasks && desc.tasks.length > 0

  useEffect(() => {
    if (isIQ && hasPositions) {
      const qs = getQuestionsForPositions(user.positions)
      setIqQuestions(qs)
    }
  }, [isIQ, hasPositions, user.positions])

  useEffect(() => {
    if (phase !== 'running') return
    if (timeLeft <= 0) {
      setPhase('input')
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, timeLeft])

  function handleSave() {
    if (hasBlocks) {
      const currentBlock = desc.blocks[blockIndex]
      const inputs = blockInputs[blockIndex] || []
      if (inputs.length !== currentBlock.points.length || inputs.some((v) => v === '' || v === undefined)) {
        alert('Заполни все поля')
        return
      }
      const numeric = inputs.map(Number)
      for (let i = 0; i < numeric.length; i++) {
        if (numeric[i] < 0 || numeric[i] > currentBlock.totalPerPoint) {
          alert(`Поле "${currentBlock.points[i]}" должно быть от 0 до ${currentBlock.totalPerPoint}`)
          return
        }
      }
      const newScores = [...blockScores, numeric]
      setBlockScores(newScores)
      if (blockIndex + 1 < desc.blocks.length) {
        setBlockIndex(blockIndex + 1)
      } else {
        const finalScore = calculateFinalScore(newScores, desc.blocks)
        setFinalResult({
          score: finalScore,
          breakdown: newScores.map((blockScore, i) => ({
            label: desc.blocks[i].title,
            value: `${blockScore.reduce((a, b) => a + b, 0)} / ${desc.blocks[i].points.length * desc.blocks[i].totalPerPoint}`,
          })),
        })
        setPhase('result')
      }
      return
    }

    if (isDribble) {
      const count = Number(dribbleInputCount)
      if (isNaN(count) || dribbleInputCount === '') {
        alert('Введи количество отскоков')
        return
      }
      if (count < 0 || count > (desc.max || 200)) {
        alert(`Введи число от 0 до ${desc.max || 200}`)
        return
      }
      if (dribbleInputLosses === null) {
        alert('Выбери количество потерь')
        return
      }

      const currentTask = desc.tasks[dribbleTaskIndex]
      const newData = { ...dribbleData, [currentTask.id]: { count, losses: dribbleInputLosses } }
      setDribbleData(newData)

      if (dribbleTaskIndex + 1 < desc.tasks.length) {
        setDribbleTaskIndex(dribbleTaskIndex + 1)
        setDribbleInputCount('')
        setDribbleInputLosses(null)
        setTimeLeft(30)
        setPhase('running')
        return
      }

      const scores = desc.tasks.map((t) => {
        const d = newData[t.id]
        if (!d) return 0
        const base = Math.min(100, Math.round((d.count / t.norm) * 100))
        const penalty = d.losses * 3
        return Math.max(0, base - penalty)
      })
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

      setFinalResult({
        score: avg,
        breakdown: desc.tasks.map((t) => {
          const d = newData[t.id]
          return {
            label: t.title,
            value: `${d.count} отскоков · ${d.losses} ${d.losses === 1 ? 'потеря' : 'потерь'}`,
          }
        }),
      })
      setPhase('result')
      return
    }

    if (isAtlet) {
      const num = Number(atletInput)
      if (isNaN(num) || atletInput === '') {
        alert('Введи результат')
        return
      }
      const currentTask = desc.tasks[atletIndex]

      if (currentTask.direction === 'higher' && num < 0) {
        alert('Введи положительное число')
        return
      }
      if (currentTask.direction === 'lower' && (num < 1 || num > 15)) {
        alert('Введи время от 1 до 15 секунд')
        return
      }

      const newData = { ...atletData, [currentTask.id]: num }
      setAtletData(newData)

      if (atletIndex + 1 < desc.tasks.length) {
        setAtletIndex(atletIndex + 1)
        setAtletInput('')
        setPhase('input')
        return
      }

      const scores = desc.tasks.map((t) => {
        const value = newData[t.id]
        if (value === undefined) return 0
        if (t.direction === 'higher') return Math.min(100, Math.round((value / t.norm) * 100))
        else return Math.min(100, Math.round((t.norm / value) * 100))
      })
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

      setFinalResult({
        score: avg,
        breakdown: desc.tasks.map((t) => ({
          label: t.title,
          value: `${newData[t.id]} ${t.unit}`,
        })),
      })
      setPhase('result')
      return
    }

    const num = Number(result)
    if (isNaN(num) || result === '') return
    if (desc && (num < 0 || num > desc.max)) {
      alert(`Введи число от 0 до ${desc.max}`)
      return
    }
    setFinalResult({
      score: num,
      breakdown: [{ label: 'Результат', value: num }],
    })
    setPhase('result')
  }

  function handleIQAnswer(optionWeight) {
    const newAnswers = [...iqAnswers, optionWeight]
    setIqAnswers(newAnswers)
    if (iqIndex + 1 < iqQuestions.length) {
      setIqIndex(iqIndex + 1)
    } else {
      const maxPossible = iqQuestions.length * 10
      const sum = newAnswers.reduce((a, w) => a + w, 0)
      const score = Math.round((sum / maxPossible) * 100)

      setFinalResult({
        score,
        breakdown: [
          { label: 'Ответов дано', value: `${iqQuestions.length}` },
          { label: 'Итоговый балл', value: `${score} / 100` },
        ],
      })
      setPhase('result')
    }
  }

  function handleResultDone() {
    onSave(testId, finalResult.score)
  }

  function handleResultRetry() {
    setFinalResult(null)
    setPhase('intro')
    setTimeLeft(30)
    setResult('')
    setIqIndex(0)
    setIqAnswers([])
    setBlockIndex(0)
    setBlockScores([])
    setBlockInputs({})
    setDribbleTaskIndex(0)
    setDribbleData({})
    setDribbleInputCount('')
    setDribbleInputLosses(null)
    setAtletIndex(0)
    setAtletData({})
    setAtletInput('')
  }

  const header = (
    <div className="screen-head">
      <div className="screen-head-left">
        <button className="icon-btn" onClick={onBack}>←</button>
        <h2 className="screen-head-title">
          {testTitle}
          <small>{desc ? desc.description.slice(0, 36) + '…' : ''}</small>
        </h2>
      </div>
      <button className="icon-btn" onClick={onGoHome}>🏠</button>
    </div>
  )

  if (isIQ) {
    if (!hasPositions) {
      return (
        <>
          {header}
          <div className="test-run">
            <div className="test-run-icon">🎯</div>
            <p className="test-run-desc">Для этого теста нужна игровая позиция.</p>
            <button className="start-btn" onClick={onOpenProfile}>Перейти в профиль</button>
          </div>
        </>
      )
    }
    if (phase === 'intro' || phase === 'safety') {
      return (
        <>
          {header}
          <div className="test-run">
            <div className="test-run-icon">🧠</div>
            <div className="card">
              <div className="tag-pill">Что тебя ждёт</div>
              <h2 className="card-title">Игровые ситуации</h2>
              <p className="card-text">
                {iqQuestions.length} ситуаций из игры. Выбери, как бы ты поступил.
                Приложение само посчитает результат.
              </p>
            </div>
            <div className="test-run-hint-block">🎯 Здесь нет «правильных» ответов — есть лучшие</div>
            <button className="bottom-cta" onClick={() => setPhase('running')}>
              Начать <span className="arrow">→</span>
            </button>
          </div>
        </>
      )
    }
    if (phase === 'result' && finalResult) {
      return <ResultView header={header} finalResult={finalResult} onDone={handleResultDone} onRetry={handleResultRetry} />
    }
    const currentQ = iqQuestions[iqIndex]
    if (!currentQ) return null
    const progressPercent = (iqIndex / iqQuestions.length) * 100
    return (
      <>
        {header}
        <div className="iq-screen">
          <div className="iq-progress-row">
            <span className="iq-progress-label">Вопрос {iqIndex + 1} из {iqQuestions.length}</span>
            <div className="iq-progress-bar">
              <div className="iq-progress-fill" style={{ width: progressPercent + '%' }} />
            </div>
          </div>
          <div className="iq-question">{currentQ.question}</div>
          <div className="iq-options">
            {currentQ.options.map((opt) => (
              <button key={opt.id} className="iq-option" onClick={() => handleIQAnswer(opt.weight)}>
                <span className="iq-option-letter">{opt.id.toUpperCase()}</span>
                <span className="iq-option-text">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (phase === 'safety') {
    return (
      <>
        {header}
        <div className="safety-screen">
          <div className="card">
            <div className="tag-pill">Перед началом</div>
            <h2 className="card-title">Проверь условия</h2>
            <p className="card-text">
              Убедись, что всё в порядке. Если дискомфорт — <strong>не начинай тест</strong>.
            </p>
          </div>
          <div className="card">
            <div className="safety-list">
              <div className="safety-item">
                <span className="safety-check">✓</span>
                <div>
                  <div className="safety-item-title">Площадка сухая</div>
                  <div className="safety-item-text">Никакой влаги, пыли, мусора.</div>
                </div>
              </div>
              <div className="safety-item">
                <span className="safety-check">✓</span>
                <div>
                  <div className="safety-item-title">Размялся</div>
                  <div className="safety-item-text">Суставы, мышцы, связки готовы.</div>
                </div>
              </div>
              <div className="safety-item">
                <span className="safety-check">✓</span>
                <div>
                  <div className="safety-item-title">Нет травм и боли</div>
                  <div className="safety-item-text">Ничего не болит, нет дискомфорта.</div>
                </div>
              </div>
              <div className="safety-item">
                <span className="safety-check">✓</span>
                <div>
                  <div className="safety-item-title">Хорошее самочувствие</div>
                  <div className="safety-item-text">Без головокружения, слабости.</div>
                </div>
              </div>
              <div className="safety-item">
                <span className="safety-check">✓</span>
                <div>
                  <div className="safety-item-title">Обувь подходит</div>
                  <div className="safety-item-text">Надёжно фиксирует стопу.</div>
                </div>
              </div>
              <div className="safety-item">
                <span className="safety-check">✓</span>
                <div>
                  <div className="safety-item-title">Рядом есть вода</div>
                  <div className="safety-item-text">Пей, если почувствуешь жажду.</div>
                </div>
              </div>
            </div>
          </div>
          <button className="bottom-cta" onClick={() => setPhase('intro')}>
            Продолжить <span className="arrow">→</span>
          </button>
        </div>
      </>
    )
  }

  if (!desc) {
    return (
      <>
        {header}
        <div className="test-run">
          <p className="test-run-desc">Тест пока недоступен.</p>
        </div>
      </>
    )
  }

  if (phase === 'result' && finalResult) {
    return <ResultView header={header} finalResult={finalResult} onDone={handleResultDone} onRetry={handleResultRetry} />
  }

  if (phase === 'intro') {
    return (
      <>
        {header}
        <div className="block-screen">
          <div className="intro-hero">
            <div className="intro-hero-icon">{desc.icon}</div>
            <h1 className="intro-hero-title">{testTitle}</h1>
            <p className="intro-hero-sub">{desc.description}</p>
          </div>

          <div className="intro-meta">
            {desc.duration && (
              <div className="intro-meta-item">
                <span className="intro-meta-icon">⏱️</span>
                <span className="intro-meta-label">Время</span>
                <span className="intro-meta-value">{desc.duration}</span>
              </div>
            )}
            {desc.needs && (
              <div className="intro-meta-item">
                <span className="intro-meta-icon">🎒</span>
                <span className="intro-meta-label">Нужно</span>
                <span className="intro-meta-value">{desc.needs}</span>
              </div>
            )}
          </div>

          {desc.bullets && desc.bullets.length > 0 && (
            <div className="card">
              <div className="tag-pill">Что тебя ждёт</div>
              <div className="intro-bullets">
                {desc.bullets.map((b, i) => (
                  <div key={i} className="intro-bullet">
                    <span className="intro-bullet-check">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {desc.tip && (
            <div className="intro-tip">
              <span className="intro-tip-icon">💡</span>
              <span className="intro-tip-text">{desc.tip}</span>
            </div>
          )}

          {hasBlocks && (
            <div className="test-run-hint-block">
              🎯 Счёт начинается с первого попавшего мяча
            </div>
          )}

          <button
            className="bottom-cta"
            onClick={() => {
              if (hasBlocks) setPhase('input')
              else if (isDribble) {
                setDribbleTaskIndex(0)
                setDribbleInputCount('')
                setDribbleInputLosses(null)
                setTimeLeft(30)
                setPhase('running')
              } else if (isAtlet) {
                setAtletIndex(0)
                setAtletInput('')
                setPhase('input')
              } else if (desc.hasTimer) {
                setPhase('running')
                setTimeLeft(30)
              } else setPhase('input')
            }}
          >
            Начать <span className="arrow">→</span>
          </button>
        </div>
      </>
    )
  }

  if (phase === 'running') {
    return (
      <>
        {header}
        <div className="test-run">
          <div className="test-timer">{timeLeft}</div>
          <p className="test-run-hint">Выполняй упражнение. Считай отскоки.</p>
          <button className="pick-day-btn" onClick={() => setPhase('input')}>
            Закончил раньше
          </button>
        </div>
      </>
    )
  }

  if (phase === 'input') {
    if (hasBlocks) {
      const block = desc.blocks[blockIndex]
      const currentInputs = blockInputs[blockIndex] || []
      const progressSegments = desc.blocks.map((_, i) => i <= blockIndex)

      function updateInput(pointIdx, value) {
        const newInputs = [...currentInputs]
        newInputs[pointIdx] = value
        setBlockInputs({ ...blockInputs, [blockIndex]: newInputs })
      }

      const allFilled = currentInputs.length === block.points.length && currentInputs.every((v) => v !== '' && v !== undefined)

      return (
        <>
          {header}
          <div className="block-screen">
            <div className="segmented-progress">
              {progressSegments.map((filled, i) => (
                <div key={i} className={`segmented-progress-item ${filled ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="card">
              <div className="tag-pill">Техника</div>
              <h2 className="card-title">{block.title}</h2>
              <p className="card-text">Бросай с каждой точки по порядку. Записывай попадания отдельно.</p>
            </div>

            <div className="card">
              <div className="tag-pill">Сколько попал</div>
              <div className="multi-inputs">
                {block.points.map((point, i) => (
                  <div key={i} className="multi-input-row">
                    <span className="multi-input-label">{point}</span>
                    <div className="multi-input-control">
                      <input
                        type="number"
                        value={currentInputs[i] ?? ''}
                        onChange={(e) => updateInput(i, e.target.value)}
                        min="0"
                        max={block.totalPerPoint}
                      />
                      <span className="multi-input-suffix">из {block.totalPerPoint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`bottom-cta ${allFilled ? '' : 'disabled'}`}
              onClick={handleSave}
              disabled={!allFilled}
            >
              {blockIndex + 1 < desc.blocks.length ? 'Следующий блок' : 'Завершить'}
              <span className="arrow">→</span>
            </button>
          </div>
        </>
      )
    }

    if (isDribble) {
      const currentTask = desc.tasks[dribbleTaskIndex]
      const allFilled = dribbleInputCount !== '' && dribbleInputLosses !== null
      const progressSegments = desc.tasks.map((_, i) => i <= dribbleTaskIndex)

      return (
        <>
          {header}
          <div className="block-screen">
            <div className="segmented-progress">
              {progressSegments.map((filled, i) => (
                <div key={i} className={`segmented-progress-item ${filled ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="card">
              <div className="tag-pill">Задание {dribbleTaskIndex + 1} из {desc.tasks.length}</div>
              <h2 className="card-title">{currentTask.title}</h2>
              <p className="card-text">{currentTask.technique}</p>
            </div>

            <div className="card">
              <div className="tag-pill">Результат</div>
              <h2 className="card-title">{currentTask.countLabel}</h2>
              <label className="reg-field" style={{ marginTop: '14px' }}>
                <input
                  type="number"
                  value={dribbleInputCount}
                  onChange={(e) => setDribbleInputCount(e.target.value)}
                  autoFocus
                  min="0"
                  max={desc.max || 200}
                />
              </label>
            </div>

            <div className="card">
              <div className="tag-pill">Потери</div>
              <h2 className="card-title">Сколько раз потерял мяч?</h2>
              <div className="losses-row">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className={`losses-btn ${dribbleInputLosses === n ? 'active' : ''}`}
                    onClick={() => setDribbleInputLosses(n)}
                  >
                    {n === 4 ? '4+' : n}
                  </button>
                ))}
              </div>
            </div>

            <div className="info-note">
              <span className="info-note-icon">ℹ️</span>
              <span className="info-note-text">
                Возможна погрешность 1–3 касания — это нормально.
              </span>
            </div>

            <div className="warning-note">
              <span className="warning-note-icon">⚠️</span>
              <span className="warning-note-text">
                <strong>Обманывая приложение — ты обманываешь себя.</strong> Честный результат даёт точный план роста.
              </span>
            </div>

            <button
              className={`bottom-cta ${allFilled ? '' : 'disabled'}`}
              onClick={handleSave}
              disabled={!allFilled}
            >
              {dribbleTaskIndex + 1 < desc.tasks.length ? 'Следующее задание' : 'Завершить'}
              <span className="arrow">→</span>
            </button>
          </div>
        </>
      )
    }

    if (isAtlet) {
      const currentTask = desc.tasks[atletIndex]
      const allFilled = atletInput !== ''
      const progressSegments = desc.tasks.map((_, i) => i <= atletIndex)

      return (
        <>
          {header}
          <div className="block-screen">
            <div className="segmented-progress">
              {progressSegments.map((filled, i) => (
                <div key={i} className={`segmented-progress-item ${filled ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="card">
              <div className="tag-pill">Упражнение {atletIndex + 1} из {desc.tasks.length}</div>
              <h2 className="card-title">{currentTask.title}</h2>
              <p className="card-text">{currentTask.technique}</p>
            </div>

            <div className="card">
              <div className="tag-pill">Результат</div>
              <h2 className="card-title">{currentTask.inputLabel}</h2>
              <label className="reg-field" style={{ marginTop: '14px' }}>
                <input
                  type="number"
                  step={currentTask.direction === 'lower' ? '0.1' : '1'}
                  value={atletInput}
                  onChange={(e) => setAtletInput(e.target.value)}
                  autoFocus
                  min="0"
                />
              </label>
            </div>

            <div className="info-note">
              <span className="info-note-icon">💡</span>
              <span className="info-note-text">
                Норма для твоей позиции: <strong>{currentTask.norm} {currentTask.unit}</strong>. Это уровень 100 баллов.
              </span>
            </div>

            <button
              className={`bottom-cta ${allFilled ? '' : 'disabled'}`}
              onClick={handleSave}
              disabled={!allFilled}
            >
              {atletIndex + 1 < desc.tasks.length ? 'Следующее' : 'Завершить'}
              <span className="arrow">→</span>
            </button>
          </div>
        </>
      )
    }

    return (
      <>
        {header}
        <div className="block-screen">
          <div className="card">
            <div className="tag-pill">Результат</div>
            <h2 className="card-title">{desc.inputLabel}</h2>
          </div>

          <div className="card">
            <label className="reg-field">
              <span className="reg-label">Введи число</span>
              <input
                type="number"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                autoFocus
                min="0"
                max={desc.max}
              />
            </label>
          </div>

          <button
            className={`bottom-cta ${result !== '' ? '' : 'disabled'}`}
            onClick={handleSave}
            disabled={result === ''}
          >
            Сохранить <span className="arrow">→</span>
          </button>
        </div>
      </>
    )
  }

  return null
}

// ============ ЭКРАН РЕЗУЛЬТАТА ============
function ResultView({ header, finalResult, onDone, onRetry }) {
  const score = finalResult.score
  const rank =
    score >= 85 ? { label: 'Отлично', emoji: '🏆', cls: 'success' } :
    score >= 70 ? { label: 'Хорошо', emoji: '🔥', cls: 'success' } :
    score >= 50 ? { label: 'Средне', emoji: '⚡', cls: 'accent' } :
    score >= 30 ? { label: 'Нужно поработать', emoji: '💪', cls: 'accent' } :
    { label: 'Только начало', emoji: '🎯', cls: 'accent' }

  return (
    <>
      {header}
      <div className="result-screen">
        <div className={`result-hero ${rank.cls}`}>
          <div className="result-hero-emoji">{rank.emoji}</div>
          <div className="result-hero-label">{rank.label}</div>
          <div className="result-hero-value">{score}</div>
          <div className="result-hero-hint">из 100 баллов</div>
        </div>

        {finalResult.breakdown && finalResult.breakdown.length > 0 && (
          <div className="card">
            <div className="tag-pill">Разбивка</div>
            <div className="result-breakdown">
              {finalResult.breakdown.map((item, i) => (
                <div key={i} className="result-breakdown-row">
                  <span className="result-breakdown-label">{item.label}</span>
                  <span className="result-breakdown-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions">
          <button className="result-btn secondary" onClick={onRetry}>
            Перепройти
          </button>
          <button className="result-btn primary" onClick={onDone}>
            К тестам <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </>
  )
}

// ============ КАРТОЧКА ============
function CardScreen({ user, onBack, onOpenPro, onChangeCardTheme }) {
  const [showThemePanel, setShowThemePanel] = useState(false)
  const allTests = user.categories.flatMap((c) => c.tests)
  const positionText = user.positions.length > 0 ? user.positions.join(' / ') : '—'
  const ovr = calculateOVR(user.categories, user.positions)

  const cardMetrics = [
    { code: 'B-IQ', value: allTests.find((t) => t.id === 'b-iq-base')?.score ?? null },
    { code: 'SHT', value: allTests.find((t) => t.id === 'sht-base')?.score ?? null },
    { code: 'DRBL', value: allTests.find((t) => t.id === 'drbl-base')?.score ?? null },
    { code: 'ATL', value: allTests.find((t) => t.id === 'atl-base')?.score ?? null },
  ]

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
          <h2 className="screen-head-title">Моя карточка</h2>
        </div>
        <button className="icon-btn pill" onClick={() => setShowThemePanel(true)}>🎨 Тема</button>
      </div>

      <div className={`player-card card-theme-${user.cardTheme}`}>
        <div className="card-top">
          <div className="card-ovr">{ovr !== null ? ovr : '—'}</div>
          <div className="card-pos">{positionText}</div>
        </div>
        <div className="card-center">
          <div className="card-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
            ) : (
              user.avatarLetter
            )}
          </div>
          <div className="card-name">
            {user.username}
            {user.plan === 'pro' && <span className="pro-badge">PRO</span>}
          </div>
        </div>
        <div className="card-metrics">
          {cardMetrics.map((m) => (
            <div key={m.code} className="card-metric">
              <div className="card-metric-code">{m.code}</div>
              <div className="card-metric-value">{m.value !== null ? m.value : '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {user.plan === 'free' && (
        <div className="pro-promo card-promo" onClick={onOpenPro}>
          <div className="pro-promo-icon">✨</div>
          <div className="pro-promo-text">
            <div className="pro-promo-title">С PRO-карточкой результаты точнее</div>
            <div className="pro-promo-sub">Больше тестов, история и тренировки</div>
          </div>
          <div className="pro-promo-arrow">→</div>
        </div>
      )}

      {showThemePanel && (
        <div className="theme-panel-overlay" onClick={() => setShowThemePanel(false)}>
          <div className="theme-panel" onClick={(e) => e.stopPropagation()}>
            <div className="theme-panel-handle" />
            <h3 className="theme-panel-title">Тема карточки</h3>
            <p className="theme-panel-sub">Выбери цвет</p>
            <div className="theme-panel-grid">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-panel-item ${user.cardTheme === t.id ? 'active' : ''}`}
                  onClick={() => onChangeCardTheme(t.id)}
                >
                  <div className="theme-panel-preview" style={{ background: t.color }} />
                  <span className="theme-panel-icon">{t.icon}</span>
                  <span className="theme-panel-label">{t.label}</span>
                  {user.cardTheme === t.id && <span className="theme-panel-check">✓</span>}
                </button>
              ))}
            </div>
            <button className="theme-panel-close" onClick={() => setShowThemePanel(false)}>Готово</button>
          </div>
        </div>
      )}
    </>
  )
}

// ============ ЗАГЛУШКА ============
function CalendarScreen() {
  return (
    <div className="placeholder-screen">
      <div className="placeholder-icon">📅</div>
      <h2>Календарь</h2>
      <p>Программа появится автоматически после теста</p>
    </div>
  )
}

// ============ ПРОФИЛЬ ============
function ProfileScreen({ user, onReset, onOpenPro, onChangeTheme }) {
  const [showThemePanel, setShowThemePanel] = useState(false)

  const allTests = user.categories.flatMap((c) => c.tests)
  const totalDone = allTests.filter((t) => t.status === 'done').length
  const totalFree = allTests.filter((t) => t.plan === 'free').length
  const positionText = user.positions.length > 0 ? user.positions.join(' · ') : '—'
  const progressPercent = totalFree > 0 ? (totalDone / totalFree) * 100 : 0

  return (
    <div className="profile-screen">
      <div className="profile-head">
        <h1 className="profile-head-title">Профиль</h1>
        <div className="profile-head-right">
          <button className="icon-btn pill theme-btn" onClick={() => setShowThemePanel(true)}>
            🎨 Тема
          </button>
          {user.plan === 'pro' ? (
            <span className="profile-plan-pill pro">PRO</span>
          ) : (
            <button className="profile-plan-pill clickable" onClick={onOpenPro}>
              FREE
            </button>
          )}
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-card-avatar-wrap">
          <div className="profile-card-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
            ) : (
              user.avatarLetter
            )}
          </div>
          <div className="profile-card-ring" />
        </div>
        <div className="profile-card-info">
          <div className="profile-card-name">{user.username}</div>
          <div className="profile-card-pos">{positionText}</div>
        </div>
      </div>

      <div className="profile-progress-card">
        <div className="profile-progress-top">
          <span className="profile-progress-label">Замеры карточки</span>
          <span className="profile-progress-value">{totalDone} / {totalFree}</span>
        </div>
        <div className="profile-progress-bar">
          <div className="profile-progress-fill" style={{ width: progressPercent + '%' }} />
        </div>
        <div className="profile-progress-hint">
          {totalDone === totalFree ? '🎉 Все тесты пройдены' : `Осталось: ${totalFree - totalDone}`}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-grid-item">
          <span className="profile-grid-icon">📏</span>
          <div className="profile-grid-value">{user.height || '—'}</div>
          <div className="profile-grid-label">Рост, см</div>
        </div>
        <div className="profile-grid-item">
          <span className="profile-grid-icon">⚖️</span>
          <div className="profile-grid-value">{user.weight || '—'}</div>
          <div className="profile-grid-label">Вес, кг</div>
        </div>
        <div className="profile-grid-item">
          <span className="profile-grid-icon">🎂</span>
          <div className="profile-grid-value">{user.age || '—'}</div>
          <div className="profile-grid-label">Возраст</div>
        </div>
        <div className="profile-grid-item">
          <span className="profile-grid-icon">🏀</span>
          <div className="profile-grid-value">Баскет</div>
          <div className="profile-grid-label">Спорт</div>
        </div>
      </div>

      <div className="profile-achievements">
        <div className="profile-achievements-head">
          <span className="profile-achievements-title">Достижения</span>
          <span className="profile-achievements-count">
            {Math.min(2, Math.floor(totalDone / 2))} / 6
          </span>
        </div>
        <div className="profile-achievements-grid">
          <div className={`achievement ${totalDone >= 1 ? 'unlocked' : ''}`}>
            <span className="achievement-icon">🎯</span>
            <span className="achievement-label">Первый замер</span>
          </div>
          <div className={`achievement ${totalDone >= 2 ? 'unlocked' : ''}`}>
            <span className="achievement-icon">🔥</span>
            <span className="achievement-label">2 теста</span>
          </div>
          <div className={`achievement ${totalDone >= 4 ? 'unlocked' : ''}`}>
            <span className="achievement-icon">🏆</span>
            <span className="achievement-label">Все free</span>
          </div>
          <div className="achievement">
            <span className="achievement-icon">⚡</span>
            <span className="achievement-label">Скорость</span>
          </div>
          <div className="achievement">
            <span className="achievement-icon">💎</span>
            <span className="achievement-label">100 OVR</span>
          </div>
          <div className="achievement">
            <span className="achievement-icon">👑</span>
            <span className="achievement-label">PRO</span>
          </div>
        </div>
      </div>

      <button className="profile-reset" onClick={onReset}>
        Сбросить и начать заново
      </button>

      {showThemePanel && (
        <div className="theme-panel-overlay" onClick={() => setShowThemePanel(false)}>
          <div className="theme-panel" onClick={(e) => e.stopPropagation()}>
            <div className="theme-panel-handle" />
            <h3 className="theme-panel-title">Тема приложения</h3>
            <p className="theme-panel-sub">Меняет весь интерфейс</p>
            <div className="theme-panel-grid">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-panel-item ${user.theme === t.id ? 'active' : ''}`}
                  onClick={() => onChangeTheme(t.id)}
                >
                  <div className="theme-panel-preview" style={{ background: t.color }} />
                  <span className="theme-panel-icon">{t.icon}</span>
                  <span className="theme-panel-label">{t.label}</span>
                  {user.theme === t.id && <span className="theme-panel-check">✓</span>}
                </button>
              ))}
            </div>
            <button className="theme-panel-close" onClick={() => setShowThemePanel(false)}>Готово</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ PRO ============
function ProScreen({ user, onBack }) {
  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
        </div>
        <span className="screen-head-pill pro">PRO</span>
      </div>

      <div className="pro-hero">
        <div className="pro-hero-icon">🏆</div>
        <h1 className="pro-hero-title pro-hero-title-animated">Прокачай свою карточку</h1>
        <p className="pro-hero-sub">PRO — это больше данных о твоей игре. Точнее карточка. Честнее OVR.</p>
      </div>

      <div className="pro-features">
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Расширенные тесты</div>
            <div className="pro-feature-sub">Ещё 6 тестов: точность штрафных, дриблинг под давлением, реакция, выносливость.</div>
          </div>
        </div>
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Персональные тренировки</div>
            <div className="pro-feature-sub">Программа под твои слабые места. Что тренировать — подскажет приложение.</div>
          </div>
        </div>
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Сравнение с профи</div>
            <div className="pro-feature-sub">Узнай, насколько ты близок к уровню NCAA, Евролиги и NBA.</div>
          </div>
        </div>
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">История прогресса</div>
            <div className="pro-feature-sub">Графики и динамика месяц за месяцем.</div>
          </div>
        </div>
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Расширенная статистика</div>
            <div className="pro-feature-sub">Средние по позиции, лучшие и слабые стороны.</div>
          </div>
        </div>
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Сравнение с друзьями</div>
            <div className="pro-feature-sub">Добавляй друзей по нику и сравнивай карточки.</div>
          </div>
        </div>
      </div>

      <div className="pro-reasons">
        <div className="pro-reasons-title">Зачем это тебе</div>
        <p className="pro-reasons-text">
          Чем больше замеров — тем точнее карточка отражает твой реальный уровень.
          PRO раскрывает тебя полностью: больше навыков, сравнение с профи,
          история прогресса и персональные тренировки, чтобы расти быстрее.
        </p>
      </div>

      {user.plan === 'pro' ? (
        <div className="pro-active">✓ PRO активна</div>
      ) : (
        <button className="pro-cta" onClick={() => alert('Оплата появится позже')}>Оформить PRO</button>
      )}
      <p className="pro-note">Оплата появится позже</p>
    </>
  )
}

// ============ ГЛАВНЫЙ ============
function App() {
  const [user, setUser] = useState(DEFAULT_USER)
  const [registered, setRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [showCard, setShowCard] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [runningTest, setRunningTest] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Telegram WebApp: отладка + подтягивание данных
  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp
      const debugInfo = {
        hasTelegram: !!tg,
        hasInitData: !!tg?.initData,
        initDataLength: tg?.initData?.length || 0,
        user: tg?.initDataUnsafe?.user || null,
        platform: tg?.platform || 'unknown',
      }
      alert('DEBUG:\n' + JSON.stringify(debugInfo, null, 2))

      if (!tg) return

      tg.ready()
      tg.expand()
      tg.disableVerticalSwipes?.()

      const tgUser = tg.initDataUnsafe?.user
      if (tgUser) {
        setUser((prev) => ({
          ...prev,
          username: tgUser.username ? `@${tgUser.username}` : (tgUser.first_name || prev.username),
          avatarLetter: (tgUser.first_name || 'P')[0].toUpperCase(),
          avatarUrl: tgUser.photo_url || null,
        }))
      }
    } catch (err) {
      alert('ERROR: ' + err.message)
    }
  }, [])

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEYS.registered)
      const u = localStorage.getItem(STORAGE_KEYS.user)
      if (r === 'true' && u) {
        const parsed = JSON.parse(u)
        setUser({
          ...DEFAULT_USER,
          ...parsed,
          categories: parsed.categories || freshCategories(),
        })
        setRegistered(true)
      } else {
        setUser({ ...DEFAULT_USER, categories: freshCategories() })
      }
    } catch (err) {
      console.warn(err)
      setUser({ ...DEFAULT_USER, categories: freshCategories() })
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEYS.registered, String(registered))
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    } catch (err) { console.warn(err) }
  }, [user, registered, loaded])

  useEffect(() => {
    document.body.setAttribute('data-theme', user.theme || 'classic')
  }, [user.theme])

  function goToTab(tab) {
    setActiveTab(tab)
    setShowCard(false)
    setShowPro(false)
    setRunningTest(null)
  }

  function handleRegistration(data) {
    setUser((prev) => ({ ...prev, ...data, categories: freshCategories() }))
    setRegistered(true)
  }

  function handleReset() {
    if (!window.confirm('Точно сбросить все данные?')) return
    localStorage.removeItem(STORAGE_KEYS.registered)
    localStorage.removeItem(STORAGE_KEYS.user)

    const cleanCats = freshCategories()
    cleanCats[0].tests[0].status = 'active'
    cleanCats[0].tests[0].score = null
    cleanCats[1].tests[0].status = 'pending'
    cleanCats[1].tests[0].score = null
    cleanCats[2].tests[0].status = 'pending'
    cleanCats[2].tests[0].score = null
    cleanCats[3].tests[0].status = 'pending'
    cleanCats[3].tests[0].score = null

    setUser({
      ...DEFAULT_USER,
      username: user.username && user.username !== '@player' ? user.username : '@player',
      avatarLetter: user.avatarLetter || 'P',
      avatarUrl: user.avatarUrl || null,
      categories: cleanCats,
    })
    setRegistered(false)
    setActiveTab('home')
    setShowCard(false)
    setShowPro(false)
    setRunningTest(null)
  }

  function handleChangeTheme(themeId) { setUser((prev) => ({ ...prev, theme: themeId })) }
  function handleChangeCardTheme(themeId) { setUser((prev) => ({ ...prev, cardTheme: themeId })) }

  function findTest(testId) {
    for (const cat of user.categories) {
      const t = cat.tests.find((x) => x.id === testId)
      if (t) return { test: t, category: cat }
    }
    return null
  }

  function handleSaveTestResult(testId, score) {
    setUser((prev) => {
      const newCategories = prev.categories.map((cat) => {
        const hasTest = cat.tests.some((t) => t.id === testId)
        if (!hasTest) return cat
        const newTests = cat.tests.map((t) =>
          t.id === testId ? { ...t, status: 'done', score } : t
        )
        const hasActive = newTests.some((t) => t.status === 'active')
        if (!hasActive) {
          const nextIdx = newTests.findIndex((t) => t.status === 'pending' && t.plan === 'free')
          if (nextIdx !== -1) {
            newTests[nextIdx] = { ...newTests[nextIdx], status: 'active' }
          }
        }
        return { ...cat, tests: newTests }
      })
      const anyActive = newCategories.some((cat) => cat.tests.some((t) => t.status === 'active'))
      if (!anyActive) {
        for (let i = 0; i < newCategories.length; i++) {
          const idx = newCategories[i].tests.findIndex((t) => t.status === 'pending' && t.plan === 'free')
          if (idx !== -1) {
            newCategories[i].tests[idx] = { ...newCategories[i].tests[idx], status: 'active' }
            break
          }
        }
      }
      return { ...prev, categories: newCategories }
    })
    setRunningTest(null)
    setActiveTab('home')
  }

  if (!loaded) return <div className="app" />

  if (!registered) {
    return (
      <div className="app">
        <RegistrationScreen onComplete={handleRegistration} />
      </div>
    )
  }

  const runningTestInfo = runningTest ? findTest(runningTest) : null

  return (
    <div className="app">
      {showPro ? (
        <ProScreen user={user} onBack={() => setShowPro(false)} />
      ) : runningTestInfo ? (
        <TestRunScreen
          testId={runningTest}
          testTitle={runningTestInfo.test.title}
          user={user}
          onBack={() => setRunningTest(null)}
          onSave={handleSaveTestResult}
          onGoHome={() => { setRunningTest(null); setActiveTab('home') }}
          onOpenProfile={() => { setRunningTest(null); setActiveTab('profile') }}
        />
      ) : showCard ? (
        <CardScreen user={user} onBack={() => setShowCard(false)} onOpenPro={() => setShowPro(true)} onChangeCardTheme={handleChangeCardTheme} />
      ) : (
        <>
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              onOpenCard={() => setShowCard(true)}
              onOpenPro={() => setShowPro(true)}
              onStartTest={(id) => setRunningTest(id)}
              onOpenTests={() => setActiveTab('test')}
            />
          )}
          {activeTab === 'test' && (
            <TestsScreen user={user} onOpenPro={() => setShowPro(true)} onStartTest={(id) => setRunningTest(id)} />
          )}
          {activeTab === 'calendar' && <CalendarScreen />}
          {activeTab === 'profile' && (
            <ProfileScreen user={user} onReset={handleReset} onOpenPro={() => setShowPro(true)} onChangeTheme={handleChangeTheme} />
          )}
        </>
      )}

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'calendar' && !showCard && !showPro && !runningTest ? 'active' : ''}`} onClick={() => goToTab('calendar')}>
          <span className="nav-icon">📅</span><span className="nav-label">Календарь</span>
        </button>
        <button className={`nav-item ${activeTab === 'home' && !showCard && !showPro && !runningTest ? 'active' : ''}`} onClick={() => goToTab('home')}>
          <span className="nav-icon">🏠</span><span className="nav-label">Главная</span>
        </button>
        <button className={`nav-item ${activeTab === 'test' && !showCard && !showPro && !runningTest ? 'active' : ''}`} onClick={() => goToTab('test')}>
          <span className="nav-icon">🎯</span><span className="nav-label">Тест</span>
        </button>
        <button className={`nav-item ${activeTab === 'profile' && !showCard && !showPro && !runningTest ? 'active' : ''}`} onClick={() => goToTab('profile')}>
          <span className="nav-icon">👤</span><span className="nav-label">Профиль</span>
        </button>
      </nav>
    </div>
  )
}

export default App