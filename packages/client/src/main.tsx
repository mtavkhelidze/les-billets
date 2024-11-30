import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { CableReaderDaemon } from "@services/CableReaderService.ts";
import { UserProfileService } from "@services/UserProfileService.ts";
import { WsClientService } from "@services/WSClient.ts";

import * as Effect from "effect/Effect";


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";
import { execute } from "./state/runtime.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container>
      <Routes />
    </Container>
  </StrictMode>,
);
