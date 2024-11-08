import * as S from "effect/Schema";

export const GetTickets = S.Struct({
  $type: S.Literal("GetTickets"),
});

export type GetTickets = S.Schema.Type<typeof GetTickets>

export const ClientMessage = S.Union(
  GetTickets,
);
export type ClientMessage = S.Schema.Type<typeof ClientMessage>

