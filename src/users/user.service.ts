import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { FindOptionsWhere, Repository } from "typeorm";
import { User, UserDto, hashEmail } from "./User.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.getUserWithChangeEvents({ id });

    return user.toDTO();
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.getUserWithChangeEvents({ email });

    return user.toDTO();
  }

  private async getUserWithChangeEvents(whereQuery: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne({
      where: whereQuery,
      relations: ["changeEvents"],
    });

    if (!user || user.deletedAt) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(email: string): Promise<UserDto> {
    await this.bailIfUserExists(email);

    const deletedUser = await this.checkDeletedUser(email);
    if (deletedUser) {
      return await this.restoreUser(email, deletedUser);
    }

    return await this.createNewUser(email);
  }

  async softDeleteUser(id: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(id, {
      email: user.hashEmail(),
      deletedAt: new Date(),
    });

    return id;
  }

  private async bailIfUserExists(email: string) {
    const userExists = await this.userRepository.exists({ where: { email } });
    if (userExists) {
      throw new HttpException("User already exists", HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async checkDeletedUser(email: string) {
    const deletedUser = await this.userRepository.findOne({ where: { email: hashEmail(email) }, withDeleted: true });
    return deletedUser;
  }

  private async restoreUser(email: string, deletedUser: User) {
    const restoredUser = await this.userRepository.save({
      ...deletedUser,
      email,
      deletedAt: undefined,
    });
    return restoredUser.toDTO();
  }

  private async createNewUser(email: string) {
    const user = new User();
    user.email = email;
    user.changeEvents = [];
    const insertedUser = await this.userRepository.save(user);
    return insertedUser.toDTO();
  }
}
