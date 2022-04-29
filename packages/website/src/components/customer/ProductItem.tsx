import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { Product as ProductData } from "hooks/useProducts";
import React, { useCallback } from "react";

const useStyles = makeStyles(() => ({
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
    display: "flex !important",
    flexDirection: "column",
    alignItems: "start !important",
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

interface Props {
  id: number;
  useGetProduct: (param: number) => ProductData | undefined;
  itemClickHandler: (id: number, action: string) => void;
  buttonAction: string;
  buttonText: string;
}

const ProductItem = ({
  id,
  useGetProduct,
  itemClickHandler,
  buttonAction,
  buttonText,
}: Props) => {
  const classes = useStyles();
  const product = useGetProduct(id);
  const cardClickHandler = useCallback(() => {
    itemClickHandler(id, buttonAction);
  }, [itemClickHandler, id, buttonAction]);
  if (product === undefined) return null;
  return (
    <Grid item className={classes.itemGrid} sm={6} md={4} lg={3}>
      <Card className={classes.card}>
        <CardActionArea className={classes.cardAction}>
          <CardMedia
            className={classes.cardMedia}
            image={product.image ?? "https://source.unsplash.com/random"}
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
          <Button size="small" color="primary" onClick={cardClickHandler}>
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default React.memo(ProductItem);
