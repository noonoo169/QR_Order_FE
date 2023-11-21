import React, { useState } from "react";

import { ListGroup } from "reactstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CartItem from "./CartItem";

import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";

import "../../../styles/shopping-cart.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios"

const Carts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.cart.cartProduct);
  const cartCombos = useSelector((state) => state.cart.cartCombo);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createNewOrderAction = async () => {
    if (totalQuantity === 0) {
      setErrorMessage('Your cart is empty')
      setOpen(true)
    }
    else {
      try {
        toggleCart()
        const orderData = {
          "tableId": sessionStorage.getItem('table_id'),
          "totalPrice": totalAmount,
          "note": null,
          "orderDetails":
            cartProducts.map((product) => (
              {
                productId: product.id,
                quantity: product.quantity
              }
            )).concat(
              cartCombos.map((combo) => (
                {
                  comboId: combo.id,
                  quantity: combo.quantity
                }
              ))
            )
        };
        const responseOrder = await axios.post(
          `${process.env.REACT_APP_BE_URL}/api/order/addOfflineOrder`, orderData
        );
        if (responseOrder.status >= 200 && responseOrder.status < 300) {
          const responseOrderData = responseOrder.data
          if (responseOrderData !== "This table is UNEMPTY") {
            sessionStorage.setItem('orderId', JSON.stringify(responseOrderData.id))
            cartProducts.map((product) => (
              dispatch(cartActions.deleteItem({ id: product.id, isCombo: false }))
            ))
            cartCombos.map((combo) => (
              dispatch(cartActions.deleteItem({ id: combo.id, isCombo: true }))
            ));
            navigate('/order')
          }
        } else {
          setErrorMessage('Cannot order right now')
          setOpen(true)
        }
      } catch (error) {
        setErrorMessage('Please try again')
        setOpen(true)
      }
    }
  }

  const addFoodOrderAction = async () => {
    if (totalQuantity === 0) {
      setErrorMessage('Your cart is empty')
      setOpen(true)
    }
    else {
      try {
        toggleCart()
        const orderData = {
          "tableId": sessionStorage.getItem('table_id'),
          "totalPrice": totalAmount,
          "note": null,
          "orderDetails":
            cartProducts.map((product) => (
              {
                productId: product.id,
                quantity: product.quantity
              }
            )).concat(
              cartCombos.map((combo) => (
                {
                  comboId: combo.id,
                  quantity: combo.quantity
                }
              ))
            )
        };
        const responseOrder = await axios.post(
          `${process.env.REACT_APP_BE_URL}/api/order/addOfflineOrder`, orderData
        );
        if (responseOrder.status >= 200 && responseOrder.status < 300) {
          const responseOrderData = responseOrder.data
          if (responseOrderData !== "This table is UNEMPTY") {
            sessionStorage.setItem('orderId', JSON.stringify(responseOrderData.id))
            cartProducts.map((product) => (
              dispatch(cartActions.deleteItem({ id: product.id, isCombo: false }))
            ))
            cartCombos.map((combo) => (
              dispatch(cartActions.deleteItem({ id: combo.id, isCombo: true }))
            ));
            navigate('/order')
          }
        } else {
          setErrorMessage('Cannot order right now')
          setOpen(true)
        }
      } catch (error) {
        setErrorMessage('Please try again')
        setOpen(true)
      }
    }
  }



  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  const handleClose = () => {
    setErrorMessage('Your cart is empty')
    setOpen(false);
  };

  const isCreateNewOrder = () => {
    return sessionStorage.getItem('orderId') === null
  }
  return (
    <div className="cart__container">
      <ListGroup className="cart">
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert severity="error" sx={{ width: '100%', mb: '100px' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <div className="cart__close">
          <span onClick={toggleCart}>
            <i class="ri-close-fill"></i>
          </span>
        </div>

        <div className="cart__item-list">
          {cartProducts.length === 0 && cartCombos.length === 0 ? (
            <h6 className="text-center mt-5">No item added to the cart</h6>
          ) : (
            <>
              {cartProducts.length > 0 && cartProducts.map((item, index) => (
                <CartItem item={item} key={index} isCombo={false} />
              ))}
              {cartCombos.length > 0 && cartCombos.map((item, index) => (
                <CartItem item={item} key={index} isCombo={true} />
              ))}
            </>
          )}
        </div>
        <div className="cart__bottom d-flex align-items-center justify-content-between">
          <h6>
            Subtotal : <span>${totalAmount}</span>
          </h6>
          {
            isCreateNewOrder() ? (
              <button onClick={createNewOrderAction}>
                Checkout
              </button>
            ) : (
              <button onClick={addFoodOrderAction}>
                Add new food
              </button>
            )
          }

        </div>
      </ListGroup>
    </div>
  );
};

export default Carts;
