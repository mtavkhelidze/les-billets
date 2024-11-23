/**
 * @misha: I just copied this from
 * https://github.com/react-hook-form/resolvers/tree/master/effect-ts
 *
 * v3.10, which will be using a correct import for effect/Schema wasn't
 * released yet (2024-11-23).
 */
import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import * as  Effect from "effect/Effect";

import { ArrayFormatter, decodeUnknown } from "effect/ParseResult";
import * as Schema from "effect/Schema";
import type { ParseOptions } from "effect/SchemaAST";
import type {
  FieldErrors,
  FieldValues,
  ResolverOptions,
  ResolverResult,
} from "react-hook-form";

type Resolver = <A extends FieldValues, I, TContext>(
  schema: Schema.Schema<A, I>,
  config?: ParseOptions,
) => (
  values: FieldValues,
  _context: TContext | undefined,
  options: ResolverOptions<A>,
) => Promise<ResolverResult<A>>;

export const dbEffectResolver: Resolver =
  (schema, config = { errors: "all", onExcessProperty: "ignore" }) =>
    (values, _, options) => {
      return decodeUnknown(
        schema,
        config,
      )(values).pipe(
        Effect.catchAll((parseIssue) =>
          Effect.flip(ArrayFormatter.formatIssue(parseIssue)),
        ),
        Effect.mapError((issues) => {
          const errors = issues.reduce((acc, current) => {
            const key = current.path.join(".");
            acc[key] = { message: current.message, type: current._tag };
            return acc;
          }, {} as FieldErrors);

          return toNestErrors(errors, options);
        }),
        Effect.tap(() =>
          Effect.sync(
            () =>
              options.shouldUseNativeValidation &&
              validateFieldsNatively({}, options),
          ),
        ),
        Effect.match({
          onFailure: (errors) => (
            { errors, values: {} }
          ),
          onSuccess: (result) => (
            { errors: {}, values: result }
          ),
        }),
        Effect.runPromise,
      );
    };
