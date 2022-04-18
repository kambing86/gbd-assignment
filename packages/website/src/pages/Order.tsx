import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "components/common/MainLayout";
import OrderDetailDialog from "components/customer/OrderDetailDialog";
import OrderList from "components/customer/OrderList";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { Order as OrderStructure } from "hooks/useOrder";
import { usePaginatedOrders } from "hooks/usePaginatedOrders";
import React, { useCallback, useState } from "react";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loading: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  inline: {
    display: "inline",
  },
  seeMore: {
    textAlign: "right",
    marginTop: theme.spacing(3),
  },
}));

const ITEMS_PER_PAGE = 10;

const Order = () => {
  useAuth(CUSTOMER);
  const [viewOrder, setViewOrder] = useState<OrderStructure>();
  const {
    rowsData,
    loading,
    hasData,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
    orderIds,
  } = usePaginatedOrders({
    itemsPerPage: ITEMS_PER_PAGE,
    dataClicked: setViewOrder,
  });

  const classes = useStyles();
  const closeDialogHandler = useCallback(() => {
    setViewOrder(undefined);
  }, []);

  return (
    <MainLayout>
      <Container className={classes.cardGrid} maxWidth="md">
        {loading && (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        )}
        {!loading && !hasData && (
          <Typography variant="h5" align="center">
            You have no order yet
          </Typography>
        )}
        {!loading && rowsData && hasData && (
          <OrderList {...{ orderIds, itemClickHandler }} />
        )}
        <div className={classes.seeMore}>
          <Button
            color="primary"
            href="#"
            onClick={prevPageHandler}
            disabled={!enablePrevPage}
          >
            Prev
          </Button>
          <Button
            color="primary"
            href="#"
            onClick={nextPageHandler}
            disabled={!enableNextPage}
          >
            Next
          </Button>
        </div>
        {viewOrder !== undefined && (
          <OrderDetailDialog
            handleClose={closeDialogHandler}
            order={viewOrder}
          />
        )}
      </Container>
    </MainLayout>
  );
};

export default React.memo(Order);
