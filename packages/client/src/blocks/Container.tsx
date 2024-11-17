import { Header } from "@blocks/Header.tsx";
import React, { type PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <div
    className="container w-2/3 m-auto flex flex-col min-h-screen"
  >
    <Header />
    <>
      {children}
    </>
  </div>;
};
