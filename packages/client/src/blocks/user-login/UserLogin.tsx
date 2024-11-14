import { Button } from "@blocks/button";
import { useUserLogin } from "@blocks/user-login/UserLogin.hooks.ts";
import { UserProfile } from "@domain/model";
import { useUserProfile } from "@services/user_wire.ts";
import * as O from "effect/Option";
import * as S from "effect/Schema";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

const FormUser = UserProfile.pipe(
  S.pick("email"),
  S.extend(
    S.Struct({
      password: S.String,
    }),
  ),
);

type FormData = S.Schema.Type<typeof FormUser>

export const UserLogin = () => {
  const { handleSubmit, register, reset } = useForm<FormData>();
  const [_, navigate] = useLocation();

  const { profile } = useUserProfile();
  const { loading, error, login } = useUserLogin();

  const onSubmit = (data: FormData) => {

  };
  return (
    <div className="flex flex-col w-full justify-center items-center gap-4">
      <h1 className="m-2 text-xl text-orange-600 font-bold">Login</h1>
      <h1 className="m-2 text-xs md:w-56 w-full font-extralight">
        <code>
          use:
          <br />| user@one.com:pass!Un
          <br />| user@two.com:pass@Deux
          <br />| user@three.com:pass#Trois
        </code>
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onReset={
          () => {
            reset({
              email: "",
              password: "",
            }, { keepErrors: false, keepDirty: false });
          }
        }
        className="flex gap-3 flex-col w-full md:w-56"
      >
        <div className="mb-3 flex flex-col gap-2">
          <label
            className="text-orange-600 text-sm font-medium"
            htmlFor="email"
            role="label"
          >Email</label>
          <input
            autoComplete="username"
            id="email"
            placeholder="name@example.com"
            type="email"
            {...register("email")}
            className="p-2 rounded flex-1"
          />
        </div>
        <div className="mb-3 flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-orange-600 text-sm font-medium"
          >Password</label>
          <input
            autoComplete="current-password"
            id="password"
            type="password"
            placeholder="Xa#i1joj"
            {...register("password")}
            className="p-2 rounded"
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button type="reset" style="secondary">Reset</Button>
          <Button type="submit">Login</Button>
        </div>
        <div className="flex flex-row justify-end gap-2">
          {O.getOrNull(error)}
        </div>
      </form>
    </div>
  );
};
