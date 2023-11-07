import { Notification } from "../../enterprise/entitites/notification";

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>;
}