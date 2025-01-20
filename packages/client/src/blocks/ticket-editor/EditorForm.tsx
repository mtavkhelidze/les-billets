import { Button } from "@blocks/button";
import { LabelledInput } from "@blocks/labelled-input";
import { NamedTimestamp } from "@blocks/named-timestamp";
import { RadioButton } from "@blocks/RadioButton.tsx";
import { resolver } from "@lib/form.ts";

import { Ticket } from "@my/domain/model";
import * as S from "effect/Schema";
import { useForm } from "react-hook-form";

import "./EditorForm.css";

const FormData = Ticket.pipe(S.omit(
  "_tag",
  "createdAt",
  "createdBy",
  "id",
  "updatedAt",
  "updatedBy",
));
type FormData = S.Schema.Type<typeof FormData>;


export const EditorForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: resolver(FormData),
  });
  // const [_, navigate] = useLocation();
  // const { loading, error, login, resetError } = useUserLogin();
  //
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <form
      className="editor-form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={
        () => {
          reset({
            title: "",
            description: "Misha",
            status: "open",
          }, { keepErrors: false, keepDirty: false });
        }
      }
    >
      <LabelledInput
        error={errors.title?.message}
        label="Title:"
        placeholder="Hoover is too loud"
        required
        {...register("title")}
      />
      <LabelledInput
        error={errors.description?.message}
        label="Description:"
        multiline
        placeholder="The janitor complains that from 5 to 7 am his houver is too noisy."
        {...register("description")}
      />
      <div className="status-group">
        <label htmlFor="description" role="label">Status:</label>
        <fieldset>
          <RadioButton
            defaultChecked
            id="open"
            label="Open"
            value="open"
            {...register("status")}
          />
          <RadioButton
            defaultChecked={false}
            id="closed"
            label="Closed"
            value="closed"
            {...register("status")}
          />
          <RadioButton
            defaultChecked={false}
            id="locked"
            label="Locked"
            value="locked"
            {...register("status")}
          />
        </fieldset>
      </div>
      <NamedTimestamp
        className="mx-4"
        deed={"Created"} by={"Socket Tavkhelidze"} at={0}
      />
      <div className="flex flex-row justify-end gap-2 pr-4">
        <Button
          type="reset"
          disabled={false}
          style="secondary"
        >Reset</Button>
        <Button
          type="submit"
          loading={false}
          disabled={false}
        >Login</Button>
      </div>
      {/*<div className="flex flex-row justify-end gap-2">*/}
      {/*  {O.getOrNull(error.pipe(O.map(e => e.message)))}*/}
      {/*</div>*/}
    </form>
  );
};
