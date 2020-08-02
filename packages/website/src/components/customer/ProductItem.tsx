import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent } from "react";
import { RecoilState, useRecoilValue } from "recoil";
import { Product as ProductData } from "../../hooks/useProducts";

const useStyles = makeStyles((theme) => ({
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

interface Props {
  id: number;
  getProduct: (param: number) => RecoilState<ProductData | undefined>;
  itemClickHandler: (event: MouseEvent) => void;
  buttonAction: string;
  buttonText: string;
}

const ProductItem: React.FC<Props> = ({
  id,
  getProduct,
  itemClickHandler,
  buttonAction,
  buttonText,
}) => {
  const classes = useStyles();
  const product = useRecoilValue(getProduct(id));
  if (product === undefined) return null;
  return (
    <Grid item className={classes.itemGrid} sm={6} md={4} lg={3}>
      <Card className={classes.card}>
        <CardActionArea
          className={classes.cardAction}
          data-id={product.id}
          onClick={itemClickHandler}
        >
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
          <Button
            size="small"
            color="primary"
            data-id={product.id}
            data-action={buttonAction}
            onClick={itemClickHandler}
          >
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default React.memo(ProductItem);
