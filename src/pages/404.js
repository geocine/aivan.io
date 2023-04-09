import React from 'react'

import Layout from '../components/Layout'
import SEO from '../components/Seo'
// import type { HeadFC, PageProps } from "gatsby"

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Layout>
    )
  }
}

export default NotFoundPage

export const Head = () => <SEO title="404: Not Found" />