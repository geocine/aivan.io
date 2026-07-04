// Cloudflare Image Transformations
// Format: https://<CF-ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
// Using relative paths since images are on the same domain
const cfImageBase = 'https://cdn.aivan.io/cdn-cgi/image'

const Image = ({ src, sizes = [], aspectRatio, alt = '', ...rest }) => {
  const isRemote = /^https?:\/\//.test(src)
  const isLocal = src.startsWith('/assets/') || src.startsWith('assets/')
  const localSrc = src.startsWith('/') ? src : `/${src}`
  const imageSrc = isLocal || isRemote ? (isLocal ? localSrc : src) : `${cfImageBase}/format=auto/${src}`
  const srcSet =
    isLocal || isRemote
      ? undefined
      : sizes
          .map(size => {
            return `${cfImageBase}/width=${size},quality=85,format=auto/${src} ${size}w`
          })
          .join(', ')
  const placeholder = isLocal || isRemote ? imageSrc : `${cfImageBase}/width=30,quality=4,format=auto/${src}`

  return (
    <span
      {...rest}
      style={{
        display: 'block',
        aspectRatio,
        backgroundImage: `url(${placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...rest.style,
      }}
    >
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes="(max-width: 850px) 100vw, 850px"
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          aspectRatio,
          objectFit: 'cover',
        }}
      />
    </span>
  )
}

export default Image
