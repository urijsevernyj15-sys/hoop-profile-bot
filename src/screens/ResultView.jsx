export default function ResultView({ header, finalResult, onDone, onRetry }) {
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