import { Either, left, right } from "./either"

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

describe('Either', () => {
  it('Success Result', () => {
    const result = doSomeThing(true)

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
  })

  it('Error Result', () => {
    const result = doSomeThing(false)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
  })
})