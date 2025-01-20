import * as S from "effect/Schema";

export const EmailPassword = S.Struct({
  email: S.String,
  password: S.String,
});
export type EmailPassword = S.Schema.Type<typeof EmailPassword>;

export const WithMessage = (message: string) => S.Struct({
  message: S.String.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => message),
  ),
});

export const ErrorShape = S.Struct({
  cause: S.Object,
  message: S.NonEmptyString,
  module: S.Symbol,
});
