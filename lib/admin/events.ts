export const ADMIN_REQUESTS_CHANGED_EVENT = "betclear:admin-requests-changed";

export function notifyAdminRequestsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_REQUESTS_CHANGED_EVENT));
}
