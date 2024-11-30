import { Header } from "@blocks/Header.tsx";
import { CableReaderDaemon } from "@services/CableReaderService.ts";
import { WsClientService } from "@services/WSClient.ts";
import * as Effect from "effect/Effect";
import React, { type PropsWithChildren, useEffect } from "react";
import { execute } from "../state/runtime.ts";

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    execute(
      CableReaderDaemon.pipe(
        Effect.andThen(daemon => daemon.run()),
        Effect.provide(CableReaderDaemon.live),
        Effect.provide(WsClientService.live),
      ),
    );
  }, []);
  return <div
    className="w-full md:w-4/5 bg-gray-50 px-4 py-2 4 m-auto flex flex-col min-h-screen"
  >
    <Header />
    <div className="container flex-1 flex justify-center pt-2">
      {children}
    </div>
  </div>;
};
