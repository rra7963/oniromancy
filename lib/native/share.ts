import { Share } from "@capacitor/share";
import { isNativeIOS } from "./platform";

export interface SharePayload {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}

export async function shareContent(payload: SharePayload): Promise<boolean> {
  if (isNativeIOS()) {
    try {
      await Share.share(payload);
      return true;
    } catch (error) {
      console.debug("Native share cancelled or unavailable", error);
      return false;
    }
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: payload.title, text: payload.text, url: payload.url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
