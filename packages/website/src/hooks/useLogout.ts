import { useLogoutMutation } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSetLoading } from "state/useLoadingStore";
import { setUser } from "state/useUserStore";

const LOGOUT_LOADING_KEY = "logoutLoading";

export function useLogout() {
  const setLoading = useSetLoading(LOGOUT_LOADING_KEY);
  const history = useHistory();
  const [logoutMutation, logoutResult] = useLogoutMutation({
    fetchPolicy: "no-cache",
  });
  const logoutHandler = useCallback(async () => {
    setLoading(true);
    await logoutMutation();
  }, [logoutMutation, setLoading]);
  const { data, error, loading } = logoutResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      setUser(undefined);
      history.push("/");
      setLoading(false);
    }
  }, [history, data, error, loading, setLoading]);
  return { logout: logoutHandler };
}
