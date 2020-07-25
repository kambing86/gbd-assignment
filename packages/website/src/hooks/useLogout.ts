import { gql, useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "./useUser";

const LOGOUT = gql`
  mutation {
    logout
  }
`;

export function useLogout() {
  const history = useHistory();
  const [logoutMutation, logoutResult] = useMutation(LOGOUT);
  const logoutHandler = useCallback(() => {
    logoutMutation();
  }, [logoutMutation]);
  const { data, error, loading } = logoutResult;
  const [, setUser] = useUser();
  useEffect(() => {
    if (!loading && !error && data) {
      setUser(undefined);
      const { logout } = data;
      if (logout) {
        history.push("/");
      }
    }
  }, [history, data, error, loading, setUser]);
  return { logout: logoutHandler };
}
