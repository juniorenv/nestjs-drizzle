import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/schema";

export const DRIZZLE = Symbol("drizzle-connection");

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const DATABASE_URL = configService.getOrThrow<string>("DATABASE_URL");
        const NODE_ENV = configService.get<string>("NODE_ENV", "development");

        const pool = new Pool({
          connectionString: DATABASE_URL,
          ssl: NODE_ENV === "production" ? true : false,
        });

        pool.on("error", (err) => {
          console.error("❌ Unexpected database pool error:", err);
        });

        pool.on("connect", (client) => {
          client.on("error", (err) => {
            console.error("❌ Database client error:", err);
          });
        });

        try {
          const client = await pool.connect();
          await client.query("SELECT 1");
          console.log("✅ Database connected");
          client.release();
        } catch (error) {
          console.error("❌ Database connection failed:", error);
        }

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
