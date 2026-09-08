import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { isNativeIOS } from "./platform";

async function safely(run: () => Promise<void>): Promise<void> {
  if (!isNativeIOS()) return;
  try {
    await run();
  } catch (error) {
    console.debug("Native haptics unavailable", error);
  }
}

export const nativeHaptics = {
  tab: () => safely(() => Haptics.impact({ style: ImpactStyle.Light })),
  action: () => safely(() => Haptics.impact({ style: ImpactStyle.Medium })),
  reveal: () => safely(() => Haptics.notification({ type: NotificationType.Success })),
  warning: () => safely(() => Haptics.notification({ type: NotificationType.Warning })),
};
