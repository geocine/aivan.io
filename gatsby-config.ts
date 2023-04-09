import type { GatsbyConfig } from 'gatsby'

function getCover(node: any) {
  const slug = node.fields.slug.replace(/^\/|\/$/g, '')
  const cover = node.frontmatter.cover.replace(/^\/|\/$/g, '')
  return `${slug}/${cover}`
}

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Aivan Monceller`,
    author: ``,
    shortDescription: `Fullstack JavaScript Engineer`,
    description: `Building front-end applications, web APIs, system utilities and development tools using JavaScript, TypeScript, C# and Go.`,
    siteUrl: `https://aivan.io/`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-image',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: `gatsby-remark-smartypants`,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: './content/blog/',
      },
      __key: 'blog',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: './content/assets/',
      },
      __key: 'assets',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: './content/data/',
      },
      __key: 'data',
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'G-2S179EH3RR', // Google Analytics / GA
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          optimize_id: 'OPT_CONTAINER_ID',
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: ['/preview/**', '/do-not-track/me/too/'],
          // Defaults to https://www.googletagmanager.com
          origin: 'aivan.io',
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
    {
      resolve: '@geocine/gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }: any) => {
              return allMdx.edges.map((edge: any) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  data: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [
                    {
                      'content:encoded': edge.node.frontmatter.meta_description,
                    },
                    {
                      'media:encoded': {
                        _attr: {
                          url: getCover(edge.node),
                          medium: 'image',
                          type: 'image/png',
                        },
                      },
                    },
                  ],
                })
              })
            },

            /* if you want to filter for only published posts, you can do
             * something like this:
             * filter: { frontmatter: { published: { ne: false } } }
             * just make sure to add a published frontmatter field to all posts,
             * otherwise gatsby will complain
             **/
            query:
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
                      date(formatString: "MMMM DD, YYYY")
                      title
                      author
                      cover
                      meta_description
                    }
                    excerpt
                  }
                }
              }
            }
            `
                : `
            {
              allMdx(
                limit: 1000
                sort: {frontmatter: {date: DESC}}
                filter: { frontmatter: { published: { ne: false } } }
              ) {
                edges {
                  node {
                    fields { 
                      slug
                    }
                    frontmatter {
                      date(formatString: "MMMM DD, YYYY")
                      title
                      author
                      cover
                      meta_description
                    }
                    excerpt
                  }
                }
              }
            }
            `,
            output: '/rss.xml',
            title: 'aivan.io RSS Feed',
            link: 'https://aivan.io/rss.xml',
            custom_namespaces: {
              media: 'http://search.yahoo.com/mrss/',
            }
          },
        ]
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `Aivan`,
        short_name: `Aivan`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#0161ab`,
        display: `minimal-ui`,
        icon: `content/assets/aivan-icon.png`,
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion',
    {
      resolve: '@chakra-ui/gatsby-plugin',
      options: {
        /**
         * @property {boolean} [resetCSS=true]
         * if `false`, this plugin will not use `<CSSReset />
         */
        resetCSS: true,
      },
    },
  ],
}

export default config
