import { useLogoutMutation } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadingActions } from "store/slices/loading.slice";
import { userActions } from "store/slices/user.slice";

const LOGOUT_LOADING_KEY = "logoutLoading";

export function useLogout() {
  const navigate = useNavigate();
  const [logoutMutation, logoutResult] = useLogoutMutation({
    fetchPolicy: "no-cache",
  });
  const dispatch = useDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(
      loadingActions.setLoading({
        loadingKey: LOGOUT_LOADING_KEY,
        isLoading: true,
      }),
    );
    void logoutMutation();
  }, [dispatch, logoutMutation]);
  const { data, error, loading } = logoutResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      dispatch(userActions.setUser(undefined));
      navigate("/");
      dispatch(
        loadingActions.setLoading({
          loadingKey: LOGOUT_LOADING_KEY,
          isLoading: false,
        }),
      );
    }
  }, [navigate, data, error, loading, dispatch]);
  return { logout: logoutHandler };
}
