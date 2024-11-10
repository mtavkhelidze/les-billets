import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({

  schema: "./modules/model/src/schema.ts",
  verbose: true,
  strict: true,
  out: "./drizzle",
  dialect: "sqlite",
  // https://orm.drizzle.team/kit-docs/config-reference#dbcredentials
  dbCredentials: {
    url: process.env.DB_FILE || ":memory:",
  },
});
