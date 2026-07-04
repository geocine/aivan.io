const ColorBox = ({ color, ...rest }) => {
  return (
    <span className="color-box" {...rest}>
      <span className="color-swatch" style={{ backgroundColor: color }} />
      <span className="color-label">{color}</span>
    </span>
  )
}

export default ColorBox
