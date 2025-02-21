import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/User.entity";
import { Repository } from "typeorm";
import { ChangeEvent } from "./ChangeEvent.entity";
import { ChangeEventType, PayloadsByEventType } from "./payload.dto";

@Injectable()
export class ChangeEventService {
  constructor(
    @InjectRepository(ChangeEvent)
    private readonly changeEventRepo: Repository<ChangeEvent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async insertChangeEvent(
    userId: string,
    eventType: keyof typeof ChangeEventType,
    payload: InstanceType<typeof PayloadsByEventType[keyof typeof ChangeEventType]>,
  ): Promise<ChangeEvent> {
    // First make sure we are creating an event for a valid user
    const userExists = await this.userRepo.exists({ where: { id: userId } }); // TODO check soft delete when implemented
    if (!userExists) {
      throw new HttpException(`User with id ${userId} does not exist`, HttpStatus.NOT_FOUND);
    }

    const changeEvent = new ChangeEvent();
    changeEvent.user = { id: userId } as User;
    changeEvent.event_type = eventType;
    changeEvent.payload = payload;

    return this.changeEventRepo.save(changeEvent);
  }

  async getEventsByUserId(userId: string): Promise<ChangeEvent[]> {
    return this.changeEventRepo.find({
      where: { user: { id: userId } },
    });
  }
}
