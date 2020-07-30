import ProductsIcon from "@material-ui/icons/Kitchen";
import React from "react";
import SideBarLink from "../common/SideBarLink";

const AdminListItems: React.FC = () => (
  <>
    <SideBarLink path="/admin" text="Products" icon={<ProductsIcon />} />
  </>
);

export default AdminListItems;
