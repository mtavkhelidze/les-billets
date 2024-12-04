export { TicketStorageService } from "./TicketStorage.ts";
export { UserStorageService } from "./UserStorage.ts";
import { DataBaseDriver } from "@storage/DataBaseDriver.ts";
import { TicketStorageService } from "@storage/TicketStorage.ts";
import { UserStorageService } from "@storage/UserStorage.ts";
import * as Layer from "effect/Layer";

export const StorageLayer = {
  live: Layer.mergeAll(
    UserStorageService.live,
    TicketStorageService.live,
  ),
};
