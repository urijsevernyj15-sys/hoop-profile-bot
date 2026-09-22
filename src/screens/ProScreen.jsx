import { useState } from 'react'
import InfoModal from '../components/InfoModal'

export default function ProScreen({ user, onBack }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <>
      <div className="screen-head">
        <div className="screen-head-left">
          <button className="icon-btn" onClick={onBack}>←</button>
        </div>
        <span className="screen-head-pill pro">PRO</span>
      </div>

      <div className="pro-hero">
        <div className="pro-hero-icon">🏆</div>
        <h1 className="pro-hero-title pro-hero-title-animated">
          Прокачай свою карточку
        </h1>
        <p className="pro-hero-sub">
          PRO — это больше данных о твоей игре. Точнее карточка. Честнее OVR.
        </p>
      </div>

      <div className="pro-features">
        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Расширенные тесты</div>
            <div className="pro-feature-sub">
              Ещё 6 тестов: точность штрафных, дриблинг под давлением,
              реакция, выносливость.
            </div>
          </div>
        </div>

        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Персональные тренировки</div>
            <div className="pro-feature-sub">
              Выбор целей, инвентаря и уровня. План подстраивается под тебя.
            </div>
          </div>
        </div>

        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Сравнение с профи</div>
            <div className="pro-feature-sub">
              Узнай, насколько ты близок к уровню NCAA, Евролиги и NBA.
            </div>
          </div>
        </div>

        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">История прогресса</div>
            <div className="pro-feature-sub">
              Графики и динамика месяц за месяцем.
            </div>
          </div>
        </div>

        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Расширенная статистика</div>
            <div className="pro-feature-sub">
              Средние по позиции, лучшие и слабые стороны.
            </div>
          </div>
        </div>

        <div className="pro-feature">
          <span className="pro-feature-check">✓</span>
          <div>
            <div className="pro-feature-title">Сравнение с друзьями</div>
            <div className="pro-feature-sub">
              Добавляй друзей по нику и сравнивай карточки.
            </div>
          </div>
        </div>
      </div>

      <div className="pro-reasons">
        <div className="pro-reasons-title">Зачем это тебе</div>
        <p className="pro-reasons-text">
          Чем больше замеров — тем точнее карточка отражает твой реальный
          уровень. PRO раскрывает тебя полностью: больше навыков, сравнение с
          профи, история прогресса и персональные тренировки, чтобы расти
          быстрее.
        </p>
      </div>

      {user.plan === 'pro' ? (
        <div className="pro-active">✓ PRO активна</div>
      ) : (
        <button
          className="pro-cta"
          onClick={() => setShowPaymentModal(true)}
        >
          Оформить PRO
        </button>
      )}

      <p className="pro-note">Оплата появится позже</p>

      {showPaymentModal && (
        <InfoModal
          icon="✨"
          title="Оплата скоро появится"
          text="Мы уже работаем над этим. PRO станет доступен в ближайшее время — следи за обновлениями."
          buttonText="Понятно"
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  )
}