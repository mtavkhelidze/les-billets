import * as Context from "effect/Context";
import * as Effect from "effect/Effect";

const CableClerkId = Symbol.for("@my/client/daemons/CableClerk");
type CableClerkId = typeof CableClerkId;

interface CableClerk {
  run: () => Promise<void>;
}

export const CableClerkDaemon = Context.GenericTag<CableClerkId, CableClerk>(
  CableClerkId.toString(),
);

