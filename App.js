import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { uiActions } from "./Store/ui-slice";
import Notification from "./components/UI/Notification";
import { fetchCardData } from "./Store/cart-actions";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    dispatch(fetchCardData());
  }, [dispatch]);

  useEffect(() => {
    const sendCardData = async () => {
      if (cart.changed) {
        dispatch(
          uiActions.showNotifications({
            status: "pending",
            title: "Sending...",
            message: "Sending cart data!",
          })
        );
        const response = await fetch(
          "https://food-ordering-acb5d-default-rtdb.europe-west1.firebasedatabase.app/cart.json",
          { method: "PUT", body: JSON.stringify(cart) }
        );

        if (!response.ok) {
          throw new Error(" Sending cart data failed!");
        }

        dispatch(
          uiActions.showNotifications({
            status: "success",
            title: "Success.",
            message: "Sent cart data succesfully!",
          })
        );
        await response.json();
      }
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCardData().catch((error) => {
      dispatch(
        uiActions.showNotifications({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
