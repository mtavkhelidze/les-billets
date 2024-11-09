import { sql } from "drizzle-orm";
import * as D from "drizzle-orm/sqlite-core";
import * as uuid from "uuid";

export const ticketsTable = D.sqliteTable("tickets", {
  createdAt: D.text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  createdBy: D.text("created_by").notNull().references(() => usersTable.id),
  description: D.text("description").notNull(),
  id: D.text("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(uuid.v4),
  status: D.text("status", { enum: ["open", "locked", "closed"] })
    .notNull()
    .default("open"),
  title: D.text("title").notNull(),
  updatedAt: D.text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
  updatedBy: D.text("updated_by")
    .references(() => usersTable.id),
});


export type TicketsRow = typeof ticketsTable.$inferSelect;


export const usersTable = D.sqliteTable("users", {
  email: D.text("email").notNull(),
  fullName: D.text("full_name").notNull(),
  id: D.text("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(uuid.v4),
  password: D.text("password").notNull(),
});
