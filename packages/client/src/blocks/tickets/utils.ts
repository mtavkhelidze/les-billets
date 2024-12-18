import { Ticket } from "@my/domain/model";
import { flow, pipe } from "effect";
import * as Arr from "effect/Array";
import * as Rec from "effect/Record";
import * as Str from "effect/String";
import React from "react";
import { TitleCell } from "./TitleCell.tsx";

// @misha: this is an almost useless exercise in hubris and vanity

type KeyType = keyof typeof Ticket.fields;
type CellEntry = [KeyType, React.ReactElement]

const makeTitleCellBlock = ([title, key]: [string, KeyType]): CellEntry =>
  [key, TitleCell({ key, title })];

const splitAndCapitalize: (key: KeyType) => string = flow(
  Str.capitalize,
  Str.pascalToSnake,
  Str.replace(/_/g, " "),
  Str.replace(" at", ""),
  Str.capitalize,
);

export const ticketTitleCells: Record<KeyType, React.ReactElement> = pipe(
  Rec.keys(Ticket.fields),
  fields => pipe(
    fields.map(splitAndCapitalize),
    Arr.zip(fields),
    Arr.map(makeTitleCellBlock),
    Rec.fromEntries<CellEntry>,
  ),
);
