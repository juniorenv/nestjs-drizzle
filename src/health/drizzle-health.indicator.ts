import { Inject, Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { sql } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import type { DrizzleDB } from "src/drizzle/types/drizzle";

@Injectable()
export class DrizzleHealthIndicator {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    try {
      await this.db.execute(sql`SELECT 1`);
      return indicator.up();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown database error";
      return indicator.down({
        message: errorMessage,
        error: error instanceof Error ? error.name : "DatabaseError",
      });
    }
  }
}
