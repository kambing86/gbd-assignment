import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AdminListItems from "components/admin/AdminListItems";
import CustomerListItems from "components/customer/CustomerListItems";
import { useLogout } from "hooks/useLogout";
import React from "react";
import { useGetUser } from "store/selectors/user.selectors";

const SideBarLinkList = () => {
  const { logout } = useLogout();
  const user = useGetUser();
  const isAdmin = Boolean(user?.isAdmin);
  const isCustomer = Boolean(user && !user.isAdmin);
  return (
    <>
      <List>
        {isAdmin && <AdminListItems />}
        {isCustomer && <CustomerListItems />}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <Icon>logout</Icon>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );
};

export default React.memo(SideBarLinkList);
