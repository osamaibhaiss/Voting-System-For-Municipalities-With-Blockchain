import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PayButton from "./PayButton";
import VoteCast from "./admin/VoteCast";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
 
  return (
    <div className="cart-container">
      {cart.cartItems.length === 0 ? (
        <>
          <h2>Groups</h2>
          <div className="cart-empty">
            <p>Admin Has Not Created Group</p>
            <div className="start-shopping">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
                <span>Back main Page</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2>Please Cast a Vote</h2>
          <div className="titles">
            <h3 className="product-title">Group ID</h3>
            <h3 className="price">Group Name</h3>
            <h3 className="price">Total Votes</h3>
            <h3 className="total">Vote</h3>
          </div>
          <div className="cart-items">
            {cart.cartItems &&
              cart.cartItems.map((cartItem) => (
                <div key={cartItem._id}>
                  {cartItem.Groups &&
                    cartItem.Groups.map((item) => (
                      <div className="cart-item" key={item}>
                        <div className="cart-product">
                            <h4>{item.GroupId}</h4>
                          <div>
                          </div>
                        </div>
                        <div className="cart-product-price">{item.Name}</div>
                        <div className="cart-product-price">{item.TotalVoteCast}</div>
                        <div className="vote" style={{ justifySelf: "right" }}>
                          {/* <button className="vote">Cast a Vote</button> */}
                          <VoteCast prodId={cartItem._id} groupid={item.GroupId} />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
          <div className="cart-summary">
            <div className="cart-checkout">
              {cart.cartItems &&
                cart.cartItems.map((cartItem) => (
                  <div className="" key={cartItem._id}>
                    <div className="subtotal">
                      <span>{cartItem.uid}</span>
                    </div>
                    <p>Election City Name: {cartItem.CityName}</p>
                    <PayButton cartItems={cartItem.TxHash} />
                  </div>
                ))
              }

              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Move Back to Elections Page</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
