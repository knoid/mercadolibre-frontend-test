import React, { PropTypes } from 'react'
import { Link } from 'react-router'

export default function ResultItem(props) {
  return (
    <div className="result-item">
      <Link to={`/items/${props.id}`}>
        <div className="result-item-inner row">
          <div>
            <img src={props.picture} />
          </div>
          <div className="col">
            <div>
              <span className="price">
                $ {props.price.amount.toLocaleString()}
              </span>
              {props.free_shipping &&
                <span className="free-shipping-image">free shipping</span>}
            </div>
            <div className="title">{props.title}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

ResultItem.propTypes = {
  id: PropTypes.string.isRequired,
  free_shipping: PropTypes.bool,
  picture: PropTypes.string.isRequired,
  price: PropTypes.shape({
    amount: PropTypes.number,
  }),
  title: PropTypes.string.isRequired,
}
