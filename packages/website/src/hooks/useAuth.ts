import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useRoute } from "./helpers/useRoute";

const USER = gql`
  query {
    user {
      username
      isAdmin
    }
  }
`;

export function useAuth() {
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
      if (data) {
        const { user } = data;
        if (user !== null) {
          if (user.isAdmin) {
            pushHistory("/admin");
          } else {
            pushHistory("/customer");
          }
        } else {
          pushHistory("/");
        }
      } else if (error) {
        pushHistory("/");
      }
    }
  }, [pushHistory, data, error, loading]);
  if (loading) {
    throw new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }
}
