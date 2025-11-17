import { Module } from "@nestjs/common";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { PostModule } from "./post/post.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { CommentModule } from "./comment/comment.module";
import { GroupModule } from "./group/group.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    PostModule,
    UserModule,
    CommentModule,
    GroupModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
