import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "../slices/cartSlice";
import Cart from "./Cart";



const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (gp) => {
    dispatch(addToCart(gp));
    // Cart(gp);
    navigate("/cart");
  };


  return (
    <div className="home-container">
      {status === "success" ? (
        <>
          <h2>Participate in Elections</h2>
          <div className="products">
            {data &&
              data?.map((product) => (
                <div key={product._id} className="product">
                  <h3 style={{ marginBottom: "0px" }}> Election Day
                    <span style={{ color: "green", fontSize: "10px" }}>{""} {product.CityName}
                    </span>
                    <br />
                    <h6>{new Date(product.ElectionDate *1000).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</h6>
                  </h3>
                  <div className="details">
                    <h5>Election Start <br /><span
                      style={{ fontSize: "10px" }}>
                      {new Date(product.StartTime * 1000).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span></h5>
                    <h5>Election End <br /><span
                      style={{ fontSize: "10px" }}>
                      {new Date(product.EndTime * 1000).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span></h5>
                  </div>
                  <div>
                    <h3>Register Voters: {product.RegisterVotter}</h3>
                    <h4>Total Groups: {product.Groups.length}</h4>
                  </div>
                  {/* <Cart dat = {product} /> */}
                  <button 
                  onClick={() => handleAddToCart(product)}>
                    visit to vote
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occured...</p>
      )}
    </div>
  );
};

export default Home;
