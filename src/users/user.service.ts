import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserDto } from "./User.entity";
import type { Repository } from "typeorm";
import {
  mergeSubscriptionConsentChangeEvents,
  SubscriptionChangeEvent,
} from "src/changeEvents/subscriptionEvent.helpers";
import { ChangeEventType } from "src/changeEvents/ChangeEvent.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ["changeEvents"],
    });

    if (!user || user.deletedAt) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const consents = mergeSubscriptionConsentChangeEvents(
      user.changeEvents.filter(
        (changeEvent) => changeEvent.event_type === ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
      ) as SubscriptionChangeEvent[],
    );

    return {
      id: user.id,
      email: user.email,
      consents,
    };
  }

  async createUser(email: string): Promise<User> { // TODO DTO
    const userExists = await this.userRepository.exists({ where: { email } });
    if (userExists) {
      throw new HttpException("User already exists", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user = new User();
    user.email = email;
    user.changeEvents = [];
    return this.userRepository.save(user);
  }

  async softDeleteUser(id: string): Promise<string> {
    await this.userRepository.update(id, {
      email: "",
      deletedAt: new Date(),
    });
    return id;
  }
}
