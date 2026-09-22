import { useState } from 'react'
import { THEMES, POSITIONS } from '../data/themes'
import ConfirmModal from '../components/ConfirmModal'

export default function SettingsScreen({
  user,
  onBack,
  onChangeTheme,
  onSaveProfile,
  onReset,
}) {
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  const [editingPositions, setEditingPositions] = useState(false)
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const [supportExpanded, setSupportExpanded] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  function startEdit(field) {
    setEditingField(field)
    setTempValue(String(user[field] || ''))
  }

  function saveEdit() {
    if (!editingField) return
    onSaveProfile({ [editingField]: tempValue })
    setEditingField(null)
    setTempValue('')
  }

  function togglePosition(code) {
    const current = user.positions || []
    let next
    if (current.includes(code)) {
      next = current.filter((p) => p !== code)
    } else {
      if (current.length >= 2) return
      next = [...current, code]
    }
    onSaveProfile({ positions: next })
  }

  const themeLabels = {
    classic: 'Классика',
    nba: 'NBA',
    neon: 'Неон',
    techno: 'Техно',
    acid: 'Кислота',
  }

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
          <h2 className="screen-head-title">Настройки</h2>
        </div>
      </div>

      <div className="settings-screen">
        {/* ============ ТЕМА ============ */}
        <div className="settings-section">
          <div className="settings-section-head">
            <span className="settings-section-icon">🎨</span>
            <div>
              <div className="settings-section-title">Тема приложения</div>
              <div className="settings-section-sub">Меняет цвета всего интерфейса</div>
            </div>
          </div>

          <div className="settings-themes-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`settings-theme-item ${user.theme === t.id ? 'active' : ''}`}
                onClick={() => onChangeTheme(t.id)}
              >
                <div
                  className="settings-theme-preview"
                  style={{ background: t.color }}
                />
                <span className="settings-theme-icon">{t.icon}</span>
                <span className="settings-theme-label">
                  {themeLabels[t.id] || t.label}
                </span>
                {user.theme === t.id && (
                  <span className="settings-theme-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ============ ПОЗИЦИИ ============ */}
        <div className="settings-section">
          <div className="settings-section-head">
            <span className="settings-section-icon">🏀</span>
            <div>
              <div className="settings-section-title">Игровые позиции</div>
              <div className="settings-section-sub">
                {user.positions && user.positions.length > 0
                  ? user.positions.join(' · ')
                  : 'Не выбраны'}
              </div>
            </div>
            <button
              className="settings-edit-btn"
              onClick={() => setEditingPositions(!editingPositions)}
            >
              {editingPositions ? 'Готово' : 'Изменить'}
            </button>
          </div>

          {editingPositions && (
            <div className="settings-positions-list">
              {POSITIONS.map((p) => {
                const isSelected = (user.positions || []).includes(p.code)
                const isDisabled =
                  !isSelected && (user.positions || []).length >= 2
                return (
                  <button
                    key={p.code}
                    className={`settings-position-btn ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => togglePosition(p.code)}
                    disabled={isDisabled}
                  >
                    <span className="settings-position-code">{p.code}</span>
                    <span className="settings-position-label">{p.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ============ ЛИЧНЫЕ ДАННЫЕ ============ */}
        <div className="settings-section">
          <div className="settings-section-head">
            <span className="settings-section-icon">📏</span>
            <div>
              <div className="settings-section-title">Личные данные</div>
              <div className="settings-section-sub">Рост, вес, возраст</div>
            </div>
          </div>

          <div className="settings-fields">
            {[
              { key: 'height', label: 'Рост, см', icon: '📏', placeholder: '195' },
              { key: 'weight', label: 'Вес, кг', icon: '⚖️', placeholder: '88' },
              { key: 'age', label: 'Возраст', icon: '🎂', placeholder: '22' },
            ].map((f) => (
              <div key={f.key} className="settings-field">
                <span className="settings-field-icon">{f.icon}</span>
                <div className="settings-field-info">
                  <div className="settings-field-label">{f.label}</div>
                  {editingField === f.key ? (
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder={f.placeholder}
                      autoFocus
                      className="settings-field-input"
                    />
                  ) : (
                    <div className="settings-field-value">
                      {user[f.key] || '—'}
                    </div>
                  )}
                </div>
                {editingField === f.key ? (
                  <button className="settings-field-save" onClick={saveEdit}>
                    ✓
                  </button>
                ) : (
                  <button
                    className="settings-field-edit"
                    onClick={() => startEdit(f.key)}
                  >
                    Изменить
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============ О ПРИЛОЖЕНИИ ============ */}
        <div className="settings-section">
          <div className="settings-section-head">
            <span className="settings-section-icon">ℹ️</span>
            <div>
              <div className="settings-section-title">О приложении</div>
              <div className="settings-section-sub">Snake Basketball · v1.45</div>
            </div>
          </div>
          <div className="settings-about-text">
            Честная оценка уровня в баскетболе, волейболе и футболе. Пройди тесты — узнай свой OVR.
          </div>
        </div>

        {/* ============ О НАС (сворачиваемая) ============ */}
        <div className="settings-section">
          <button
            className="settings-collapse-head"
            onClick={() => setAboutExpanded(!aboutExpanded)}
          >
            <span className="settings-section-icon">👥</span>
            <div className="settings-collapse-info">
              <div className="settings-section-title">О нас</div>
              <div className="settings-section-sub">Команда Snake Basketball</div>
            </div>
            <span className={`settings-collapse-arrow ${aboutExpanded ? 'open' : ''}`}>
              ▾
            </span>
          </button>

          {aboutExpanded && (
            <div className="settings-collapse-body">
              <div className="settings-about-text" style={{ marginBottom: 16 }}>
                Snake Basketball — это продукт, созданный командой из{' '}
                <strong>12 человек</strong>, каждый из которых вложил в проект свой
                многолетний опыт. Мы собрали специалистов из разных сфер: бывшие
                профессиональные игроки, тренеры, спортивные аналитики, разработчики
                и дизайнеры.
              </div>

              <div className="settings-about-text" style={{ marginBottom: 16 }}>
                Наши тренеры и консультанты имеют{' '}
                <strong>колоссальный опыт</strong> — каждый из них работал с командами
                и игроками уровня <strong>Лиги ВТБ</strong>, Единой Лиги, а также с
                действующими и бывшими игроками сборных. Именно они разрабатывали
                методику тестов — она основана на реальных требованиях
                профессионального баскетбола.
              </div>

              <div className="settings-about-text" style={{ marginBottom: 16 }}>
                Наши спортивные аналитики собрали и обработали{' '}
                <strong>тысячи данных</strong> с тренировок, матчей и сборов — чтобы
                ты получал честную оценку, а не «средние цифры из интернета». Все
                нормы и веса для позиций (PG, SG, SF, PF, C) — результат работы с
                реальными тренерами профессиональных клубов.
              </div>

              <div className="settings-about-text" style={{ marginBottom: 16 }}>
                Разработчики и дизайнеры сделали приложение{' '}
                <strong>быстрым, красивым и удобным</strong> — чтобы тебе хотелось
                возвращаться и расти. Мы верим, что честный замер — это первый шаг
                к прогрессу.
              </div>

              <div className="settings-about-text">
                <strong>Наша миссия:</strong> дать каждому игроку — от новичка до
                профи — инструмент, который поможет понять свой реальный уровень и
                расти быстрее. Без иллюзий. Только цифры и работа.
              </div>

              <div className="settings-about-signature">
                — Команда Snake Basketball 🐍🏀
              </div>
            </div>
          )}
        </div>

        {/* ============ ПОДДЕРЖКА (сворачиваемая) ============ */}
        <div className="settings-section">
          <button
            className="settings-collapse-head"
            onClick={() => setSupportExpanded(!supportExpanded)}
          >
            <span className="settings-section-icon">💬</span>
            <div className="settings-collapse-info">
              <div className="settings-section-title">Поддержка</div>
              <div className="settings-section-sub">Свяжись с нами</div>
            </div>
            <span className={`settings-collapse-arrow ${supportExpanded ? 'open' : ''}`}>
              ▾
            </span>
          </button>

          {supportExpanded && (
            <div className="settings-collapse-body">
              <div className="settings-about-text" style={{ marginBottom: 16 }}>
                Нашли баг? Есть идея? Хочешь предложить фичу? Мы открыты к
                обратной связи — пиши нам напрямую в Telegram.
              </div>

              <a
                href="https://t.me/mayndir"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-support-item"
              >
                <span className="settings-support-icon">💬</span>
                <div className="settings-support-info">
                  <div className="settings-support-label">Telegram</div>
                  <div className="settings-support-value">@mayndir</div>
                </div>
                <span className="settings-support-arrow">→</span>
              </a>

              <a
                href="https://t.me/haliburgers"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-support-item"
              >
                <span className="settings-support-icon">💬</span>
                <div className="settings-support-info">
                  <div className="settings-support-label">Telegram</div>
                  <div className="settings-support-value">@haliburgers</div>
                </div>
                <span className="settings-support-arrow">→</span>
              </a>

              <a
                href="https://t.me/snake_basketballl"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-support-item"
              >
                <span className="settings-support-icon">📢</span>
                <div className="settings-support-info">
                  <div className="settings-support-label">Канал с новостями</div>
                  <div className="settings-support-value">@snake_basketballl</div>
                </div>
                <span className="settings-support-arrow">→</span>
              </a>

              <div className="settings-support-note">
                ⏱️ Отвечаем в течение 24 часов
              </div>
            </div>
          )}
        </div>

        {/* ============ СБРОС ============ */}
        <div className="settings-section settings-section-danger">
          <div className="settings-section-head">
            <span className="settings-section-icon">⚠️</span>
            <div>
              <div className="settings-section-title">Сбросить всё</div>
              <div className="settings-section-sub">
                Удалит прогресс, тесты, карточку
              </div>
            </div>
          </div>
          <button
            className="settings-reset-btn"
            onClick={() => setShowResetConfirm(true)}
          >
            Сбросить и начать заново
          </button>
        </div>
      </div>

      {/* ============ МОДАЛКА ПОДТВЕРЖДЕНИЯ ============ */}
      {showResetConfirm && (
        <ConfirmModal
          icon="⚠️"
          title="Сбросить все данные?"
          text="Это удалит прогресс, тесты, карточку и все настройки. Действие нельзя отменить."
          confirmText="Да, сбросить"
          cancelText="Отмена"
          danger={true}
          onConfirm={() => {
            setShowResetConfirm(false)
            onReset()
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </>
  )
}