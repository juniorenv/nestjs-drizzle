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
import { ProfileEntity, UserEntity } from "./dto/user.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private readonly SALT_ROUNDS = 10;

  private async findByEmail(userEmail: string): Promise<UserEntity | null> {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    return foundUser || null;
  }

  private async findProfileInfo(userId: string): Promise<ProfileEntity | null> {
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
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.checkUserExists(userId);

    const allowedUpdates: UpdateUserDto = {};

    if (updateUserDto.name !== undefined)
      allowedUpdates.name = updateUserDto.name;
    if (updateUserDto.email !== undefined)
      allowedUpdates.email = updateUserDto.email;

    if (allowedUpdates.email) {
      const existingEmail = await this.findByEmail(allowedUpdates.email);

      if (existingEmail && existingEmail.id !== userId)
        throw new ConflictException("Email already in use");
    }

    const [updatedUser] = await this.db
      .update(users)
      .set({ ...allowedUpdates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return plainToInstance(UserResponseDto, updatedUser);
  }

  public async createProfileInfo(
    userId: string,
    profile: CreateProfileDto,
  ): Promise<ProfileEntity> {
    await this.checkUserExists(userId);

    const existingProfile = await this.findProfileInfo(userId);

    if (existingProfile) {
      throw new ConflictException("This user already has a profile");
    }

    const [createdProfileInfo] = await this.db
      .insert(profileInfo)
      .values({ userId, metadata: profile.metadata })
      .returning();

    return createdProfileInfo;
  }

  public async updateProfileInfo(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity> {
    await this.checkUserExists(userId);

    const existingProfile = await this.findProfileInfo(userId);

    if (!existingProfile) {
      throw new NotFoundException("This user does not have a profile yet");
    }

    const updatedMetadata = updateProfileDto.metadata
      ? { ...existingProfile.metadata, ...updateProfileDto.metadata }
      : existingProfile.metadata;

    const [updatedProfileInfo] = await this.db
      .update(profileInfo)
      .set({ metadata: updatedMetadata, updatedAt: new Date() })
      .where(eq(profileInfo.userId, userId))
      .returning();

    return updatedProfileInfo;
  }
}
