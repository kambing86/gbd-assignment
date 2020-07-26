import { gql, useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLoadingBackdrop } from "./useLoadingBackdrop";
import { useUser } from "./useUser";

const LOGOUT = gql`
  mutation {
    logout
  }
`;

const LOGOUT_LOADING_KEY = "logoutLoading";

export function useLogout() {
  const { setLoading } = useLoadingBackdrop(LOGOUT_LOADING_KEY);
  const history = useHistory();
  const [logoutMutation, logoutResult] = useMutation(LOGOUT, {
    fetchPolicy: "no-cache",
  });
  const logoutHandler = useCallback(() => {
    setLoading(true);
    logoutMutation();
  }, [logoutMutation, setLoading]);
  const { data, error, loading } = logoutResult;
  const [, setUser] = useUser();
  useEffect(() => {
    if (!loading && (error || data)) {
      setUser(undefined);
      history.push("/");
      setLoading(false);
    }
  }, [history, data, error, loading, setUser, setLoading]);
  return { logout: logoutHandler };
}
