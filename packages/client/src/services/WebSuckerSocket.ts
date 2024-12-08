import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

class CannotConnect extends Schema.TaggedError<CannotConnect>(
  "WebSuckerSocket/CannotCreate")(
  "CannotConnect",
  {
    cause: Schema.Any,
  },
) {}

export const SocketError = Schema.Union(
  CannotConnect,
);
export type SocketError = Schema.Schema.Type<typeof SocketError>;

interface WebSuckerSocketShape {
  readonly open: (url: string) => Effect.Effect<WebSocket, SocketError>;
}

const open: WebSuckerSocketShape["open"] = (url) => Effect.try({
  try: () => new WebSocket(url),
  catch: cause => new CannotConnect({ cause }),
});

export class WebSuckerSocket extends Effect.Tag("WebSuckerSocket")<
  WebSuckerSocket, WebSuckerSocketShape
>() {
  public static live: WebSuckerSocketShape = {
    open,
  };
}
