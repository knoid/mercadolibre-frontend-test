import React from 'react'
import SearchBox from '../components/SearchBox'
import { routerShape } from 'react-router/lib/PropTypes'

export default class Search extends React.Component {

  render() {
    return (
      <div>
        <SearchBox router={this.props.router} />
      </div>
    )
  }

}

Search.propTypes = {
  router: routerShape,
}
