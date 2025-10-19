import {
  primaryKey,
  text,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// The joint table
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.groupId] })],
);
