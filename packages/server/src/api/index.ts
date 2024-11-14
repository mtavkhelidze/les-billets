import { HttpApi, OpenApi } from "@effect/platform";
import { User } from "./user.ts";

export class API extends HttpApi.empty.add(User)
  .annotateContext(
    OpenApi.annotations({
      title: "Les Billets API",
      version: "1.0.0",
    }),
  ) {}

