import { useLogoutMutation } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { dispatch } from "store";

const LOGOUT_LOADING_KEY = "logoutLoading";

export function useLogout() {
  const history = useHistory();
  const [logoutMutation, logoutResult] = useLogoutMutation({
    fetchPolicy: "no-cache",
  });
  const logoutHandler = useCallback(async () => {
    dispatch.loading.setLoading({
      loadingKey: LOGOUT_LOADING_KEY,
      isLoading: true,
    });
    await logoutMutation();
  }, [logoutMutation]);
  const { data, error, loading } = logoutResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      dispatch.user.setUser(undefined);
      history.push("/");
      dispatch.loading.setLoading({
        loadingKey: LOGOUT_LOADING_KEY,
        isLoading: false,
      });
    }
  }, [history, data, error, loading]);
  return { logout: logoutHandler };
}
