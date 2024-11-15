import { UserProfile } from "@domain/model";
import * as Context from "effect/Context";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import { KJUR } from "jsrsasign";
import { jwtSecret } from "../config.ts";

const ALG = "RS256";
const header = {
  alg: ALG,
  cty: "JWT",
};

type Payload = {
  sub: UserProfile["id"];
}

export class JwtInvalidSecret extends Schema.TaggedError<JwtInvalidSecret>()(
  "JwtInvalidSecret",
  {},
) {}

export class JwtInvalidToken extends Schema.TaggedError<JwtInvalidToken>()(
  "JwtInvalidToken",
  {},
) {}

export class JwtInvalidPayload extends Schema.TaggedError<JwtInvalidPayload>()(
  "JwtInvalidPayload",
  {},
) {}

export class JwtTokenExpired extends Schema.TaggedError<JwtTokenExpired>()(
  "JwtTokenExpired",
  {},
) {}

export const JwtError = Schema.Union(
  JwtInvalidPayload,
  JwtInvalidSecret,
  JwtInvalidToken,
  JwtTokenExpired,
);
export type JwtError = Schema.Schema.Type<typeof JwtError>;

export class JwtBackend extends Context.Tag("JwtBackend")<
  JwtBackend,
  {
    validate: (token: string) => Effect.Effect<UserProfile["id"], JwtError>;
    create: (user: UserProfile) => Effect.Effect<string, JwtError>;
  }
>() {
  public static live = Layer.succeed(
    JwtBackend,
    JwtBackend.of({
      create: (user: UserProfile) =>
        jwtSecret.pipe(
          Effect.catchAll(_ => Effect.fail(new JwtInvalidSecret())),
          Effect.andThen(secret => DateTime.now.pipe(
              Effect.map(now => (
                  {
                    sub: user.id,
                    iat: Math.floor(now.epochMillis / 1000),
                    exp: Math.floor(
                      now.pipe(
                        DateTime.add({ days: 1 })).epochMillis / 1000,
                    ),
                  }
                ),
              ),
              Effect.map(payload => KJUR.jws.JWS.sign(
                ALG,
                JSON.stringify(header),
                JSON.stringify(payload),
                secret,
              )),
            ),
          ),
        ),
      validate: (token: string) => jwtSecret.pipe(
        Effect.catchAll(_ => new JwtInvalidSecret()),
        Effect.andThen(secret =>
          KJUR.jws.JWS.verify(token, secret)
            ? Effect.void
            : Effect.fail(new JwtInvalidToken()),
        ),
        Effect.andThen(
          Effect.try({
            try: () => KJUR.jws.JWS.parse(token),
            catch: _ => new JwtInvalidToken(),
          }),
        ),
        Effect.flatMap(jws => Effect.fromNullable(jws.payloadObj)),
        Effect.map(
          x => (
            x as Payload
          ).sub,
        ),
        Effect.catchAll(_ => new JwtInvalidPayload()),
      ),
    }),
  );
}
