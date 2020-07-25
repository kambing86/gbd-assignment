import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

export function useRoute() {
  const history = useHistory();
  const location = useLocation();

  const pushHistory = useCallback(
    (path: string) => {
      if (location.pathname !== path) {
        history.push(path);
      }
    },
    [history, location],
  );

  return {
    history,
    location,
    pushHistory,
  };
}
