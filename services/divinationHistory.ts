/**
 * Local history for divination readings — a port of the upstream
 * `divinationHistory` store: the last N readings per type, kept in
 * localStorage so a reading survives a refresh even when the remote history
 * table is unavailable.
 */

import { DivinationReading } from "../types";
import { DivinationType } from "../lib/divination";

const KEY_PREFIX = "oniromancy:divination-history:";
const MAX_PER_TYPE = 10;

const storageKey = (type: DivinationType) => `${KEY_PREFIX}${type}`;

const canUseStorage = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};

export function loadDivinationHistory(type: DivinationType): DivinationReading[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(type));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is DivinationReading =>
        !!item && typeof item.content === "string" && typeof item.id === "string"
    );
  } catch {
    return [];
  }
}

export function saveDivinationToHistory(
  type: DivinationType,
  reading: DivinationReading
): DivinationReading[] {
  if (!canUseStorage()) return [];
  const next = [
    reading,
    ...loadDivinationHistory(type).filter((r) => r.id !== reading.id),
  ].slice(0, MAX_PER_TYPE);
  try {
    window.localStorage.setItem(storageKey(type), JSON.stringify(next));
  } catch {
    // Quota or private mode — history is a convenience, never a hard failure.
  }
  return next;
}

export function clearDivinationHistory(type: DivinationType): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(storageKey(type));
  } catch {
    // ignore
  }
}
