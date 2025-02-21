import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { IsEmail, IsUUID } from "class-validator";
import { UserDto } from "./User.entity";
import { UserService } from "./user.service";

class UserIdParams {
  @IsUUID()
  id: string;
}

class CreateUserDto {
  @IsEmail()
  email: string;
}

@Controller("users")
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserById(@Query() query: UserIdParams): Promise<UserDto> {
    console.log("Getting user with id: ", query.id);
    const user = await this.userService.getUserById(query.id);
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    console.log("Creating user with email: ", createUserDto.email);
    return await this.userService.createUser(createUserDto.email);
  }

  @Delete()
  async deleteUser(@Body() body: UserIdParams): Promise<string> {
    console.log("Deleting user with id: ", body.id);
    return await this.userService.softDeleteUser(body.id);
  }
}
