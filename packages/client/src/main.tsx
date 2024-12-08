import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { AppRuntime } from "@lib/runtime.ts";
import { GetTicketList } from "@my/domain/http";
import { UserProfile } from "@my/domain/model";
import { UserProfileStoreService } from "@services/UserProfileStoreService.ts";
import { WebSuckerClient } from "@services/WebSuckerClient.ts";
import { WsClientService } from "@services/WSClient.ts";
import { Layer } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";


import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

const onProfile = (po: O.Option<UserProfile>) => {
  return WsClientService.pipe(
    Effect.andThen(wsc => O.match(po, {
        onNone: () => wsc.cleanup(),
        onSome: p => wsc.connectWith(p.jwtToken).pipe(
          Effect.andThen(_ => wsc.send(
              JSON.stringify(
                GetTicketList.make({}),
              ),
            ),
          ),
          Effect.andThen(_ => wsc.messages().pipe(
              Stream.runForEach(x => {
                console.log(">>>>>", x);
                return Effect.void;
              }),
            ),
          ),
        ),
      }),
    ),
  );
};

const watchUserProfile = Layer.effectDiscard(
  UserProfileStoreService.pipe(
    Effect.andThen(store => store.stream().pipe(
        Stream.runForEach(onProfile),
      ),
    ),
  ),
);

const Main = () => {
  useEffect(() => {
    AppRuntime.runPromise(
      WebSuckerClient.send("misha"),
    )
      .then(console.warn)
      .catch(console.warn);

    AppRuntime.runPromise(
      WebSuckerClient.messages(x => console.log("got >>>", x)),
    )
      .then(console.warn)
      .catch(console.warn);
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
