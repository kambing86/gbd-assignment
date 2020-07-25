import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useRoute } from "./helpers/useRoute";
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

export function useAuth(userType?: USER_TYPE): User | undefined {
  const [, setUser] = useUser();
  const { pushHistory } = useRoute();
  const resolveRef = useRef<() => void>();
  const [userQuery, userResult] = useLazyQuery(USER, {
    onCompleted: () => {
      if (resolveRef.current) resolveRef.current();
    },
  });
  useEffect(() => {
    userQuery();
  }, [userQuery]);
  const { data, error, loading } = userResult;
  useEffect(() => {
    if (!loading) {
      if (error) {
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
    }
  }, [pushHistory, data, error, loading, userType, setUser]);
  return data?.user;
}
