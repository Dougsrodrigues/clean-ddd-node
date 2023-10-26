import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository()

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})