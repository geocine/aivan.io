const Message = ({ type, children }) => {
  return <p className={['mdx-message', type].filter(Boolean).join(' ')}>{children}</p>
}

export default Message
