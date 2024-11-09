// import * as Context from "effect/Context";
// import * as Layer from "effect/Layer";
// import * as PubSub from "effect/PubSub";
//
// interface GeorgianTelegraphId {
//   readonly _: unique symbol;
// }
//
// export interface GeorgianTelegraph {
//   readonly wire: PubSub.PubSub<WireEvent>;
// }
//
// export const GeorgianTelegraph =
//   Context.GenericTag<GeorgianTelegraphId, GeorgianTelegraph>("GeorgianTelegraph");
//
// export const live: GeorgianTelegraph = {
//   _tag: "GeorgianPost",
// };
// export const Telegraph = Layer.succeed(GeorgianTelegraph, live);
