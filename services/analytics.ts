type AnalyticsEvent = {
  name: string;
  props?: Record<string, string | number | boolean>;
};

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = (import.meta.env?.VITE_GA_ID as string | undefined) || "G-8Q5JCKR61F";

let context = {
  language: "pt-BR",
  page_path: "/",
  page_title: ""
};

export const initAnalytics = () => {
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) {
    window.gtag = function gtag(){ window.dataLayer?.push(arguments); };
  }
  window.gtag("config", GA_ID, { send_page_view: false });
};

export const setAnalyticsContext = (next: { language: string; page_path: string; page_title: string }) => {
  context = { ...context, ...next };
};

export const trackEvent = ({ name, props }: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, { ...context, ...(props || {}) });
};

export const trackPageView = (path: string, lang: string) => {
  trackEvent({ name: 'page_view', props: { page_path: path, page_title: context.page_title, language: lang } });
};
