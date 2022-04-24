import { useGetUserQuery } from "graphql/types-and-hooks";
import { useEffect, useRef } from "react";
import { loadingActions } from "store/actions/loading";
import { userActions } from "store/actions/user";
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
  const userResult = useGetUserQuery({
    fetchPolicy: "no-cache",
  });
  const { data, error, loading } = userResult;
  const loadingIsSet = useRef(false);
  useEffect(() => {
    // only show loading if user data is not ready
    if (userRef.current === undefined && !loadingIsSet.current) {
      loadingIsSet.current = true;
      loadingActions.setLoading({
        loadingKey: AUTH_LOADING_KEY,
        isLoading: true,
      });
    }
  }, []);
  useEffect(() => {
    if (!loading && (error || data)) {
      const user = data?.user;
      if (user) {
        userActions.setUser(user);
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
        userActions.setUser(undefined);
        pushHistory("/");
      }
      loadingActions.setLoading({
        loadingKey: AUTH_LOADING_KEY,
        isLoading: false,
      });
    }
  }, [pushHistory, data, error, loading, userType]);
}
