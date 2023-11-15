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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  let visitedPage = pageNumber * productPerPage;

  useEffect(() => {
    const getData = async () => {
      try {
        const responseProducts = await axios.get(
          `http://localhost:8080/api/product`
        );

        const responseCategory = await axios.get(
          `http://localhost:8080/api/category`
        );

        if (responseProducts.status >= 200 && responseProducts.status < 300 &&
          responseCategory.status >= 200 && responseCategory.status < 300) {
          setProduct(responseProducts.data);
          setDisplayProduct(responseProducts.data);
          setCategories(responseCategory.data);
          setError('');
        } else {
          setError(responseProducts.status);
          setPageCount(0);
          setDisplayPage([]);
        }
      } catch (err) {
        setError(err.message);
        setPageCount(null);
        setCategories([]);
        setProduct([]);
        setDisplayPage([]);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

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

  const [choosedCategory, setChoosedCategory] = useState("ALL");

  const changeCategory = (categoryName) => {
    setChoosedCategory(categoryName);
    if (categoryName === "ALL") {
      setDisplayProduct(products);
    }
    else {
      setDisplayProduct(products.filter(
        (item) => item.category.name === categoryName
      ))
    }
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
                        <i class="ri-search-line"></i>
                      </span>
                    </div>
                  </Col>
                  <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
                    <div className="sorting__widget text-end">
                      <select className="w-50">
                        <option>Default</option>
                        <option value="ascending">Alphabetically, A-Z</option>
                        <option value="descending">Alphabetically, Z-A</option>
                        <option value="high-price">High Price</option>
                        <option value="low-price">Low Price</option>
                      </select>
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
                      <ProductCard item={item} />
                    </Col>
                  ))}
                  <div>
                    <ReactPaginate
                      pageCount={pageCount}
                      onPageChange={changePage}
                      previousLabel={"Prev"}
                      nextLabel={"Next"}
                      containerClassName=" paginationBttns "
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
