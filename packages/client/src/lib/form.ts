import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import { flow, pipe } from "effect";
import * as A from "effect/Array";
import * as Effect from "effect/Effect";

import {
  ArrayFormatter,
  type ArrayFormatterIssue,
  decodeUnknown,
} from "effect/ParseResult";
import * as S from "effect/Schema";
import type { ParseOptions } from "effect/SchemaAST";
import type { FieldError, FieldValues, Resolver } from "react-hook-form";

/**
 * @misha: This is (kinda) copied from
 * https://github.com/react-hook-form/resolvers/tree/master/effect-ts
 *
 * As of 2024-11-23, v3.10, which will be using a correct
 * import for effect/Schema, hasn't been released yet.
 */

const issueToError = (issue: ArrayFormatterIssue): Record<string, FieldError> => (
  {
    [issue.path.join(".")]: {
      message: issue.message,
      type: issue._tag,
    },
  }
);
const collectIssuesIntoErrors = (issues: ArrayFormatterIssue[]): Record<string, FieldError> =>
  A.reduce<ArrayFormatterIssue, Record<string, FieldError>>(
    issues,
    {},
    (acc, a) => (
      { ...acc, ...issueToError(a) }
    ),
  );

export const resolver = <A extends FieldValues>(
  schema: S.Schema<A>,
  config: ParseOptions = {
    errors: "all",
    onExcessProperty: "ignore",
  },
): Resolver<A> => (
  values,
  _,
  options,
) => {
  const program = pipe(
    values,
    decodeUnknown(schema, config),
    Effect.map(values => (
      { values, errors: {} }
    )),
    Effect.catchAll(flow(ArrayFormatter.formatIssue, Effect.flip)),
    Effect.mapError(collectIssuesIntoErrors),
    Effect.mapError(es => toNestErrors(es, options)),
    Effect.tap(() => Effect.sync(() =>
        options.shouldUseNativeValidation &&
        validateFieldsNatively({}, options),
      ),
    ),
    Effect.match({
      onFailure: (errors) => (
        { errors, values }
      ),
      onSuccess: ({ values }) => (
        { errors: {}, values }
      ),
    }),
  );
  return Effect.runPromise(program);
};
