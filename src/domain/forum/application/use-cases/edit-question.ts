import { Either, left, right } from "@/core/either"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Question } from "../../enterprise/entities/question"
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list"
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository"
import { QuestionRepository } from "../repositories/question-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  question: Question
}>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) { }

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

    const questionAttachment = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    questionAttachmentList.update(questionAttachment)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}