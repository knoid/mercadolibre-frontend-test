import * as api from '../components/api'
import React, { PropTypes } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import SearchBox from '../components/SearchBox'
import _View from './_View'
import padStart from 'lodash/padStart'
import { routerShape } from 'react-router/lib/PropTypes'
import sample from 'lodash/sample'

export default class Item extends _View {

  constructor(props, context) {
    super(props, context)
    this.handleBuy = this.handleBuy.bind(this)
    this.state = this._getInitState('Item') || { categories: [] }
  }

  componentDidMount() {
    this.setData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.router.params.id !== this.props.router.params.id) {
      this.setData()
    }
  }

  setData() {
    this.fetchData().then(data => this.setState(() => data))
  }

  fetchData() {
    return api.fetchItem(this.props.router.params.id)
  }

  handleBuy() {
    this.refs.buy.innerHTML = sample([
      'JAJajaja',
      'Comprar',
      'da, en serio.',
    ])
  }

  render() {
    const { item } = this.state
    return (
      <div className="item">
        <SearchBox router={this.props.router} />
        <div className="container">
          <Breadcrumb categories={this.state.categories} />
          {item &&
            <div className="view-content">
              <div className="row">
                <div className="col text-center">
                  <img src={item.picture} />
                </div>
                <div className="col-3">
                  <div className="cond-sold">
                    {item.condition === 'new' ? 'Nuevo' : 'Usado'}
                    {' '}- {item.sold_quantity}
                    {item.sold_quantity === 1 ? ' vendido' : ' vendidos'}
                  </div>
                  <div className="title">{item.title}</div>
                  <div className="price">
                    $ {Math.floor(item.price.amount).toLocaleString()}
                    <span>{padStart(item.price.decimals, 2, '0')}</span>
                  </div>
                  <button ref="buy" className="btn btn-primary"
                          onClick={this.handleBuy}>Comprar</button>
                </div>
                <div className="description col-12">
                  <label>Descripción del producto</label>
                  <div dangerouslySetInnerHTML={{ __html: item.description }}
                       ></div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

}

Item.contextTypes = {
  data: PropTypes.object,
}

Item.propTypes = {
  router: routerShape,
}
