import { HttpApiSchema } from "@effect/platform";
import * as S from "effect/Schema";
import { ReasonPhrases as RP, StatusCodes as Code } from "http-status-codes";
import { WithMessage } from "../model/utility.ts";

export class Conflict
  extends S.TaggedError<Conflict>()(
    "Conflict",
    WithMessage(RP.CONFLICT),
    HttpApiSchema.annotations({ status: Code.CONFLICT }),
  ) {}

export class InternalServerError
  extends S.TaggedError<InternalServerError>()(
    "InternalServerError",
    WithMessage(RP.INTERNAL_SERVER_ERROR),
    HttpApiSchema.annotations({ status: Code.INTERNAL_SERVER_ERROR }),
  ) {}

export class Unauthorized extends S.TaggedError<Unauthorized>()(
  "Unauthorized",
  WithMessage(RP.UNAUTHORIZED),
  HttpApiSchema.annotations({ status: Code.UNAUTHORIZED }),
) {}

export class NotFound extends S.TaggedError<NotFound>()(
  "NotFound",
  WithMessage(RP.NOT_FOUND),
  HttpApiSchema.annotations({ status: Code.NOT_FOUND }),
) {}

export class InvalidCredentials
  extends S.TaggedError<InvalidCredentials>()(
    "InvalidCredentials",
    WithMessage("Invalid credentials."),
    HttpApiSchema.annotations({ status: Code.UNPROCESSABLE_ENTITY }),
  ) {}

export const HttpError = S.Union(
  Conflict,
  InternalServerError,
  InvalidCredentials,
  NotFound,
  Unauthorized,
);

export type HttpError = S.Schema.Type<typeof HttpError>;
