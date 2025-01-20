import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

export class JsonError extends Data.Error<{
  message: string;
}> {}

export const toJson = <A, I>(schema: S.Schema<A, I>) =>
  (value: A): Effect.Effect<string, JsonError> =>
    Effect.try({
      try: () => S.encodeUnknownSync(schema)(value),
      catch: e => new JsonError({ message: `${e}` }),
    }).pipe(
      Effect.andThen(input => Effect.try({
          try: () => JSON.stringify(input),
          catch: e => new JsonError({ message: `${e}` }),
        }),
      ),
    );

export const fromJson = <A, I>(schema: S.Schema<A, I>) =>
  (json: string): Effect.Effect<A, JsonError> =>
    Effect.try({
      try: () => S.decodeUnknownSync(S.parseJson(schema))(json),
      catch: e => new JsonError({ message: `${e}` }),
    });
