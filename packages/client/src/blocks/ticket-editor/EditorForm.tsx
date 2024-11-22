import { Button } from "@blocks/button";
import { LabelledInput } from "@blocks/labelled-input";
import { NamedTimestamp } from "@blocks/named-timestamp";
import { RadioButton } from "@blocks/RadioButton.tsx";
import * as S from "@effect/schema/Schema";

import "./EditorForm.css";

const FormData = S.Struct({
  email: S.String.pipe(S.nonEmptyString({ message: () => "Email is required" })),
  password: S.String.pipe(S.nonEmptyString({ message: () => "Password is required" })),
});
type FormData = S.Schema.Type<typeof FormData>

export const EditorForm = () => {
  // const {
  //   register,
  //   reset,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: effectTsResolver(FormData),
  // });
  // const [_, navigate] = useLocation();
  // const { loading, error, login, resetError } = useUserLogin();
  //
  // const onSubmit = (data: FormData) => {
  //   void login(data.email, data.password)
  //     .then(() => navigate("/"));
  //
  // };
  return (
    <form
      className="editor-form"
      // onSubmit={handleSubmit(onSubmit)}
      // onReset={
      //   () => {
      //     resetError();
      //     reset({
      //       email: "",
      //       password: "",
      //     }, { keepErrors: false, keepDirty: false });
      //   }
      // }
    >
      <LabelledInput
        id="title"
        label="Title:"
        placeholder="Hoover is too loud"
      />
      <LabelledInput
        error="we have a problem"
        id="description"
        label="Description:"
        multiline
        placeholder="The janitor complains that from 5 to 7 am his houver is too noisy."
      />
      <div className="status-group">
        <label htmlFor="description" role="label">Status:</label>
        <fieldset>
          <RadioButton
            defaultChecked
            id="open"
            label="Open"
            name="status"
            value="open"
          />
          <RadioButton
            defaultChecked={false}
            id="closed"
            label="Closed"
            name="status"
            value="closed"
          />
          <RadioButton
            defaultChecked={false}
            id="locked"
            label="Locked"
            name="status"
            value="locked"
          />
        </fieldset>
      </div>
      <NamedTimestamp
        className="mx-4"
        deed={"Created"} by={"Misha Tavkhelidze"} at={0}
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
