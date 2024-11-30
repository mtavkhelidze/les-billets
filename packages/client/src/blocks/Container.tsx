import { Header } from "@blocks/Header.tsx";
import { CableReaderDaemon } from "@services/CableReaderService.ts";
import { WsClientService } from "@services/WSClient.ts";
import { StateRuntime } from "@state";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";
import React, { type PropsWithChildren, useEffect } from "react";

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
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
  return <div
    className="w-full md:w-4/5 bg-gray-50 px-4 py-2 4 m-auto flex flex-col min-h-screen"
  >
    <Header />
    <div className="container flex-1 flex justify-center pt-2">
      {children}
    </div>
  </div>;
};
