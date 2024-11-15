import { HttpApiSchema } from "@effect/platform";
import * as Schema from "effect/Schema";
import { ReasonPhrases as RP, StatusCodes as Code } from "http-status-codes";

const WithMessage = (message: string) => Schema.Struct({
  message: Schema.String.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => message),
  ),
});

export class Conflict
  extends Schema.TaggedError<Conflict>()(
    "Conflict",
    WithMessage(RP.CONFLICT),
    HttpApiSchema.annotations({ status: Code.CONFLICT }),
  ) {}

export class InternalServerError
  extends Schema.TaggedError<InternalServerError>()(
    "InternalServerError",
    WithMessage(RP.INTERNAL_SERVER_ERROR),
    HttpApiSchema.annotations({ status: Code.INTERNAL_SERVER_ERROR }),
  ) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  WithMessage(RP.UNAUTHORIZED),
  HttpApiSchema.annotations({ status: Code.UNAUTHORIZED }),
) {}

export class NotFound extends Schema.TaggedError<NotFound>()(
  "NotFound",
  WithMessage(RP.NOT_FOUND),
  HttpApiSchema.annotations({ status: Code.NOT_FOUND }),
) {}

export class InvalidCredentials
  extends Schema.TaggedError<InvalidCredentials>()(
    "InvalidCredentials",
    WithMessage(RP.UNPROCESSABLE_ENTITY),
    HttpApiSchema.annotations({ status: Code.UNPROCESSABLE_ENTITY }),
  ) {}
