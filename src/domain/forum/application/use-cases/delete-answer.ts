import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answer-repository";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteAnswerUseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, object>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    answerId,
    authorId
  }: DeleteAnswerUseRequest): Promise<DeleteAnswerUseCaseResponse> {

    const answer = await this.answerRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError())

    if (authorId !== answer.authorId.toString()) return left(new NotAllowedError())

    await this.answerRepository.delete(answer)

    return right({})
  }
}
