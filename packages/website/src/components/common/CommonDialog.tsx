import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { dialogActions } from "store/actions/dialog";
import { useGetDialog } from "store/selectors/dialog";

const useStyles = makeStyles(() => ({
  notSelected: {
    userSelect: "none",
  },
}));

const CommonDialog = () => {
  const classes = useStyles();
  const closeHandler = useCallback(() => {
    dialogActions.close();
  }, []);
  const { isOpen, title, description } = useGetDialog();
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick={true}
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
