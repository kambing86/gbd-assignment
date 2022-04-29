import Badge from "@mui/material/Badge";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import { useRoute } from "hooks/helpers/useRoute";
import { totalCartCount, useGetCart } from "hooks/useCart";
import React, { useCallback } from "react";

const CartIcon = () => {
  const { pushHistory } = useRoute();
  const clickCartHandler = useCallback(() => {
    pushHistory("/customer/cart");
  }, [pushHistory]);
  const { cart } = useGetCart();
  return (
    <IconButton color="inherit" onClick={clickCartHandler}>
      <Badge
        badgeContent={totalCartCount(cart)}
        color="success"
        overlap="rectangular"
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "success.light",
          },
        }}
      >
        <Icon>shopping_cart</Icon>
      </Badge>
    </IconButton>
  );
};

export default React.memo(CartIcon);
