import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "components/common/MainLayout";
import OrderDetailDialog from "components/customer/OrderDetailDialog";
import OrderItem from "components/customer/OrderItem";
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
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
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
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
    useGetOrder,
  } = usePaginatedOrders({
    itemsPerPage: ITEMS_PER_PAGE,
    dataClicked: setViewOrder,
  });

  const classes = useStyles();
  const closeDialogHandler = useCallback(() => {
    setViewOrder(undefined);
  }, []);
  const hasData = (rowsData?.rows.length ?? 0) > 0;

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
          <List className={classes.root}>
            {rowsData.rows.map(({ id }) => (
              <OrderItem
                key={id}
                {...{
                  id,
                  useGetOrder,
                  itemClickHandler,
                }}
              />
            ))}
          </List>
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
