import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useDialog } from "../../hooks/useDialog";

const useStyles = makeStyles((theme) => ({
  notSelected: {
    userSelect: "none",
  },
}));

const CommonDialog: React.FC = () => {
  const classes = useStyles();
  const { state, close } = useDialog();
  return (
    <Dialog
      open={state.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick={true}
    >
      <DialogTitle className={classes.notSelected} id="alert-dialog-title">
        {state.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          className={classes.notSelected}
          id="alert-dialog-description"
        >
          {state.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={close} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(CommonDialog);
