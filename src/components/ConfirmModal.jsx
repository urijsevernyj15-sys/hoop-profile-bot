// src/components/ConfirmModal.jsx
// Модалка подтверждения (вместо window.confirm)

export default function ConfirmModal({
  icon = '⚠️',
  title,
  text,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!title) return null

  return (
    <div className="info-modal-overlay" onClick={onCancel}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`info-modal-glow ${danger ? 'danger' : ''}`} />

        <div className={`info-modal-icon ${danger ? 'danger' : ''}`}>{icon}</div>

        <h3 className="info-modal-title">{title}</h3>

        {text && <p className="info-modal-text">{text}</p>}

        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`confirm-modal-btn ${danger ? 'danger' : 'confirm'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}