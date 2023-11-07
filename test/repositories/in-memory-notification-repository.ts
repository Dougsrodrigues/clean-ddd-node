import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository"
import { Notification } from "@/domain/notification/enterprise/entitites/notification"


export class InMemoryNotificationsRepository
  implements NotificationsRepository {
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }
}