"use client";

import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IOSBottomNavigation } from "./IOSBottomNavigation";
import {
  APP_ORIGIN,
  APP_URL_SCHEME,
  isAllowedInAppUrl,
  markNativeEnvironment,
  safeInternalPath,
} from "@/lib/native/platform";

const EXTERNAL_SAME_ORIGIN_PATHS = [
  "/about",
  "/blog",
  "/contact",
  "/faq",
  "/partners",
  "/privacy",
  "/symbolism-guide",
  "/tarot-meanings",
  "/terms",
];

function shouldOpenExternally(url: URL): boolean {
  if (url.protocol === "mailto:" || url.protocol === "tel:") return false;
  if (!isAllowedInAppUrl(url)) return url.protocol === "http:" || url.protocol === "https:";
  return (
    url.origin === APP_ORIGIN &&
    EXTERNAL_SAME_ORIGIN_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`))
  );
}

export function NativeAppBridge() {
  const [nativeIOS, setNativeIOS] = useState(false);

  useEffect(() => {
    const enabled = markNativeEnvironment();
    const renderFrame = window.requestAnimationFrame(() => setNativeIOS(enabled));
    if (!enabled) return () => window.cancelAnimationFrame(renderFrame);

    void StatusBar.setStyle({ style: Style.Light });
    void StatusBar.setOverlaysWebView({ overlay: true });

    const subscriptions: Array<{ remove: () => Promise<void> }> = [];

    void Keyboard.addListener("keyboardWillShow", () => {
      document.documentElement.dataset.keyboard = "visible";
    }).then((handle) => subscriptions.push(handle));
    void Keyboard.addListener("keyboardWillHide", () => {
      delete document.documentElement.dataset.keyboard;
    }).then((handle) => subscriptions.push(handle));

    void App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) window.dispatchEvent(new CustomEvent("oniromancy:resume"));
    }).then((handle) => subscriptions.push(handle));

    void App.addListener("appUrlOpen", ({ url }) => {
      try {
        const incoming = new URL(url);
        if (incoming.protocol !== `${APP_URL_SCHEME}:`) return;
        const callbackPath = incoming.host === "auth" && incoming.pathname === "/callback"
          ? `/auth/callback${incoming.search}`
          : safeInternalPath(incoming.searchParams.get("next"));
        void Browser.close().catch(() => undefined);
        window.location.assign(`${APP_ORIGIN}${callbackPath}`);
      } catch (error) {
        console.warn("Ignored invalid app URL", error);
      }
    }).then((handle) => subscriptions.push(handle));

    const interceptLinks = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!shouldOpenExternally(url)) return;
      event.preventDefault();
      event.stopPropagation();
      void Browser.open({ url: url.toString(), presentationStyle: "popover" });
    };
    document.addEventListener("click", interceptLinks, true);

    const online = () => document.documentElement.removeAttribute("data-offline");
    const offline = () => document.documentElement.setAttribute("data-offline", "true");
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    if (!navigator.onLine) offline();

    return () => {
      window.cancelAnimationFrame(renderFrame);
      document.removeEventListener("click", interceptLinks, true);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      subscriptions.forEach((handle) => void handle.remove());
      delete document.documentElement.dataset.keyboard;
    };
  }, []);

  if (!nativeIOS) return null;
  return (
    <>
      <div className="ios-offline-banner" role="status">You’re offline. Some rituals may be unavailable.</div>
      <IOSBottomNavigation />
    </>
  );
}
