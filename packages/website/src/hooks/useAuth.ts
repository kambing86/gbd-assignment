import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useRoute } from "./helpers/useRoute";
import { useLoadingBackdrop } from "./useLoadingBackdrop";
import { useUser } from "./useUser";

const USER = gql`
  query {
    user {
      username
      isAdmin
    }
  }
`;

export const CUSTOMER = "CUSTOMER";
export const ADMIN = "ADMIN";
type USER_TYPE = typeof CUSTOMER | typeof ADMIN;

const AUTH_LOADING_KEY = "authLoading";

// if userType if undefined, it's used by login to redirect user
export function useAuth(userType?: USER_TYPE) {
  const { setLoading } = useLoadingBackdrop(AUTH_LOADING_KEY);
  const [userState, setUserState] = useUser();
  const userRef = useRef(userState);
  const { pushHistory } = useRoute();
  const [userQuery, userResult] = useLazyQuery(USER, {
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
      if (error) {
        setUserState(undefined);
        pushHistory("/");
      } else if (data) {
        const { user } = data;
        if (user !== null) {
          setUserState(user);
          if (userType === undefined) {
            if (user.isAdmin) {
              pushHistory("/admin");
            } else {
              pushHistory("/customer");
            }
          }
          if (!user.isAdmin && userType === ADMIN) {
            pushHistory("/customer");
          }
        } else {
          pushHistory("/");
        }
      }
      setLoading(false);
    }
  }, [pushHistory, data, error, loading, userType, setUserState, setLoading]);
}
