import { useLoginMutation } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadingActions } from "store/actions/loading";
import { userActions } from "store/actions/user";
import useStateWithRef from "./helpers/useStateWithRef";

const USERNAME_KEY = "username";

function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

const LOGIN_LOADING_KEY = "loginLoading";

export function useLogin() {
  const history = useHistory();
  const [loginMutation, loginResult] = useLoginMutation({
    fetchPolicy: "no-cache",
  });
  const savedUsername = getUsername();
  const [isSaveUsername, setIsSaveUsername] = useStateWithRef(
    savedUsername !== "",
  );
  const loginHandler = useCallback(
    async (username: string, password: string) => {
      loadingActions.setLoading({
        loadingKey: LOGIN_LOADING_KEY,
        isLoading: true,
      });
      if (isSaveUsername.current) {
        localStorage.setItem(USERNAME_KEY, username);
      } else {
        localStorage.removeItem(USERNAME_KEY);
      }
      await loginMutation({
        variables: { username, password },
      });
    },
    [loginMutation, isSaveUsername],
  );
  const { data, error, loading } = loginResult;
  useEffect(() => {
    if (!loading && !error && data) {
      const { login } = data;
      if (login) {
        userActions.setUser(login);
        if (login.isAdmin) {
          history.push("/admin");
        } else {
          history.push("/customer");
        }
      }
      loadingActions.setLoading({
        loadingKey: LOGIN_LOADING_KEY,
        isLoading: false,
      });
    }
  }, [history, data, error, loading]);
  return {
    login: loginHandler,
    savedUsername,
    isSaveUsername: isSaveUsername.current,
    setIsSaveUsername,
  };
}
