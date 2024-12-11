import { UserProfileStore } from "@services";
import { Console } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

const tag = "@my/client/daemons/CableClerkDaemon";
const tagFor = (subTag: string) => tag + "/" + subTag;

interface CableClerk {
  readonly work: () => Effect.Effect<void, never, UserProfileStore>;
}

const work: CableClerk["work"] = () =>
  UserProfileStore.stream().pipe(
    Stream.runForEach(Console.log),
  );

export class CableClerkDaemon extends Effect.Tag(tag)<
  CableClerkDaemon,
  CableClerk
>() {
  public static live = Layer.succeed(
    CableClerkDaemon,
    CableClerkDaemon.of({
      work,
    }),
  );
}
