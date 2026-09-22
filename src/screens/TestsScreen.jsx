import { useState } from 'react'

export default function TestsScreen({ user, onOpenPro, onStartTest }) {
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
        <p className="tests-subtitle">
          Тесты разработаны профи — чтобы честно определить твой уровень
        </p>
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
          {freeDone === freeTotal
            ? '🎉 Все бесплатные тесты пройдены'
            : `Осталось пройти: ${freeTotal - freeDone}`}
        </div>
      </div>

      <div className="categories-list">
        {user.categories.map((cat) => {
          const isOpen = expanded[cat.id]
          const progress = getProgress(cat)
          const avg = getScore(cat)

          return (
            <div key={cat.id} className="category">
              <button
                className="category-header"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="category-header-left">
                  <div className="category-info">
                    <div className="category-title">{cat.title}</div>
                    <div className="category-progress">
                      <div className="category-progress-bar">
                        <div
                          className="category-progress-fill"
                          style={{ width: progress.percent + '%' }}
                        />
                      </div>
                      <span className="category-progress-text">
                        {progress.done} / {progress.total}
                      </span>
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
                      const isLocked = t.plan === 'pro' && user.plan !== 'pro'
                      return (
                      <button
                        key={t.id}
                        className={`test-item ${t.status} ${isLocked ? 'locked' : ''}`}
                                                onClick={() => {
                          if (isLocked) return onOpenPro()
                          if (t.status === 'locked') {
                            // PRO-тест, у юзера PRO → разблокируем
                            if (user.plan === 'pro') {
                              onStartTest(t.id)
                              return
                            }
                            return
                          }
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
                            <div className="test-score-badge">
                              <span className="check">✓</span>
                              <span>{t.score}</span>
                            </div>
                          )}
                          {t.status === 'active' && !isLocked && (
                            <span className="test-action">Начать →</span>
                          )}
                          {t.status === 'pending' && !isLocked && (
                            <span className="test-action dim">Замерить →</span>
                          )}
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
                {/* ============ КАК СТРОЯТСЯ ТРЕНИРОВКИ ============ */}
        <div className="training-explainer">
          <div className="training-explainer-header">
            <span className="training-explainer-icon">💡</span>
            <h3 className="training-explainer-title">Как строятся тренировки</h3>
          </div>

          <div className="training-explainer-list">
            <div className="training-explainer-item">
              <span className="training-explainer-num">1</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Учитываем твой уровень
                </div>
                <div className="training-explainer-item-text">
                  Новичок — 3 упражнения, любитель — 5, продвинутый — 7.
                  Прогрессия каждую неделю.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">2</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Подбираем под позицию
                </div>
                <div className="training-explainer-item-text">
                  Упражнения заточены под PG, SG, SF, PF или C.
                  Разыгрывающий и центровой тренируются по-разному.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">3</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Учитываем инвентарь
                </div>
                <div className="training-explainer-item-text">
                  Есть только мяч — план подстроится. Есть партнёр — добавим
                  упражнения в паре.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">4</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Режим «Микс» ищет слабые места
                </div>
                <div className="training-explainer-item-text">
                  Робот анализирует твои тесты и подбирает программы, которые
                  прокачают слабые навыки.
                </div>
              </div>
            </div>

            <div className="training-explainer-item">
              <span className="training-explainer-num">5</span>
              <div className="training-explainer-content">
                <div className="training-explainer-item-title">
                  Структура — всегда 3 части
                </div>
                <div className="training-explainer-item-text">
                  🔥 Разминка → 🎯 Основная часть → 🧘 Заминка.
                  Это снижает риск травм и ускоряет прогресс.
                </div>
              </div>
            </div>
          </div>

          <div className="training-explainer-note">
            💪 Регулярность важнее интенсивности. Лучше 3 короткие тренировки в неделю, чем 1 длинная.
          </div>
        </div>
      </div>
    </>
  )
}
