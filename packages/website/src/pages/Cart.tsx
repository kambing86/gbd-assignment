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
import React, { MouseEvent, useCallback, useMemo, useRef } from "react";
import MainLayout from "../components/common/MainLayout";
import PlaceOrder from "../components/customer/PlaceOrder";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import { useCart, useCartWithProduct } from "../hooks/useCart";
import { useUser } from "../hooks/useUser";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loadingGrid: {
    padding: theme.spacing(8),
    width: "100%",
    textAlign: "center",
  },
  itemGrid: {
    width: "100%",
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

export default function Cart() {
  useAuth(CUSTOMER);
  const [user] = useUser();
  const classes = useStyles();
  const title = useMemo(() => `Hello ${user?.username}`, [user]);
  const { removeFromCart } = useCart();
  const { cartProducts, isReady } = useCartWithProduct();
  const productsRef = useRef(cartProducts);
  productsRef.current = cartProducts;
  const itemClickHandler = useCallback(
    (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const product = productsRef.current?.find((p) => p.id === id);
      if (product && action === "removeFromCart") {
        removeFromCart(product);
      }
    },
    [productsRef, removeFromCart],
  );

  return (
    <MainLayout title={title}>
      {!isReady && (
        <Grid item className={classes.loadingGrid}>
          <CircularProgress />
        </Grid>
      )}
      {isReady && (
        <Container className={classes.cardGrid} maxWidth="md">
          <PlaceOrder />
          {cartProducts.length === 0 && (
            <Typography variant="h5" align="center">
              Your cart is empty
            </Typography>
          )}
          <Grid container spacing={2}>
            {cartProducts.map((product) => (
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
                      <Typography>In Cart: {product.quantity}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      data-id={product.id}
                      data-action="removeFromCart"
                      onClick={itemClickHandler}
                    >
                      Remove From Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {cartProducts.length > 4 && <PlaceOrder />}
          </Grid>
        </Container>
      )}
    </MainLayout>
  );
}
