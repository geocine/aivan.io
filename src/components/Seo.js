import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
// import type { HeadFC } from "gatsby"

// const imageHost = 'https://img.imageboss.me/aivan'
const imageHost = 'https://cdn.aivan.io'

function SEO({
  index = false,
  description,
  keywords,
  title,
  image
}) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={(data) => {
        const metaDescription =
          description || data.site.siteMetadata.description
        const metaTitle = index
          ? `${data.site.siteMetadata.title} | ${data.site.siteMetadata.shortDescription}`
          : title
        return (
          <>
            <html lang="en" />
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="website"/>
            <meta property="og:image" content={`${imageHost}/${image}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:creator"
              content={data.site.siteMetadata.author}
            />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:image" content={`${imageHost}/${image}`} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="keywords" content={keywords.join(',')} />
          </>
        )
      }}
    />
  )
}

SEO.defaultProps = {
  meta: [],
  keywords: [],
}

SEO.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        shortDescription
        description
        author
      }
    }
  }
`
