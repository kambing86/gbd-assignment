import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import Copyright from "components/common/Copyright";
import useStateWithRef from "hooks/helpers/useStateWithRef";
import { useAuth } from "hooks/useAuth";
import { useLogin } from "hooks/useLogin";
import React, { ChangeEvent, MouseEvent, useCallback } from "react";

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  useAuth();
  const classes = useStyles();
  const { login, savedUsername, isSaveUsername, setIsSaveUsername } =
    useLogin();
  const [username, setUsername] = useStateWithRef<string>(savedUsername);
  const [password, setPassword] = useStateWithRef<string>("");
  const changeUsernameHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    },
    [setUsername],
  );
  const changePasswordHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [setPassword],
  );
  const changeSaveUsernameHandler = useCallback(
    (_event: React.SyntheticEvent, val: boolean) => setIsSaveUsername(val),
    [setIsSaveUsername],
  );
  const clickLoginHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      void login(username.current, password.current);
    },
    [login, username, password],
  );

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Icon>lock_outlined</Icon>
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus={savedUsername === "" ? true : false}
              value={username.current}
              onChange={changeUsernameHandler}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus={savedUsername === "" ? false : true}
              value={password.current}
              onChange={changePasswordHandler}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              checked={isSaveUsername}
              onChange={changeSaveUsernameHandler}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={clickLoginHandler}
            >
              Login
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default React.memo(Login);
