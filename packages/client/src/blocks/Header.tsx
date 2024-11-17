import { useUserProfile } from "@services/UserWireService.ts";
import * as O from "effect/Option";
import Logo from "../assets/les-billets-logo.png";

export const Header = () => {
  const { profile, isLoggedIn, logout } = useUserProfile();

  return isLoggedIn && (
    <header className="py-2 mb-1 flex items-start justify-between border-b border-gray600">
      <img src={Logo} alt="Logo" className="h-10 w-auto" />
      <div className="flex flex-col items-end">
        <div>{profile.pipe(O.map(p => p.name), O.getOrNull)}</div>
        <div
          className="text-xs  cursor-pointer hover:underline text-orange-600"
          onClick={() => logout()}
        >Logout
        </div>
      </div>
    </header>
  );
};
