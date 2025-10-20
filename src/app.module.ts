import { Module } from "@nestjs/common";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { PostModule } from "./post/post.module";

@Module({
  imports: [DrizzleModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
