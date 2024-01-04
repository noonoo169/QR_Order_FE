import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import axios from "axios"
import { Container, Row, Col } from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";

import "../styles/all-foods.css";
import "../styles/pagination.css";

const AllFoods = () => {
  const productPerPage = 4;
  const [pageNumber, setPageNumber] = useState(0);
  const [products, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [displayPage, setDisplayPage] = useState([]);
  const [choosedCategory, setChoosedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // const [visitedPage, setVisitedPage] = useState
  const [isCombo, setIsCombo] = useState(false);
  let visitedPage = pageNumber * productPerPage;
  useEffect(() => {
    const getCategories = async () => {
      try {
        const responseCategory = await axios.get(
          `${process.env.REACT_APP_BE_URL}/api/category`
        );

        if (responseCategory.status >= 200 && responseCategory.status < 300) {
          setCategories(responseCategory.data);
          setError('');
        } else {
          setError(responseCategory.status);
        }
      } catch (err) {
        setError(err.message);
        setCategories([]);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        let endpoint = ''
        if (choosedCategory === 'ALL') {
          endpoint = `${process.env.REACT_APP_BE_URL}/api/product`
          setIsCombo(false)
        }
        else if (choosedCategory === 'COMBO') {
          endpoint = `${process.env.REACT_APP_BE_URL}/api/combo/`
          setIsCombo(true)
        }
        else {
          endpoint = `${process.env.REACT_APP_BE_URL}/api/product/?categoryName=${choosedCategory}`
          setIsCombo(false)
        }
        const response = await axios.get(endpoint);
        if (response.status >= 200 && response.status < 300) {
          // console.log('respone: ', response)
          let data = response.data
          if (data.length > 0) {
            if (data[0].hasOwnProperty('detailsProducts')) {
              // console.log('dataCombo:', data);
              data = data.map(combo => ({
                ...combo,
                images: combo.detailsProducts.map(detail => (
                  detail.product.images[0]
                ))
              }))
            }
            visitedPage = 0
            setProduct(data);
            setDisplayProduct(data);
            setError('');
          }
          else {
            setProduct([]);
            setDisplayProduct([]);
            setError('');
          }
        } else {
          setError(response.status);
          setPageCount(0);
          setDisplayPage([]);
        }
      } catch (err) {
        setError(err.message);
        setPageCount(null);
        setProduct([]);
        setDisplayPage([]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    getData();
  }, [choosedCategory]);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    visitedPage = selected * productPerPage;
    setDisplayPage(
      filteredProducts.slice(
        visitedPage,
        visitedPage + productPerPage
      )
    );
  };

  const changeCategory = (categoryName) => {
    setChoosedCategory(categoryName);
  };

  const filterProduct = (productName) => {
    setDisplayProduct(products.filter(
      (item) => item.name.toLowerCase().includes(productName.toLowerCase())
    ))
  };

  function setDisplayProduct(productData) {
    setFilteredProducts(productData);
    setPageCount(Math.ceil(productData.length / productPerPage));
    setDisplayPage(
      productData.slice(
        visitedPage,
        visitedPage + productPerPage
      )
    );
  }

  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Foods" />
      <section>
        <Container >
          {
            error ? (
              <div>Error occurred: {error}</div>
            ) : isLoading ? (
              <CircularProgress />
            ) : (
              <Row>
                <Col lg="6" md="6" sm="6" xs="12">
                  <div className="search__widget d-flex align-items-center justify-content-between ">
                    <input
                      type="text"
                      placeholder="I'm looking for...."
                      onChange={(e) => filterProduct(e.target.value)}
                      style={{ width: '100%', background: 'none' }}
                    />
                    <span>
                      <i className="ri-search-line"></i>
                    </span>
                  </div>
                </Col>

                <Col lg="12">
                  <div className="food__category d-flex align-items-center justify-content-center gap-2">
                    <button
                      className={`all__btn    ${choosedCategory === "ALL" ? "foodBtnActive" : ""
                        } `}
                      onClick={() => changeCategory('ALL')}
                    >
                      All
                    </button>
                    <button
                      className={`    ${choosedCategory === "COMBO" ? "foodBtnActive" : ""
                        } `}
                      onClick={() => changeCategory('COMBO')}
                    >
                      Combo
                    </button>
                    {categories.map((category) => (
                      <button key={category.id}
                        className={`d-flex align-items-center gap-2 ${choosedCategory === category.name ? "foodBtnActive" : ""
                          } `}
                        onClick={() => changeCategory(category.name)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </Col>
                {displayPage.map((item) => (
                  <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4">
                    <ProductCard item={item} isCombo={isCombo} />
                  </Col>
                ))}
                <div>
                  <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={changePage}
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    containerClassName=" paginationBttns "
                    activeClassName="active"
                  />
                </div>
              </Row>
            )
          }
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;
