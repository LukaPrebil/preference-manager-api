import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./User.entity";
import type { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>
  ) {}

  getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ["changeEvents"],
    });
  }

  createUser(email: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.changeEvents = [];
    return this.userRepository.save(user);
  }
}
