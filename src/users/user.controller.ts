import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User, CreateUserDto, UserDto } from "./User.entity";

@Controller("users")
export class UsersController {
  constructor(private userService: UserService) {}

  @Get("by-id") // 1aca4117-3ab0-4dd6-8082-4717d4fface8
  async getUserById(@Param("id") id: string): Promise<UserDto> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Post("create")
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // TODO return DTO
    return await this.userService.createUser(createUserDto.email);
  }

  @Delete("delete")
  async deleteUser(@Param("id") id: string): Promise<string> {
    return await this.userService.softDeleteUser(id);
  }
}
