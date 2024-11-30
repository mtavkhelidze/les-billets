import "./main.css";
import { Container } from "@blocks/Container.tsx";


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container>
      <Routes />
    </Container>
  </StrictMode>,
);
