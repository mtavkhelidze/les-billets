import { formatDistance as fnsFormatDistance } from "date-fns";
import * as DT from "effect/DateTime";

export const formatIso = DT.formatIso;
export const formatDistance = (dt: DT.DateTime): string =>
  dt.pipe(
    DT.toDate,
    d => fnsFormatDistance(d, new Date(), { addSuffix: true }),
  );
