import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { UserProfile } from "@my/domain/model";
import { UserProfileStoreService } from "@services/UserProfileStoreService.ts";
import { WsClientService } from "@services/WSClient.ts";
import { StateRuntime } from "@state";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";


import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

const onProfile = (po: O.Option<UserProfile>) => {
  return WsClientService.pipe(
    Effect.andThen(wsc => O.match(po, {
        onNone: () => wsc.cleanup(),
        onSome: p => wsc.connectWith(p.jwtToken),
      }),
    ),
  );
  // return WsClientService.pipe(
  //   Effect.map(wsc => {
  //     console.count("onProfile");
  //     return wsc.connectWith;
  //   }),
  // );
  // return WsClientService.pipe(
  //   Effect.andThen(wsc =>
  //     O.match(po, {
  //       onSome: p => {
  //         return wsc.connectWith(p.jwtToken);
  //       },
  //       onNone: () => {
  //         return wsc.cleanup();
  //       },
  //     }),
  //   ),
  //   Effect.tapBoth({
  //     onSuccess: Console.log,
  //     onFailure: Console.warn,
  //   })
  // );
};
const watchUserProfile = () =>
  UserProfileStoreService.pipe(
    Effect.andThen(store => store.stream().pipe(
        Stream.runForEach(onProfile),
      ),
    ),
    Effect.scoped,
  );

const Main = () => {
  useEffect(() => {
    StateRuntime.execute(
      watchUserProfile().pipe(
        Effect.provide(WsClientService.live),
      ),
    )
      .then(constVoid)
      .catch(constVoid);
  }, []);

  return (
    <StrictMode>
      <Container>
        <Routes />
      </Container>
    </StrictMode>
  );
};
createRoot(document.getElementById("root")!).render(<Main />);
