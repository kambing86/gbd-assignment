import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React, { useCallback } from "react";
import { useRoute } from "../../hooks/helpers/useRoute";
import { totalCartCount, useGetCart } from "../../hooks/useCart";

const CartIcon: React.FC = () => {
  const { pushHistory } = useRoute();
  const clickCartHandler = useCallback(() => {
    pushHistory("/customer/cart");
  }, [pushHistory]);
  const { cart } = useGetCart();
  return (
    <IconButton color="inherit" onClick={clickCartHandler}>
      <Badge badgeContent={totalCartCount(cart)} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default React.memo(CartIcon);
