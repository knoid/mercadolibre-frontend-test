import * as api from '../components/api'
import React, { PropTypes } from 'react'
import { locationShape, routerShape } from 'react-router/lib/PropTypes'
import Breadcrumb from '../components/Breadcrumb'
import ResultItem from '../components/ResultItem'
import SearchBox from '../components/SearchBox'
import _View from './_View'
import assign from 'lodash/assign'

export default class Results extends _View {

  constructor(props, context) {
    super(props, context)
    this.state = this._getInitState('Results') || { categories: [], items: [] }
  }

  componentDidMount() {
    this.searchItems()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.query.search !== this.props.location.query.search) {
      this.searchItems()
    }
  }

  fetchData() {
    const { search } = this.props.location.query
    return api.searchItems(search)
  }

  searchItems() {
    const { search } = this.props.location.query
    this.fetchData()
    .then(results => {
      this.setState(() => assign(results, { search }))
    })
  }

  render() {
    return (
      <div className="results">
        <SearchBox router={this.props.router} />
        <div className="container">
          <Breadcrumb categories={this.state.categories} />
          <div className="view-content">
            {this.state.items.map(result =>
              <ResultItem key={result.id} {...result} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

Results.contextTypes = {
  data: PropTypes.object,
}

Results.propTypes = {
  router: routerShape,
  location: locationShape,
}
