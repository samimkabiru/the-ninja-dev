"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reads a media query without the usual "set state inside an effect" dance,
 * which causes an extra render pass on every mount.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // On the server there is no viewport, so assume the conservative answer.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export const useFinePointer = () => useMediaQuery("(pointer: fine)");
