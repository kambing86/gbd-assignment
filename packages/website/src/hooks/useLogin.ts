import { gql, useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useStateWithRef from "./helpers/useStateWithRef";
import { useLoadingBackdrop } from "./useLoadingBackdrop";
import { useUser } from "./useUser";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      isAdmin
    }
  }
`;

const USERNAME_KEY = "username";

function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

const LOGIN_LOADING_KEY = "loginLoading";

export function useLogin() {
  const { setLoading } = useLoadingBackdrop(LOGIN_LOADING_KEY);
  const [, setUser] = useUser();
  const history = useHistory();
  const [loginMutation, loginResult] = useMutation(LOGIN, {
    fetchPolicy: "no-cache",
  });
  const savedUsername = getUsername();
  const [isSaveUsername, setIsSaveUsername] = useStateWithRef(
    savedUsername !== "",
  );
  const loginHandler = useCallback(
    (username: string, password: string) => {
      setLoading(true);
      if (isSaveUsername.current) {
        localStorage.setItem(USERNAME_KEY, username);
      } else {
        localStorage.removeItem(USERNAME_KEY);
      }
      loginMutation({
        variables: { username, password },
      });
    },
    [loginMutation, isSaveUsername, setLoading],
  );
  const { data, error, loading } = loginResult;
  useEffect(() => {
    if (!loading && !error && data) {
      const { login } = data;
      if (login) {
        setUser(login);
        if (login.isAdmin) {
          history.push("/admin");
        } else {
          history.push("/customer");
        }
      }
      setLoading(false);
    }
  }, [history, data, error, loading, setLoading, setUser]);
  return {
    login: loginHandler,
    savedUsername,
    isSaveUsername: isSaveUsername.current,
    setIsSaveUsername,
  };
}
