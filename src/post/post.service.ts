import { Inject, Injectable } from "@nestjs/common";
import type { DrizzleDB } from "../drizzle/types/drizzle";
import { DRIZZLE } from "src/drizzle/drizzle.module";

@Injectable()
export class PostService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
}
