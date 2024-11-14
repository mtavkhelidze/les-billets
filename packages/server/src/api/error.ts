import * as Schema from "effect/Schema";
import { ReasonPhrases as RP } from "http-status-codes";

const WithMessage = (message: string) => Schema.Struct({
  message: Schema.String.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => message),
  ),
});

class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  WithMessage(RP.NOT_FOUND),
) {}

export class InvalidCredentials
  extends Schema.TaggedError<InvalidCredentials>()(
    "InvalidCredentials",
    WithMessage(RP.UNPROCESSABLE_ENTITY),
  ) {}
