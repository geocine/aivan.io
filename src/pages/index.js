import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/Seo'
import Card from '../components/Card'
import Container from '../components/Container'
// import type { HeadFC, PageProps } from "gatsby"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const posts = data.allMdx.edges

    function getCover(node) {
      const slug = node.fields.slug.replace(/^\/|\/$/g, '')
      const cover = node.frontmatter.cover.replace(/^\/|\/$/g, '')
      return `${slug}/${cover}`
    }

    return (
      <Layout location={this.props.location}>
        <Container>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <Card
                key={node.id}
                link={node.fields.slug}
                date={node.frontmatter.date}
                title={title}
                cover={getCover(node)}
                excerpt={node.frontmatter.meta_description}
                category={node.frontmatter.category}
                author={node.frontmatter.author}
                mb={10}
              />
            )
          })}
        </Container>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: {frontmatter: {date: DESC}}
      filter: { fields: { list: { ne: false } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            author
            title
            cover
            category
            meta_description
          }
        }
      }
    }
  }
`
//Head: HeadFC 
export const Head = () => (
  <SEO title="Aivan Monceller" index keywords={[`aivan monceller`, `programming`]} image="cover.jpg" />
)
