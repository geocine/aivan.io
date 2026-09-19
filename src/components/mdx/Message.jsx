const LABELS = {
  warning: 'warning',
  success: 'done',
}

/* Gloss callout: hairline left edge, small mono label, body text as prose. */
const Message = ({ type, children }) => (
  <div className={['callout', type].filter(Boolean).join(' ')}>
    <span className="cl">{LABELS[type] || 'note'}</span>
    {children}
  </div>
)

export default Message
