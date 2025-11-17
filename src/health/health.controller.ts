import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { DrizzleHealthIndicator } from "./drizzle-health.indicator";

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly drizzleHealthIndicator: DrizzleHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this.health.check([
      async () => this.drizzleHealthIndicator.isHealth("database"),
    ]);
  }
}
