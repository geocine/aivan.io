import React from 'react'
import GatsbyImage from 'gatsby-image'

const imageTransform = 'https://cdn.statically.io/img/cdn.aivan.io'

const Image = ({ src, sizes, aspectRatio, ...rest }) => {
  return (
    <GatsbyImage
      fluid={{
        aspectRatio,
        src: `${imageTransform}/${src}`,
        base64: `${imageTransform}/w=30,q=4/${src}`,
        sizes: '(max-width: 850px) 100vw, 850px',
        srcSet: sizes
          .map(size => {
            return `${imageTransform}/w=${size},q=100/${src} ${size}w`
          })
          .join(),
      }}
      {...rest}
    />
  )
}

export default Image
