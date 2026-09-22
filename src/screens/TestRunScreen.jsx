import { useState, useEffect } from 'react'
import { getQuestionsForPositions, getTestDescription } from '../iqQuestions'
import { calculateFinalScore } from '../data/ovr'
import ResultView from './ResultView'

export default function TestRunScreen({
  testId,
  testTitle,
  user,
  onBack,
  onSave,
  onGoHome,
  onOpenProfile,
}) {
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
    // ========== БРОСОК ==========
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

    // ========== ДРИБЛИНГ ==========
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

    // ========== АТЛЕТИЗМ ==========
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

    // ========== FALLBACK ==========
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

  // ========== IQ ==========
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
      return (
        <ResultView
          header={header}
          finalResult={finalResult}
          onDone={handleResultDone}
          onRetry={handleResultRetry}
        />
      )
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

  // ========== SAFETY ==========
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

  // ========== RESULT ==========
  if (phase === 'result' && finalResult) {
    return (
      <ResultView
        header={header}
        finalResult={finalResult}
        onDone={handleResultDone}
        onRetry={handleResultRetry}
      />
    )
  }

  // ========== INTRO ==========
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

  // ========== TIMER ==========
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

  // ========== INPUT ==========
  if (phase === 'input') {
    // Бросок
    if (hasBlocks) {
      const block = desc.blocks[blockIndex]
      const currentInputs = blockInputs[blockIndex] || []
      const progressSegments = desc.blocks.map((_, i) => i <= blockIndex)

      function updateInput(pointIdx, value) {
        const newInputs = [...currentInputs]
        newInputs[pointIdx] = value
        setBlockInputs({ ...blockInputs, [blockIndex]: newInputs })
      }

      const allFilled =
        currentInputs.length === block.points.length &&
        currentInputs.every((v) => v !== '' && v !== undefined)

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
              <p className="card-text">
                Бросай с каждой точки по порядку. Записывай попадания отдельно.
              </p>
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

    // Дриблинг
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
              <div className="tag-pill">
                Задание {dribbleTaskIndex + 1} из {desc.tasks.length}
              </div>
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
                <strong>Обманывая приложение — ты обманываешь себя.</strong> Честный
                результат даёт точный план роста.
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

    // Атлетизм
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
              <div className="tag-pill">
                Упражнение {atletIndex + 1} из {desc.tasks.length}
              </div>
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
                Норма для твоей позиции:{' '}
                <strong>
                  {currentTask.norm} {currentTask.unit}
                </strong>
                . Это уровень 100 баллов.
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

    // Fallback
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