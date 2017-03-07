import DataProvider from '../components/DataProvider'
import Html from '../components/Html'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Routes from '../components/Routes'
import _ from 'lodash'
import express from 'express'
import { match } from 'react-router'
const htmlComponent = React.createFactory(Html)

export default express.Router()

  .get('*', (req, res, next) => {
    match({ routes: Routes(), location: req.url }, (err, redirect, props) => {
      if (err) {
        next(err)
      } else if (redirect) {
        res.redirect(redirect.pathname + redirect.search)
      } else if (props) {
        // -- WARNING -- HACKATION AHEAD
        const fetchingData = props.components.map(Component => {
          if (Component) {
            const instance = new Component(props, {})
            if (instance.fetchData) {
              return instance.fetchData()
              .then(data => {
                return { [Component.name]: data }
              })
            }
          }
        })
        Promise.all(fetchingData)
        .then(states => {
          states = _.assign(...states)
          const html = ReactDOMServer.renderToStaticMarkup(
            htmlComponent({
              cssFiles: req.cssFiles,
              jsFiles: req.jsFiles,
              INIT_STATE: _.clone(states),
              markup: ReactDOMServer.renderToString(
                <DataProvider {...props} data={states} />
              ),
            })
          )
          res.type('html').end(html)
        })
        .catch(next)
      } else {
        next()
      }
    })
  })
