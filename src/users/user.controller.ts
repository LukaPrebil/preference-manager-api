import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { UserDto } from "./User.entity";
import { UserService } from "./user.service";
import { CreateUserDto, UserIdParamsDto } from "./user.dto";

@Controller("users")
export class UsersController {
  constructor(private userService: UserService) {}

  /**
   * Gets a user by their id.
   * @throws {404} If the user does not exist.
   */
  @Get()
  async getUserById(@Query() query: UserIdParamsDto): Promise<UserDto> {
    const user = await this.userService.getUserById(query.id);
    return user;
  }

  /**
   * Creates a new user with the given email. If the user was previously deleted, they will be restored.
   * The user email must be unique.
   * 
   * @throws {422} If the user already exists.
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    console.log("Creating user with email: ", createUserDto.email);
    return await this.userService.createUser(createUserDto.email);
  }

  /**
   * Deletes a user by their id.
   * 
   * @throws {404} If the user does not exist.
   */
  @Delete()
  async deleteUser(@Body() body: UserIdParamsDto): Promise<string> {
    console.log("Deleting user with id: ", body.id);
    return await this.userService.softDeleteUser(body.id);
  }
}
