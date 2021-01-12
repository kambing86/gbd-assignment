import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useAutoDispatch(
  actionCreator: ActionCreatorWithoutPayload,
): () => void;
export function useAutoDispatch<P>(
  actionCreator: ActionCreatorWithPayload<P>,
): (payload: P) => void;
export function useAutoDispatch<P>(
  actionCreator: ActionCreatorWithOptionalPayload<P>,
): (payload?: P) => void;
export function useAutoDispatch<P>(
  actionCreator:
    | ActionCreatorWithoutPayload
    | ActionCreatorWithPayload<P>
    | ActionCreatorWithOptionalPayload<P>,
) {
  const dispatch = useDispatch();
  return useCallback(
    (payload: P) => {
      dispatch(actionCreator(payload));
    },
    [actionCreator, dispatch],
  );
}
