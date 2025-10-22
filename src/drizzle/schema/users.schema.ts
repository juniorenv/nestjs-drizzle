import { relations } from "drizzle-orm";
import { timestamp, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { comments } from "./comments.schema";
import { posts } from "./posts.schema";
import { usersToGroups } from "./groups.schema";
import { profileInfo } from "./profileInfo.schema";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  comments: many(comments),
  posts: many(posts),
  usersToGroups: many(usersToGroups),
  profileInfo: one(profileInfo, {
    fields: [users.id],
    references: [profileInfo.userId],
  }),
}));
