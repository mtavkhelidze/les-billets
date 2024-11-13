import { Button } from "@blocks/button";
import * as S from "@effect/schema/Schema";
import { useUserWire } from "../../services/user_wire.ts";
import { UserRecord } from "model";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { WebUser } from "../../model/WebUser.ts";

const FormUser = UserRecord.pipe(S.omit("id"));
type FormData = S.Schema.Type<typeof FormUser>

export const UserLogin = () => {
  const { handleSubmit, register, reset } = useForm<FormData>();
  const [error, setError] = useState<string>();
  const [_, navigate] = useLocation();

  const { user, setUser } = useUserWire();

  const onSubmit = (data: FormData) => {
    setUser(WebUser.make({
      id: "92dbbee8-b902-413d-81c7-f9b25aaff857",
      fullName: "Misha Tavkhelidze",
      email: "misha@zgharbi.ge",
    }));
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="m-2 text-xl">Login</h1>
      <h1 className="m-2 text-xs">
        <pre>
          {JSON.stringify(user)}<br />
          use:
          <br />| user@one.example:passOne
          <br />| user@two.example:passTwo
          <br />| user@three.example:passThree
        </pre>
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onReset={
          () => {
            setError("");
            reset({
              email: "misha@zgharbi.ge",
              fullName: "Misha",
              password: "pass",
            }, { keepErrors: false, keepDirty: false });
          }
        }
        className="flex gap-3 flex-col w-1/3"
      >
        <div className="mb-3 flex flex-col gap-2">
          <label
            className="text-primary-600 text-sm"
            htmlFor="email"
            role="label"
          >Email</label>
          <input
            autoComplete="username"
            id="email"
            placeholder="name@example.com"
            type="email"
            {...register("email")}
            className="p-2 rounded"
          />
        </div>
        <div className="mb-3 flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-primary-600 text-sm"
          >Password</label>
          <input
            autoComplete="current-password"
            id="password"
            type="password"
            placeholder="password"
            {...register("password")}
            className="p-2 rounded"
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button type="reset" style="secondary">Reset</Button>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
};
