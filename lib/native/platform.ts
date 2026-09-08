import { Capacitor } from "@capacitor/core";

export const APP_ORIGIN = "https://www.oniromancy.com";
export const APP_URL_SCHEME = "oniromancy";

export function isNativeIOS(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";
}

export function markNativeEnvironment(): boolean {
  const nativeIOS = isNativeIOS();
  if (typeof document === "undefined") return nativeIOS;

  const root = document.documentElement;
  const body = document.body;
  if (nativeIOS) {
    root.dataset.capacitor = "true";
    root.dataset.platform = "ios";
    body.dataset.capacitor = "true";
    body.dataset.platform = "ios";
  } else {
    delete root.dataset.capacitor;
    delete root.dataset.platform;
    delete body.dataset.capacitor;
    delete body.dataset.platform;
  }
  return nativeIOS;
}

export function safeInternalPath(rawPath: string | null | undefined): string {
  if (!rawPath || !rawPath.startsWith("/") || rawPath.startsWith("//")) return "/";
  try {
    const url = new URL(rawPath, APP_ORIGIN);
    return url.origin === APP_ORIGIN ? `${url.pathname}${url.search}${url.hash}` : "/";
  } catch {
    return "/";
  }
}

export function isAllowedInAppUrl(url: URL): boolean {
  if (url.protocol === `${APP_URL_SCHEME}:`) return true;
  if (url.protocol !== "https:") return false;
  return (
    url.hostname === "www.oniromancy.com" ||
    url.hostname === "oniromancy.com" ||
    url.hostname.endsWith(".supabase.co")
  );
}
