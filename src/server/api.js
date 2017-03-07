import _ from 'lodash'
import express from 'express'
import { stringify } from 'querystring'

const defaultData = {
    author: {
      name: 'Ariel',
      lastname: 'Barabas',
    },
  },
  API_CATEGORY = 'https://api.mercadolibre.com/categories/',
  API_ITEM = 'https://api.mercadolibre.com/items/',
  API_LIST = 'https://api.mercadolibre.com/sites/MLA/search?'

function fetchData(url) {
  return fetch(url).then(res => res.json())
}

function mapItem(product) {
  return {
    id: product.id,
    title: product.title,
    price: {
      currency: product.currency_id,
      amount: product.price,
      decimals: Math.round((product.price - Math.floor(product.price)) * 100),
    },
    picture: product.thumbnail,
    condition: product.condition,
    free_shipping: product.shipping.free_shipping,
  }
}

export default express.Router()

  .get('/items', (req, res, next) => {
    const { q } = req.query
    if (!q) {
      return next(new Error('Parameter q is needed.'))
    }

    fetchData(API_LIST + stringify({ q }))
    .then(({ filters, results }) => {
      let categories = _.find(filters, { id: 'category' })
      if (categories && categories.values.length > 0) {
        categories = categories.values[0].path_from_root.map(p => p.name)
      }
      res.json(_.assign({}, defaultData, {
        categories: categories || [],
        items: results.slice(0, 4).map(mapItem),
      }))
    })
    .catch(next)
  })

  .get('/item/:id', (req, res, next) => {
    Promise.all([
      fetchData(API_ITEM + req.params.id)
      .then(item =>
        // agrego este fetch para poder cumplir el punto:
        //   - Dado un id de producto, debería poder ingresar directamente a la
        //   vista de detalle de producto.
        fetchData(API_CATEGORY + item.category_id)
        .then(category => {
          item.categories = category.path_from_root.map(p => p.name)
          return item
        })
      ),
      fetchData(API_ITEM + req.params.id + '/description'),
    ])
    .then(([ product, description ]) => {
      const item = _.assign(mapItem(product), {
        sold_quantity: product.sold_quantity,
        description: description.text || description.plain_text,
      })
      if (product.pictures.length > 0) {
        item.picture = product.pictures[0].url
      }
      res.json(_.assign({}, defaultData, {
        categories: product.categories,
        item,
      }))
    })
    .catch(next)
  })
