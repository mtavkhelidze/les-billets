import { NotFound } from "@blocks/NotFound.tsx";
import { tickets, TicketsTable } from "@blocks/tickets-table";
import { UserLogin } from "@blocks/user-login";
import { useUserProfile } from "@services/user_wire.ts";
import * as O from "effect/Option";
import React, { Component } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
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
  const { profile } = useUserProfile();
  const [_, navigate] = useLocation();

  return (
    <Switch>
      <Route path="/"><Protected><TicketsTable tickets={tickets} /></Protected></Route>
      <Route path="/login"><UserLogin /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
};
