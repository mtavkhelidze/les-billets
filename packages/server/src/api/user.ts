import { InvalidCredentials } from "@api/error";
import { LoginRequest, LoginResponse } from "@domain/model/http";
import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { StatusCodes } from "http-status-codes";

export class User extends HttpApiGroup
  .make("user")
  .add(
    HttpApiEndpoint.post("login", "/login")
      .addError(
        InvalidCredentials,
        { status: StatusCodes.UNPROCESSABLE_ENTITY },
      )
      .addSuccess(LoginResponse)
      .setPayload(LoginRequest),
  )
  .prefix("/user")
  .annotateContext(
    OpenApi.annotations({
      title: "User API",
      description: "User register/login/profile",
      version: "1.0.0",
    }),
  ) {}
