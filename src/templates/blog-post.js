import React from 'react'
import { Link, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import styled from '@emotion/styled'

import Layout from '../components/Layout'
import SEO from '../components/Seo'
import BlogContainer from '../components/BlogContainer'
import Image from '../components/Image'
import Title from '../components/Title'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { bpDesktopOnly } from '../lib/breakpoints'
// import type { HeadFC, PageProps } from "gatsby"

const PostBody = styled.div`
  p > code {
    background-color: #d1ebfd;
    line-height: inherit;
    padding: 5px 7px 0;
    white-space: pre-wrap;
    border-bottom: 2px solid #006cb7;
    font-style: normal;
    border-radius: 4px;
    color: #1a202c;
    font-size: 15px;
  }
  code {
    color: rgb(217, 239, 255);
  }
  a > code {
    color: #ffffff;
  }
  li > code {
    color: #1a202c;
  }
  pre {
    background-color: #2d3033 !important;
    ${bpDesktopOnly} {
      border-radius: 4px;
    }
    font-size: 16px;
    padding: 10px;
    overflow-x: auto;
    /* Track */
    ::-webkit-scrollbar {
      width: 100%;
      height: 5px;
      border-radius: 0 0 5px 5px;
    }
    ::-webkit-scrollbar-track {
      background: #061526;
      border-radius: 0 0 4px 4px;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }
  }
  .highlight-line {
    background-color: rgba(85, 66, 42, 0.61);
    margin: 0 -10px;
    padding: 0 5px;
    border-left: 5px solid #ff8e01;
  }
`

const CoverImage = styled(Image)`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  overflow: unset !important;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  border: 0;
  border-color: transparent;
  &::before {
    content: '';
    position: absolute;
    left: -100vw;
    right: -100vw;
    bottom: 0;
    height: 50%;
    background-color: #fff;
  }
  picture img {
    border-radius: 4px;
    border-color: transparent;
  }
`

const PostHeader = styled.div`
  overflow: hidden;
  max-width: calc(100% + 40px);
  margin-top: -40px;
  margin-bottom: 40px;
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
  background: #006cb7;
  h1 {
    a {
      color: #fff !important;
    }
    max-width: 850px;
    margin: 0 auto 20px auto;
  }
  .author {
    color: #fff;
  }
`

const PostFooter = styled.div`
  margin: 25px 0;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style: none;
    padding: 0;
  }
  a > svg {
    display: inline-block;
  }
`
// Do not show date
class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title
    const author = this.props.data.author
    const { previous, next } = this.props.pageContext

    function getCover() {
      const slug = post.fields.slug.replace(/^\/|\/$/g, '')
      const cover = post.frontmatter.cover.replace(/^\/|\/$/g, '')
      return `${slug}/${cover}`
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <article>
          <PostHeader>
            <Title link="/#" date={post.frontmatter.date} author={author}>
              {post.frontmatter.title}
            </Title>
            <CoverImage
              aspectRatio={2.93}
              src={getCover()}
              sizes={[370, 530, 690, 850]}
              className="cover-image"
              alt={post.frontmatter.title}
            />
          </PostHeader>
          <BlogContainer>
            <PostBody>{this.props.children}</PostBody>
            <PostFooter>
              <ul>
                <li>
                  {previous && (
                    <Link to={previous.fields.slug} rel="prev">
                      <IoMdArrowBack /> Previous
                    </Link>
                  )}
                </li>
                <li>
                  {next && (
                    <Link to={next.fields.slug} rel="next">
                      Next <IoMdArrowForward />
                    </Link>
                  )}
                </li>
              </ul>
            </PostFooter>
          </BlogContainer>
        </article>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query ($slug: String!, $author: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      fields {
        slug
      }
      frontmatter {
        title
        cover
        date(formatString: "MMMM DD, YYYY")
        category
        meta_description
      }
      body
    }
    author: authorsJson(jsonId: { eq: $author }) {
      id
      name
      avatar
      bio
    }
  }
`
export const Head = (props) => {
  const post = props.data.mdx

  function getCover() {
    const slug = post.fields.slug.replace(/^\/|\/$/g, '')
    const cover = post.frontmatter.cover.replace(/^\/|\/$/g, '')
    return `${slug}/${cover}`
  }

  return (
    <SEO
      title={post.frontmatter.title}
      description={post.frontmatter.meta_description}
      image={getCover()}
    />
  )
}
