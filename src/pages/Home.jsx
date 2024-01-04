import React , {useEffect} from "react";
import { useParams  } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

import heroImg from "../assets/images/hero.png";
import "../styles/hero-section.css";

import { Link } from "react-router-dom";

import Category from "../components/UI/category/Category.jsx";

import "../styles/home.css";

import featureImg01 from "../assets/images/service-01.png";
import featureImg02 from "../assets/images/service-02.png";
import featureImg03 from "../assets/images/service-03.png";

import whyImg from "../assets/images/location.png";

import networkImg from "../assets/images/network.png";

import TestimonialSlider from "../components/UI/slider/TestimonialSlider.jsx";
import axios from "axios"

const featureData = [
  {
    title: "Quick Delivery",
    imgUrl: featureImg01,
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus, doloremque.",
  },

  {
    title: "Super Dine In",
    imgUrl: featureImg02,
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus, doloremque.",
  },
  {
    title: "Easy Pick Up",
    imgUrl: featureImg03,
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus, doloremque.",
  },
];
  
const Home = () => {
  const {table_id} = useParams();

  useEffect(() => {
    const getTable = async () => {
      try {
        
          const responseTable = await axios.get(
            `${process.env.REACT_APP_BE_URL}/api/table/${table_id}`
          );  
          if (responseTable.status >= 200 && responseTable.status < 300) {
            const table = responseTable.data
            console.log('table', table);
            if (table.status === 'EMPTY' && table.tableAccessKey === null) {
              console.log("Can order")
              const table_access_key = uuidv4();
              const responseSetTableAccessKey = await axios.get(
                `${process.env.REACT_APP_BE_URL}/api/table/addTableAccessKey/${table_id}/${table_access_key}`, 
              );
              if (responseSetTableAccessKey.status >= 200 && responseSetTableAccessKey.status < 300) {
                const responseSetTableAccessKeyData = responseSetTableAccessKey.data
                if (responseSetTableAccessKeyData !== "Can't set table access key" &&
                responseSetTableAccessKeyData !== "No item have this ID" ) {
                  localStorage.setItem('table_access_key', table_access_key);
                  localStorage.removeItem('orderId')
                }
              }
              localStorage.setItem('table_id', table_id)
            }
        }
      } catch (err) {
      } 
    };
    getTable();
  }, [table_id]);
  
  return (
    <Helmet title="Home">
        <section>
          <Container>
            <Row>
              <Col lg="6" md="6">
                <div className="hero__content  ">
                  <h5 className="mb-3">Easy way to make an order</h5>
                  <h1 className="mb-4 hero__title">
                    <span>HUNGRY?</span> Just wait <br /> food at
                    <span> your door</span>
                  </h1>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
                    magni delectus tenetur autem, sint veritatis!
                  </p>

                  <div className="hero__btns d-flex align-items-center gap-5 mt-4">
                    
                    <Link to="/foods" className="order__btn d-flex align-items-center justify-content-between">Order now 
                       <i className="ri-arrow-right-s-line"></i>
                    </Link>  
                    
                    <Link to="/foods" className="all__foods-btn">See all foods </Link>
                    
                  </div>

                  <div className=" hero__service  d-flex align-items-center gap-5 mt-5 ">
                    <p className=" d-flex align-items-center gap-2 ">
                      <span className="shipping__icon">
                        <i className="ri-car-line"></i>
                      </span>{" "}
                      No shipping charge
                    </p>

                    <p className=" d-flex align-items-center gap-2 ">
                      <span className="shipping__icon">
                        <i className="ri-shield-check-line"></i>
                      </span>{" "}
                      100% secure checkout
                    </p>
                  </div>
                </div>
              </Col>

              <Col lg="6" md="6">
                <div className="hero__img">
                  <img src={heroImg} alt="hero-img" className="w-100" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="pt-0">
          <Category />
        </section>

        <section>
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h5 className="feature__subtitle mb-4">What we serve</h5>
                <h2 className="feature__title">Just sit back at home</h2>
                <h2 className="feature__title">
                  we will <span>take care</span>
                </h2>
                <p className="mb-1 mt-4 feature__text">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor,
                  officiis?
                </p>
                <p className="feature__text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aperiam, eius.{" "}
                </p>
              </Col>

              {featureData.map((item, index) => (
                <Col lg="4" md="6" sm="6" key={index} className="mt-5">
                  <div className="feature__item text-center px-5 py-3">
                    <img
                      src={item.imgUrl}
                      alt="feature-img"
                      className="w-25 mb-3"
                    />
                    <h5 className=" fw-bold mb-3">{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="why__choose-us">
          <Container>
            <Row>
              <Col lg="6" md="6">
                <img src={whyImg} alt="why-tasty-treat" className="w-100" />
              </Col>

              <Col lg="6" md="6">
                <div className="why__tasty-treat">
                  <h2 className="tasty__treat-title mb-4">
                    Why <span>Tasty Treat?</span>
                  </h2>
                  <p className="tasty__treat-desc">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorum, minus. Tempora reprehenderit a corporis velit,
                    laboriosam vitae ullam, repellat illo sequi odio esse iste
                    fugiat dolor, optio incidunt eligendi deleniti!
                  </p>

                  <ListGroup className="mt-4">
                    <ListGroupItem className="border-0 ps-0">
                      <p className=" choose__us-title d-flex align-items-center gap-2 ">
                        <i className="ri-checkbox-circle-line"></i> Fresh and tasty
                        foods
                      </p>
                      <p className="choose__us-desc">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Quia, voluptatibus.
                      </p>
                    </ListGroupItem>

                    <ListGroupItem className="border-0 ps-0">
                      <p className="choose__us-title d-flex align-items-center gap-2 ">
                        <i className="ri-checkbox-circle-line"></i> Quality support
                      </p>
                      <p className="choose__us-desc">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Qui, earum.
                      </p>
                    </ListGroupItem>

                    <ListGroupItem className="border-0 ps-0">
                      <p className="choose__us-title d-flex align-items-center gap-2 ">
                        <i className="ri-checkbox-circle-line"></i>Order from any
                        location{" "}
                      </p>
                      <p className="choose__us-desc">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Qui, earum.
                      </p>
                    </ListGroupItem>
                  </ListGroup>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container>
            <Row>
              <Col lg="6" md="6">
                <div className="testimonial ">
                  <h5 className="testimonial__subtitle mb-4">Testimonial</h5>
                  <h2 className="testimonial__title mb-4">
                    What our <span>customers</span> are saying
                  </h2>
                  <p className="testimonial__desc">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Distinctio quasi qui minus quos sit perspiciatis inventore
                    quis provident placeat fugiat!
                  </p>

                  <TestimonialSlider />
                </div>
              </Col>

              <Col lg="6" md="6">
                <img src={networkImg} alt="testimonial-img" className="w-100" />
              </Col>
            </Row>
          </Container>
        </section>
    </Helmet>
    
  );
};

export default Home;
