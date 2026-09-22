import { calculateOVR } from '../data/ovr'

export default function HomeScreen({ user, onOpenCard, onOpenPro, onStartTest, onOpenTests }) {
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