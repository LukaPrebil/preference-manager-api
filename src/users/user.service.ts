import { Injectable } from "@nestjs/common";
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

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ["changeEvents"],
    });

    if (!user) {
      return null;
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

  createUser(email: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.changeEvents = [];
    return this.userRepository.save(user);
  }
}
