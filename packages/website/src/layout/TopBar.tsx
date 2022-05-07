import Typography from "@mui/material/Typography";
import CartIcon from "components/customer/CartIcon";
import React from "react";
import { useGetUser } from "store/selectors/user.selectors";

const TopBar = () => {
  const user = useGetUser();
  const isCustomer = Boolean(user && !user.isAdmin);
  return (
    <>
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
    </>
  );
};

export default React.memo(TopBar);
