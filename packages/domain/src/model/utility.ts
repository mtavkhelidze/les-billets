import * as S from "effect/Schema";
import * as Schema from "effect/Schema";

export const EmailPassword = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
});
export type EmailPassword = Schema.Schema.Type<typeof EmailPassword>;

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
