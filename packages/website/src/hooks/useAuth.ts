import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { useRoute } from "./helpers/useRoute";
import { useLoadingBackdrop } from "./useLoadingBackdrop";
import { User, useUser } from "./useUser";

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

export function useAuth(userType?: USER_TYPE): User | undefined {
  const { setLoading } = useLoadingBackdrop(AUTH_LOADING_KEY);
  const [, setUser] = useUser();
  const { pushHistory } = useRoute();
  const [userQuery, userResult] = useLazyQuery(USER, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    setLoading(true);
    userQuery();
  }, [userQuery, setLoading]);
  const { data, error, loading } = userResult;
  useEffect(() => {
    if (!loading && (error || data)) {
      if (error) {
        setUser(undefined);
        pushHistory("/");
      } else if (data) {
        const { user } = data;
        if (user !== null) {
          setUser(user);
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
  }, [pushHistory, data, error, loading, userType, setUser, setLoading]);
  return data?.user;
}
