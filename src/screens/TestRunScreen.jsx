import { useState, useEffect, useRef } from 'react'
import { getQuestionsForPositions, getTestDescription } from '../iqQuestions'
import { calculateFinalScore } from '../data/ovr'
import { IQBrainIcon } from '../components/Icons'
import {
  getTestProgress,
  saveTestProgress,
  clearTestProgress,
} from '../utils/testProgress'
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
  const savedProgress = useRef(getTestProgress(testId)).current

  const [phase, setPhase] = useState(savedProgress?.phase || 'safety')
  const [finalResult, setFinalResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showTimer, setShowTimer] = useState(false)
  const [result, setResult] = useState(savedProgress?.result || '')

  const [iqQuestions, setIqQuestions] = useState([])
  const [iqIndex, setIqIndex] = useState(savedProgress?.iqIndex || 0)
  const [iqAnswers, setIqAnswers] = useState(savedProgress?.iqAnswers || [])

  const [blockIndex, setBlockIndex] = useState(savedProgress?.blockIndex || 0)
  const [blockScores, setBlockScores] = useState(savedProgress?.blockScores || [])
  const [blockInputs, setBlockInputs] = useState(savedProgress?.blockInputs || {})

  const [dribbleTaskIndex, setDribbleTaskIndex] = useState(savedProgress?.dribbleTaskIndex || 0)
  const [dribbleData, setDribbleData] = useState(savedProgress?.dribbleData || {})
  const [dribbleInputCount, setDribbleInputCount] = useState(savedProgress?.dribbleInputCount || '')
  const [dribbleInputLosses, setDribbleInputLosses] = useState(savedProgress?.dribbleInputLosses ?? null)

  const [atletIndex, setAtletIndex] = useState(savedProgress?.atletIndex || 0)
  const [atletData, setAtletData] = useState(savedProgress?.atletData || {})
  const [atletInput, setAtletInput] = useState(savedProgress?.atletInput || '')

  const isIQ = testId === 'b-iq-base'
  const isDribble = testId === 'drbl-base' || testId === 'drbl-pressure' || testId === 'drbl-hands'
  const isAtlet = testId === 'atl-base' || testId === 'atl-jump' || testId === 'atl-run' || testId === 'atl-endurance'
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
    if (!showTimer) return
    if (timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, timeLeft, showTimer])

  useEffect(() => {
    if (phase === 'result') return
    if (
      phase === 'safety' &&
      iqIndex === 0 &&
      blockIndex === 0 &&
      dribbleTaskIndex === 0 &&
      atletIndex === 0 &&
      !savedProgress
    ) {
      return
    }

    saveTestProgress(testId, {
      phase,
      iqIndex,
      iqAnswers,
      blockIndex,
      blockScores,
      blockInputs,
      dribbleTaskIndex,
      dribbleData,
      dribbleInputCount,
      dribbleInputLosses,
      atletIndex,
      atletData,
      atletInput,
      result,
    })
  }, [
    phase, iqIndex, iqAnswers, blockIndex, blockScores, blockInputs,
    dribbleTaskIndex, dribbleData, dribbleInputCount, dribbleInputLosses,
    atletIndex, atletData, atletInput, result, testId, savedProgress,
  ])

  function handleBack() {
    if (isIQ) {
      if (phase === 'running' && iqIndex > 0) {
        setIqIndex(iqIndex - 1)
        setIqAnswers(iqAnswers.slice(0, -1))
        return
      }
      if (phase === 'running' && iqIndex === 0) {
        setPhase('intro')
        return
      }
      if (phase === 'intro') {
        setPhase('safety')
        return
      }
      if (phase === 'safety') {
        onBack()
        return
      }
    }

    if (hasBlocks) {
      if (phase === 'input' && blockIndex > 0) {
        setBlockIndex(blockIndex - 1)
        setBlockScores(blockScores.slice(0, -1))
        return
      }
      if (phase === 'input' && blockIndex === 0) {
        setPhase('intro')
        return
      }
      if (phase === 'intro') {
        setPhase('safety')
        return
      }
      if (phase === 'safety') {
        onBack()
        return
      }
    }

    if (isDribble) {
      if ((phase === 'running' || phase === 'input') && dribbleTaskIndex > 0) {
        setDribbleTaskIndex(dribbleTaskIndex - 1)
        const prevTask = desc.tasks[dribbleTaskIndex - 1]
        const prevData = dribbleData[prevTask.id]
        if (prevData) {
          setDribbleInputCount(String(prevData.count))
          setDribbleInputLosses(prevData.losses ?? null)
        }
        setPhase('input')
        return
      }
      if ((phase === 'running' || phase === 'input') && dribbleTaskIndex === 0) {
        setPhase('intro')
        return
      }
      if (phase === 'intro') {
        setPhase('safety')
        return
      }
      if (phase === 'safety') {
        onBack()
        return
      }
    }

    if (isAtlet) {
      if (phase === 'input' && atletIndex > 0) {
        setAtletIndex(atletIndex - 1)
        const prevTask = desc.tasks[atletIndex - 1]
        const prevVal = atletData[prevTask.id]
        setAtletInput(prevVal !== undefined ? String(prevVal) : '')
        return
      }
      if (phase === 'input' && atletIndex === 0) {
        setPhase('intro')
        return
      }
      if (phase === 'intro') {
        setPhase('safety')
        return
      }
      if (phase === 'safety') {
        onBack()
        return
      }
    }

    onBack()
  }

  const showBackButton = (() => {
    if (isIQ) return phase === 'running' || phase === 'intro' || phase === 'safety'
    if (hasBlocks) return phase === 'input' || phase === 'intro' || phase === 'safety'
    if (isDribble) return phase === 'running' || phase === 'input' || phase === 'intro' || phase === 'safety'
    if (isAtlet) return phase === 'input' || phase === 'intro' || phase === 'safety'
    return phase === 'input' || phase === 'intro' || phase === 'safety'
  })()

  const backButtonText = (() => {
    if (phase === 'safety') return '← Назад к тестам'
    if (phase === 'intro') return '← Назад'
    if (isIQ && iqIndex === 0) return '← Назад к интро'
    if (hasBlocks && blockIndex === 0) return '← Назад к интро'
    if (isDribble && dribbleTaskIndex === 0) return '← Назад к интро'
    if (isAtlet && atletIndex === 0) return '← Назад к интро'
    return '← Прошлое задание'
  })()

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
        clearTestProgress(testId)
      }
      return
    }

    // ========== ДРИБЛИНГ ==========
    if (isDribble) {
      const isBaseDribble = testId === 'drbl-base'
      const count = Number(dribbleInputCount)

      if (isNaN(count) || dribbleInputCount === '') {
        alert(isBaseDribble ? 'Введи количество отскоков' : 'Введи результат')
        return
      }
      if (count < 0 || count > (desc.max || 200)) {
        alert(`Введи число от 0 до ${desc.max || 200}`)
        return
      }

      if (isBaseDribble && dribbleInputLosses === null) {
        alert('Выбери количество потерь')
        return
      }

      const currentTask = desc.tasks[dribbleTaskIndex]
      const taskData = isBaseDribble
        ? { count, losses: dribbleInputLosses }
        : { count }

      const newData = { ...dribbleData, [currentTask.id]: taskData }
      setDribbleData(newData)

      if (dribbleTaskIndex + 1 < desc.tasks.length) {
        setDribbleTaskIndex(dribbleTaskIndex + 1)
        setDribbleInputCount('')
        setDribbleInputLosses(null)
        setTimeLeft(30)
        setShowTimer(false)
        setPhase('running')
        return
      }

      const scores = desc.tasks.map((t) => {
        const d = newData[t.id]
        if (!d) return 0

        if (isBaseDribble) {
          const base = Math.min(100, Math.round((d.count / t.norm) * 100))
          const penalty = d.losses * 3
          return Math.max(0, base - penalty)
        }

        if (t.direction === 'higher') {
          return Math.min(100, Math.round((d.count / t.norm) * 100))
        }

        const losses = d.count
        if (losses === 0) return 100
        if (losses >= t.norm) {
          return Math.max(0, Math.round(100 - (losses / t.norm) * 50))
        }
        return Math.round(100 - (losses / t.norm) * 50)
      })

      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

      setFinalResult({
        score: avg,
        breakdown: desc.tasks.map((t) => {
          const d = newData[t.id]
          let displayValue

          if (isBaseDribble) {
            displayValue = `${d.count} отскоков · ${d.losses} ${d.losses === 1 ? 'потеря' : 'потерь'}`
          } else if (t.direction === 'higher') {
            displayValue = `${d.count} касаний`
          } else {
            displayValue = `${d.count} ${d.count === 1 ? 'потеря' : 'потерь'}`
          }

          return {
            label: t.title,
            value: displayValue,
          }
        }),
      })
      setPhase('result')
      clearTestProgress(testId)
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
      if (currentTask.direction === 'lower' && (num < 1 || num > 60)) {
        alert('Введи время от 1 до 60 секунд')
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
      clearTestProgress(testId)
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
    clearTestProgress(testId)
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
      clearTestProgress(testId)
    }
  }

  function handleResultDone() {
    onSave(testId, finalResult.score)
  }

  function handleResultRetry() {
    clearTestProgress(testId)
    setFinalResult(null)
    setPhase('safety')
    setTimeLeft(30)
    setShowTimer(false)
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
    <div className="screen-head screen-head-minimal">
      <button className="icon-btn" onClick={onBack}>←</button>
      <button className="icon-btn" onClick={onGoHome}>🏠</button>
    </div>
  )

  const introHint = (
    <div className="unified-hint">
      <div className="unified-hint-row">
        <span className="unified-hint-icon">💾</span>
        <span>Можно выходить — прогресс сохранится</span>
      </div>
      {hasBlocks && (
        <div className="unified-hint-row">
          <span className="unified-hint-icon">🎯</span>
          <span>Счёт начинается с первого попавшего мяча</span>
        </div>
      )}
      {desc && desc.tip && (
        <div className="unified-hint-row">
          <span className="unified-hint-icon">💡</span>
          <span>{desc.tip}</span>
        </div>
      )}
    </div>
  )

  const savedHint = savedProgress ? (
    <div className="progress-hint">
      💾 Прогресс сохранён — можешь продолжить
    </div>
  ) : null

  // ========== IQ ==========
  if (isIQ) {
    if (!hasPositions) {
      return (
        <>
          {header}
          <div className="test-run">
            <div className="test-run-icon">
              <IQBrainIcon />
            </div>
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
          <div className="intro-screen">
            <div className="intro-hero">
              <div className="intro-hero-icon">
                <IQBrainIcon />
              </div>
              <h1 className="intro-hero-title">{testTitle}</h1>
              <p className="intro-hero-sub">
                {desc && desc.description
                  ? desc.description
                  : 'Отвечай на игровые ситуации — приложение посчитает твой IQ.'}
              </p>
            </div>

            {savedHint}

            <div className="card intro-card">
              <div className="tag-pill">Что тебя ждёт</div>
              <div className="intro-bullets">
                <div className="intro-bullet">
                  <span className="intro-bullet-check">✓</span>
                  <span>{iqQuestions.length} игровых ситуаций</span>
                </div>
                <div className="intro-bullet">
                  <span className="intro-bullet-check">✓</span>
                  <span>Выбор из 4 вариантов действий</span>
                </div>
                <div className="intro-bullet">
                  <span className="intro-bullet-check">✓</span>
                  <span>Автоматический подсчёт баллов</span>
                </div>
              </div>
            </div>

            {introHint}

            <div className="intro-actions">
              <button className="bottom-cta-inline" onClick={() => setPhase('running')}>
                {iqIndex > 0 ? 'Продолжить' : 'Начать'} <span className="arrow">→</span>
              </button>
              {showBackButton && (
                <button className="back-btn" onClick={handleBack}>
                  {backButtonText}
                </button>
              )}
            </div>
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
            <span className="iq-progress-label">
              Вопрос {iqIndex + 1} из {iqQuestions.length}
            </span>
            <div className="iq-progress-bar">
              <div className="iq-progress-fill" style={{ width: progressPercent + '%' }} />
            </div>
          </div>

          <div key={iqIndex} className="iq-question-enter">
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

          {iqIndex > 0 && (
            <button className="back-btn" onClick={handleBack}>
              {backButtonText}
            </button>
          )}
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
          <div className="intro-actions">
            <button className="bottom-cta-inline" onClick={() => setPhase('intro')}>
              Продолжить <span className="arrow">→</span>
            </button>
            <button className="back-btn" onClick={handleBack}>
              {backButtonText}
            </button>
          </div>
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
        <div className="intro-screen">
          <div className="intro-hero">
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

          {savedHint}

          {desc.bullets && desc.bullets.length > 0 && (
            <div className="card intro-card">
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

          {introHint}

          <div className="intro-actions">
            <button
              className="bottom-cta-inline"
              onClick={() => {
                if (hasBlocks) setPhase('input')
                else if (isDribble) {
                  if (dribbleTaskIndex === 0 && !dribbleData[desc.tasks[0].id]) {
                    setDribbleTaskIndex(0)
                    setDribbleInputCount('')
                    setDribbleInputLosses(null)
                    setTimeLeft(30)
                    setShowTimer(false)
                    setPhase('running')
                  } else {
                    setPhase('input')
                  }
                } else if (isAtlet) {
                  setAtletIndex(0)
                  setAtletInput('')
                  setPhase('input')
                } else if (desc.hasTimer) {
                  setPhase('running')
                  setTimeLeft(30)
                  setShowTimer(false)
                } else setPhase('input')
              }}
            >
              {savedProgress ? 'Продолжить' : 'Начать'} <span className="arrow">→</span>
            </button>

            <button className="back-btn" onClick={handleBack}>
              {backButtonText}
            </button>
          </div>
        </div>
      </>
    )
  }

  // ========== TIMER ==========
  if (phase === 'running') {
    const totalSeconds = 30
    const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100
    const isDone = timeLeft <= 0

    return (
      <>
        {header}
        <div className="running-screen">
          {showTimer && (
            <div className="timer-card">
              <div className="timer-card-top">
                <span className="timer-card-icon">⏱️</span>
                <span className="timer-card-label">
                  {isDone ? 'Время вышло!' : `Осталось: ${timeLeft} сек`}
                </span>
              </div>
              <div className="timer-card-bar">
                <div
                  className="timer-card-fill"
                  style={{ width: progressPercent + '%' }}
                />
              </div>
            </div>
          )}

          <div className="running-content">
            <h2 className="running-title">
              {isDribble && desc.tasks
                ? desc.tasks[dribbleTaskIndex]?.title
                : 'Выполняй упражнение'}
            </h2>
            <p className="running-sub">
              {isDribble
                ? 'Считай отскоки и потери. Закончил — нажми кнопку.'
                : 'Выполняй упражнение. Закончил — нажми кнопку.'}
            </p>
          </div>

          <div className="intro-actions">
            <button
              className="timer-toggle-btn"
              onClick={() => setShowTimer(!showTimer)}
            >
              {showTimer ? '⏸️ Скрыть таймер' : '⏱️ Включить таймер'}
            </button>

            <button
              className="bottom-cta-inline"
              onClick={() => setPhase('input')}
            >
              Закончил <span className="arrow">→</span>
            </button>

            {dribbleTaskIndex > 0 && (
              <button className="back-btn" onClick={handleBack}>
                {backButtonText}
              </button>
            )}
          </div>
        </div>
      </>
    )
  }

  // ========== INPUT ==========
  if (phase === 'input') {
    // БРОСОК
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
          <div className="block-screen" key={`block-${blockIndex}`}>
            <div className="block-enter">
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

              <div className="intro-actions">
                <button
                  className={`bottom-cta-inline ${allFilled ? '' : 'disabled'}`}
                  onClick={handleSave}
                  disabled={!allFilled}
                >
                  {blockIndex + 1 < desc.blocks.length ? 'Следующий блок' : 'Завершить'}
                  <span className="arrow">→</span>
                </button>

                <button className="back-btn" onClick={handleBack}>
                  {backButtonText}
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }

    // ДРИБЛИНГ
    if (isDribble) {
      const currentTask = desc.tasks[dribbleTaskIndex]
      const progressSegments = desc.tasks.map((_, i) => i <= dribbleTaskIndex)
      const isBaseDribble = testId === 'drbl-base'

      const allFilled = isBaseDribble
        ? dribbleInputCount !== '' && dribbleInputLosses !== null
        : dribbleInputCount !== ''

      return (
        <>
          {header}
          <div className="block-screen" key={`dribble-${dribbleTaskIndex}`}>
            <div className="block-enter">
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
                <h2 className="card-title">
                  {currentTask.countLabel || currentTask.inputLabel}
                </h2>
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

              {isBaseDribble && (
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
              )}

              <div className="info-note">
                <span className="info-note-icon">ℹ️</span>
                <span className="info-note-text">
                  {isBaseDribble
                    ? 'Возможна погрешность 1–3 касания — это нормально.'
                    : currentTask.norm
                      ? `Норма для твоей позиции: ${currentTask.norm} ${currentTask.unit}. Это уровень 100 баллов.`
                      : 'Честный результат — точный план роста.'}
                </span>
              </div>

              <div className="warning-note">
                <span className="warning-note-icon">⚠️</span>
                <span className="warning-note-text">
                  <strong>Обманывая приложение — ты обманываешь себя.</strong> Честный
                  результат даёт точный план роста.
                </span>
              </div>

              <div className="intro-actions">
                <button
                  className={`bottom-cta-inline ${allFilled ? '' : 'disabled'}`}
                  onClick={handleSave}
                  disabled={!allFilled}
                >
                  {dribbleTaskIndex + 1 < desc.tasks.length ? 'Следующее задание' : 'Завершить'}
                  <span className="arrow">→</span>
                </button>

                <button className="back-btn" onClick={handleBack}>
                  {backButtonText}
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }

    // АТЛЕТИЗМ
    if (isAtlet) {
      const currentTask = desc.tasks[atletIndex]
      const allFilled = atletInput !== ''
      const progressSegments = desc.tasks.map((_, i) => i <= atletIndex)

      return (
        <>
          {header}
          <div className="block-screen" key={`atlet-${atletIndex}`}>
            <div className="block-enter">
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

              <div className="intro-actions">
                <button
                  className={`bottom-cta-inline ${allFilled ? '' : 'disabled'}`}
                  onClick={handleSave}
                  disabled={!allFilled}
                >
                  {atletIndex + 1 < desc.tasks.length ? 'Следующее' : 'Завершить'}
                  <span className="arrow">→</span>
                </button>

                <button className="back-btn" onClick={handleBack}>
                  {backButtonText}
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }

    // FALLBACK
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

          <div className="intro-actions">
            <button
              className={`bottom-cta-inline ${result !== '' ? '' : 'disabled'}`}
              onClick={handleSave}
              disabled={result === ''}
            >
              Сохранить <span className="arrow">→</span>
            </button>

            <button className="back-btn" onClick={handleBack}>
              {backButtonText}
            </button>
          </div>
        </div>
      </>
    )
  }

  return null
}