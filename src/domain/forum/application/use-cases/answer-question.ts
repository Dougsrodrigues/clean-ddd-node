import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachments-list'
import { AnswerRepository } from '../repositories/answer-repository'

interface AnswerQuestionUseRequest {
  instructorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}


type AnswerQuestionUseResponse = Either<null, {
  answer: Answer
}>

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseRequest): Promise<AnswerQuestionUseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    const answerAttachment = attachmentsIds.map(attachmentId => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachment)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
