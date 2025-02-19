import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChangeEvent, ChangeEventType } from "./ChangeEvent.entity";
import { Repository } from "typeorm";
import { User } from "src/users/User.entity";

@Injectable()
export class ChangeEventService {
  constructor(
    @InjectRepository(ChangeEvent) 
    private readonly changeEventRepo: Repository<ChangeEvent>
  ) {}

  async insertChangeEvent(
    userId: string,
    eventType: ChangeEventType,
    payload: Record<string, unknown>
  ): Promise<ChangeEvent> {
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