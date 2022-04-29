import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import makeStyles from "@mui/styles/makeStyles";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useGetDialog } from "store/selectors/dialog.selectors";
import { dialogActions } from "store/slices/dialog.slice";

const useStyles = makeStyles(() => ({
  notSelected: {
    userSelect: "none",
  },
}));

const CommonDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const closeHandler = useCallback(() => {
    dispatch(dialogActions.close());
  }, [dispatch]);
  const { isOpen, title, description } = useGetDialog();
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.notSelected} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          className={classes.notSelected}
          id="alert-dialog-description"
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={closeHandler}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(CommonDialog);
