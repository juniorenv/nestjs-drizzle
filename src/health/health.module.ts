import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { DrizzleHealthIndicator } from "./drizzle-health.indicator";

@Module({
  imports: [TerminusModule, DrizzleModule],
  controllers: [HealthController],
  providers: [DrizzleHealthIndicator],
})
export class HealthModule {}
