import { UniqueEntityId } from "@/core/entities/unique-entity-id"

import { makeAnswer } from "test/factories/make-answer"
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository"
import { DeleteAnswerUseCase } from "./delete-answer"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })
  it('should be able to delete answer', async () => {
    const authorId = new UniqueEntityId()

    const newAnswer = makeAnswer({
      authorId
    }, new UniqueEntityId('answer-1'))

    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: authorId.toString()
    })

    expect(inMemoryAnswerRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const authorId = new UniqueEntityId('author-1')

    const newAnswer = makeAnswer({
      authorId
    }, new UniqueEntityId('answer-1'))

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})