"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Cache snapshot theo key để `getSnapshot` của useSyncExternalStore trả về
 * cùng tham chiếu khi raw string không đổi (yêu cầu của React).
 */
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readSnapshot<T>(key: string, initial: T): T {
  const raw = readRaw(key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T;
  if (raw === null) {
    value = initial;
  } else {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = initial;
    }
  }
  snapshotCache.set(key, { raw, value });
  return value;
}

/** Tập subscriber theo key — gọi khi localStorage thay đổi từ chính tab này. */
const localSubscribers = new Map<string, Set<() => void>>();

function subscribe(key: string, cb: () => void): () => void {
  // 1) đăng ký listener local cho cùng tab
  let set = localSubscribers.get(key);
  if (!set) {
    set = new Set();
    localSubscribers.set(key, set);
  }
  set.add(cb);

  // 2) đăng ký storage event cho tab khác
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) cb();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    set?.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function notify(key: string) {
  localSubscribers.get(key)?.forEach((cb) => cb());
}

type SetState<T> = T | ((prev: T) => T);

/**
 * Hook đọc/ghi một giá trị JSON-serializable vào localStorage.
 * - SSR-safe: dùng `useSyncExternalStore` để snapshot client/server tách bạch.
 * - Đồng bộ giữa các tab (storage event) và trong cùng tab (local subscribers).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const value = useSyncExternalStore<T>(
    useCallback((cb) => subscribe(key, cb), [key]),
    useCallback(() => readSnapshot(key, initialValue), [key, initialValue]),
    useCallback(() => initialValue, [initialValue])
  );

  const setValue = useCallback(
    (updater: SetState<T>) => {
      const prev = readSnapshot(key, initialValue);
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(prev)
          : updater;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // storage full hoặc bị chặn — ignore
      }
      // Invalidate cache để getSnapshot đọc lại
      snapshotCache.delete(key);
      notify(key);
    },
    [key, initialValue]
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    snapshotCache.delete(key);
    notify(key);
  }, [key]);

  return { value, setValue, reset, hydrated: true };
}
