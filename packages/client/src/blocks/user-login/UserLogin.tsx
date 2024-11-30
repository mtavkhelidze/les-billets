import { Button } from "@blocks/button";
import { LabelledInput } from "@blocks/labelled-input";
import { resolver } from "@lib/form.ts";
import { useUserProfile } from "@state";
import * as O from "effect/Option";
import * as S from "effect/Schema";
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
    resolver: resolver(FormData),
    defaultValues: {
      email: "user@one.com",
      password: "pass!Un",
    },
  });
  const [_, navigate] = useLocation();
  const { loading, error, login, resetError } = useUserProfile();

  const onSubmit = (data: FormData) => {
    void login(data.email, data.password)
      .then(() => {
        navigate("/tickets", { replace: true });
      });
  };
  return (
    <div className="flex flex-col w-full justify-center items-center gap-4">
      <h1 className="m-2 text-xl text-orange-600 font-bold">Login</h1>
      <h1 className="m-2 text-xs md:w-56 w-full font-extralight">
        <code>
          try one of those:
          <br />| user@one.com : pass!Un
          <br />| user@two.com : pass@Deux
          <br />| user@three.com : pass#Trois
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
        className="flex flex-col w-4/5 gap-3"
      >
        <input
          type="text"
          name="hidden"
          autoComplete="username email"
          className="hidden"
        />
        <LabelledInput
          required
          error={errors.email?.message}
          autoComplete="username email"
          disabled={loading}
          label="Email:"
          placeholder="name@example.com"
          {...register("email")} />
        <LabelledInput
          required
          password
          error={errors.password?.message}
          autoComplete="current-password"
          disabled={loading}
          label="Password:"
          placeholder="1234567"
          {...register("password")} />
        <div className="flex flex-row justify-end gap-2 mr-4 mt-2">
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
        <div className="text-right py-2 text-red-700 text-xs h-24 mr-4">
          <span>{O.getOrNull(error.pipe(O.map(e => e.message)))}</span>
        </div>
      </form>
    </div>
  );
};
