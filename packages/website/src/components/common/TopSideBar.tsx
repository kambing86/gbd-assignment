import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AdminListItems from "components/admin/AdminListItems";
import CartIcon from "components/customer/CartIcon";
import CustomerListItems from "components/customer/CustomerListItems";
import { useAppTheme } from "hooks/useAppTheme";
import { useLogout } from "hooks/useLogout";
import React, { useCallback, useState } from "react";
import { useGetUser } from "store/selectors/user.selectors";
import AppBar from "./AppBar";
import Drawer from "./Drawer";

const TopSideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const handleDrawerOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const handleDrawerClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const { theme, toggleDarkMode } = useAppTheme();
  const { logout } = useLogout();
  const user = useGetUser();
  const isAdmin = Boolean(user?.isAdmin);
  const isCustomer = Boolean(user && !user.isAdmin);
  return (
    <>
      <AppBar position="absolute" open={isOpen}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: "36px",
              ...(isOpen && { display: "none" }),
            }}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {`Hello ${user?.username ?? ""}`}
          </Typography>
          {isCustomer && <CartIcon />}
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {theme.palette.mode === "light" ? (
              <Icon>light_mode</Icon>
            ) : (
              <Icon>dark_mode</Icon>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={isOpen}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Toolbar>
        <Divider />
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
      </Drawer>
    </>
  );
};

export default React.memo(TopSideBar);
