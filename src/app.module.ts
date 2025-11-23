import { Module } from "@nestjs/common";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { PostModule } from "./post/post.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { CommentModule } from "./comment/comment.module";
import { GroupModule } from "./group/group.module";
import { HealthModule } from "./health/health.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    PostModule,
    UserModule,
    CommentModule,
    GroupModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
