import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useCheckCart } from "hooks/useCart";
import {
  AdminPage,
  CartPage,
  CustomerPage,
  NotFoundPage,
  OrderPage,
} from "preload";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Copyright from "./Copyright";
import TopSideBar from "./TopSideBar";

const useStyles = makeStyles<Theme>((theme) => ({
  contentWrapper: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

const MainLayout = () => {
  useCheckCart();
  const classes = useStyles();
  return (
    <Box sx={{ display: "flex" }} color="text.primary">
      <TopSideBar />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <div className={classes.contentWrapper}>
          <div className={classes.appBarSpacer} />
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/customer/cart" element={<CartPage />} />
            <Route path="/customer/order" element={<OrderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Box component="footer" sx={{ my: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(MainLayout);
