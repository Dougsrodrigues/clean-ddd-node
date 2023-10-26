import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetQuestionBySlugUseRequest {
  slug: string
}

type GetQuestionBySlugUseResponse = Either<ResourceNotFoundError, {
  question: Question
}>

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) { }

  async execute({
    slug,
  }: GetQuestionBySlugUseRequest): Promise<GetQuestionBySlugUseResponse> {

    const question = await this.questionRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
