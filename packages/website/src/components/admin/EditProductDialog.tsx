import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRefInSync } from "../../hooks/helpers/useRefInSync";
import { Product, useUpdateProduct } from "../../hooks/useProducts";

interface Field {
  name: string;
  label: string;
}
const fieldsToEdit: Field[] = [
  { name: "name", label: "Name" },
  { name: "quantity", label: "Quantity" },
  { name: "price", label: "Price" },
  { name: "isUp", label: "On Shelf" },
];

// TODO: replace with react form library
function useProductInput(product: Product) {
  const [productState, setProductState] = useState(product);
  const changeHandler = useCallback((event: ChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { name, type, value, checked } = event.currentTarget;
    if (type === "checkbox") {
      setProductState((p) => ({
        ...p,
        [name]: checked,
      }));
    } else {
      setProductState((p) => ({
        ...p,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  }, []);
  const allInputs = fieldsToEdit.map((field) => {
    const { name, label } = field;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = productState[field.name];
    const valueType = typeof value;
    if (valueType === "boolean") {
      return (
        <FormControlLabel
          key={name}
          control={
            <Checkbox
              color="primary"
              checked={value}
              onChange={changeHandler}
              name={name}
            />
          }
          label={label}
        />
      );
    }
    return (
      <TextField
        key={name}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label={label}
        name={name}
        autoFocus
        value={value}
        type={valueType === "number" ? "number" : "text"}
        inputProps={valueType === "number" ? { min: 0 } : {}}
        onChange={changeHandler}
      />
    );
  });
  return { productState, allInputs };
}

interface Props {
  handleClose: () => void;
  product: Product;
}

const EditProductDialog: React.FC<Props> = ({ handleClose, product }) => {
  const { productState, allInputs } = useProductInput(product);
  const productRef = useRefInSync(productState);
  const [result, updateProduct] = useUpdateProduct();
  const submitHandler = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      updateProduct(productRef.current);
    },
    [updateProduct, productRef],
  );
  const { loading, data } = result;
  useEffect(() => {
    if (!loading && data) {
      handleClose();
    }
  }, [loading, data, handleClose]);
  return (
    <Dialog
      maxWidth={"md"}
      fullWidth={true}
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick={true}
    >
      <DialogTitle id="responsive-dialog-title">{product?.name}</DialogTitle>
      <form noValidate onSubmit={submitHandler}>
        <DialogContent>{allInputs}</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            onClick={handleClose}
            color="secondary"
          >
            Cancel
          </Button>
          <Button variant="contained" autoFocus type="submit" color="primary">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
