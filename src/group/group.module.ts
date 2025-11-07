import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";
import { UserModule } from "src/user/user.module";

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [DrizzleModule, UserModule],
})
export class GroupModule {}
