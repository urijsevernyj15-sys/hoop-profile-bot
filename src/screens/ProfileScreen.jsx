import { useState } from 'react'
import {
  IconShooting,
  IconFire,
  IconTrophy,
  IconDefense,
  IconAthleticism,
  IconRobot,
  IconTrophy as TrophyIcon,
} from '../components/Icons'

// Иконки достижений (SVG, размер 22)
function AchIcon({ type, size = 22 }) {
  switch (type) {
    case 'first':   return <IconShooting size={size} />
    case 'two':     return <IconFire size={size} />
    case 'all':     return <IconTrophy size={size} />
    case 'speed':   return <IconAthleticism size={size} />
    case 'diamond': return <IconDefense size={size} />
    case 'pro':     return <IconRobot size={size} />
    default:        return null
  }
}

export default function ProfileScreen({
  user,
  onOpenPro,
  onOpenTrainingSettings,
  onOpenSettings,
  onSaveProfile,
}) {
  const [tapCount, setTapCount] = useState(0)
  const [showTapHint, setShowTapHint] = useState(false)

  const allTests = user.categories.flatMap((c) => c.tests)
  const totalDone = allTests.filter((t) => t.status === 'done').length
  const totalFree = allTests.filter((t) => t.plan === 'free').length
  const positionText = user.positions.length > 0 ? user.positions.join(' · ') : '—'
  const progressPercent = totalFree > 0 ? (totalDone / totalFree) * 100 : 0

  // 5 тапов → переключение FREE ↔ PRO
  function handlePlanTap() {
    const next = tapCount + 1
    setTapCount(next)
    setShowTapHint(true)

    if (next >= 5) {
      if (user.plan === 'pro') {
        onSaveProfile({ plan: 'free' })
      } else {
        onSaveProfile({ plan: 'pro' })
      }
      setTapCount(0)
      setShowTapHint(false)
      return
    }

    setTimeout(() => {
      setTapCount(0)
      setShowTapHint(false)
    }, 3000)
  }

  return (
    <div className="profile-screen">
      <div className="profile-head">
        <h1 className="profile-head-title">Профиль</h1>
        <div className="profile-head-right">
          {user.plan === 'pro' ? (
            <button
              className="head-plan-pill pro"
              onClick={handlePlanTap}
              title="5 тапов для переключения на FREE"
            >
              PRO
            </button>
          ) : (
            <button
              className="head-plan-pill clickable"
              onClick={handlePlanTap}
              title="5 тапов для активации PRO"
            >
              FREE
            </button>
          )}
          <button className="icon-btn" onClick={onOpenSettings} title="Настройки">
            ⚙️
          </button>
        </div>
      </div>

      {showTapHint && (
        <div className="tap-hint">
          {user.plan === 'pro'
            ? `Тапни ещё ${5 - tapCount} раз, чтобы отключить PRO`
            : `Тапни ещё ${5 - tapCount} раз, чтобы активировать PRO`}
        </div>
      )}

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
            <span className="achievement-icon">
              <AchIcon type="first" size={26} />
            </span>
            <span className="achievement-label">Первый замер</span>
          </div>
          <div className={`achievement ${totalDone >= 2 ? 'unlocked' : ''}`}>
            <span className="achievement-icon">
              <AchIcon type="two" size={26} />
            </span>
            <span className="achievement-label">2 теста</span>
          </div>
          <div className={`achievement ${totalDone >= 4 ? 'unlocked' : ''}`}>
            <span className="achievement-icon">
              <AchIcon type="all" size={26} />
            </span>
            <span className="achievement-label">Все free</span>
          </div>
          <div className="achievement">
            <span className="achievement-icon">
              <AchIcon type="speed" size={26} />
            </span>
            <span className="achievement-label">Скорость</span>
          </div>
          <div className="achievement">
            <span className="achievement-icon">
              <AchIcon type="diamond" size={26} />
            </span>
            <span className="achievement-label">100 OVR</span>
          </div>
          <div className="achievement">
            <span className="achievement-icon">
              <AchIcon type="pro" size={26} />
            </span>
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
            ? 'Цели, инвентарь и уровень — план собирается под тебя'
            : 'Выбери цели, инвентарь и уровень. Доступно в PRO-версии'}
        </div>

        <div className="training-card-action">
          {user.plan === 'pro' ? (
            <>Открыть <span className="training-card-arrow">→</span></>
          ) : (
            <>Разблокировать <span className="training-card-arrow">→</span></>
          )}
        </div>
      </div>
    </div>
  )
}