import { Body, Controller, Post } from "@nestjs/common";
import { CreateChangeEventDto } from "./ChangeEvent.entity";
import { ChangeEventService } from "./changeEvent.service";

@Controller("events")
export class ChangeEventController {
  constructor(private readonly changeEventService: ChangeEventService) {}

  @Post()
  async createChangeEvent(@Body() body: CreateChangeEventDto) {
    return this.changeEventService.insertChangeEvent(body.userId, body.eventType, body.payload);
  }
}
