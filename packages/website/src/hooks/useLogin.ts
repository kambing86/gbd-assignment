import { useLoginMutation } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadingActions } from "store/slices/loading.slice";
import { userActions } from "store/slices/user.slice";
import useStateWithRef from "./helpers/useStateWithRef";

const USERNAME_KEY = "username";

function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

const LOGIN_LOADING_KEY = "loginLoading";

export function useLogin() {
  const navigate = useNavigate();
  const [loginMutation, loginResult] = useLoginMutation({
    fetchPolicy: "no-cache",
  });
  const savedUsername = getUsername();
  const [isSaveUsername, setIsSaveUsername] = useStateWithRef(
    savedUsername !== "",
  );
  const dispatch = useDispatch();
  const loginHandler = useCallback(
    async (username: string, password: string) => {
      dispatch(
        loadingActions.setLoading({
          loadingKey: LOGIN_LOADING_KEY,
          isLoading: true,
        }),
      );
      if (isSaveUsername.current) {
        localStorage.setItem(USERNAME_KEY, username);
      } else {
        localStorage.removeItem(USERNAME_KEY);
      }
      await loginMutation({
        variables: { username, password },
      });
    },
    [dispatch, loginMutation, isSaveUsername],
  );
  const { data, error, loading } = loginResult;
  useEffect(() => {
    if (!loading && !error && data) {
      const { login } = data;
      if (login) {
        dispatch(userActions.setUser(login));
        if (login.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/customer");
        }
      }
      dispatch(
        loadingActions.setLoading({
          loadingKey: LOGIN_LOADING_KEY,
          isLoading: false,
        }),
      );
    }
  }, [navigate, data, error, loading, dispatch]);
  return {
    login: loginHandler,
    savedUsername,
    isSaveUsername: isSaveUsername.current,
    setIsSaveUsername,
  };
}
