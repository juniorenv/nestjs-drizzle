import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [DrizzleModule],
})
export class UserModule {}
