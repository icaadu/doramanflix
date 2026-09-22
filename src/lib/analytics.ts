declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface PlanCheckoutEvent {
  planName: string;
  value: number;
  currency?: string;
}

/**
 * Fires a Meta Pixel "InitiateCheckout" event when a user clicks to start a
 * plan checkout (PIX). Safe to call even if the Pixel hasn't loaded yet
 * (blocked by an ad blocker, script still loading, etc).
 */
export function trackPlanCheckout({ planName, value, currency = "BRL" }: PlanCheckoutEvent) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "InitiateCheckout", {
    content_name: planName,
    content_category: "Plano de Assinatura",
    value,
    currency,
  });
}
