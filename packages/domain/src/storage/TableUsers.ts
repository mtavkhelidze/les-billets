import * as D from "drizzle-orm/sqlite-core";
import * as uuid from "uuid";

export const TableUsers = D.sqliteTable("users", {
  email: D.text("email").notNull(),
  fullName: D.text("full_name").notNull(),
  id: D.text("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(uuid.v4),
  password: D.text("password").notNull(),
});
