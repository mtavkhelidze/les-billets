import { InternalServerError, InvalidCredentials } from "@api/error";
import { LoginRequest, LoginResponse } from "@domain/model/http";
import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";

export class UserEndpoints extends HttpApiGroup
  .make("user")
  .add(
    HttpApiEndpoint.post("login", "/login")
      .addError(InvalidCredentials)
      .addError(InternalServerError)
      .addSuccess(LoginResponse)
      .setPayload(LoginRequest),
  )
  .prefix("/user")
  .annotateContext(
    OpenApi.annotations({
      title: "User Endpoints",
      description: "User register/login/profile",
      version: "1.0.0",
    }),
  ) {}