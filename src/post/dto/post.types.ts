import { posts } from "src/drizzle/schema/posts.schema";

export type PostEntity = typeof posts.$inferSelect;
