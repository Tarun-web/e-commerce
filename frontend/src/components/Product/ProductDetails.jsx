import { React, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  // clearErrors,
  getProductDetails,
  // newReview,
} from "../../Services/Actions/productAction";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader/Loader";
import ReactStars from "react-rating-stars-component";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";

//match is used to get id from url
const ProductDetails = () => {
  // console.log(match.params)

  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  );
  // console.log(product);

  //it is a hook  used to fetch params
  const { id } = useParams();
  // console.log(id);

  const options = {
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} --ECOMMERCE`} />

          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img src={item.url} key={i} alt={`${i} Slide`} />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>{product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <span className="detailsBlock-2-span">
                  <ReactStars {...options} />({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>&#8377;{`${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input type="number" />
                    <button>+</button>
                  </div>
                  <button>Add To Cart</button>
                </div>

                <p>
                  Status:{" "}
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">Reviews</h3>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviws &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <div className="noReviews">No Reviews Yet...</div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
