import { useCallback, useEffect } from "react";

export default function useBodyKeyDown(
  targetKey: string,
  onKeyDown: (event?: any) => void,
  suppress = false
): void {
  const downHandler = useCallback(
    (event) => {
      if (
        !suppress &&
        event.key === targetKey &&
        event.target.tagName === "BODY" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        onKeyDown(event);
      }
    },
    [suppress, targetKey, onKeyDown]
  );
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return (): void => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [suppress, targetKey, downHandler]);
}
