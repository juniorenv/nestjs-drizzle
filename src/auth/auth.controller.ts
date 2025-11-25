import { Controller, Post } from "@nestjs/common";

@Controller()
export class AuthController {
  @Post()
  public async signUp() {}

  @Post()
  public async signIn() {}
}
