import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { CreateUserDto } from "./dto/create-user.dto";
import { users } from "src/drizzle/schema/users.schema";
import { hash } from "bcrypt";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { profileInfo } from "src/drizzle/schema/profileInfo.schema";
import { eq } from "drizzle-orm";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";
import { ProfileInfo, User } from "./dto/user.types";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private readonly SALT_ROUNDS = 10;

  private async findByEmail(userEmail: string): Promise<User | null> {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    return foundUser || null;
  }

  private async findProfileInfo(userId: string): Promise<ProfileInfo | null> {
    const foundProfileInfo = await this.db.query.profileInfo.findFirst({
      where: eq(profileInfo.userId, userId),
    });

    return foundProfileInfo || null;
  }

  private async checkUserExists(userId: string): Promise<void> {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  public async findOne(userId: string): Promise<UserResponseDto> {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        password: false,
      },
      with: {
        profileInfo: true,
        posts: {
          with: { comments: true },
        },
      },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return plainToInstance(UserResponseDto, foundUser);
  }

  public async create(user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    const [createdUser] = await this.db
      .insert(users)
      .values({
        ...user,
        password: await hash(user.password, this.SALT_ROUNDS),
      })
      .returning();

    return plainToInstance(UserResponseDto, createdUser);
  }

  public async delete(userId: string): Promise<UserResponseDto> {
    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return plainToInstance(UserResponseDto, deletedUser);
  }

  public async update(
    userId: string,
    updateData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.checkUserExists(userId);

    if (updateData.email) {
      const existingEmail = await this.findByEmail(updateData.email);

      if (existingEmail && existingEmail.id !== userId)
        throw new ConflictException("Email already in use");
    }

    const [updatedUser] = await this.db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return plainToInstance(UserResponseDto, updatedUser);
  }

  public async createProfileInfo(
    userId: string,
    profile: CreateProfileDto,
  ): Promise<ProfileInfo> {
    await this.checkUserExists(userId);

    const existingProfile = await this.findProfileInfo(userId);

    if (existingProfile) {
      throw new ConflictException("Profile already exists for this user");
    }

    const [createdProfileInfo] = await this.db
      .insert(profileInfo)
      .values({ userId, metadata: profile.metadata })
      .returning();

    return createdProfileInfo;
  }
}
