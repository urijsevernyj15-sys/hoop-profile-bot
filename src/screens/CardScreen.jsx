import { useState } from 'react'
import { POSITIONS_FULL } from '../data/themes'
import { calculateOVR, calculateDetailedStats } from '../data/ovr'
import {
  IconShooting,
  IconDribbling,
  IconAthleticism,
  IconIQ,
  IconTrophy,
} from '../components/Icons'

// Все редкости по порядку
const RARITIES = [
  { id: 'bronze', label: 'БРОНЗА',  color: '#CD7F32', minOvr: 0,  icon: '🥉' },
  { id: 'silver', label: 'СЕРЕБРО', color: '#C0C0C0', minOvr: 50, icon: '🥈' },
  { id: 'gold',   label: 'ЗОЛОТО',  color: '#FFD700', minOvr: 70, icon: '🥇' },
  { id: 'elite',  label: 'ЭЛИТА',   color: '#8B5CF6', minOvr: 85, icon: '💜' },
  { id: 'legend', label: 'ЛЕГЕНДА', color: '#FF6B1A', minOvr: 95, icon: '🔥' },
]

// Определяем редкость по OVR (для отображения)
function getRarityByOvr(ovr) {
  if (ovr === null) return RARITIES[0]
  if (ovr >= 95) return RARITIES[4]
  if (ovr >= 85) return RARITIES[3]
  if (ovr >= 70) return RARITIES[2]
  if (ovr >= 50) return RARITIES[1]
  return RARITIES[0]
}

// Какие редкости доступны пользователю (не выше его OVR)
function getAvailableRarities(ovr) {
  const current = ovr === null ? 0 : ovr
  return RARITIES.filter((r) => r.minOvr <= current)
}

// Иконка метрики
function getMetricIcon(code, size = 14) {
  switch (code) {
    case 'B-IQ': return <IconIQ size={size} />
    case 'SHT':  return <IconShooting size={size} />
    case '3PT':  return <IconShooting size={size} />
    case '2PT':  return <IconShooting size={size} />
    case 'FIN':  return <IconTrophy size={size} />
    case 'DRBL': return <IconDribbling size={size} />
    case 'ATL':  return <IconAthleticism size={size} />
    default:     return null
  }
}

