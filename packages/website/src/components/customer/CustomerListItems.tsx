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
  </>
);

export default CustomerListItems;