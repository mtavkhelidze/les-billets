import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { CableClerkDaemon } from "@daemons";
import { AppRuntime } from "@lib/runtime.ts";
import * as Layer from "effect/Layer";

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
