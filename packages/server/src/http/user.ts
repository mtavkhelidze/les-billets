import { API } from "@api";
import { InvalidCredentials } from "@api/error";
import { HttpApiBuilder } from "@effect/platform";
import * as Effect from "effect/Effect";

export const UserLive = HttpApiBuilder.group(
  API,
  "user",
  handlers => handlers
    .handle("login", ({ payload }) =>
        Effect.fail(new InvalidCredentials({ message: "Invalid email in request" })),
      //   UserProfile.make({
      //     email: payload.email,
      //     fullName: "John Doe",
      //     id: "23f6be43-4bdd-4116-ae4a-8b1203de1045",
      //     jwtToken: O.some("token"),
      //   }),
      // ),
    ),
);
