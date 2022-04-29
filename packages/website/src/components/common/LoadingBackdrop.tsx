import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { useShouldShowLoading } from "store/selectors/loading.selectors";

const useStyles = makeStyles<Theme>((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const LoadingBackdrop = () => {
  const classes = useStyles();
  const isLoading = useShouldShowLoading();
  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default React.memo(LoadingBackdrop);
