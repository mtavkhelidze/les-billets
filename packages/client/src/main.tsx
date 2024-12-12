import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { CableClerkDaemon } from "@daemons";
import { AppRuntime } from "@lib/runtime.ts";
import * as Layer from "effect/Layer";

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
      Layer.launch(CableClerkDaemon.daemon),
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
