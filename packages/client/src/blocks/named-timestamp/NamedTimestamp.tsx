import cx from "clsx";
import * as  DateTime from "effect/DateTime";
import React from "react";

type Props = {
  deed: "Created" | "Updated";
  by: string;
  at: number;
  className?: string
}

export const NamedTimestamp: React.FC<Props> = ({
  deed,
  by,
  at,
  className = "",
}) => {
  const ts = DateTime.unsafeMake(at).pipe(DateTime.formatUtc);
  const cn = cx(
    "flex flex-row gap-1 items-center justify-end text-xs",
    className,
  );
  console.log(cn);
  return (
    <div
      className={cn}
    >
      <div className="text-orange-600">{deed} by:</div>
      <div>{by} <span className="text-orange-600">on</span> {ts}</div>
    </div>
  );
};
