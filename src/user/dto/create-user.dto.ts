import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(2, 32, { message: "Name must be between 2 and 32 characters" })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 50, { message: "Password must be between 8 and 50 characters" })
  password: string;
}
