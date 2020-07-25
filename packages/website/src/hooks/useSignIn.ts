import { gql, useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useStateWithRef from "./helpers/useStateWithRef";

const SIGN_IN = gql`
  mutation SignIn($username: String!, $password: String!) {
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

export function useSignIn() {
  const history = useHistory();
  const [signInMutation, signInResult] = useMutation(SIGN_IN);
  const [isSaveUsername, setIsSaveUsername] = useStateWithRef(false);
  const savedUsername = getUsername();
  const signIn = useCallback(
    (username: string, password: string) => {
      if (isSaveUsername.current) {
        localStorage.setItem(USERNAME_KEY, username);
      } else {
        localStorage.removeItem(USERNAME_KEY);
      }
      signInMutation({
        variables: { username, password },
      });
    },
    [signInMutation, isSaveUsername],
  );
  const { data, error, loading } = signInResult;
  useEffect(() => {
    if (!loading && data) {
      const { login } = data;
      if (login) {
        if (login.isAdmin) {
          history.push("/admin");
        } else {
          history.push("/customer");
        }
      }
    }
  }, [history, data, error, loading]);
  return { signIn, savedUsername, isSaveUsername, setIsSaveUsername };
}
