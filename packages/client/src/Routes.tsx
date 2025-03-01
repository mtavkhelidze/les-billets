import { NotFound } from "@blocks/NotFound.tsx";
import { Tickets } from "@blocks/tickets";
import { UserLogin } from "@blocks/user-login";
import { useUserProfile } from "@state";

import React, { type PropsWithChildren } from "react";
import { Redirect, Route, Switch } from "wouter";

type Props = PropsWithChildren & {
  with: () => boolean;
};

const Protected: React.FC<Props> = props =>
  props.with() ? <>{props.children}</> : <UserLogin />;

export const Routes = () => {
  const { isLoggedIn } = useUserProfile();

  return (
    <Switch>
      <Route path="/"><Redirect to="/tickets" /></Route>
      <Route path="/tickets">
        <Protected with={() => isLoggedIn}>
          <Tickets />
        </Protected>
      </Route>
      <Route path="/login"><UserLogin /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
};
