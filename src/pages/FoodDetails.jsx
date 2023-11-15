import React, { useState, useEffect } from "react";
import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';

import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";

import "../styles/product-details.css";

import ProductCard from "../components/UI/product-card/ProductCard";

const FoodDetails = () => {
  const product_id = useParams();
  const [product, setProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);
  const [tab, setTab] = useState("desc");
  const [comments, setComments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const responseProductDetail = await axios.get(
          `http://localhost:8080/api/product/${product_id.id}`
        );
        const responseComments = await axios.get(
          'http://localhost:8080/api/comment/', {
          params: {
            productId: product_id.id,
          },
        });
        if (responseProductDetail.status >= 200 && responseProductDetail.status < 300 &&
          responseComments.status >= 200 && responseComments.status < 300) {
          setProduct(responseProductDetail.data);
          setPreviewImg(responseProductDetail.data.images[0].imageUrl)
          setComments(responseComments.data ? responseComments.data : [])
          const responseProductsByCategory = await axios.get('http://localhost:8080/api/product/', {
            params: {
              categoryName: responseProductDetail.data.category.name,
            },
          });
          if (responseProductsByCategory.status >= 200 && responseProductsByCategory.status < 300) {
            setRelatedProduct(responseProductsByCategory.data.filter(
              (item) => item.id !== responseProductDetail.data.id
            ));
            setError('');
          } else {
            setError(responseProductsByCategory.status);
            setProduct([]);
            setRelatedProduct([]);
          }
        } else {
          setError(responseProductDetail.status);
          setProduct([]);
          setRelatedProduct([]);
        }
      } catch (err) {
        setError(err.message);
        setProduct([]);
        setRelatedProduct([]);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [product_id]);

  const { id, name, price, description, images = [], category = [] } = product;
  const dispatch = useDispatch();
  const addItem = () => {
    dispatch(
      cartActions.addItem({
        id, name, price, description, images
      })
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <Helmet title="Product-details">
      <CommonSection title={name} />

      <section>
        <Container>
          {error ? (
            <div>Error occurred: {error}</div>
          ) : isLoading ? (
                <CircularProgress />
              ) : (
            <Row>
              <Col lg="2" md="2">
                <div className="product__images ">
                  {
                    images.map((image) => (
                      <div key={image.id}
                        className="img__item mb-3"
                        onClick={() => setPreviewImg(image.imageUrl)}
                      >
                        <img src={image.imageUrl} alt="" className="w-50" />
                      </div>
                    ))
                  }
                </div>
              </Col>

              <Col lg="4" md="4">
                <div className="product__main-img">
                  <img src={previewImg} alt="" className="w-100" />
                </div>
              </Col>

              <Col lg="6" md="6">
                <div className="single__product-content">
                  <h2 className="product__title mb-3">{name}</h2>
                  <p className="product__price">
                    {" "}
                    Price: <span>${price}</span>
                  </p>
                  <p className="category mb-5">
                    Category: <span>{category.name}</span>
                  </p>

                  <button onClick={addItem} className="addTOCart__btn">
                    Add to Cart
                  </button>
                </div>
              </Col>

              <Col lg="12">
                <div className="tabs d-flex align-items-center gap-5 py-4">
                  <h6
                    className={` ${tab === "desc" ? "tab__active" : ""}`}
                    onClick={() => setTab("desc")}
                  >
                    Description
                  </h6>
                  <h6
                    className={` ${tab === "rev" ? "tab__active" : ""}`}
                    onClick={() => setTab("rev")}
                  >
                    Review
                  </h6>
                </div>

                {tab === "desc" ? (
                  <div className="tab__content">
                    <p>{description}</p>
                  </div>
                ) : (
                  <div className="comment-list">
                    {
                      comments.map((comment) => (
                        <div className="comment">
                          <div className="comment-author">{comment.username}</div>
                          <div className="comment-content">{comment.description}</div>
                        </div>
                      ))
                    }

                  </div>
                )}
              </Col>

              <Col lg="12" className="mb-5 mt-4">
                <h2 className="related__Product-title">You might also like</h2>
              </Col>

              {relatedProduct.map((item) => (
                <Col lg="3" md="4" sm="6" xs="6" className="mb-4" key={item.id}>
                  <ProductCard item={item} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </Helmet>
  );
};

export default FoodDetails;
