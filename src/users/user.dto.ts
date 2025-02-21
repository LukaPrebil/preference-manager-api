import { IsUUID, IsEmail } from "class-validator";

export class UserIdParamsDto {
  @IsUUID()
  id: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;
}