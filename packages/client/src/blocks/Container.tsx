import { Header } from "@blocks/Header.tsx";
import React, { type PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <div
    className="w-full md:w-2/3 lg:w-1/2 bg-gray-50 px-4 py-2 4 m-auto flex flex-col min-h-screen"
  >
    <Header />
    <div className="container flex-1 flex justify-center pt-2">
      {children}
    </div>
  </div>;
};
