import OrderIcon from "@material-ui/icons/ListAlt";
import ExploreIcon from "@material-ui/icons/ShoppingBasket";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React from "react";
import SideBarLink from "../common/SideBarLink";

const CustomerListItems: React.FC = () => (
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

export default CustomerListItems;
