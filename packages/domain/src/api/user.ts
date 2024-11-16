import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { LoginRequest, LoginResponse } from "@my/domain/http";
import {
  InternalServerError,
  InvalidCredentials,
} from "@my/domain/http/errors";

export class UserEndpoints extends HttpApiGroup
  .make("user")
  .add(
    HttpApiEndpoint.post("login", "/login")
      .addError(InternalServerError)
      .addError(InvalidCredentials)
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
