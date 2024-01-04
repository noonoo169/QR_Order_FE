import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { Container, Row, Col } from "reactstrap";
import "../styles/order.css"
import axios from "axios";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CallStaff from "../components/UI/call-staff/CallStaff";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Order = () => {
  const orderId = JSON.parse(localStorage.getItem('orderId'))
  const [order, setOrder] = useState({});
  const [error, setError] = useState('')

  useEffect(() => {
    const getOrder = async () => {
      try {
        const responseOrder = await axios.get(
          `${process.env.REACT_APP_BE_URL}/api/order/${orderId}`
        );

        if (responseOrder.status >= 200 && responseOrder.status < 300) {
          const responseOrderData = responseOrder.data
          const [year, month, day, hours, minutes, seconds] = responseOrderData.orderTime;
          const date = new Date(year, month - 1, day, hours, minutes, seconds);
          const data = {
            "id": responseOrderData.id,
            "tableName": responseOrderData.tableName,
            "orderStatus": responseOrderData.orderStatus,
            "orderTime": date.toLocaleString(),
            "totalPrice": responseOrderData.totalPrice,
            "orderDetails":
              responseOrderData.orderDetails.map((orderDetail) => {
                const quantity = orderDetail.quantity
                const detail = orderDetail.combo ? orderDetail.combo : orderDetail.product
                const price = detail.price * quantity
                return { name: detail.name, quantity: quantity, price: price }
              })
          }
          setOrder(data)
          setError('');
        } else {
          setError(responseOrder.status);
        }
      } catch (err) {
        setError(err.message);
        setOrder([])
      }
    };
    if (orderId !== null) {
      getOrder();
    }
  }, [orderId]);

  // handle open close cancel order dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  //handle cancel order
  const navigate = useNavigate();
  const [message, setMessage] = useState('Order successfully canceled; create a new one.')
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleCancelOrder = async () => {
    try {
      const responseCancelOrder = await axios.put(
        `${process.env.REACT_APP_BE_URL}/api/order/cancelOfflineOrder/${orderId}`
      );

      if (responseCancelOrder.status >= 200 && responseCancelOrder.status < 300) {
        localStorage.removeItem('orderId')
        setTimeout(() => {
          navigate('/foods');
      }, 3000);
      } else {
        setMessage("Cannot cancel order while it's in progress, please contact to staff");
      }
    } catch (err) {
      setMessage("Cannot cancel order while it's in progress, please contact to staff");
    } finally {
      handleAlertOpen()
    }
  }

  return (
    <Helmet title="Order">
      <CommonSection title="Your Order" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {orderId === null ? (
                <h5 className="text-center">You have not ordered</h5>
              ) : error ? (
                <div>Error occurred: {error}</div>
              ) : order && order.orderDetails ? (
                <div className="card mt-50 mb-50">
                  <div className="main">
                    <span id="sub-title">
                      <p><b>Order detail</b></p>
                    </span>
                    <div className="row row-main justify-content-start">
                      <div className="col">
                        <div className="row d-flex">
                          <p><b>Order: {order.id}</b></p>
                        </div>
                        <div className="row d-flex">
                          <p><b>Table: {order.tableName}</b></p>
                        </div>
                        <div className="row d-flex">
                          <p><b>Date: {order.orderTime}</b></p>
                        </div>
                        <div className="row d-flex">
                          <p><b>Status: {order.orderStatus}</b></p>
                        </div>
                      </div>
                    </div>
                    <hr></hr>
                    {
                      order.orderDetails.map((detail, index) => (
                        <div className="row row-main justify-content-around" key={index} >
                          <div className="col-6">
                            <p><b>{detail.name}</b></p>
                            <p>x {detail.quantity}</p>
                          </div>
                          <div className="col-4 d-flex justify-content-end">
                            <p><b>${detail.price}</b></p>
                          </div>
                        </div>
                      ))
                    }
                    <hr></hr>
                    <div className="total">
                      <div className="row justify-content-around">
                        <div className="col-6"> <b> Total:</b> </div>
                        <div className="col-4 d-flex justify-content-end"> <b>${order.totalPrice}</b> </div>
                      </div>


                      <ButtonGroup className="my-4 d-flex" size="large" aria-label="large button group">
                        <Button className="btn mx-auto" variant="outlined" color="success" href="/foods">
                          Add food
                        </Button>
                        <CallStaff />
                      </ButtonGroup>

                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" color="error" onClick={handleDialogOpen} style={{ marginBottom: '30px' }}>
                          Cancel order
                        </Button>
                        <Dialog open={dialogOpen} onClose={handleDialogClose}>
                          <DialogTitle>Cancel Order</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Are you sure you want to cancel this order?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleDialogClose} color="success" variant="outlined" >
                              No
                            </Button>
                            <Button onClick={handleCancelOrder} color="error" variant="outlined" >
                              Yes
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                <div>Loading...</div>
              )}

            </Col>
          </Row>
        </Container>
      </section>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
        { 
          message === "Order successfully canceled; create a new one." ? (
            <Alert onClose={handleDialogClose} severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>
          ) : (
            <Alert onClose={handleDialogClose} severity="error" sx={{ width: '100%' }}>
              {message}
            </Alert>
          )
        }
      </Snackbar>
    </Helmet>
  );
};



export default Order;
