import {
  primaryKey,
  integer,
  text,
  serial,
  pgTable,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// The joint table
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.groupId] })],
);
