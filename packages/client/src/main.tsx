import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { CableClerkDaemon } from "@daemons";
import { AppRuntime } from "@lib/runtime.ts";
import { GetTicketList } from "@my/domain/http";
import { pipe } from "effect";

import * as Effect from "effect/Effect";

// void AppRuntime.runPromise(
//   ServerSocketService.create("token").pipe(
//     Effect.andThen(_ => ServerSocketService.send("Misha")),
//     Effect.andThen(_ => ServerSocketService.messages()),
//     Effect.andThen(Stream.runForEach(Console.log)),
//   ),
// ).catch(console.error);
// setTimeout(() => {
//   void AppRuntime.runPromise(
//     ServerSocketService.destroy(),
//   ).catch(console.error);
// }, 5000);
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

const Main = () => {
  useEffect(() => {
    void AppRuntime.runFork(
      pipe(
        CableClerkDaemon.sendCable(GetTicketList.make()),
        Effect.provide(CableClerkDaemon.layer),
      ),
    );
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
