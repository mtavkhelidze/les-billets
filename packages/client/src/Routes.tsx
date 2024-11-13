import { NotFound } from "@blocks/NotFound.tsx";
import { UserLogin } from "@blocks/user-login/UserLogin.tsx";
import { Route, Switch } from "wouter";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/"><UserLogin /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
};
