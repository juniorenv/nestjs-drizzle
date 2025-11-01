import { comments } from "src/drizzle/schema/comments.schema";

export type CommentEntity = typeof comments.$inferSelect;
