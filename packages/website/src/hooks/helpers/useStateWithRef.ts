import { useState } from "react";
import { useRefInSync } from "./useRefInSync";

/*
this hook is for 2 purposes

1) to avoid invoking useCallback/useEffect again when state is used as deps
which cannot be done with useState

eg:
const [searchValue, setSearchValue] = useStateWithRef("");
const onSearchHandler = useCallback(() => {
  setSearchHistory(searchValue.current);
  if (onClickSearch) {
    onClickSearch(searchValue.current);
  }
}, [setSearchHistory, onClickSearch, searchValue]);

onSearchHandler will always stay the same even though searchValue.current is changed

2) to rerender the updated state which cannot be done with useRef

eg:
const [searchValue, setSearchValue] = useStateWithRef("");
const onChangeHandler = useCallback(
  (input: ValueType<OptionType>) => {
    if (input) {
      if (isArray(input)) {
        setSearchValue(input[0].value);
      } else {
        setSearchValue(input.value);
      }
    } else {
      setSearchValue("");
    }
  },
  [setSearchValue],
);
return (
  <>
    <SearchComponent onChange={onChangeHandler} />
    <Button disabled={searchValue.current === ""}>Search</Button>
  </>
)

the Button will rerender and change the disabled state when searchValue is updated
*/

function useStateWithRef<S>(
  initialState: S | (() => S),
): [React.MutableRefObject<S>, React.Dispatch<React.SetStateAction<S>>];
function useStateWithRef<S = undefined>(): [
  React.MutableRefObject<S | undefined>,
  React.Dispatch<React.SetStateAction<S | undefined>>,
];

function useStateWithRef<T>(
  initialValue?: T | (() => T),
): [
  React.MutableRefObject<T | undefined>,
  React.Dispatch<React.SetStateAction<T | undefined>>,
] {
  const [state, setState] = useState(initialValue);
  const stateRef = useRefInSync(state);
  return [stateRef, setState];
}

export default useStateWithRef;
