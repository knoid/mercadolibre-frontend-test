import { IndexRoute, Route } from 'react-router'
import Item from '../views/Item'
import React from 'react'
import Results from '../views/Results'
import Search from '../views/Search'

export default function Routes() {
  return (
    <Route path="/">
      <IndexRoute component={Search} />
      <Route path="items" component={Results} />
      <Route path="items/:id" component={Item} />
    </Route>
  )
}
