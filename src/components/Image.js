import React from 'react'
import GatsbyImage from 'gatsby-image'

const imageTransform = 'https://img.imageboss.me/aivan'

const Image = ({ src, sizes, aspectRatio, ...rest }) => {
  return (
    <GatsbyImage
      fluid={{
        aspectRatio,
        src: `${imageTransform}/cdn/${src}`,
        base64: `${imageTransform}/width/30/blur:4/${src}`,
        sizes: '(max-width: 850px) 100vw, 850px',
        srcSet: sizes
          .map(size => {
            return `${imageTransform}/width/${size}/quality:100/${src} ${size}w`
          })
          .join(),
      }}
      {...rest}
    />
  )
}

export default Image
