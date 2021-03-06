import ProductsIcon from "@material-ui/icons/Kitchen";
import SideBarLink from "components/common/SideBarLink";
import React from "react";

const AdminListItems = () => (
  <>
    <SideBarLink path="/admin" text="Products" icon={<ProductsIcon />} />
  </>
);

export default React.memo(AdminListItems);
