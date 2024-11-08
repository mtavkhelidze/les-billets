import * as Data from "effect/Data";
import * as E from "effect/Either";
import * as S from "effect/Schema";
import * as uuid from "uuid";

export {
  ClientMessage, GetTickets, LockTicket, UpdateTicket,
} from "./ClientMessage.ts";

class ModelError extends Data.Error<{ message: string }> {
}

export class User extends S.Class<User>("User")({
  id: S.UUID,
  email: S.NonEmptyString,
  fullName: S.NonEmptyString,
}) {
  public static create(
    email: string,
    fullName: string,
  ): E.Either<User, ModelError> {
    return E.try({
      try: () => new User({ id: uuid.v4(), email, fullName }),
      catch: e => new ModelError({ message: `${e}` }),
    });
  }
}
