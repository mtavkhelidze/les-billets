import * as Data from "effect/Data";
import * as E from "effect/Either";

class NetAddressError extends Data.Error<{
  // message: string;
  // cause: Error;
}> {}

export class NetAddress extends Data.Class {
  private constructor(private readonly url: URL) {
    super();
  }

  public get mkString() {
    return this.url.toString();
  }

  public addQueryParam = (key: string, value: string) => {
    this.url.searchParams.append(key, value);
    return NetAddress.make(this.url.toString());
  };

  public removeQueryParam = (key: string) => {
    this.url.searchParams.delete(key);
    return NetAddress.make(this.url.toString());
  };

  public static make = (url: string): E.Either<NetAddress, NetAddressError> =>
    E.try({
      try: () => new NetAddress(new URL(url)),
      catch: e => new NetAddressError(),
    });
}
