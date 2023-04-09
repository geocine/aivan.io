import { resolve } from 'path'
import { createFilePath } from 'gatsby-source-filesystem'

const createPages = ({ graphql, actions }: any) => {
  const { createPage } = actions
  const blogPost = resolve(`./src/templates/blog-post.js`)
  return graphql(
    process.env.NODE_ENV === 'development'
      ? `
      {
        allMdx(
          sort: {frontmatter: {date: DESC}}
          limit: 1000
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                author
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }
    `
      : `
      {
        allMdx(
          sort: {frontmatter: {date: DESC}}
          limit: 1000
          filter: { frontmatter: { published: { ne: false } } }
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                author
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }
    `
  ).then((result: any) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges
    posts.forEach((post: any, index: any) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
        context: {
          slug: post.node.fields.slug,
          author: post.node.frontmatter.author,
          previous,
          next,
        },
      })
    })
  })
}

const onCreateNode = ({ node, actions, getNode }: any) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
    createNodeField({
      name: `list`,
      node,
      value:
        process.env.NODE_ENV === 'production'
          ? node.frontmatter.published
          : true,
    })
  }
}

export { onCreateNode , createPages}