import { NotFound } from "@blocks/NotFound.tsx";
import { TicketsTable } from "@blocks/tickets-table";
import { UserLogin } from "@blocks/user-login";
import { useUserProfile } from "@services/UserWireService.ts";
import React from "react";
import { Route, Switch } from "wouter";

const maybeRedirect = (haveUser: boolean) => (el: React.ReactNode) =>
  haveUser ? el : <UserLogin />;

export const Routes = () => {
  const { haveUser } = useUserProfile();

  return (
    <Switch>
      <Route path="/">
        {maybeRedirect(haveUser)(<TicketsTable tickets={[]} />)}
      </Route>
      <Route path="/login"><UserLogin /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
};
