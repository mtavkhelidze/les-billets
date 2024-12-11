import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { AppRuntime } from "@lib/runtime.ts";
import { ServerSocketService } from "@services";
import { Console } from "effect";

import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";


import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

const Main = () => {
  useEffect(() => {
    void AppRuntime.runPromise(
      ServerSocketService.create("token").pipe(
        Effect.andThen(_ => ServerSocketService.send("Misha")),
        Effect.andThen(_ => ServerSocketService.messages()),
        Effect.andThen(Stream.runForEach(Console.log)),
      ),
    ).catch(console.error);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      void AppRuntime.runPromise(
        ServerSocketService.destroy(),
      ).catch(console.error);
    }, 5000);
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
