import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { makeQuestion } from "test/factories/make-question"
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository"
import { DeleteQuestionUseCase } from "./delete-question"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })
  it('should be able to delete question', async () => {
    const authorId = new UniqueEntityId()

    const newQuestion = makeQuestion({
      authorId
    }, new UniqueEntityId('question-1'))

    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: authorId.toString()
    })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an question from another user', async () => {
    const authorId = new UniqueEntityId('author-1')

    const newQuestion = makeQuestion({
      authorId
    }, new UniqueEntityId('question-1'))

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})