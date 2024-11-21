import { Socket } from "@effect/platform";
import { ApiClient } from "@services/LesBilletsApiClient.ts";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

interface CableReader {
  readonly connect: () => Effect.Effect<boolean, never, Socket.WebSocketConstructor>;
  //process: (cable: ClientCable) => Effect.Effect<void>;
}


class CableReaderImpl implements CableReader {
  public readonly connect = () => {
    return Socket.makeWebSocket("http://localhost:9091/ws").pipe(
      Effect.flatMap(s => s.writer),
      Effect.andThen(send => send("Misha")),
      Effect.scoped,
    );
  };

  constructor(private client: ApiClient) {}
}

export class CableWireService extends Context.Tag("CableWireService")<
  CableWireService,
  CableReader
>() {
  public static live = Layer.succeed(
    CableWireService,
    new CableReaderImpl(ApiClient),
  );
}
