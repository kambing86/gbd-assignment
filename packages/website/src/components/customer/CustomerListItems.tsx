import OrderIcon from "@material-ui/icons/ListAlt";
import ExploreIcon from "@material-ui/icons/ShoppingBasket";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SideBarLink from "components/common/SideBarLink";
import React from "react";

const CustomerListItems = (): JSX.Element => (
  <>
    <SideBarLink path="/customer" text="Explore" icon={<ExploreIcon />} />
    <SideBarLink
      path="/customer/cart"
      text="Cart"
      icon={<ShoppingCartIcon />}
    />
    <SideBarLink path="/customer/order" text="Order" icon={<OrderIcon />} />
  </>
);

export default React.memo(CustomerListItems);
