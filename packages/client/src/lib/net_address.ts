import * as Data from "effect/Data";
import * as E from "effect/Either";

class NetAddressError extends Data.Error<{
  message: string;
  cause: Error;
}> {
  public static make = (e: unknown): NetAddressError =>
    new NetAddressError({
      cause: e as TypeError,
      message: (
        e as TypeError
      ).message,
    });
}

export class NetAddress extends Data.Class {
  public static make = (url: string): E.Either<NetAddress, NetAddressError> =>
    E.try({
      try: () => new NetAddress(new URL(url)),
      catch: NetAddressError.make,
    });
  public addQueryParam = (key: string, value: string) => {
    this.url.searchParams.set(key, value);
    return NetAddress.make(this.url.toString());
  };
  public removeQueryParam = (key: string) => {
    this.url.searchParams.delete(key);
    return NetAddress.make(this.url.toString());
  };

  private constructor(private readonly url: URL) {
    super();
  }

  public get mkString() {
    return this.url.toString();
  }
}
