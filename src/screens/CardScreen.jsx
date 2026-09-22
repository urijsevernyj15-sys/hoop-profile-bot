import { useState } from 'react'
import { THEMES, POSITIONS_FULL } from '../data/themes'
import { calculateOVR } from '../data/ovr'

export default function CardScreen({ user, onBack, onOpenPro, onChangeCardTheme }) {
  const [showThemePanel, setShowThemePanel] = useState(false)

  const allTests = user.categories.flatMap((c) => c.tests)
  const ovr = calculateOVR(user.categories, user.positions)

  const cardMetrics = [
    { code: 'B-IQ', value: allTests.find((t) => t.id === 'b-iq-base')?.score ?? null },
    { code: 'SHT', value: allTests.find((t) => t.id === 'sht-base')?.score ?? null },
    { code: 'DRBL', value: allTests.find((t) => t.id === 'drbl-base')?.score ?? null },
    { code: 'ATL', value: allTests.find((t) => t.id === 'atl-base')?.score ?? null },
  ]

  // Полные названия позиций
  const primaryPos = user.positions[0]
    ? POSITIONS_FULL[user.positions[0]] || user.positions[0]
    : null
  const secondaryPos = user.positions[1]
    ? POSITIONS_FULL[user.positions[1]] || user.positions[1]
    : null

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
          <h2 className="screen-head-title">Моя карточка</h2>
        </div>
        <div className="card-head-actions">
          {user.plan === 'pro' ? (
            <span className="head-plan-pill pro">PRO</span>
          ) : (
            <button
              className="head-plan-pill clickable"
              onClick={onOpenPro}
            >
              FREE
            </button>
          )}
          <button
            className="icon-btn pill"
            onClick={() => setShowThemePanel(true)}
          >
            🎨 Тема
          </button>
        </div>
      </div>

      <div className={`player-card card-theme-${user.cardTheme}`}>
        <div className="card-top">
          <div className="card-ovr">{ovr !== null ? ovr : '—'}</div>
          <div className="card-pos-block">
            {primaryPos ? (
              <>
                <div className="card-pos-primary">{primaryPos}</div>
                {secondaryPos && (
                  <div className="card-pos-secondary">{secondaryPos}</div>
                )}
              </>
            ) : (
              <div className="card-pos-primary">—</div>
            )}
          </div>
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
              <div className="card-metric-value">
                {m.value !== null ? m.value : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

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
                  {user.cardTheme === t.id && (
                    <span className="theme-panel-check">✓</span>
                  )}
                </button>
              ))}
            </div>

            <button
              className="theme-panel-close"
              onClick={() => setShowThemePanel(false)}
            >
              Готово
            </button>
          </div>
        </div>
      )}
    </>
  )
}