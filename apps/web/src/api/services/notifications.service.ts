import type { Notification } from "@bridgeed/shared";
import { apiClient } from "../api";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get<{ data: Notification[] }>(
    "/notifications"
  );
  return response.data.data;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await apiClient.patch<{ data: Notification }>(
    `/notifications/${notificationId}/read`
  );
  return response.data.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch("/notifications/read-all");
};
