import { useState } from 'react'
import { THEMES } from '../data/themes'

export default function ProfileScreen({
  user,
  onReset,
  onOpenPro,
  onChangeTheme,
  onOpenTrainingSettings,
}) {
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
          <button
            className="icon-btn pill theme-btn"
            onClick={() => setShowThemePanel(true)}
          >
            🎨 Тема
          </button>
          {user.plan === 'pro' ? (
            <span className="profile-plan-pill pro">PRO</span>
          ) : (
            <button
              className="profile-plan-pill clickable"
              onClick={onOpenPro}
            >
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
          <span className="profile-progress-value">
            {totalDone} / {totalFree}
          </span>
        </div>
        <div className="profile-progress-bar">
          <div
            className="profile-progress-fill"
            style={{ width: progressPercent + '%' }}
          />
        </div>
        <div className="profile-progress-hint">
          {totalDone === totalFree
            ? '🎉 Все тесты пройдены'
            : `Осталось: ${totalFree - totalDone}`}
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

      <div
        className={`training-card ${user.plan === 'pro' ? 'unlocked' : 'locked'}`}
        onClick={user.plan === 'pro' ? onOpenTrainingSettings : onOpenPro}
      >
        <div className="training-card-glow" />
        <div className="training-card-top">
          <div className="training-card-icon">
            <span>⚙️</span>
          </div>
          <div className="training-card-badge">
            {user.plan === 'pro' ? (
              <span className="training-card-pill pro">PRO</span>
            ) : (
              <span className="training-card-pill locked">🔒 PRO</span>
            )}
          </div>
        </div>

        <div className="training-card-title">Настройки тренировок</div>
        <div className="training-card-desc">
          {user.plan === 'pro'
            ? 'Цели, инвентарь и уровень нагрузки — план собирается под тебя'
            : 'Выбери цели, инвентарь и уровень. Доступно в PRO-версии'}
        </div>

        <div className="training-card-action">
          {user.plan === 'pro' ? (
            <>
              Открыть <span className="training-card-arrow">→</span>
            </>
          ) : (
            <>
              Разблокировать <span className="training-card-arrow">→</span>
            </>
          )}
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
                  <div
                    className="theme-panel-preview"
                    style={{ background: t.color }}
                  />
                  <span className="theme-panel-icon">{t.icon}</span>
                  <span className="theme-panel-label">{t.label}</span>
                  {user.theme === t.id && (
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
    </div>
  )
}