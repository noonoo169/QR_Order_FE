import React, {useState} from "react";

import "../../../styles/product-card.css";

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ProductCard = (props) => {
  const { id, name, price, description, images } = props.item;
  const isCombo = props.isCombo;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id, name, price, description, images, isCombo
      })
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    
    <div className="product__item">
      <Snackbar  open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%', margin: '20px' }}>
          Product added successfully
        </Alert>
      </Snackbar>
      <div className="product__img">
        <img src={images[0].imageUrl} alt="product-img" className="product_custom_img" />
      </div>

      <div className="product__content">
        {/* <h5>
          <Link to={`/foods/${id}`}>{name}</Link>
        </h5> */}
        <h5>
          <Link to={`/foods/${id}`}
              state={{ isCombo: isCombo }}>{name}</Link>
        </h5>
        <div className=" d-flex align-items-center justify-content-between ">
          <span className="product__price">${price}</span>
          <button className="addTOCart__btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
