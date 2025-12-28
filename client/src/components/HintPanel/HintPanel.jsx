import './HintPanel.scss'

function HintPanel({ hint, loading, onClose }) {
  if (!hint && !loading) return null

  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <span className="hint-panel__icon">💡</span>
        <span className="hint-panel__title">Hint</span>
        <button 
          className="hint-panel__close"
          onClick={onClose}
          aria-label="Close hint"
        >
          ✕
        </button>
      </div>
      <div className="hint-panel__content">
        {loading ? (
          <div className="hint-panel__loading">
            <div className="spinner"></div>
            <span>Generating hint...</span>
          </div>
        ) : (
          <p>{hint}</p>
        )}
      </div>
    </div>
  )
}

export default HintPanel
