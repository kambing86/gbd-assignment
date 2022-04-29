import SideBarLink from "components/common/SideBarLink";
import React from "react";

const CustomerListItems = () => (
  <>
    <SideBarLink path="/customer" text="Explore" icon="shopping_basket" />
    <SideBarLink path="/customer/cart" text="Cart" icon="shopping_cart" />
    <SideBarLink path="/customer/order" text="Order" icon="list_alt" />
  </>
);

export default React.memo(CustomerListItems);
