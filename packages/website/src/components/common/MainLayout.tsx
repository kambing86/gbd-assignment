import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  footer: {
    padding: theme.spacing(4),
  },
}));

const MainLayout = () => {
  useCheckCart();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TopSideBar />
      <main className={classes.content}>
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
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </main>
    </div>
  );
};

export default React.memo(MainLayout);
