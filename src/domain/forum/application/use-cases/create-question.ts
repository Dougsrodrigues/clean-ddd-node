import { Either, right } from "@/core/either"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Question } from "../../enterprise/entities/question"
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list"
import { QuestionRepository } from "../repositories/question-repository"
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"

interface CreateQuestionUseRequest {
  authorId: string
  title: string
  content: string
  attachmenstId: string[]
}

type CreateQuestionUseResponse = Either<null, {
  question: Question
}>

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) { }

  async execute({
    authorId,
    title,
    content,
    attachmenstId
  }: CreateQuestionUseRequest): Promise<CreateQuestionUseResponse> {

    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    })

    const questionAttachment = attachmenstId.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachment)

    await this.questionRepository.create(question)

    return right({ question })
  }
}
