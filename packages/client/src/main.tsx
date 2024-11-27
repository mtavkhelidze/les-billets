import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { CableReaderLive } from "@services/CableWireService.ts";
import { UserWireService } from "@services/UserWireService.ts";
import { WsClientService } from "@services/WSClient.ts";
import * as Effect from "effect/Effect";


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

UserWireService.runtime.runPromise(
  CableReaderLive.pipe(
    Effect.provide(WsClientService.live),
    Effect.provide(UserWireService.live),
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container>
      <Routes />
    </Container>
  </StrictMode>,
);
