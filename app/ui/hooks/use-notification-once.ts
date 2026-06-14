import { notifications, type NotificationData } from "@mantine/notifications";
import { useCallback, useRef } from "react";

/**
 * Show a notification at most once per notification id within this component's
 * lifetime. Useful for `useEffect`s that re-run on revalidation — the dedup
 * guard stops the same success/error toast from firing repeatedly.
 */
export function useNotificationOnce() {
  const shownNotificationIdsRef = useRef<Set<string>>(new Set());

  return useCallback((notification: NotificationData) => {
    if (notification.id) {
      if (shownNotificationIdsRef.current.has(notification.id)) {
        return;
      }
      shownNotificationIdsRef.current.add(notification.id);
    }
    notifications.show(notification);
  }, []);
}
