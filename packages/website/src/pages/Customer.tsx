import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useMemo } from "react";
import MainLayout from "../components/common/MainLayout";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { usePaginatedProducts } from "../hooks/usePaginatedProducts";
import { Product } from "../hooks/useProducts";
import { useUser } from "../hooks/useUser";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  itemGrid: {
    width: "100%",
  },
  loadingGrid: {
    width: "100%",
    textAlign: "center",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardAction: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  cardMedia: {
    paddingTop: "100%",
    width: "100%",
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    flexGrow: 1,
  },
}));

const ITEMS_PER_PAGE = 8;

export default function Customer() {
  useAuth(CUSTOMER);
  const [user] = useUser();
  const classes = useStyles();
  const title = useMemo(() => `Hello ${user?.username}`, [user]);
  const { addToCart } = useCart();
  const productClicked = useCallback(
    (product?: Product, action?: string) => {
      if (action === "addToCart" && product) {
        addToCart(product);
      }
    },
    [addToCart],
  );
  const {
    rowsData,
    loading,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    pageClickHandler,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    productClicked,
    onShelfOnly: true,
  });

  return (
    <MainLayout title={title}>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={2}>
          {loading && (
            <Grid item className={classes.loadingGrid}>
              <CircularProgress />
            </Grid>
          )}
          {!loading &&
            rowsData &&
            rowsData.rows.map((product) => (
              <Grid
                item
                className={classes.itemGrid}
                key={product.id}
                sm={6}
                md={4}
                lg={3}
              >
                <Card className={classes.card}>
                  <CardActionArea
                    className={classes.cardAction}
                    data-id={product.id}
                    onClick={itemClickHandler}
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={
                        product.image ?? "https://source.unsplash.com/random"
                      }
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        className={classes.productName}
                      >
                        {product.name}
                      </Typography>
                      <Typography gutterBottom variant="h6" component="h3">
                        {`$ ${product.price.toFixed(2)}`}
                      </Typography>
                      <Typography>Quantity: {product.quantity}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      data-id={product.id}
                      data-action="addToCart"
                      onClick={itemClickHandler}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Button
          color="primary"
          href="#"
          onClick={pageClickHandler}
          disabled={!enablePrevPage}
          data-action="prev"
        >
          Prev
        </Button>
        <Button
          color="primary"
          href="#"
          onClick={pageClickHandler}
          disabled={!enableNextPage}
          data-action="next"
        >
          Next
        </Button>
      </Container>
    </MainLayout>
  );
}
