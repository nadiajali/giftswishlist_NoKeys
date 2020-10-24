import React, { Component } from "react";
import DataService from "../services/data-service";
import "./product-condensed.css";

let ds = new DataService();

class ProductCondensed extends Component {
  constructor(props) {
    super(props);

    // Bind Functions
    this.removeProduct = this.removeProduct.bind(this);
  }

  removeProduct = () => {
    ds.removeWishListItem(this.props.product);
  };

  render() {
    return (
      <li className="list-group-item pc-condensed">
        <div className="row">
          <div className="col-sm-2">
            <a
              className="btn btn-outline-danger"
              onClick={() => this.removeProduct()}
            >
              X
            </a>
          </div>
          <div className="col-sm-6 title">{this.props.product.title}</div>
          <div className="col-sm-2">
            <b>${this.props.product.price}</b>
          </div>
        </div>
      </li>
    );
  }
}

export default ProductCondensed;