export default function CardScreen({ user, onBack, onOpenPro, onSaveProfile }) {
  const [showRarityPanel, setShowRarityPanel] = useState(false)

  const ovr = calculateOVR(user.categories, user.positions)
  const detailed = calculateDetailedStats(user.categories, user.positions)

  // Какую редкость показываем сейчас
  const savedRarityId = user.cardRarity || null
  // Если сохранённая редкость доступна — показываем её
  // Иначе — берём по OVR
  const availableRarities = getAvailableRarities(ovr)
  const availableIds = availableRarities.map((r) => r.id)
  const effectiveRarity = savedRarityId && availableIds.includes(savedRarityId)
    ? RARITIES.find((r) => r.id === savedRarityId)
    : getRarityByOvr(ovr)
  const rarity = effectiveRarity

  const isPro = user.plan === 'pro'

  // Группы метрик
  const universalMetrics = [
    { code: 'B-IQ', value: detailed['b-iq'] },
    { code: 'DRBL', value: detailed.drbl },
    { code: 'ATL',  value: detailed.atl },
  ]

  const shootingMetrics = [
    { code: 'SHT', value: detailed.sht },
    { code: '3PT', value: detailed.threePt },
    { code: '2PT', value: detailed.twoPt },
    { code: 'FIN', value: detailed.fin },
  ]

  const freeMetrics = [
    { code: 'B-IQ', value: detailed['b-iq'] },
    { code: 'SHT',  value: detailed.sht },
    { code: 'DRBL', value: detailed.drbl },
    { code: 'ATL',  value: detailed.atl },
  ]

  const primaryPos = user.positions[0]
    ? POSITIONS_FULL[user.positions[0]] || user.positions[0]
    : null
  const secondaryPos = user.positions[1]
    ? POSITIONS_FULL[user.positions[1]] || user.positions[1]
    : null

  const allTests = user.categories.flatMap((c) => c.tests)
  const freeDone = allTests.filter((t) => t.status === 'done' && t.plan === 'free').length
  const freeTotal = allTests.filter((t) => t.plan === 'free').length
  const progressPercent = freeTotal > 0 ? (freeDone / freeTotal) * 100 : 0

  function handleSelectRarity(id) {
    onSaveProfile({ cardRarity: id })
    setShowRarityPanel(false)
  }

  function handleResetRarity() {
    onSaveProfile({ cardRarity: null })
    setShowRarityPanel(false)
  }

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
          <h2 className="screen-head-title">Моя карточка</h2>
        </div>
        <div className="card-head-actions">
          {isPro ? (
            <span className="head-plan-pill pro">PRO</span>
          ) : (
            <button className="head-plan-pill clickable" onClick={onOpenPro}>
              FREE
            </button>
          )}
          <button
            className="icon-btn pill"
            onClick={() => setShowRarityPanel(true)}
          >
            🎨 Редкость
          </button>
        </div>
      </div>

      {/* ============ КАРТОЧКА ============ */}
      <div className={`card-v3 rarity-${rarity.id}`}>
        <div className="card-v3-glow" />

        <div className="card-v3-rarity-pill">
          <span>{rarity.label}</span>
        </div>

        <div className="card-v3-avatar-block">
          <div className="card-v3-avatar-ring card-v3-avatar-ring-outer" />
          <div className="card-v3-avatar-ring card-v3-avatar-ring-inner" />
          <div className="card-v3-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
            ) : (
              user.avatarLetter
            )}
          </div>
        </div>

        <div className="card-v3-name-block">
          <div className="card-v3-name">
            {user.username}
            {isPro && <span className="pro-badge">PRO</span>}
          </div>
          {primaryPos && (
            <div className="card-v3-pos">
              {primaryPos}
              {secondaryPos && ` · ${secondaryPos}`}
            </div>
          )}
        </div>

        {isPro ? (
          <>
            <div className="card-v3-group">
              <div className="card-v3-group-title">
                <span className="card-v3-group-line" />
                <span className="card-v3-group-label">Универсальные</span>
                <span className="card-v3-group-line" />
              </div>
              <div className="card-v3-metrics card-v3-metrics-3">
                {universalMetrics.map((m) => (
                  <div key={m.code} className="card-v3-metric">
                    <div className="card-v3-metric-icon">
                      {getMetricIcon(m.code, 14)}
                    </div>
                    <div className="card-v3-metric-code">{m.code}</div>
                    <div className="card-v3-metric-value">
                      {m.value !== null && m.value !== undefined ? m.value : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-v3-group">
              <div className="card-v3-group-title">
                <span className="card-v3-group-line" />
                <span className="card-v3-group-label">Бросок</span>
                <span className="card-v3-group-line" />
              </div>
              <div className="card-v3-metrics card-v3-metrics-4">
                {shootingMetrics.map((m) => (
                  <div key={m.code} className="card-v3-metric">
                    <div className="card-v3-metric-icon">
                      {getMetricIcon(m.code, 14)}
                    </div>
                    <div className="card-v3-metric-code">{m.code}</div>
                    <div className="card-v3-metric-value">
                      {m.value !== null && m.value !== undefined ? m.value : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card-v3-group">
            <div className="card-v3-metrics card-v3-metrics-4">
              {freeMetrics.map((m) => (
                <div key={m.code} className="card-v3-metric">
                  <div className="card-v3-metric-icon">
                    {getMetricIcon(m.code, 14)}
                  </div>
                  <div className="card-v3-metric-code">{m.code}</div>
                  <div className="card-v3-metric-value">
                    {m.value !== null && m.value !== undefined ? m.value : '—'}
                  </div>
                </div>
              ))}
            </div>

            <button className="card-v3-pro-hint" onClick={onOpenPro}>
              <span className="card-v3-pro-hint-lock">🔒</span>
              <span>Открой PRO — 3PT, 2PT, FIN</span>
              <span className="card-v3-pro-hint-arrow">→</span>
            </button>
          </div>
        )}

        <div className="card-v3-ovr-block">
          <div className="card-v3-ovr-rarity-bar" />
          <div className="card-v3-ovr-row">
            {ovr !== null ? (
              <>
                <div className="card-v3-ovr-value">{ovr}</div>
                <div className="card-v3-ovr-label">OVR</div>
              </>
            ) : (
              <>
                <div className="card-v3-ovr-value card-v3-ovr-value-empty">
                  {freeDone}/{freeTotal}
                </div>
                <div className="card-v3-ovr-label">ПРОЙДЕНО ТЕСТОВ</div>
                <div className="card-v3-ovr-progress">
                  <div
                    className="card-v3-ovr-progress-fill"
                    style={{ width: progressPercent + '%' }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============ ПАНЕЛЬ РЕДКОСТИ ============ */}
      {showRarityPanel && (
        <div className="theme-panel-overlay" onClick={() => setShowRarityPanel(false)}>
          <div className="theme-panel" onClick={(e) => e.stopPropagation()}>
            <div className="theme-panel-handle" />
            <h3 className="theme-panel-title">Редкость карточки</h3>
            <p className="theme-panel-sub">
              {ovr !== null
                ? `Твой OVR: ${ovr} · Доступно: ${availableRarities.length} из ${RARITIES.length}`
                : `Пройди все тесты, чтобы открыть редкости`}
            </p>

            <div className="rarity-panel-list">
              {RARITIES.map((r) => {
                const isAvailable = availableIds.includes(r.id)
                const isActive = rarity.id === r.id
                return (
                  <button
                    key={r.id}
                    className={`rarity-panel-item ${isActive ? 'active' : ''} ${!isAvailable ? 'locked' : ''}`}
                    style={{ '--rarity-color': r.color }}
                    onClick={() => isAvailable && handleSelectRarity(r.id)}
                    disabled={!isAvailable}
                  >
                    <span className="rarity-panel-icon">{r.icon}</span>
                    <div className="rarity-panel-info">
                      <div className="rarity-panel-label">{r.label}</div>
                      <div className="rarity-panel-sub">
                        {isAvailable
                          ? `От ${r.minOvr} OVR`
                          : `Нужно ${r.minOvr} OVR`}
                      </div>
                    </div>
                    {!isAvailable && (
                      <span className="rarity-panel-lock">🔒</span>
                    )}
                    {isActive && (
                      <span className="rarity-panel-check">✓</span>
                    )}
                  </button>
                )
              })}
            </div>

            <button
              className="theme-panel-close"
              onClick={() => setShowRarityPanel(false)}
            >
              Готово
            </button>
          </div>
        </div>
      )}
    </>
  )
}