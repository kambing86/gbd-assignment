import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { Order, getLocalDate, getTotalAmount } from "hooks/useOrder";
import React, { useCallback } from "react";

interface Props {
  id: number;
  useGetOrder: (id: number) => Order | undefined;
  itemClickHandler?: (id: number) => void;
}

const OrderItem = ({ id, useGetOrder, itemClickHandler }: Props) => {
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
