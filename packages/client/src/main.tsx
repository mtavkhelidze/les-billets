import "./main.css";
import { Container } from "@blocks/Container.tsx";
import { GetTicketList } from "@my/domain/http";
import { WsClientService, WsClientServiceLive } from "@services/WSClient.ts";
import { Effect } from "effect";


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

// Effect.runPromise(
//   Effect.scoped(WsClientService.pipe(
//       Effect.andThen(client => client.send(JSON.stringify(GetTicketList.make({})))),
//       Effect.provide(WsClientServiceLive),
//     ),
//   ),
// );

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container>
      <Routes />
    </Container>
  </StrictMode>,
);
