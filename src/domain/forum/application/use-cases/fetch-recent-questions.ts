import { Either, right } from '@/core/either'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

interface FetchRecentQuestionUseCaseRequest {
  page: number
}

type FetchRecentQuestionUseCaseResponse = Either<null, {
  questions: Question[]
}>

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionRepository) { }

  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}