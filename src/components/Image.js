import React from 'react'
import GatsbyImage from 'gatsby-image'

// Cloudflare Image Transformations
// Format: https://<CF-ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
// Using cdn.aivan.io as the Cloudflare zone for transformations
const cfImageBase = 'https://cdn.aivan.io/cdn-cgi/image'
const imageOrigin = 'https://cdn.aivan.io'

const Image = ({ src, sizes, aspectRatio, ...rest }) => {
  return (
    <GatsbyImage
      fluid={{
        aspectRatio,
        src: `${cfImageBase}/format=auto/${imageOrigin}/${src}`,
        base64: `${cfImageBase}/width=30,quality=4,format=auto/${imageOrigin}/${src}`,
        sizes: '(max-width: 850px) 100vw, 850px',
        srcSet: sizes
          .map(size => {
            return `${cfImageBase}/width=${size},quality=85,format=auto/${imageOrigin}/${src} ${size}w`
          })
          .join(),
      }}
      {...rest}
    />
  )
}

export default Image
