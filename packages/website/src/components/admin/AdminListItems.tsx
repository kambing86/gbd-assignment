// import BarChartIcon from "@material-ui/icons/BarChart";
import ProductsIcon from "@material-ui/icons/Kitchen";
// import LayersIcon from "@material-ui/icons/Layers";
// import PeopleIcon from "@material-ui/icons/People";
// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React from "react";
import SideBarLink from "../common/SideBarLink";

const AdminListItems: React.FC = () => (
  <>
    <SideBarLink path="/admin" text="Products" icon={<ProductsIcon />} />
  </>
);

export default AdminListItems;
