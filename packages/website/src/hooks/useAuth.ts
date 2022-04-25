import { useGetUserQuery } from "graphql/types-and-hooks";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useGetUser } from "store/selectors/user.selectors";
import { loadingActions } from "store/slices/loading.slice";
import { userActions } from "store/slices/user.slice";
import { useRoute } from "./helpers/useRoute";

export const CUSTOMER = "CUSTOMER";
export const ADMIN = "ADMIN";
type USER_TYPE = typeof CUSTOMER | typeof ADMIN;

const AUTH_LOADING_KEY = "authLoading";

// if userType if undefined, it's used by login page to redirect user
export function useAuth(userType?: USER_TYPE) {
  const userState = useGetUser();
  const userRef = useRef(userState);
  const { pushHistory } = useRoute();
  const userResult = useGetUserQuery({
    fetchPolicy: "no-cache",
  });
  const { data, error, loading } = userResult;
  const loadingIsSet = useRef(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // only show loading if user data is not ready
    if (userRef.current === undefined && !loadingIsSet.current) {
      loadingIsSet.current = true;
      dispatch(
        loadingActions.setLoading({
          loadingKey: AUTH_LOADING_KEY,
          isLoading: true,
        }),
      );
    }
  }, [dispatch]);
  useEffect(() => {
    if (!loading && (error || data)) {
      const user = data?.user;
      if (user) {
        dispatch(userActions.setUser(user));
        // for login page
        if (userType === undefined) {
          if (user.isAdmin) {
            pushHistory("/admin");
          } else {
            pushHistory("/customer");
          }
        }
        // for customer who went into admin pages
        if (!user.isAdmin && userType === ADMIN) {
          pushHistory("/customer");
        }
      } else {
        dispatch(userActions.setUser(undefined));
        pushHistory("/");
      }
      dispatch(
        loadingActions.setLoading({
          loadingKey: AUTH_LOADING_KEY,
          isLoading: false,
        }),
      );
    }
  }, [pushHistory, data, error, loading, userType, dispatch]);
}
