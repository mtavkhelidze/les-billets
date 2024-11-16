import { NotFound } from "@blocks/NotFound.tsx";
import { TicketsTable } from "@blocks/tickets-table";
import { UserLogin } from "@blocks/user-login";
import { useUserProfile } from "@services/user_wire.ts";
import * as O from "effect/Option";
import React, { Component } from "react";
import { Redirect, Route, Switch } from "wouter";

// @misha: weak typing, but will work for now
const Protected = <T extends object>(props: T) => {
  const { profile } = useUserProfile();
  console.log(profile);
  const renderChildren = () =>
    O.isSome(profile)
      ? <Component {...props} />
      : <Redirect to="/login" />;

  return (
    <Route>{renderChildren}</Route>
  );
};
export const Routes = () => {
  return (
    <Switch>
      <Route path="/"><Protected><TicketsTable tickets={[]} /></Protected></Route>
      <Route path="/login"><UserLogin /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
};
