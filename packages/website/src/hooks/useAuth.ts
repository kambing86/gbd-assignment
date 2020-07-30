import { useEffect, useRef } from "react";
import { useGetUserLazyQuery } from "../graphql/types-and-hooks";
import { useRoute } from "./helpers/useRoute";
import { useLoadingBackdrop } from "./useLoadingBackdrop";
import { useUser } from "./useUser";

export const CUSTOMER = "CUSTOMER";
export const ADMIN = "ADMIN";
type USER_TYPE = typeof CUSTOMER | typeof ADMIN;

const AUTH_LOADING_KEY = "authLoading";

// if userType if undefined, it's used by login page to redirect user
export function useAuth(userType?: USER_TYPE) {
  const { setLoading } = useLoadingBackdrop(AUTH_LOADING_KEY);
  const [userState, setUserState] = useUser();
  const userRef = useRef(userState);
  const { pushHistory } = useRoute();
  const [userQuery, userResult] = useGetUserLazyQuery({
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    // only show loading if user data is not ready
    if (userRef.current === undefined) {
      setLoading(true);
    }
    userQuery();
  }, [userQuery, setLoading]);
  const { data, error, loading } = userResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      const user = data?.user;
      if (user) {
        setUserState(user);
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
        setUserState(undefined);
        pushHistory("/");
      }
      setLoading(false);
    }
  }, [pushHistory, data, error, loading, userType, setUserState, setLoading]);
}
