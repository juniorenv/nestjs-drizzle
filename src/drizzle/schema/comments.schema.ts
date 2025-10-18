import { text, pgTable, serial, integer } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { posts } from "./posts.schema";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
});
