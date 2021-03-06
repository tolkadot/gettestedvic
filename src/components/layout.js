/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
 //console.log(data);
  return (
    <div>

      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />

      <main>{children}</main>
      
      <footer>
        <div>
          © {new Date().getFullYear()}, Built by&nbsp;
          <a href="https://tolka.io" target="_blank" rel="noreferrer">Tolka</a>
        </div>
      </footer>

    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
