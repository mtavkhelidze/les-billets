import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { CableReaderDaemon } from "@services/CableReaderService.ts";
import { WsClientService } from "@services/WSClient.ts";
import { StateRuntime } from "@state";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";


import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

const Main = () => {
  useEffect(() => {
    StateRuntime.execute(
      CableReaderDaemon.pipe(
        Effect.andThen(daemon => daemon.run()),
        Effect.provide(CableReaderDaemon.live),
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
