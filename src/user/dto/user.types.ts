import { profileInfo } from "src/drizzle/schema/profileInfo.schema";
import { users } from "src/drizzle/schema/users.schema";

export type User = typeof users.$inferSelect;

export type InsertUser = typeof users.$inferInsert;

export type ProfileInfo = typeof profileInfo.$inferSelect;

export type InsertProfileInfo = typeof profileInfo.$inferInsert;
