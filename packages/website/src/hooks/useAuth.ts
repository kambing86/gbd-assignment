import { useGetUserLazyQuery } from "graphql/types-and-hooks";
import { useEffect, useRef } from "react";
import { dispatch } from "store";
import { useGetUser } from "store/selectors/user";
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
  const [userQuery, userResult] = useGetUserLazyQuery({
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    // only show loading if user data is not ready
    if (userRef.current === undefined) {
      dispatch.loading.setLoading({
        loadingKey: AUTH_LOADING_KEY,
        isLoading: true,
      });
    }
    userQuery();
  }, [userQuery]);
  const { data, error, loading } = userResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      const user = data?.user;
      if (user) {
        dispatch.user.setUser(user);
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
        dispatch.user.setUser(undefined);
        pushHistory("/");
      }
      dispatch.loading.setLoading({
        loadingKey: AUTH_LOADING_KEY,
        isLoading: false,
      });
    }
  }, [pushHistory, data, error, loading, userType]);
}
