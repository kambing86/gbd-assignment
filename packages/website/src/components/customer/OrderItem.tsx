import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { getLocalDate, getTotalAmount } from "hooks/useOrder";
import React, { useCallback } from "react";
import { useGetOrder } from "store/selectors/order.selectors";

interface Props {
  id: number;
  itemClickHandler?: (id: number) => void;
}

const OrderItem = ({ id, itemClickHandler }: Props) => {
  const order = useGetOrder(id);
  const listItemClickHandler = useCallback(() => {
    itemClickHandler?.(id);
  }, [itemClickHandler, id]);
  if (!order) return null;
  return (
    <ListItem
      key={id}
      button
      alignItems="flex-start"
      onClick={listItemClickHandler}
    >
      <ListItemText
        primary={
          <>
            <Typography component="span" variant="h6" color="textPrimary">
              Order created:
            </Typography>
            {` ${getLocalDate(order.createdDate)}`}
          </>
        }
        secondary={
          <>
            <Typography component="span" variant="body2" color="textPrimary">
              Total amount:
            </Typography>
            {` $ ${getTotalAmount(order).toFixed(2)}`}
          </>
        }
      />
    </ListItem>
  );
};

export default React.memo(OrderItem);
