import { profileInfo } from "src/drizzle/schema/profileInfo.schema";
import { users } from "src/drizzle/schema/users.schema";

export type UserEntity = typeof users.$inferSelect;

export type InsertUser = typeof users.$inferInsert;

export type ProfileEntity = typeof profileInfo.$inferSelect;

export type InsertProfileEntity = typeof profileInfo.$inferInsert;
