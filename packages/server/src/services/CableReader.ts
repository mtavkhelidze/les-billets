import type { ClientCable } from "@my/domain/http";
import * as Console from "effect/Console";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";


const CableReaderId: unique symbol =
  Symbol.for("@my/server/services/CableReader");

type CableReaderId = typeof CableReaderId;

export interface CableReader {
  react: (cable: ClientCable) => Effect.Effect<void>;
}

export const CableReader = Context.GenericTag<CableReaderId, CableReader>(
  CableReaderId.toString(),
);

export const CableReaderLice =
  Layer.succeed(CableReader, CableReader.of({
      react: (cable: ClientCable) => Console.log(cable).pipe(
        Effect.annotateLogs(CableReaderId.toString(), "ClientCable"),
      ),
    }),
  );
