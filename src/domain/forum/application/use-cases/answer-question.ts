import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

interface AnswerQuestionUseRequest {
  instructorId: string
  questionId: string
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
  }: AnswerQuestionUseRequest): Promise<AnswerQuestionUseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
