import { NotFound } from "@blocks/NotFound.tsx";
import { TicketsTable } from "@blocks/tickets-table";
import { UserLogin } from "@blocks/user-login";
import { useUserProfile } from "@services/UserWireService.ts";

import React, { type PropsWithChildren } from "react";
import { Route, Switch } from "wouter";

type Props = PropsWithChildren & {
  with: () => boolean;
};

const Protected: React.FC<Props> = props =>
  props.with() ? <>{props.children}</> : <UserLogin />;

export const Routes = () => {
  const { isLoggedIn } = useUserProfile();

  return (
    <Switch>
      <Route path="/">
        <Protected with={() => isLoggedIn}>
          <TicketsTable tickets={[]} />
        </Protected>
      </Route>
      <Route path="/login"><UserLogin /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
};
