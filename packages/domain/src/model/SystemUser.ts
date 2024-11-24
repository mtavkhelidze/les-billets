import * as S from "effect/Schema";

export const UserID = S.UUID;
export type UserID = S.Schema.Type<typeof UserID>;

export class SystemUser extends S.Class<SystemUser>(
  "@my/domain/model/SystemUser",
)({
  email: S.NonEmptyString,
  id: UserID,
  name: S.NonEmptyString,
}) {}
