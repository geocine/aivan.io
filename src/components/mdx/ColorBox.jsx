/* Flat swatch with a mono label; click copies the value. The confirm label
   lives in its own grid inside the flex label, so the two states cross-fade
   in place without fighting the centering. */
const ColorBox = ({ color, ...rest }) => {
  return (
    <button type="button" className="color-box" data-copy-text={color} data-craft-press="scale" {...rest}>
      <span className="color-swatch" style={{ backgroundColor: color }} />
      <span className="color-label">
        <span data-fb="">
          <span className="fb-idle">{color}</span>
          <span className="fb-done" aria-hidden="true">
            copied
          </span>
        </span>
      </span>
    </button>
  )
}

export default ColorBox
