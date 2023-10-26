import { Either, left, right } from "@/core/either";
import { QuestionRepository } from "../repositories/question-repository";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteQuestionUseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, object>
export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) { }

  async execute({
    questionId,
    authorId
  }: DeleteQuestionUseRequest): Promise<DeleteQuestionUseCaseResponse> {

    const question = await this.questionRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError())

    if (authorId !== question.authorId.toString()) return left(new NotAllowedError())

    await this.questionRepository.delete(question)

    return right({})
  }
}
