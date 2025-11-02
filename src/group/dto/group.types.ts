import { groups } from "src/drizzle/schema/groups.schema";

export type GroupEntity = typeof groups.$inferSelect;
