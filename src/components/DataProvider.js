import React, { PropTypes } from 'react'
import { RouterContext } from 'react-router'

export default class DataProvider extends React.Component {

  getChildContext() {
    return { data: this.props.data }
  }

  render() {
    return <RouterContext {...this.props}/>
  }

}

DataProvider.propTypes = {
  data: PropTypes.object,
}

DataProvider.childContextTypes = {
  data: PropTypes.object,
}
