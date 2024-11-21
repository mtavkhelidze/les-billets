import { flow, pipe } from "effect";
import * as Chunk from "effect/Chunk";
import * as Match from "effect/Match";
import type { RawData } from "ws";
//
// const toChunk = flow(
//   new TextDecoder("utf-8").decode,
//   x => Chunk.fromIterable([x]),
// );
// const buffer = ArrayBuffer;
//
// export const rawDataToString = Match.type<RawData>().pipe(
//   Match.when(Match.instanceOfUnsafe(ArrayBuffer), toChunk),
//   Match.when(Match.instanceOfUnsafe(Buffer), toChunk),
//   Match.when(
//     Match.instanceOfUnsafe(Array<Buffer>),
//     xs => Chunk.fromIterable(xs.map(x => pipe(
//       x,
//       new TextDecoder("utf-8").decode,
//     ))),
//   ),
//   Match.exhaustive,
// );
