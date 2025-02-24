import { IsEmail, IsUUID } from "class-validator";

export class UserIdParamsDto {
  @IsUUID()
  id: string;
}

export class UserEmailParamsDto {
  @IsEmail()
  email: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;
}
