/**
 * Central demo store.
 *
 * This is the ONLY place mock data is mutated. UI components never touch it
 * directly — they go through `src/lib/hims/services.ts`, which mirrors the
 * future Laravel REST API. Replacing the mock services with HTTP calls does
 * not require touching any screen.
 */

import { useSyncExternalStore } from "react";
import { buildSeed } from "./seed";
import type { HimsState } from "./types";

const STORAGE_KEY = "abancool.hims.v1";

let state: HimsState | null = null;
const listeners = new Set<() => void>();

function ensure(): HimsState {
  if (!state) state = buildSeed();
  return state;
}

export function getState(): HimsState {
  return ensure();
}

/** SSR snapshot: always the pristine seed so server and client markup match. */
let serverState: HimsState | null = null;
export function getServerState(): HimsState {
  if (!serverState) serverState = buildSeed();
  return serverState;
}

function persist() {
  if (typeof window === "undefined" || !state) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — demo continues in memory */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Apply a mutation. The draft is a shallow clone; always return a new object. */
export function mutate<T>(recipe: (draft: HimsState) => T): T {
  const draft: HimsState = { ...ensure() };
  const result = recipe(draft);
  state = draft;
  persist();
  emit();
  return result;
}

export function hydrateFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      ensure();
      persist();
      emit();
      return;
    }
    const parsed = JSON.parse(raw) as HimsState;
    if (parsed && parsed.version === 1 && Array.isArray(parsed.patients)) {
      state = parsed;
      emit();
    }
  } catch {
    /* corrupt payload — fall back to seed */
  }
}

export function resetDemoData() {
  state = buildSeed();
  persist();
  emit();
}

export function nextSequence(key: string): number {
  const s = ensure();
  const next = (s.counters[key] ?? 0) + 1;
  s.counters = { ...s.counters, [key]: next };
  return next;
}

export function useHimsState(): HimsState {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

export function useHims<T>(selector: (s: HimsState) => T): T {
  return selector(useHimsState());
}
