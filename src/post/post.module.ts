import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [DrizzleModule],
})
export class PostModule {}
