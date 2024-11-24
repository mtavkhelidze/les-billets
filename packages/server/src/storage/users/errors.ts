import { ErrorShape } from "@my/domain/model/utility";
import * as Schema from "effect/Schema";

const ModuleId = Symbol.for("@my/server/storage/users");

export class QueryError extends Schema.TaggedError<QueryError>(
  Symbol.for("@my/server/storage/users/queryError").toString(),
)("QueryError", ErrorShape) {}

export class UserNotFound extends Schema.TaggedError<UserNotFound>(
  Symbol.for("@my/server/storage/users/UserNotFound").toString(),
)("UserNotFound", {}) {}

export const UserStorageError = Schema.Union(
  QueryError,
  UserNotFound,
);
export type UserStorageError = Schema.Schema.Type<typeof UserStorageError>;
