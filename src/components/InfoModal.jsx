// src/components/InfoModal.jsx
// Красивая модалка для уведомлений (вместо alert)

export default function InfoModal({
  icon = '✨',
  title,
  text,
  buttonText = 'Понятно',
  onClose,
}) {
  if (!title) return null

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal-glow" />

        <div className="info-modal-icon">{icon}</div>

        <h3 className="info-modal-title">{title}</h3>

        {text && <p className="info-modal-text">{text}</p>}

        <button className="info-modal-btn" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}