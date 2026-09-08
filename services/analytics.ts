import { sendGAEvent } from '@next/third-parties/google'

export type AnalyticsEvent = 
  | 'view_dream'
  | 'analyze_dream'
  | 'view_tarot'
  | 'draw_tarot'
  | 'view_horoscope'
  | 'draw_horoscope'
  | 'begin_checkout'
  | 'purchase'
  | 'login'
  | 'signup'
  | 'update_profile'
  | 'share_dream'
  | 'share_social'
  | 'share_copy_link'
  | 'download_dream'
  | 'view_faq_question'
  | 'select_content'
  | 'generate_lead'
  | 'view_pricing'
  | 'logout'
  | 'error';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

export const trackEvent = (eventName: AnalyticsEvent, params?: EventParams) => {
  try {
    
    // Check if GA ID is present
    if (!process.env.NEXT_PUBLIC_GA_ID) {
      console.warn("[Analytics] NEXT_PUBLIC_GA_ID is missing. Event not sent to GA.");
      return;
    }

    // Send to Google Analytics
    sendGAEvent('event', eventName, params || {});
    
  } catch (e) {
    console.warn("[Analytics] Failed to track event:", e);
  }
};
