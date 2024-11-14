import { Button } from "@blocks/button";
import { useUserLogin } from "@blocks/user-login/UserLogin.hooks.ts";
import { Schema as S } from "@effect/schema";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { useUserProfile } from "@services/user_wire.ts";
import * as O from "effect/Option";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

const FormData = S.Struct({
  email: S.String.pipe(S.nonEmptyString({ message: () => "Email is required" })),
  password: S.String.pipe(S.nonEmptyString({ message: () => "Password is required" })),
});
type FormData = S.Schema.Type<typeof FormData>

export const UserLogin = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: effectTsResolver(FormData),
  });
  const [_, navigate] = useLocation();
  const { loading, error, login, resetError } = useUserLogin();

  const onSubmit = (data: FormData) => {
    void login(data.email, data.password)
      .then(() => navigate("/"));

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
            resetError();
            reset({
              email: "",
              password: "",
            }, { keepErrors: false, keepDirty: false });
          }
        }
        className="flex flex-col w-full md:w-56"
      >
        <div className="mb-2 flex flex-col pb-2">
          <label
            className="text-orange-600 text-sm font-medium pb-2"
            htmlFor="email"
            role="label"
          >
            Email
          </label>
          <input
            autoComplete="username"
            className="p-2 rounded flex-1"
            disabled={loading}
            id="email"
            placeholder="name@example.com"
            type="email"
            {...register("email")}
          />
          <div
            className="text-xs italic h-[1.2rem] text-red-600"
            role="alert"
          >
            {errors.email?.message ?? ""}
          </div>
        </div>
        <div className="mb-3 flex flex-col gap-0">
          <label
            htmlFor="password"
            className="text-orange-600 text-sm font-medium pb-2"
          >Password</label>
          <input
            autoComplete="current-password"
            className="p-2 rounded"
            disabled={loading}
            id="password"
            placeholder="Xa#i1joj"
            type="password"
            {...register("password")}
          />
          <div
            className="text-xs italic h-[1.2rem] text-red-600"
            role="alert"
          >
            {errors.password?.message ?? ""}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button
            type="reset"
            disabled={loading}
            style="secondary"
          >Reset</Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >Login</Button>
        </div>
        <div className="flex flex-row justify-end gap-2">
          {O.getOrNull(error)}
        </div>
      </form>
    </div>
  );
};
