import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CreateUserDto, User, UserDto } from "./User.entity";
import { UserService } from "./user.service";

@Controller("users")
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserById(@Query("id") id: string): Promise<UserDto> {
    console.log("Getting user with id: ", id);
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    console.log("Creating user with email: ", createUserDto.email);
    return await this.userService.createUser(createUserDto.email);
  }

  @Delete()
  async deleteUser(@Body() body: { id: string }): Promise<string> {
    console.log("Deleting user with id: ", body.id);
    return await this.userService.softDeleteUser(body.id);
  }
}
