import * as Context from "effect/Context";

export class DataStorageService extends Context.Tag("DataStorageService")<
  DataStorageService,
  {
    getTickets: () => Promise<unknown[]>;
  }
>() {}
