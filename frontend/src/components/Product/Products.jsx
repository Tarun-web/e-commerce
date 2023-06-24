import React, { Fragment, useEffect } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProducts } from "../../Services/Actions/productAction";
import Loader from "../layouts/Loader/Loader";
import Product from "../Home/Product";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import Pagination from "react-js-pagination";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { useState } from "react";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  //setting the price as usestate as array of 2 elements of min, max price range
  const [price, setPrice] = useState([0, 25000]);

  // setting the current pag value as per the pagination request
  const [currentPage, setCurrentPage] = useState(1);

  //setting the category value
  const [category, setCategory] = useState("");

  //setting the ratings
  const [ratings, setRatings] = useState(0);

  //selector for all the datas from the database
  const {
    loading,
    error,
    products,
    productsCount,
    productsPerPage,
    filteredCount,
  } = useSelector((state) => state.products);

  //applying the keyword search filteration
  const { keyword } = useParams();

  //setting the current page value
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  //setting the priceHandler value
  let priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  let count = filteredCount;

  useEffect(() => {
    dispatch(getProducts(keyword, currentPage, price, category, ratings));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert, keyword, price, category, currentPage, ratings]);
  // console.log(productsCount)
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Products --ECOMMERCE" />

          <div className="productsHeading">Products</div>

          <div className="products">
            {products &&
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
          </div>

          {/*----- FILTER BOX WHERE ALL FILTERS WILL BE APPLIED-------- */}

          <div className="filterBox">
            {/*----- PRICE FILTER-------- */}

            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="on"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            {/*-----CATEGORIES ---------- */}

            <Typography>Category</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            {/*----- RATINGS ---------*/}
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {/*----- PAGINATION ---------*/}

          {productsPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productsPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
