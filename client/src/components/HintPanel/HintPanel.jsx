import './HintPanel.scss'

function HintPanel({ hint, loading, onClose }) {
  if (!hint && !loading) return null

  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <span className="hint-panel__icon">💡</span>
        <span className="hint-panel__title">AI Hint</span>
        <button 
          className="hint-panel__close"
          onClick={onClose}
          aria-label="Close hint"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
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
