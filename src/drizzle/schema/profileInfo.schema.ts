import { integer, jsonb, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const profileInfo = pgTable("profile_info", {
  id: serial("id").primaryKey(),
  metadata: jsonb("metadata").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
