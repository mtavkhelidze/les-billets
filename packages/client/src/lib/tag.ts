import { pipe } from "effect";
import * as Arr from "effect/Array";
import * as Str from "effect/String";

export const tagWith = (tag: string = "") => (subTag: string = ""): string =>
  pipe(
    Arr.fromIterable([tag, subTag]),
    Arr.filter(Str.isNonEmpty),
    Arr.join("/"),
  );

