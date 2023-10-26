// Tratamento de error muito conhecido na programação funcional
// Usando functional error handling
// Classes que vão controlar as respostas da aplicação
// Iremos ter 2 classes, Left and Right
// Left significa que a resposta foi de error
// Right significa que a resposta foi de sucesso

// Explicação
/*
O Functional Error Handling (FEH) é uma técnica para lidar com erros de execução de 
forma funcional e previsível, em vez de depender de exceções. Este abordagem verifica
explicitamente erros em tempo de execução e usa funções especializadas para lidar
com eles.
Além disso, ela também permite que os desenvolvedores escrevam códigos mais fáceis 
de entender e debugar — e que sejam mais compostos e reutilizáveis, pois dependem de 
funções especializadas, ao invés de propagar exceções (que podem vazar para fora do 
contexto).
*/

export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}