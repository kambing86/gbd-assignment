import { OmitByValue } from "utility-types";

export function removeNullUndefined<T extends Record<string, unknown>>(
  where: T,
): OmitByValue<T, null | undefined> {
  return Object.entries(where).reduce((prev, current) => {
    const [currentKey, currentValue] = current;
    if (currentValue == null) return prev;
    return { ...prev, [currentKey]: currentValue };
  }, {}) as OmitByValue<T, null | undefined>;
}
