import { Either, right } from "@/core/either"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Notification } from "../../enterprise/entitites/notification"
import { NotificationsRepository } from "../repositories/notifications-repository"
interface SendNotificationUseRequest {
  recipientId: string
  title: string
  content: string

}

type SendNotificationUseResponse = Either<null, {
  notification: Notification
}>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) { }

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseRequest): Promise<SendNotificationUseResponse> {

    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content
    })

    return right({ notification })
  }
}
