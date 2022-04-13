import { useLogoutMutation } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadingActions } from "store/actions/loading";
import { userActions } from "store/actions/user";

const LOGOUT_LOADING_KEY = "logoutLoading";

export function useLogout() {
  const navigate = useNavigate();
  const [logoutMutation, logoutResult] = useLogoutMutation({
    fetchPolicy: "no-cache",
  });
  const logoutHandler = useCallback(() => {
    loadingActions.setLoading({
      loadingKey: LOGOUT_LOADING_KEY,
      isLoading: true,
    });
    void logoutMutation();
  }, [logoutMutation]);
  const { data, error, loading } = logoutResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      userActions.setUser(undefined);
      navigate("/");
      loadingActions.setLoading({
        loadingKey: LOGOUT_LOADING_KEY,
        isLoading: false,
      });
    }
  }, [navigate, data, error, loading]);
  return { logout: logoutHandler };
}
