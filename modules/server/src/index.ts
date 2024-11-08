import { pipe } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

import { bunRunProgram } from "./runtime.ts";
import {
  ConnectionStreamService,
  type WebSocketConnection,
} from "./services/ConnectionStreamService.ts";
import { MessageProcessorService } from "./services/MessageProcessorService.ts";
import { MessageStreamService } from "./services/MessageStreamService.ts";

const runClientMessageStream = (wsc: WebSocketConnection) =>
  Effect.all([MessageStreamService, MessageProcessorService]).pipe(
    Effect.andThen(
      ([service, processor]) => pipe(
        service.create(wsc),
        Stream.runForEach(processor.process(wsc)),
      ),
    ),
  );

const program = ConnectionStreamService.pipe(
  Effect.andThen(
    Stream.runForEach(runClientMessageStream),
  ),
);

bunRunProgram(
  program.pipe(
    Effect.provide(Layer.mergeAll(
        ConnectionStreamService.live,
        MessageProcessorService.live,
        MessageStreamService.live,
      ),
    ),
  ),
);
