/* global INIT_STATE */
import React from 'react'

export default class _View extends React.Component {

  _getInitState(className) {
    if (this.context.data && this.context.data[className]) {
      return this.context.data[className]
    } else if (typeof INIT_STATE === 'object' && INIT_STATE[className]) {
      const ret = INIT_STATE[className]
      delete INIT_STATE[className]
      return ret
    }
  }

}
